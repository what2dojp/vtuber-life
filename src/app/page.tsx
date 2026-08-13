"use client";

import { toPng } from "html-to-image";
import {
  Download,
  Flame,
  Heart,
  Radio,
  RotateCcw,
  Share2,
  Sparkles,
  Trophy,
  Tv,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import LiveChat, {
  buildChatBurst,
  FullScreenDanmaku,
  shouldTriggerDanmaku,
  type ChatBurst,
} from "@/components/LiveChat";
import {
  CAREER_CHOICES,
  type CareerChoicePhase,
  type CareerOption,
} from "@/data/careerChoices";
import {
  RANDOM_EVENTS,
  type EventFailure,
  type EventOption,
  type EventSuccess,
  type GameEvent,
} from "@/data/events";
import { checkChance, shuffleArray } from "@/lib/prng";
import { useGameStore, type PlayerStats } from "@/store/useGameStore";

type EventOutcome = EventSuccess | EventFailure;

interface ResolveState {
  success: boolean;
  log: string;
  deltas: StatDelta;
}

interface StatDelta {
  fans: number;
  san: number;
  talk: number;
  singing: number;
  tech: number;
  drama: number;
}

const DEFAULT_NAME = "星野可樂";
const DEFAULT_SEED = "v-life-2026";
const COLAMOON_YOUTUBE = "https://www.youtube.com/@colamoonie";
const MEME_SEEDS = ["colamoon4th", "hololive", "zero-totsu"] as const;
const INITIAL_STATS = {
  name: DEFAULT_NAME,
  seed: DEFAULT_SEED,
  month: 1,
  fans: 100,
  san: 100,
  talk: 10,
  singing: 10,
  tech: 10,
  drama: 0,
  isGraduated: false,
  logs: [] as string[],
};

function isCollabEvent(event: GameEvent | null): boolean {
  if (!event) {
    return false;
  }

  return (
    event.id.includes("collab") ||
    event.title.includes("連動") ||
    event.title.includes("凸待")
  );
}

function applyCareerBuffsToDeltas(
  deltas: StatDelta,
  event: GameEvent | null,
  success: boolean,
  buffs: string[],
): StatDelta {
  const next = { ...deltas };

  if (buffs.includes("agency_black")) {
    if (next.fans > 0) {
      next.fans = Math.round(next.fans * 1.5);
    }
    if (next.san < 0) {
      next.san = Math.round(next.san * 1.3);
    }
  }

  if (buffs.includes("agency_indie_group") && isCollabEvent(event)) {
    next.fans *= 2;
    next.san *= 2;
    next.talk *= 2;
    next.singing *= 2;
    next.tech *= 2;
    next.drama *= 2;
  }

  if (buffs.includes("3d_debut")) {
    if (next.singing > 0) {
      next.singing = Math.round(next.singing * 1.5);
    }
    if (next.tech > 0) {
      next.tech = Math.round(next.tech * 1.5);
    }
  }

  if (buffs.includes("collab_marathon") && !success) {
    if (next.fans < 0) {
      next.fans = Math.round(next.fans / 2);
    }
    if (next.san < 0) {
      next.san = Math.round(next.san / 2);
    }
    if (next.drama > 0) {
      next.drama = Math.round(next.drama / 2);
    }
  }

  return next;
}

function generateSeed(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => chars[byte % chars.length]).join("");
}

function dealFromDeck(
  deckRef: { current: GameEvent[] },
  cursorRef: { current: number },
): GameEvent {
  if (cursorRef.current >= deckRef.current.length) {
    const lastId = deckRef.current[deckRef.current.length - 1]?.id;
    const pool =
      lastId != null
        ? RANDOM_EVENTS.filter((event) => event.id !== lastId)
        : RANDOM_EVENTS;
    deckRef.current = shuffleArray(pool.length > 0 ? pool : RANDOM_EVENTS);
    cursorRef.current = 0;
  }

  const event = deckRef.current[cursorRef.current];
  cursorRef.current += 1;
  return event ?? RANDOM_EVENTS[0];
}

function splitBracketText(text: string): { badge: string; body: string } {
  const match = /^【(.+?)】(.*)$/.exec(text);
  return {
    badge: match?.[1]?.trim() ?? "EVENT",
    body: (match?.[2] ?? text).trim(),
  };
}

function optionTagClass(tag: string, type?: EventOption["type"]): string {
  if (type === "gambling" || tag.includes("豪賭")) {
    return "bg-orange-500/20 text-orange-200";
  }
  if (type === "meme" || tag.includes("迷因")) {
    return "bg-pink-500/20 text-pink-200";
  }
  if (type === "steady" || tag.includes("穩健")) {
    return "bg-emerald-500/20 text-emerald-200";
  }
  if (tag.includes("大聲宣傳")) {
    return "bg-amber-400/20 text-amber-100";
  }
  return "bg-purple-500/20 text-purple-200";
}

