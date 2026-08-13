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
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  RANDOM_EVENTS,
  type EventFailure,
  type EventOption,
  type EventSuccess,
  type GameEvent,
} from "@/data/events";
import { checkChance, getRandomArrayItem } from "@/lib/prng";
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

const DEFAULT_NAME = "預設V子";
const DEFAULT_SEED = "v-life-2026";
const COLAMOON_YOUTUBE = "https://www.youtube.com/@colamoonie";
const COLAMOON_PROMO_OPTION =
  "【大聲宣傳】祝賀月月 4 周年快樂！(點擊同時引導開啟頻道)";
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

function generateSeed(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => chars[byte % chars.length]).join("");
}

function pickMonthlyEvent(excludeId?: string): GameEvent {
  const pool =
    excludeId != null
      ? RANDOM_EVENTS.filter((event) => event.id !== excludeId)
      : RANDOM_EVENTS;
  return getRandomArrayItem(pool.length > 0 ? pool : RANDOM_EVENTS);
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedSeed = params.get("seed");
    if (sharedSeed) {
      setSeedInput(sharedSeed);
    }
  }, []);

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
    setCurrentEvent(pickMonthlyEvent());
    setResolveState(null);
  }

  function handleOption(option: EventOption) {
    if (resolveState) {
      return;
    }

    if (option.label === COLAMOON_PROMO_OPTION) {
      window.open(COLAMOON_YOUTUBE, "_blank", "noopener,noreferrer");
    }

    const success = checkChance(option.chance);
    const outcome = success ? option.success : option.failure;
    const deltas = outcomeDeltas(outcome);
    const stats = useGameStore.getState();

    applyEventResult(
      toAbsoluteChanges(stats, deltas),
      `【第 ${stats.month} 個月】${outcome.log}`,
    );

    setResolveState({
      success,
      log: outcome.log,
      deltas,
    });
  }

  function handleNextMonth() {
    const previousId = currentEvent?.id;
    nextMonth();
    setResolveState(null);

    if (!useGameStore.getState().isGraduated) {
      setCurrentEvent(pickMonthlyEvent(previousId));
    }
  }

  function handleReincarnate() {
    useGameStore.setState(INITIAL_STATS);
    setCurrentEvent(null);
    setResolveState(null);
    setCopied(false);
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
      className="min-h-full flex-1 text-zinc-100 font-sans"
      style={{
        backgroundColor: "#0e0e10",
        backgroundImage:
          "radial-gradient(ellipse at top, rgba(145,70,255,0.22), transparent 55%), radial-gradient(ellipse at bottom right, rgba(236,72,153,0.14), transparent 50%)",
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
        />
      )}
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
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center gap-5 px-6 py-10">
      <ColamoonPromoBanner />
      <div className="rounded-3xl border border-fuchsia-400/25 bg-zinc-950/80 p-8 shadow-[0_0_48px_rgba(145,70,255,0.28)] backdrop-blur">
        <div className="mb-2 flex items-center gap-2 text-fuchsia-300">
          <Radio className="h-4 w-4 animate-pulse" />
          <span className="text-xs font-semibold tracking-[0.28em]">
            OFFLINE → WAITING ROOM
          </span>
        </div>
        <h1 className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-400 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
          V-Life 配信人生模擬器
        </h1>
        <p className="mt-4 text-sm leading-7 text-zinc-400">
          36 個月、一條種子碼、無數次忘記關麥。這是臺灣與日本 VTuber
          圈的迷因人生——出道、事故、炎上、畢業。準備好按下開始錄製了嗎？
        </p>

        <label className="mt-8 block text-xs font-semibold tracking-wider text-zinc-500">
          藝名
          <input
            value={nameInput}
            onChange={(event) => onNameChange(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-base text-white outline-none ring-fuchsia-400/40 transition focus:border-fuchsia-400/50 focus:ring-2"
            placeholder={DEFAULT_NAME}
          />
        </label>

        <label className="mt-5 block text-xs font-semibold tracking-wider text-zinc-500">
          種子碼 Seed
          <div className="mt-2 flex gap-2">
            <input
              value={seedInput}
              onChange={(event) => onSeedChange(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 font-mono text-base text-white outline-none ring-fuchsia-400/40 transition focus:border-fuchsia-400/50 focus:ring-2"
              placeholder={DEFAULT_SEED}
            />
            <button
              type="button"
              onClick={onRandomSeed}
              className="shrink-0 rounded-xl border border-violet-400/40 bg-violet-500/15 px-4 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/25"
            >
              隨機 Seed
            </button>
          </div>
        </label>

        <button
          type="button"
          onClick={onDebut}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 px-6 py-4 text-lg font-black tracking-wide text-white shadow-[0_0_28px_rgba(217,70,239,0.45)] transition hover:brightness-110"
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
}) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-4 px-4 py-4 lg:px-6">
      <header className="rounded-2xl border border-white/10 bg-zinc-950/75 px-5 py-4 shadow-[0_0_32px_rgba(145,70,255,0.12)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-red-600 px-2 py-0.5 text-[10px] font-black tracking-widest text-white">
                <Radio className="h-3 w-3" />
                LIVE
              </span>
              <span className="font-mono text-xs text-zinc-500">SEED {seed}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              {name}
            </h1>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-3 lg:max-w-xl lg:items-end">
            <div className="flex w-full items-center justify-between gap-3 text-sm">
              <span className="text-zinc-400">
                第 {month} / 36 個月
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-fuchsia-200">
                <Tv className="h-4 w-4" />
                <Sparkles className="h-4 w-4 text-amber-300" />
                {formatFans(fans)} 訂閱
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                style={{ width: `${monthProgress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)_280px]">
        <aside className="flex flex-col gap-4">
          <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-300">
                <Heart className="h-4 w-4 text-pink-400" />
                精神值 SAN
              </span>
              <span
                className={`font-mono text-sm font-bold ${sanTone.label} ${sanTone.blink ? "animate-pulse" : ""}`}
              >
                {san}/100
              </span>
            </div>
            <div
              className={`h-3 overflow-hidden rounded-full bg-zinc-800 ${sanTone.blink ? "animate-pulse ring-2 ring-red-500/70" : ""}`}
            >
              <div
                className={`h-full rounded-full ${sanTone.fill} ${sanTone.blink ? "animate-pulse" : ""}`}
                style={{ width: `${san}%` }}
              />
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3">
            <StatCard label="雜談力 Talk" value={talk} />
            <StatCard label="歌力 Singing" value={singing} />
            <StatCard label="技術力 Tech" value={tech} />
            <StatCard
              label="炎上值 Drama"
              value={drama}
              icon={<Flame className="h-3.5 w-3.5 text-orange-400" />}
              accent
            />
          </section>
        </aside>

        <section className="relative rounded-2xl border border-fuchsia-400/20 bg-zinc-950/75 p-5 shadow-[0_0_36px_rgba(217,70,239,0.12)]">
          {currentEvent ? (
            <>
              <p className="mb-2 text-[11px] font-semibold tracking-[0.25em] text-fuchsia-300">
                EVENT STREAM
              </p>
              <h2 className="text-2xl font-black text-white">
                {currentEvent.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                {currentEvent.description}
              </p>
              <div className="mt-6 flex flex-col gap-3">
                {currentEvent.options.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    disabled={resolveState != null}
                    onClick={() => onOption(option)}
                    className="rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-left transition hover:border-fuchsia-400/50 hover:bg-fuchsia-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold text-zinc-100">
                        {option.label}
                      </span>
                      <span className="shrink-0 rounded-full bg-violet-500/20 px-2 py-0.5 font-mono text-[11px] text-violet-200">
                        {option.chance}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-zinc-400">正在準備本月企劃……</p>
          )}

          {resolveState ? (
            <div className="absolute inset-0 flex items-end justify-center rounded-2xl bg-black/70 p-5 backdrop-blur-sm sm:items-center">
              <div className="w-full max-w-md rounded-2xl border border-fuchsia-400/30 bg-zinc-950 p-5 shadow-[0_0_32px_rgba(145,70,255,0.35)]">
                <p
                  className={`text-xs font-black tracking-[0.3em] ${resolveState.success ? "text-emerald-300" : "text-red-400"}`}
                >
                  {resolveState.success ? "SUCCESS" : "FAILURE"}
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-200">
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
                  className="mt-5 w-full rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 py-3 text-sm font-bold text-white"
                >
                  {isGraduated
                    ? "查看生涯畢業報告"
                    : "進入下一個月 (Next Month)"}
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <aside className="flex max-h-[70vh] flex-col rounded-2xl border border-white/10 bg-zinc-950/70 p-4 lg:max-h-none">
          <h2 className="mb-3 text-sm font-bold tracking-wide text-zinc-300">
            Career Logs
          </h2>
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {logs.map((log, index) => {
              const match = /^【(.+?)】(.*)$/.exec(log);
              const tag = match?.[1] ?? "LOG";
              const text = match?.[2] ?? log;
              return (
                <article
                  key={`${index}-${log}`}
                  className="rounded-xl border-l-2 border-fuchsia-400/70 bg-zinc-900/80 px-3 py-2"
                >
                  <p className="font-mono text-[10px] tracking-wider text-fuchsia-300">
                    {tag}
                  </p>
                  <p className="mt-1 text-xs leading-6 text-zinc-300">{text}</p>
                </article>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

function GraduationScreen({
  name,
  seed,
  fans,
  drama,
  san,
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
  careerMonths: number;
  topSkill: { label: string; value: number };
  downloading: boolean;
  copied: boolean;
  onDownload: () => void;
  onCopySeed: () => void;
  onReincarnate: () => void;
}) {
  const title = getCareerTitle(fans, drama);
  const quote = getGraduationQuote(name, fans, drama, san);

  return (
    <main className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center gap-5 px-4 py-10">
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
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {downloading ? "匯出中…" : "下載生涯報告圖卡"}
        </button>
        <button
          type="button"
          onClick={onCopySeed}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-400/40 bg-violet-500/10 px-4 py-3 text-sm font-bold text-violet-100"
        >
          <Share2 className="h-4 w-4" />
          {copied ? "已複製！" : "複製 Seed 連結"}
        </button>
        <button
          type="button"
          onClick={onReincarnate}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-zinc-900 px-4 py-3 text-sm font-bold text-zinc-200"
        >
          <RotateCcw className="h-4 w-4" />
          重新轉生
        </button>
      </div>
    </main>
  );
}

function ColamoonPromoBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-300/40 p-5 shadow-[0_0_36px_rgba(202,138,4,0.28)]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, #4c1d95 0%, #6d28d9 38%, #b45309 72%, #fbbf24 100%)",
        }}
      />
      <span className="pointer-events-none absolute top-3 left-6 h-1.5 w-1.5 animate-ping rounded-full bg-amber-100" />
      <span className="pointer-events-none absolute top-8 right-10 h-2 w-2 animate-pulse rounded-full bg-yellow-200" />
      <span className="pointer-events-none absolute bottom-4 left-1/4 h-1 w-1 animate-ping rounded-full bg-white delay-150" />
      <span className="pointer-events-none absolute right-1/3 bottom-6 h-1.5 w-1.5 animate-pulse rounded-full bg-amber-50" />
      <span className="pointer-events-none absolute top-1/2 left-10 h-1 w-1 animate-ping rounded-full bg-fuchsia-100" />

      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-black tracking-wide text-amber-50 sm:text-base">
          ✦ 台灣 VTuber 可樂月月 4 週年紀念中！衝刺 10,000 訂閱中 ✦
        </p>
        <a
          href={COLAMOON_YOUTUBE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-amber-100 px-5 py-2.5 text-sm font-black text-purple-950 shadow-[0_0_20px_rgba(253,230,138,0.65)] transition hover:scale-[1.03] hover:bg-white"
        >
          👉 點我前往 YouTube 訂閱可樂月月
        </a>
      </div>
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
      className={`rounded-2xl border p-3 ${accent ? "border-orange-400/30 bg-orange-500/10" : "border-white/10 bg-zinc-950/70"}`}
    >
      <p className="flex items-center gap-1 text-[11px] font-medium text-zinc-400">
        {icon}
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-black text-white">{value}</p>
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