function optionEffectHint(option: EventOption): string {
  const risk =
    option.type === "gambling"
      ? "高風險高報酬"
      : option.type === "meme"
        ? "迷因爆擊"
        : option.type === "steady"
          ? "低風險穩健"
          : "均衡發展";
  const effects = [
    option.success.fans ? `Fans ${formatDelta(option.success.fans)}` : null,
    option.success.san ? `SAN ${formatDelta(option.success.san)}` : null,
    option.success.talk ? `Talk ${formatDelta(option.success.talk)}` : null,
    option.success.singing
      ? `Sing ${formatDelta(option.success.singing)}`
      : null,
    option.success.tech ? `Tech ${formatDelta(option.success.tech)}` : null,
    option.success.drama ? `Drama ${formatDelta(option.success.drama)}` : null,
  ].filter((part): part is string => part != null);

  if (effects.length === 0) {
    return risk;
  }

  return `${risk} · ${effects.slice(0, 3).join(" / ")}`;
}

function outcomeDeltas(outcome: EventOutcome): StatDelta {
  return {
    fans: outcome.fans ?? 0,
    san: outcome.san ?? 0,
    talk: "talk" in outcome ? (outcome.talk ?? 0) : 0,
    singing: "singing" in outcome ? (outcome.singing ?? 0) : 0,
    tech: "tech" in outcome ? (outcome.tech ?? 0) : 0,
    drama: outcome.drama ?? 0,
  };
}

function toAbsoluteChanges(
  stats: PlayerStats,
  deltas: StatDelta,
): Partial<PlayerStats> {
  return {
    fans: stats.fans + deltas.fans,
    san: stats.san + deltas.san,
    talk: stats.talk + deltas.talk,
    singing: stats.singing + deltas.singing,
    tech: stats.tech + deltas.tech,
    drama: stats.drama + deltas.drama,
  };
}

function formatFans(fans: number): string {
  return fans.toLocaleString("zh-TW");
}

function formatDelta(value: number): string {
  if (value > 0) return `+${value}`;
  return `${value}`;
}

function getFandomTitle(peakFans: number, peakDrama: number, san: number): string {
  if (peakFans >= 1_000_000) return "百萬級箱推霸主";
  if (peakDrama >= 80) return "炎上系極限生存者";
  if (san <= 0) return "SAN 歸零現場直播本尊";
  if (peakFans < 500) return "零人凸待慘劇主角";
  if (peakFans < 1_000 && peakDrama >= 40) return "地下勢解析常客";
  if (san <= 25 && peakDrama >= 50) return "精神值比同接低的傳奇";
  if (peakFans >= 100_000) return "切片區認證の箱推本體";
  if (peakFans >= 10_000) return "萬定祈願成就者";
  if (san >= 80 && peakDrama < 20) return "穩健營業の優等生";
  if (peakDrama >= 50) return "大解析時代目擊證人";
  return "待機室認證の名場面職人";
}

function getCareerTitle(fans: number, drama: number): string {
  if (fans >= 1_000_000 && drama >= 70) return "炎上也能百萬的箱推魔王";
  if (fans >= 1_000_000) return "百萬級箱推霸主";
  if (fans >= 500_000) return "傳說級個人勢";
  if (drama >= 80) return "炎上極限生存者";
  if (fans >= 100_000 && drama >= 50) return "話題製造機";
  if (fans >= 100_000) return "穩健運營的實力派";
  if (fans >= 10_000 && drama >= 40) return "小火慢燉的解析常客";
  if (fans >= 10_000) return "萬粉達成の個人勢";
  if (fans < 500) return "慘澹畢業個人勢";
  if (fans < 1_000) return "地下勢傳說（自己的傳說）";
  if (drama >= 60) return "炎上耐性測驗通過者";
  return "努力過的三年 VTuber";
}

function getGraduationQuote(
  name: string,
  fans: number,
  drama: number,
  san: number,
): string {
  if (san <= 0) {
    return `${name} 的 SAN 值歸零了。不是畢業，是被彈幕讀完。下次轉生，記得先關麥克風再喊不要香菜。`;
  }
  if (fans >= 1_000_000) {
    return `從個人勢走到百萬訂閱。${name} 把「稍等一下喔」做成了品牌。箱推永遠在待機室等你。`;
  }
  if (drama >= 80) {
    return `解析文比 VOD 還長，${name} 還是撐到了畢業。炎上是修羅場，也是名場面。`;
  }
  if (fans < 1_000) {
    return `同接不一定會來，但 ${name} 有來。這三年很短，待機室的 BGM 還在。零人凸待也可以是神回。`;
  }
  return `謝謝每一則 Super Chat 與每一次「草」。${name} 的皮套會褪色，切片還在。下輩子還當 V 的話，先確認 OBS 有沒有真的停。`;
}

function sanBarClass(san: number): { fill: string; label: string; blink: boolean } {
  if (san > 50) {
    return { fill: "bg-emerald-400", label: "text-emerald-300", blink: false };
  }
  if (san > 25) {
    return { fill: "bg-amber-400", label: "text-amber-300", blink: false };
  }
  return { fill: "bg-red-500", label: "text-red-400", blink: true };
}

export default function Home() {
  const {
    name,
    seed,
    month,
    fans,
    san,
    talk,
    singing,
    tech,
    drama,
    isGraduated,
    logs,
    initGame,
    applyEventResult,
    nextMonth,
  } = useGameStore();

  const [nameInput, setNameInput] = useState(DEFAULT_NAME);
  const [seedInput, setSeedInput] = useState(DEFAULT_SEED);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [resolveState, setResolveState] = useState<ResolveState | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [chatBurst, setChatBurst] = useState<ChatBurst | null>(null);
  const [peakFans, setPeakFans] = useState(100);
  const [peakDrama, setPeakDrama] = useState(0);
  const [careerPhase, setCareerPhase] = useState<CareerChoicePhase | null>(
    null,
  );
  const [careerBuffs, setCareerBuffs] = useState<string[]>([]);
  const [danmakuTrigger, setDanmakuTrigger] = useState<number | null>(null);
  const careerSelecting = useRef(false);
  const eventDeckRef = useRef<GameEvent[]>([]);
  const eventCursorRef = useRef(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedSeed = params.get("seed");
    if (sharedSeed) {
      setSeedInput(sharedSeed);
    }
  }, []);

  useEffect(() => {
    setPeakFans((current) => Math.max(current, fans));
    setPeakDrama((current) => Math.max(current, drama));
  }, [fans, drama]);

  const isCreatePhase = !isGraduated && month === 1 && logs.length === 0;
  const careerMonths = month > 36 ? 36 : month;
  const monthProgress = Math.min((careerMonths / 36) * 100, 100);
  const sanTone = sanBarClass(san);

  const topSkill = useMemo(() => {
    const skills = [
      { label: "雜談力", value: talk },
      { label: "歌力", value: singing },
      { label: "技術力", value: tech },
    ];
    return skills.reduce((best, skill) =>
      skill.value > best.value ? skill : best,
    );
  }, [talk, singing, tech]);

  function handleDebut() {
    const nextName = nameInput.trim() || DEFAULT_NAME;
    const nextSeed = seedInput.trim() || DEFAULT_SEED;
    initGame(nextName, nextSeed);
    eventDeckRef.current = shuffleArray(RANDOM_EVENTS);
    eventCursorRef.current = 0;
    setPeakFans(100);
    setPeakDrama(0);
    setChatBurst(null);
    setDanmakuTrigger(null);
    setCareerPhase(null);
    setCareerBuffs([]);
    careerSelecting.current = false;
    setCurrentEvent(dealFromDeck(eventDeckRef, eventCursorRef));
    setResolveState(null);
  }

  function handleOption(option: EventOption) {
    if (resolveState) {
      return;
    }

    let chance = option.chance;
    if (careerBuffs.includes("reincarnation") && option.label.includes("迷因")) {
      chance = Math.min(100, chance + 20);
    }

    const success = checkChance(chance);
    const outcome = success ? option.success : option.failure;
    const deltas = applyCareerBuffsToDeltas(
      outcomeDeltas(outcome),
      currentEvent,
      success,
      careerBuffs,
    );
    const stats = useGameStore.getState();

    applyEventResult(
      toAbsoluteChanges(stats, deltas),
      `【第 ${stats.month} 個月】${outcome.log}`,
    );

    const nextFans = Math.max(0, stats.fans + deltas.fans);
    setChatBurst({
      token: Date.now(),
      lines: buildChatBurst(option.label, success, nextFans),
    });

    if (shouldTriggerDanmaku(option.label, success)) {
      setDanmakuTrigger(Date.now());
    }

    setResolveState({
      success,
      log: outcome.log,
      deltas,
    });
  }

  function handleNextMonth() {
    nextMonth();
    setResolveState(null);

    const state = useGameStore.getState();
    if (state.isGraduated) {
      setCareerPhase(null);
      return;
    }

    if (careerBuffs.includes("keep_indie")) {
      useGameStore.setState({ san: Math.min(100, state.san + 5) });
    }

    const arrived = useGameStore.getState().month;
    const phase = CAREER_CHOICES[arrived];
    if (phase) {
      setCurrentEvent(null);
      setCareerPhase(phase);
      return;
    }

    setCareerPhase(null);
    setCurrentEvent(dealFromDeck(eventDeckRef, eventCursorRef));
  }

  function handleCareerSelect(option: CareerOption) {
    if (careerPhase == null || careerSelecting.current) {
      return;
    }

    careerSelecting.current = true;

    const stats = useGameStore.getState();
    const deltas: StatDelta = {
      fans: option.effects.fansBoost ?? 0,
      san: option.effects.sanBoost ?? 0,
      talk: 0,
      singing: 0,
      tech: 0,
      drama: option.effects.dramaBoost ?? 0,
    };

    applyEventResult(toAbsoluteChanges(stats, deltas), option.logText);
    setCareerBuffs((current) =>
      current.includes(option.id) ? current : [...current, option.id],
    );
    setCareerPhase(null);
    setChatBurst({
      token: Date.now(),
      lines: buildChatBurst(option.tag, true, stats.fans + deltas.fans),
    });

    nextMonth();
    const after = useGameStore.getState();
    careerSelecting.current = false;
    if (after.isGraduated) {
      return;
    }

    setCurrentEvent(dealFromDeck(eventDeckRef, eventCursorRef));
  }

  function handleReincarnate() {
    useGameStore.setState(INITIAL_STATS);
    setCurrentEvent(null);
    setResolveState(null);
    setCopied(false);
    setPeakFans(100);
    setPeakDrama(0);
    setChatBurst(null);
    setDanmakuTrigger(null);
    setCareerPhase(null);
    setCareerBuffs([]);
    careerSelecting.current = false;
    eventDeckRef.current = [];
    eventCursorRef.current = 0;
    setNameInput(name || DEFAULT_NAME);
    setSeedInput(seed || DEFAULT_SEED);
  }

  async function handleDownloadCard() {
    const node = document.getElementById("export-card");
    if (!(node instanceof HTMLElement)) {
      return;
    }

    setDownloading(true);
    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#16041f",
      });
      const link = document.createElement("a");
      link.download = `${name}-vlife-report.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  async function handleCopySeedLink() {
    const url = `${window.location.origin}${window.location.pathname}?seed=${encodeURIComponent(seed)}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div
      className="min-h-full flex-1 font-sans text-purple-100"
      style={{
        backgroundColor: "#1a1625",
        backgroundImage:
          "radial-gradient(ellipse at top, rgba(244,114,182,0.22), transparent 55%), radial-gradient(ellipse at bottom right, rgba(167,139,250,0.18), transparent 50%), radial-gradient(ellipse at left, rgba(253,224,171,0.08), transparent 42%)",
      }}
    >
      {isCreatePhase ? (
        <CreateScreen
          nameInput={nameInput}
          seedInput={seedInput}
          onNameChange={setNameInput}
          onSeedChange={setSeedInput}
          onRandomSeed={() => setSeedInput(generateSeed())}
          onDebut={handleDebut}
        />
      ) : isGraduated && !resolveState ? (
        <GraduationScreen
          name={name}
          seed={seed}
          fans={fans}
          drama={drama}
          san={san}
          peakFans={peakFans}
          peakDrama={peakDrama}
          careerMonths={careerMonths}
          topSkill={topSkill}
          downloading={downloading}
          copied={copied}
          onDownload={handleDownloadCard}
          onCopySeed={handleCopySeedLink}
          onReincarnate={handleReincarnate}
        />
      ) : (
        <LiveScreen
          name={name}
          seed={seed}
          month={careerMonths}
          monthProgress={monthProgress}
          fans={fans}
          san={san}
          sanTone={sanTone}
          talk={talk}
          singing={singing}
          tech={tech}
          drama={drama}
          logs={logs}
          currentEvent={currentEvent}
          resolveState={resolveState}
          isGraduated={isGraduated}
          onOption={handleOption}
          onNextMonth={handleNextMonth}
          onCareerSelect={handleCareerSelect}
          chatBurst={chatBurst}
          careerPhase={careerPhase}
        />
      )}
      <FullScreenDanmaku trigger={danmakuTrigger} />
    </div>
  );
}

function CreateScreen({
  nameInput,
  seedInput,
  onNameChange,
  onSeedChange,
  onRandomSeed,
  onDebut,
}: {
  nameInput: string;
  seedInput: string;
  onNameChange: (value: string) => void;
  onSeedChange: (value: string) => void;
  onRandomSeed: () => void;
  onDebut: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-8 md:px-8">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-purple-300/20 bg-[#251f35]/80 p-8 shadow-[0_0_48px_rgba(244,114,182,0.22)] backdrop-blur">
        <div className="mb-2 flex items-center gap-2 text-pink-300">
          <Radio className="h-4 w-4 animate-pulse" />
          <span className="text-xs font-semibold tracking-[0.28em]">
            OFFLINE → WAITING ROOM
          </span>
        </div>
        <h1 className="bg-gradient-to-r from-pink-300 via-purple-200 to-amber-100 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
          V-Life 配信人生模擬器
        </h1>
        <p className="mt-4 text-sm leading-7 text-purple-300/70">
          36 個月、一條種子碼、無數次忘記關麥。這是臺灣與日本 VTuber
          圈的迷因人生——出道、事故、炎上、畢業。準備好按下開始錄製了嗎？
        </p>

        <label className="mt-8 block text-xs font-semibold tracking-wider text-purple-300/70">
          藝名
          <input
            value={nameInput}
            onChange={(event) => onNameChange(event.target.value)}
            className="mt-2 w-full rounded-xl border border-purple-300/20 bg-[#1a1625] px-4 py-3 text-base text-purple-100 outline-none ring-pink-400/40 transition focus:border-pink-400/50 focus:ring-2"
            placeholder="請輸入你的 VTuber 藝名"
          />
        </label>

        <label className="mt-5 block text-xs font-semibold tracking-wider text-purple-300/70">
          種子碼 Seed
          <div className="mt-2 flex gap-2">
            <input
              value={seedInput}
              onChange={(event) => onSeedChange(event.target.value)}
              className="w-full rounded-xl border border-purple-300/20 bg-[#1a1625] px-4 py-3 font-mono text-base text-purple-100 outline-none ring-pink-400/40 transition focus:border-pink-400/50 focus:ring-2"
              placeholder={DEFAULT_SEED}
            />
            <button
              type="button"
              onClick={onRandomSeed}
              className="shrink-0 rounded-xl border border-purple-300/30 bg-purple-500/15 px-4 text-sm font-semibold text-purple-100 transition hover:bg-purple-500/25"
            >
              隨機 Seed
            </button>
          </div>
        </label>

        <div className="mt-3">
          <p className="text-xs font-semibold tracking-wider text-purple-300/70">
            熱門迷因 Seed
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {MEME_SEEDS.map((memeSeed) => {
              const active = seedInput === memeSeed;
              return (
                <button
                  key={memeSeed}
                  type="button"
                  onClick={() => onSeedChange(memeSeed)}
                  className={`rounded-full px-3 py-1.5 font-mono text-xs font-semibold transition ${
                    active
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_0_16px_rgba(236,72,153,0.45)]"
                      : "border border-purple-300/20 bg-[#1a1625] text-purple-200 hover:border-pink-400/50 hover:text-purple-50"
                  }`}
                >
                  {memeSeed}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onDebut}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-4 text-lg font-black tracking-wide text-white shadow-[0_0_28px_rgba(236,72,153,0.4)] transition hover:brightness-110"
        >
          <Sparkles className="h-5 w-5" />
          初配信出道！
        </button>
      </div>
    </main>
  );
}

function LiveScreen({
  name,
  seed,
  month,
  monthProgress,
  fans,
  san,
  sanTone,
  talk,
  singing,
  tech,
  drama,
  logs,
  currentEvent,
  resolveState,
  isGraduated,
  onOption,
  onNextMonth,
  onCareerSelect,
  chatBurst,
  careerPhase,
}: {
  name: string;
  seed: string;
  month: number;
  monthProgress: number;
  fans: number;
  san: number;
  sanTone: ReturnType<typeof sanBarClass>;
  talk: number;
  singing: number;
  tech: number;
  drama: number;
  logs: string[];
  currentEvent: GameEvent | null;
  resolveState: ResolveState | null;
  isGraduated: boolean;
  onOption: (option: EventOption) => void;
  onNextMonth: () => void;
  onCareerSelect: (option: CareerOption) => void;
  chatBurst: ChatBurst | null;
  careerPhase: CareerChoicePhase | null;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 md:px-8">
      <header className="mb-6 rounded-2xl border border-purple-300/20 bg-[#251f35]/80 p-6 shadow-[0_0_32px_rgba(244,114,182,0.12)] backdrop-blur">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-[11px] font-black tracking-widest text-white">
            <Radio className="h-3.5 w-3.5" />
            LIVE
          </span>
          <span className="font-mono text-sm text-purple-300/70">SEED {seed}</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-purple-100 md:text-4xl">
          {name}
        </h1>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <section className="rounded-2xl border border-purple-300/20 bg-[#251f35]/80 p-6">
          <p className="text-sm font-medium tracking-wide text-purple-300/70">當月進度</p>
          <p className="mt-3 text-3xl font-black text-purple-100">
            第 {month} / 36 個月
          </p>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#1a1625]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
              style={{ width: `${monthProgress}%` }}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-purple-300/20 bg-[#251f35]/80 p-6">
          <p className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-purple-300/70">
            <Tv className="h-4 w-4 text-pink-300" />
            訂閱數 Fans
          </p>
          <p className="mt-3 inline-flex items-center gap-2 text-3xl font-black text-purple-100">
            <Sparkles className="h-6 w-6 text-pink-300" />
            {formatFans(fans)}
          </p>
        </section>

        <section className="rounded-2xl border border-purple-300/20 bg-[#251f35]/80 p-6">
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-purple-300/70">
              <Heart className="h-4 w-4 text-pink-400" />
              精神值 SAN
            </p>
            <span
              className={`font-mono text-lg font-bold ${sanTone.label} ${sanTone.blink ? "animate-pulse" : ""}`}
            >
              {san}/100
            </span>
          </div>
          <div
            className={`mt-4 h-3 overflow-hidden rounded-full bg-[#1a1625] ${sanTone.blink ? "animate-pulse ring-2 ring-red-500/70" : ""}`}
          >
            <div
              className={`h-full rounded-full ${sanTone.fill} ${sanTone.blink ? "animate-pulse" : ""}`}
              style={{ width: `${san}%` }}
            />
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <aside className="flex flex-col gap-6 lg:col-span-3">
          <section className="grid grid-cols-2 gap-4">
            <StatCard label="雜談力 Talk" value={talk} />
            <StatCard label="歌力 Singing" value={singing} />
            <StatCard label="技術力 Tech" value={tech} />
            <StatCard
              label="炎上值 Drama"
              value={drama}
              icon={<Flame className="h-4 w-4 text-orange-400" />}
              accent
            />
          </section>
          <ColamoonPromoBanner />
        </aside>

        <section className="relative flex h-auto min-h-[420px] flex-col rounded-2xl border border-purple-300/20 bg-[#251f35]/80 p-6 shadow-[0_0_36px_rgba(244,114,182,0.12)] lg:col-span-6">
          {careerPhase ? (
            <div className="flex min-h-[420px] flex-col justify-center text-center">
              <p className="text-[11px] font-semibold tracking-[0.25em] text-pink-300">
                CAREER CHOICE
              </p>
              <h2 className="mt-3 text-2xl font-black text-purple-100">
                人生重大抉擇進行中
              </h2>
              <p className="mt-3 text-sm text-purple-300/70">
                請在中央面板選擇你的職涯路線。本月暫停隨機事件。
              </p>
            </div>
          ) : currentEvent ? (
            <>
              {(() => {
                const heading = splitBracketText(currentEvent.title);
                return (
                  <>
                    <span className="mb-3 inline-flex w-fit rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-1 text-[11px] font-black tracking-widest text-white">
                      {heading.badge}
                    </span>
                    <h2 className="mb-3 text-xl font-bold leading-snug text-purple-100 md:text-2xl">
                      {heading.body || currentEvent.title}
                    </h2>
                  </>
                );
              })()}
              <p className="mb-5 whitespace-pre-line text-sm leading-relaxed text-purple-200/90 md:text-base">
                {currentEvent.description}
              </p>
              <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                {currentEvent.options.map((option) => {
                  const parsed = splitBracketText(option.label);
                  return (
                    <button
                      key={option.label}
                      type="button"
                      disabled={resolveState != null}
                      onClick={() => onOption(option)}
                      className="rounded-2xl border border-purple-300/20 bg-[#1a1625]/80 p-3.5 text-left transition hover:border-pink-400/50 hover:bg-pink-500/10 disabled:cursor-not-allowed disabled:opacity-40 md:p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 text-sm font-semibold leading-snug text-purple-100">
                          <span
                            className={`mr-1.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-black tracking-wide ${optionTagClass(parsed.badge, option.type)}`}
                          >
                            {parsed.badge}
                          </span>
                          {parsed.body || option.label}
                        </p>
                        <span className="shrink-0 font-mono text-xs font-semibold text-purple-300/80">
                          {option.chance}%
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-purple-300/70">
                        {optionEffectHint(option)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-purple-300/70">正在準備本月企劃……</p>
          )}

          {resolveState && !careerPhase ? (
            <div className="absolute inset-0 flex items-end justify-center rounded-2xl bg-[#1a1625]/80 p-5 backdrop-blur-sm sm:items-center">
              <div className="w-full max-w-md rounded-2xl border border-purple-300/20 bg-[#251f35] p-5 shadow-[0_0_32px_rgba(244,114,182,0.28)]">
                <p
                  className={`text-xs font-black tracking-[0.3em] ${resolveState.success ? "text-emerald-300" : "text-red-400"}`}
                >
                  {resolveState.success ? "SUCCESS" : "FAILURE"}
                </p>
                <p className="mt-3 text-sm leading-7 text-purple-100">
                  {resolveState.log}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <DeltaChip label="Fans" value={resolveState.deltas.fans} />
                  <DeltaChip label="SAN" value={resolveState.deltas.san} />
                  <DeltaChip label="Talk" value={resolveState.deltas.talk} />
                  <DeltaChip label="Sing" value={resolveState.deltas.singing} />
                  <DeltaChip label="Tech" value={resolveState.deltas.tech} />
                  <DeltaChip label="Drama" value={resolveState.deltas.drama} />
                </div>
                <button
                  type="button"
                  onClick={onNextMonth}
                  className="mt-5 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-3 text-sm font-bold text-white transition hover:brightness-110"
                >
                  {isGraduated
                    ? "查看生涯畢業報告"
                    : "進入下一個月 (Next Month)"}
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <aside className="flex h-[540px] flex-col gap-4 lg:col-span-3">
          <LiveChat burst={chatBurst} className="h-[200px] shrink-0" />
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-purple-300/20 bg-[#251f35]/80 p-6">
            <h2 className="mb-3 shrink-0 text-sm font-bold tracking-wide text-purple-100">
              Career Logs
            </h2>
            <div className="h-full min-h-0 space-y-3 overflow-y-auto pr-2 scrollbar-thin">
              {logs.map((log, index) => {
                const match = /^【(.+?)】(.*)$/.exec(log);
                const tag = match?.[1] ?? "LOG";
                const text = match?.[2] ?? log;
                return (
                  <article
                    key={`${index}-${log}`}
                    className="rounded-xl border-l-2 border-pink-400/70 bg-[#1a1625]/80 px-3 py-2"
                  >
                    <p className="font-mono text-[10px] tracking-wider text-pink-300">
                      {tag}
                    </p>
                    <p className="mt-1 text-xs leading-6 text-purple-300/70">{text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {careerPhase ? (
        <CareerChoiceModal phase={careerPhase} onSelect={onCareerSelect} />
      ) : null}
    </div>
  );
}

function GraduationScreen({
  name,
  seed,
  fans,
  drama,
  san,
  peakFans,
  peakDrama,
  careerMonths,
  topSkill,
  downloading,
  copied,
  onDownload,
  onCopySeed,
  onReincarnate,
}: {
  name: string;
  seed: string;
  fans: number;
  drama: number;
  san: number;
  peakFans: number;
  peakDrama: number;
  careerMonths: number;
  topSkill: { label: string; value: number };
  downloading: boolean;
  copied: boolean;
  onDownload: () => void;
  onCopySeed: () => void;
  onReincarnate: () => void;
}) {
  const title = getCareerTitle(fans, drama);
  const fandomTitle = getFandomTitle(peakFans, peakDrama, san);
  const quote = getGraduationQuote(name, fans, drama, san);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-8 md:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div
        id="export-card"
        className="rounded-3xl border-2 p-8"
        style={{
          background:
            "linear-gradient(160deg, #1a0828 0%, #16041f 45%, #2a0b24 100%)",
          borderColor: "#c084fc",
          color: "#faf5ff",
        }}
      >
        <p
          className="text-xs font-bold tracking-[0.35em]"
          style={{ color: "#f0abfc" }}
        >
          VTUBER 生涯畢業報告卡
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Trophy className="h-6 w-6" style={{ color: "#f5d0fe" }} />
          <h1 className="text-3xl font-black">{name}</h1>
        </div>
        <p className="mt-2 font-mono text-xs" style={{ color: "#d8b4fe" }}>
          SEED {seed}
        </p>
        <p
          className="mt-5 text-2xl font-black"
          style={{ color: "#f9a8d4" }}
        >
          {title}
        </p>
        <div
          className="mt-4 rounded-xl px-4 py-3"
          style={{ backgroundColor: "rgba(251, 191, 36, 0.12)", border: "1px solid #fbbf24" }}
        >
          <p className="text-[11px] font-bold tracking-[0.2em]" style={{ color: "#fde68a" }}>
            同人稱號
          </p>
          <p className="mt-1 text-lg font-black" style={{ color: "#fef3c7" }}>
            {fandomTitle}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ReportStat label="最終訂閱數" value={formatFans(fans)} />
          <ReportStat label="活動月數" value={`${careerMonths} / 36`} />
          <ReportStat label="總炎上次數" value={`${drama}`} />
          <ReportStat
            label="最高能力值"
            value={`${topSkill.label} ${topSkill.value}`}
          />
        </div>

        <p className="mt-6 text-sm leading-7" style={{ color: "#e9d5ff" }}>
          {quote}
        </p>

        <div
          className="mt-6 rounded-2xl p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(88,28,135,0.7) 0%, rgba(126,34,206,0.45) 48%, rgba(161,98,7,0.42) 100%)",
            border: "1px solid #fbbf24",
          }}
        >
          <p className="text-sm font-black" style={{ color: "#fde68a" }}>
            💌 來自四周年先輩「可樂月月」的特邀祝賀
          </p>
          <p className="mt-2 text-sm leading-7" style={{ color: "#f5d0fe" }}>
            不論這段 VTuber
            生涯長短，感謝你帶給觀眾的陪伴與歡笑！快要萬定的可樂月月四周年紀念中，歡迎來頻道看看喔！
          </p>
          <a
            href={COLAMOON_YOUTUBE}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold"
            style={{
              background: "linear-gradient(90deg, #7e22ce 0%, #ca8a04 100%)",
              color: "#fffbeb",
            }}
          >
            🎉 前往 YouTube 訂閱可樂月月 (衝刺 10,000 訂閱)
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={onDownload}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {downloading ? "匯出中…" : "下載生涯報告圖卡"}
        </button>
        <button
          type="button"
          onClick={onCopySeed}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-300/30 bg-purple-500/10 px-4 py-3 text-sm font-bold text-purple-100"
        >
          <Share2 className="h-4 w-4" />
          {copied ? "已複製！" : "複製 Seed 連結"}
        </button>
        <button
          type="button"
          onClick={onReincarnate}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-300/20 bg-[#251f35] px-4 py-3 text-sm font-bold text-purple-100"
        >
          <RotateCcw className="h-4 w-4" />
          重新轉生
        </button>
      </div>
      </div>
    </main>
  );
}

function CareerChoiceModal({
  phase,
  onSelect,
}: {
  phase: CareerChoicePhase;
  onSelect: (option: CareerOption) => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-[#1a1625]/85 px-4 py-8 backdrop-blur-sm">
      <div
        className="my-auto w-full max-w-6xl rounded-3xl border-2 p-6 shadow-[0_0_56px_rgba(244,114,182,0.28)] md:p-8"
        style={{
          background:
            "linear-gradient(165deg, #251f35 0%, #1a1625 42%, #3b2238 100%)",
          borderColor: "rgba(249,168,212,0.45)",
        }}
      >
        <p className="text-[11px] font-black tracking-[0.35em] text-pink-300">
          CAREER CHOICE · 人生重大抉擇
        </p>
        <h2 className="mt-3 text-2xl font-black text-purple-100 md:text-3xl">
          {phase.phaseTitle}
        </h2>
        <p className="mt-2 text-sm font-semibold text-purple-200/90">
          {phase.subtitle}
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-purple-300/70">
          {phase.description}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {phase.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option)}
              className="flex h-full flex-col rounded-2xl border border-purple-300/20 bg-[#251f35]/80 p-5 text-left transition hover:border-pink-300/50 hover:bg-pink-500/10 hover:shadow-[0_0_24px_rgba(244,114,182,0.2)]"
            >
              <span className="w-fit rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-2.5 py-1 text-[11px] font-black text-white">
                {option.tag}
              </span>
              <h3 className="mt-3 text-lg font-black text-purple-100">
                {option.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-purple-300/70">
                {option.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <DeltaChip label="Fans" value={option.effects.fansBoost ?? 0} />
                <DeltaChip label="SAN" value={option.effects.sanBoost ?? 0} />
                <DeltaChip
                  label="Drama"
                  value={option.effects.dramaBoost ?? 0}
                />
              </div>
              <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-500/10 px-3 py-2 text-xs leading-6 text-amber-100">
                {option.effects.passiveBuffDescription}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ColamoonPromoBanner() {
  return (
    <section className="rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-4">
      <p className="text-sm font-black tracking-wide text-purple-100">
        ✦ 可樂月月 4 週年紀念 ✦
      </p>
      <p className="mt-2 text-xs leading-5 text-purple-200/80">
        衝刺 10,000 訂閱中！快來幫月月點個訂閱吧！
      </p>
      <a
        href={COLAMOON_YOUTUBE}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-2 text-xs font-bold text-white transition hover:brightness-110"
      >
        👉 點我前往 YouTube
      </a>
    </section>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${accent ? "border-orange-400/30 bg-orange-500/10" : "border-purple-300/20 bg-[#251f35]/80"}`}
    >
      <p className="flex items-center gap-1 text-[11px] font-medium text-purple-300/70">
        {icon}
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-black text-purple-100">{value}</p>
    </div>
  );
}

function DeltaChip({ label, value }: { label: string; value: number }) {
  if (value === 0) {
    return null;
  }

  const positive = value > 0;
  return (
    <span
      className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${positive ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}
    >
      {label} {formatDelta(value)}
    </span>
  );
}

function ReportStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
    >
      <p className="text-[11px]" style={{ color: "#d8b4fe" }}>
        {label}
      </p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}
