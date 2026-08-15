"use client";

import { toPng } from "html-to-image";
import {
  AlertTriangle,
  Flame,
  Heart,
  Radio,
  RotateCcw,
  Sparkles,
  Trophy,
  Tv,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
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
import { checkChance, getRandomInt, shuffleArray } from "@/lib/prng";
import { getEpilogue, getVTuberTitle, TITLES } from "@/lib/titles";
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

const UNLOCKED_TITLES_KEY = "unlocked_titles";
const TITLE_ATLAS_GOAL = 50;
const DEFAULT_NAME = "可樂月月";
const DEFAULT_SEED = "v-life-2026";
const COLAMOON_YOUTUBE = "https://www.youtube.com/@colamoonie";
const MEME_SEEDS = ["colamoon4th", "hololive", "zero-totsu"] as const;

type TalentId = "cola" | "sprint" | "mechanic" | "horn";

const TALENTS: Record<
  TalentId,
  {
    id: TalentId;
    label: string;
    description: string;
    fans: number;
    san: number;
    talk: number;
    singing: number;
    tech: number;
    drama: number;
    log: string;
  }
> = {
  cola: {
    id: "cola",
    label: "🥤 【可樂神水加護】",
    description: "迷因失敗時 SAN 扣除減半。歌力 +20、SAN 上限 +15。",
    fans: 0,
    san: 15,
    talk: 0,
    singing: 20,
    tech: 0,
    drama: 0,
    log: "天賦【可樂神水加護】覺醒：歌力上升，SAN 上限擴張，迷因失敗傷害減半。",
  },
  sprint: {
    id: "sprint",
    label: "⚡ 【四週年衝刺者】",
    description: "初始粉絲 +800、雜談 +15。",
    fans: 800,
    san: 0,
    talk: 15,
    singing: 0,
    tech: 0,
    drama: 0,
    log: "天賦【四週年衝刺者】覺醒：帶著萬定應援入場，雜談火力全開。",
  },
  mechanic: {
    id: "mechanic",
    label: "🤖 【模型修復極速手】",
    description: "技術 +25，炎上值累積降低。",
    fans: 0,
    san: 0,
    talk: 0,
    singing: 0,
    tech: 25,
    drama: 0,
    log: "天賦【模型修復極速手】覺醒：技術力爆棚，炎上累積減半。",
  },
  horn: {
    id: "horn",
    label: "🚀 【萬定先鋒號角】",
    description: "出道前 12 個月粉絲成長雙倍。",
    fans: 0,
    san: 0,
    talk: 8,
    singing: 0,
    tech: 0,
    drama: 0,
    log: "天賦【萬定先鋒號角】覺醒：前期成長曲線被點燃，粉絲收益雙倍。",
  },
};

const INITIAL_STATS = {
  name: DEFAULT_NAME,
  seed: DEFAULT_SEED,
  month: 1,
  fans: 100,
  san: 100,
  sanMax: 100,
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
    if (next.talk > 0) {
      next.talk = Math.round(next.talk * 1.2);
    }
    if (next.singing > 0) {
      next.singing = Math.round(next.singing * 1.2);
    }
    if (next.tech > 0) {
      next.tech = Math.round(next.tech * 1.2);
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

function cloneEvents(source: GameEvent[] = RANDOM_EVENTS): GameEvent[] {
  return JSON.parse(JSON.stringify(source)) as GameEvent[];
}

function shuffleFreshDeck(usedIds: Set<string>, lastId?: string): GameEvent[] {
  const cloned = cloneEvents();
  const unused = cloned.filter((event) => !usedIds.has(event.id));
  if (unused.length > 0) {
    return shuffleArray(unused);
  }

  usedIds.clear();
  const pool =
    lastId != null ? cloned.filter((event) => event.id !== lastId) : cloned;
  return shuffleArray(pool.length > 0 ? pool : cloneEvents());
}

function dealFromDeck(
  deckRef: { current: GameEvent[] },
  cursorRef: { current: number },
  usedIdsRef: { current: Set<string> },
): GameEvent {
  if (
    deckRef.current.length === 0 ||
    cursorRef.current >= deckRef.current.length
  ) {
    const lastId =
      deckRef.current[cursorRef.current - 1]?.id ??
      deckRef.current[deckRef.current.length - 1]?.id;
    deckRef.current = shuffleFreshDeck(usedIdsRef.current, lastId);
    cursorRef.current = 0;
  }

  const event = deckRef.current[cursorRef.current];
  cursorRef.current += 1;
  if (event) {
    usedIdsRef.current.add(event.id);
  }
  return event ?? cloneEvents()[0];
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
    option.success.fans
      ? `Fans ${formatDelta(
          option.type === "steady"
            ? Math.round(option.success.fans / 2)
            : option.success.fans,
        )}`
      : null,
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

function correspondingSkill(
  option: EventOption,
  stats: Pick<PlayerStats, "talk" | "singing" | "tech">,
): number {
  const talkGain = option.success.talk ?? 0;
  const singingGain = option.success.singing ?? 0;
  const techGain = option.success.tech ?? 0;

  if (singingGain > talkGain && singingGain >= techGain) {
    return stats.singing;
  }
  if (techGain > talkGain && techGain > singingGain) {
    return stats.tech;
  }
  if (talkGain > 0) {
    return stats.talk;
  }

  if (option.type === "steady" || option.type === "meme") {
    return stats.talk;
  }

  return Math.max(stats.talk, stats.singing, stats.tech);
}

function hasHighSkillBonus(
  option: EventOption,
  stats: Pick<PlayerStats, "talk" | "singing" | "tech">,
): boolean {
  return correspondingSkill(option, stats) > 50;
}

function isGamblingOption(option: EventOption): boolean {
  return option.type === "gambling" || option.label.includes("豪賭");
}

function isMemeOption(option: EventOption): boolean {
  return option.type === "meme" || option.label.includes("迷因");
}

function isSteadyOption(option: EventOption): boolean {
  return option.type === "steady" || option.label.includes("穩健");
}

function getEffectiveChance(
  option: EventOption,
  stats: Pick<PlayerStats, "talk" | "singing" | "tech">,
  careerBuffs: string[],
): number {
  let chance = option.chance;

  if (
    careerBuffs.includes("reincarnation") &&
    (option.type === "meme" || option.label.includes("迷因"))
  ) {
    chance = Math.min(100, chance + 20);
  }

  if (hasHighSkillBonus(option, stats)) {
    chance = Math.min(100, chance + 15);
  }

  if (stats.talk + stats.singing + stats.tech >= 150) {
    chance = Math.min(100, chance + 10);
  }

  if (isSteadyOption(option)) {
    return Math.min(80, chance);
  }

  return chance;
}

function monthlyPassiveFans(
  fans: number,
  talk: number,
  singing: number,
  tech: number,
  agencySupport: boolean,
  trafficStagnation = false,
): number {
  const base = Math.floor(fans * 0.03) + (talk + singing + tech) * 15;
  const withAgency = agencySupport ? Math.round(base * 1.5) : base;
  return trafficStagnation ? Math.round(withAgency * 0.5) : withAgency;
}

function getDynamicBuffs(
  stats: {
    san: number;
    drama: number;
    talk: number;
    singing: number;
    tech: number;
  },
  careerBuffs: string[] = [],
  trafficStagnation = false,
): { id: string; label: string; description: string; tone: string }[] {
  const buffs: { id: string; label: string; description: string; tone: string }[] =
    [];

  if (trafficStagnation) {
    buffs.push({
      id: "traffic-stagnation",
      label: "💤 流量停滯",
      description: "連續穩健導致頻道疲乏。每月被動粉絲成長 -50%。選擇標準／豪賭／迷因可解除。",
      tone: "border-slate-400/40 bg-slate-500/10 text-slate-100",
    });
  }

  if (careerBuffs.includes("agency_black")) {
    buffs.push({
      id: "agency-support",
      label: "🏢 企業勢支援",
      description: "每月被動粉絲 +50%。選擇迷因選項時額外 +5 炎上值。",
      tone: "border-violet-400/40 bg-violet-500/10 text-violet-100",
    });
  }

  if (careerBuffs.includes("3d_debut")) {
    buffs.push({
      id: "3d-variety",
      label: "🎬 3D 綜藝體質",
      description: "雜談／歌力／技術收益永久 +20%。",
      tone: "border-sky-400/40 bg-sky-500/10 text-sky-100",
    });
  }

  if (stats.drama >= 100) {
    buffs.push({
      id: "drama-explode",
      label: "🔥 公關危機",
      description: "炎上值爆表，無預警引退倒數中。",
      tone: "border-red-400/50 bg-red-500/15 text-red-100",
    });
  } else if (stats.drama >= 60) {
    buffs.push({
      id: "drama-burn",
      label: "🔥 炎上延燒中",
      description: "每月結算時 SAN -5。風評還在燒，先別再添柴。",
      tone: "border-orange-400/40 bg-orange-500/10 text-orange-100",
    });
  }

  if (stats.san <= 30) {
    buffs.push({
      id: "exhausted",
      label: "💔 精神耗盡",
      description: "【豪賭】已禁用。請先選穩健／標準休養。",
      tone: "border-pink-400/40 bg-pink-500/10 text-pink-100",
    });
  }

  if (stats.talk + stats.singing + stats.tech >= 150) {
    buffs.push({
      id: "gold-streamer",
      label: "✨ 金牌主播",
      description: "三項能力達標，所有事件成功率 +10%。",
      tone: "border-amber-300/40 bg-amber-400/10 text-amber-100",
    });
  }

  return buffs;
}

function formatFans(fans: number): string {
  return fans.toLocaleString("zh-TW");
}

function formatDelta(value: number): string {
  if (value > 0) return `+${value}`;
  return `${value}`;
}

function seedWinRatePercent(seed: string): string {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const score = 1200 + ((hash >>> 0) % 8499);
  return (score / 100).toFixed(2);
}

function seedRecordSlogan(seed: string): string {
  const winRate = seedWinRatePercent(seed);
  return `🏆 本局成績與同 Seed ${winRate}% 的玩家相同！`;
}

function seedStampRateLine(seed: string): string {
  const winRate = seedWinRatePercent(seed);
  return `同 Seed ${winRate}%`;
}

function readUnlockedTitleIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(UNLOCKED_TITLES_KEY) ?? "[]",
    );
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function unlockTitleId(id: string): void {
  if (typeof window === "undefined" || id.length === 0) {
    return;
  }
  const current = readUnlockedTitleIds();
  if (current.includes(id)) {
    return;
  }
  window.localStorage.setItem(
    UNLOCKED_TITLES_KEY,
    JSON.stringify([...current, id]),
  );
}

function buildShareText(name: string, title: string, seed: string): string {
  const url = `${window.location.origin}${window.location.pathname}?seed=${encodeURIComponent(seed)}`;
  return [
    `我在《VTuber 人生模擬器》走完一趟配信人生，獲得同人頭銜「${title}」！`,
    `${name} 在此祝賀 @colamoonie 四週年萬定衝刺，一起衝 10,000 訂閱！`,
    url,
    "#Colamoon4th #VTuber人生模擬器",
  ].join("\n");
}

function buildXShareUrl(name: string, title: string, seed: string): string {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(buildShareText(name, title, seed))}`;
}

function buildThreadsShareUrl(name: string, title: string, seed: string): string {
  return `https://www.threads.net/intent/post?text=${encodeURIComponent(buildShareText(name, title, seed))}`;
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
    sanMax,
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
  const [hasCollab, setHasCollab] = useState(false);
  const [hasColamoonCollab, setHasColamoonCollab] = useState(false);
  const [crisisOverlay, setCrisisOverlay] = useState(false);
  const [steadyStreak, setSteadyStreak] = useState(0);
  const [trafficStagnation, setTrafficStagnation] = useState(false);
  const careerSelecting = useRef(false);
  const eventDeckRef = useRef<GameEvent[]>([]);
  const eventCursorRef = useRef(0);
  const usedEventIdsRef = useRef<Set<string>>(new Set());

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

  function handleDebut(talent: TalentId | null) {
    const nextName = nameInput.trim() || DEFAULT_NAME;
    const nextSeed = seedInput.trim() || DEFAULT_SEED;
    initGame(nextName, nextSeed);
    usedEventIdsRef.current = new Set();
    eventDeckRef.current = shuffleArray(cloneEvents());
    eventCursorRef.current = 0;
    setPeakFans(100);
    setPeakDrama(0);
    setChatBurst(null);
    setDanmakuTrigger(null);
    setCareerPhase(null);
    setCareerBuffs([]);
    setHasCollab(false);
    setHasColamoonCollab(false);
    careerSelecting.current = false;
    setCrisisOverlay(false);
    setSteadyStreak(0);
    setTrafficStagnation(false);
    setCurrentEvent(dealFromDeck(eventDeckRef, eventCursorRef, usedEventIdsRef));
    setResolveState(null);

    if (talent) {
      const bonus = TALENTS[talent];
      const stats = useGameStore.getState();
      applyEventResult(
        {
          fans: stats.fans + bonus.fans,
          san: stats.san + bonus.san,
          sanMax: talent === "cola" ? stats.sanMax + 15 : stats.sanMax,
          talk: stats.talk + bonus.talk,
          singing: stats.singing + bonus.singing,
          tech: stats.tech + bonus.tech,
          drama: stats.drama + bonus.drama,
        },
        `【第 1 個月】${bonus.log}`,
      );
      setPeakFans(stats.fans + bonus.fans);
      setPeakDrama(stats.drama + bonus.drama);
      setHasColamoonCollab(true);
      setCareerBuffs([`talent_${talent}`]);
    }
  }

  function triggerCrisisRetirement() {
    const state = useGameStore.getState();
    if (!state.logs[0]?.includes("嚴重公關危機")) {
      applyEventResult({}, "🔥 嚴重公關危機，被迫無預警引退");
    }
    useGameStore.setState({ isGraduated: true });
    setCrisisOverlay(true);
    setResolveState(null);
    setCareerPhase(null);
  }

  function handleOption(option: EventOption) {
    if (resolveState) {
      return;
    }

    const stats = useGameStore.getState();
    if (isGamblingOption(option) && stats.san <= 30) {
      return;
    }

    const chance = getEffectiveChance(option, stats, careerBuffs);
    const success = checkChance(chance);
    const outcome = success ? option.success : option.failure;
    const deltas = applyCareerBuffsToDeltas(
      outcomeDeltas(outcome),
      currentEvent,
      success,
      careerBuffs,
    );

    if (success && isGamblingOption(option) && deltas.fans > 0) {
      deltas.fans = Math.round(deltas.fans * 1.5);
    }

    if (!success && isGamblingOption(option)) {
      if (deltas.san > -25) {
        deltas.san = -25;
      }
      if (deltas.drama < 25) {
        deltas.drama = 25;
      }
    }

    if (success && isMemeOption(option) && deltas.fans > 0) {
      deltas.fans = Math.round(deltas.fans * 1.25);
    }

    if (
      !success &&
      isMemeOption(option) &&
      careerBuffs.includes("talent_cola") &&
      deltas.san < 0
    ) {
      deltas.san = Math.round(deltas.san * 0.5);
    }

    if (success && hasHighSkillBonus(option, stats) && deltas.fans > 0) {
      deltas.fans = Math.round(deltas.fans * 1.3);
    }

    if (success && isSteadyOption(option) && deltas.fans > 0) {
      deltas.fans = Math.round(deltas.fans * 0.5);
    }

    if (
      careerBuffs.includes("talent_horn") &&
      stats.month <= 12 &&
      deltas.fans > 0
    ) {
      deltas.fans *= 2;
    }

    if (careerBuffs.includes("talent_mechanic") && deltas.drama > 0) {
      deltas.drama = Math.round(deltas.drama * 0.5);
    }

    if (careerBuffs.includes("agency_black") && isMemeOption(option)) {
      deltas.drama += 5;
    }

    let logText = `【第 ${stats.month} 個月】${outcome.log}`;

    if (success && isSteadyOption(option)) {
      const cool = getRandomInt(10, 15);
      const projected = stats.drama + deltas.drama;
      const cooled = Math.max(0, projected - cool);
      deltas.drama = cooled - stats.drama;
      if (projected - cooled > 0) {
        logText += `（公關危機成功降溫，炎上值 -${projected - cooled}）`;
      }
    }

    if (isSteadyOption(option)) {
      const nextStreak = steadyStreak + 1;
      setSteadyStreak(nextStreak);
      if (nextStreak >= 3 && !trafficStagnation) {
        setTrafficStagnation(true);
        logText += "（💤 連續穩健，觸發【流量停滯】：每月被動粉絲成長 -50%）";
      }
    } else {
      setSteadyStreak(0);
      if (trafficStagnation) {
        setTrafficStagnation(false);
        logText += "（流量停滯已解除）";
      }
    }

    applyEventResult(toAbsoluteChanges(stats, deltas), logText);

    if (isCollabEvent(currentEvent)) {
      setHasCollab(true);
    }
    if (currentEvent?.id === "colamoon_collab") {
      setHasColamoonCollab(true);
    }

    const after = useGameStore.getState();
    if (after.drama >= 100) {
      triggerCrisisRetirement();
      return;
    }

    const nextFans = Math.max(0, stats.fans + deltas.fans);
    setChatBurst({
      token: Date.now(),
      lines: buildChatBurst(option.label, success, nextFans),
    });

    if (
      shouldTriggerDanmaku(option.label, success) ||
      (success && isGamblingOption(option))
    ) {
      setDanmakuTrigger(Date.now());
    }

    setResolveState({
      success,
      log: logText.replace(`【第 ${stats.month} 個月】`, ""),
      deltas,
    });
  }

  function applyMonthlyPassiveIncome() {
    const state = useGameStore.getState();
    const bonus = monthlyPassiveFans(
      state.fans,
      state.talk,
      state.singing,
      state.tech,
      careerBuffs.includes("agency_black"),
      trafficStagnation,
    );
    const earlyBoost =
      careerBuffs.includes("talent_horn") && state.month <= 12;
    const fansGain = earlyBoost ? bonus * 2 : bonus;
    const dramaBurn = state.drama >= 60;
    if (fansGain <= 0 && !dramaBurn) {
      return;
    }

    const parts = [
      fansGain > 0
        ? `被動成長 +${fansGain} 粉絲${trafficStagnation ? "（流量停滯 -50%）" : ""}${earlyBoost ? "（萬定先鋒號角 ×2）" : ""}`
        : null,
      dramaBurn ? "炎上延燒 SAN -5" : null,
    ].filter((part): part is string => part != null);

    applyEventResult(
      {
        fans: state.fans + fansGain,
        san: dramaBurn ? state.san - 5 : state.san,
      },
      `【第 ${state.month} 個月】${parts.join("，")}。`,
    );
  }

  function handleNextMonth() {
    applyMonthlyPassiveIncome();

    const settled = useGameStore.getState();
    if (settled.drama >= 100) {
      triggerCrisisRetirement();
      return;
    }

    nextMonth();
    setResolveState(null);

    const state = useGameStore.getState();
    if (state.isGraduated) {
      setCareerPhase(null);
      return;
    }

    if (careerBuffs.includes("keep_indie")) {
      useGameStore.setState({
        san: Math.min(state.sanMax, state.san + 5),
      });
    }

    const arrived = useGameStore.getState().month;
    const phase = CAREER_CHOICES[arrived];
    if (phase) {
      setCurrentEvent(null);
      setCareerPhase(phase);
      return;
    }

    setCareerPhase(null);
    setCurrentEvent(dealFromDeck(eventDeckRef, eventCursorRef, usedEventIdsRef));
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

    if (careerBuffs.includes("talent_mechanic") && deltas.drama > 0) {
      deltas.drama = Math.round(deltas.drama * 0.5);
    }

    if (
      careerBuffs.includes("talent_horn") &&
      stats.month <= 12 &&
      deltas.fans > 0
    ) {
      deltas.fans *= 2;
    }

    applyEventResult(toAbsoluteChanges(stats, deltas), option.logText);
    setCareerBuffs((current) =>
      current.includes(option.id) ? current : [...current, option.id],
    );
    if (option.id === "agency_indie_group") {
      setHasCollab(true);
    }
    setCareerPhase(null);
    setChatBurst({
      token: Date.now(),
      lines: buildChatBurst(option.tag, true, stats.fans + deltas.fans),
    });

    applyMonthlyPassiveIncome();
    const afterPassive = useGameStore.getState();
    if (afterPassive.drama >= 100) {
      triggerCrisisRetirement();
      careerSelecting.current = false;
      return;
    }

    nextMonth();
    const after = useGameStore.getState();
    careerSelecting.current = false;
    if (after.isGraduated) {
      return;
    }

    setCurrentEvent(dealFromDeck(eventDeckRef, eventCursorRef, usedEventIdsRef));
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
    setHasCollab(false);
    setHasColamoonCollab(false);
    careerSelecting.current = false;
    setCrisisOverlay(false);
    setSteadyStreak(0);
    setTrafficStagnation(false);
    eventDeckRef.current = [];
    eventCursorRef.current = 0;
    usedEventIdsRef.current = new Set();
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
      const dataUrl = await exportGraduationPng(node);
      const link = document.createElement("a");
      link.download = `${name}-vlife-report.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      window.alert("圖片匯出失敗，請直接截圖儲存生涯成果報告。");
    } finally {
      setDownloading(false);
    }
  }

  async function handleCopySeedLink() {
    const url = `${window.location.origin}${window.location.pathname}?seed=${encodeURIComponent(seed)}`;
    const text = [
      `【VTuber 人生模擬器 v${APP_VERSION}】Seed 挑戰書`,
      `⚔️ Seed #${seed} 賽馬戰績`,
      seedRecordSlogan(seed),
      `📋 複製此 Seed 發起對決：${url}`,
      "#Colamoon4th #VTuber人生模擬器",
    ].join("\n");
    await navigator.clipboard.writeText(text);
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
      ) : crisisOverlay ? (
        <CrisisRetirementOverlay
          drama={drama}
          onContinue={() => setCrisisOverlay(false)}
        />
      ) : isGraduated && !resolveState ? (
        <GraduationScreen
          name={name}
          seed={seed}
          fans={fans}
          drama={drama}
          san={san}
          talk={talk}
          singing={singing}
          tech={tech}
          peakFans={peakFans}
          peakDrama={peakDrama}
          careerMonths={careerMonths}
          hasCollab={hasCollab}
          hasColamoonCollab={hasColamoonCollab}
          isColaMoonPartner={
            hasColamoonCollab || careerBuffs.includes("agency_indie_group")
          }
          talent={
            careerBuffs.find((id) => id.startsWith("talent_"))?.slice(7) ?? null
          }
          careerBuffs={careerBuffs}
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
          sanMax={sanMax}
          sanTone={sanTone}
          talk={talk}
          singing={singing}
          tech={tech}
          drama={drama}
          careerBuffs={careerBuffs}
          trafficStagnation={trafficStagnation}
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

function CrisisRetirementOverlay({
  drama,
  onContinue,
}: {
  drama: number;
  onContinue: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/90 px-4 backdrop-blur-md">
      <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.35),transparent_62%)]" />
      <div className="relative w-full max-w-lg rounded-3xl border-2 border-red-400 bg-[#2a0b12] p-8 text-center shadow-[0_0_64px_rgba(239,68,68,0.55)]">
        <p className="text-xs font-black tracking-[0.35em] text-red-300">
          FORCED RETIREMENT
        </p>
        <h2 className="mt-4 text-3xl font-black leading-tight text-red-100">
          🔥 嚴重公關危機
          <br />
          被迫無預警引退
        </h2>
        <p className="mt-4 text-sm leading-7 text-red-100/85">
          炎上值已達 {drama}。頻道在深夜無預警關閉，後續將進入生涯成果結算。
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-4 text-lg font-black text-white shadow-[0_0_28px_rgba(239,68,68,0.45)] transition hover:brightness-110"
        >
          查看生涯成果報告
        </button>
      </div>
    </div>
  );
}

function countUnlockedTitles(ids: string[]): number {
  const unlocked = new Set(ids);
  return TITLES.filter((entry) => unlocked.has(entry.id)).length;
}

function TitleAtlasModal({
  unlockedIds,
  onClose,
}: {
  unlockedIds: string[];
  onClose: () => void;
}) {
  const unlocked = new Set(unlockedIds);
  const unlockedCount = countUnlockedTitles(unlockedIds);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#1a1625]/90 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="稱號圖鑑"
    >
      <div
        className="my-auto w-full max-w-5xl rounded-3xl border border-amber-300/30 bg-[#251f35] p-6 shadow-[0_0_48px_rgba(251,191,36,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black tracking-[0.3em] text-amber-200">
              TITLE ATLAS
            </p>
            <h2 className="mt-1 text-2xl font-black text-purple-50">
              🏆 稱號解鎖圖鑑 ({unlockedCount}/{TITLE_ATLAS_GOAL})
            </h2>
            <p className="mt-2 text-sm text-purple-300/75">
              走完不同 Seed 與抉擇，收集尚未見過的結局稱號。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-purple-300/20 px-3 py-1.5 text-xs font-bold text-purple-200 hover:bg-purple-500/10"
          >
            關閉
          </button>
        </div>
        <div className="grid max-h-[70vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
          {TITLES.map((entry) => {
            const isUnlocked = unlocked.has(entry.id);
            return (
              <article
                key={entry.id}
                className={`rounded-2xl border p-4 ${
                  isUnlocked
                    ? "border-amber-300/35 bg-gradient-to-br from-purple-600/25 to-amber-500/10"
                    : "border-purple-300/15 bg-[#1a1625] grayscale opacity-55"
                }`}
              >
                <p className="text-sm font-black text-purple-50">
                  {isUnlocked ? entry.title : "【？？？】未解鎖"}
                </p>
                <p className="mt-2 text-xs leading-6 text-purple-200/80">
                  {isUnlocked ? entry.description : "走完一局生涯成果，才會揭曉這張卡牌。"}
                </p>
              </article>
            );
          })}
        </div>
      </div>
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
  onDebut: (talent: TalentId | null) => void;
}) {
  const [talent, setTalent] = useState<TalentId | null>(null);
  const [atlasOpen, setAtlasOpen] = useState(false);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  useEffect(() => {
    setUnlockedIds(readUnlockedTitleIds());
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-8 md:px-8">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-purple-300/20 bg-[#251f35]/80 p-8 shadow-[0_0_48px_rgba(244,114,182,0.22)] backdrop-blur">
        <div className="mb-2 flex items-center gap-2 text-pink-300">
          <Radio className="h-4 w-4 animate-pulse" />
          <span className="text-xs font-semibold tracking-[0.28em]">
            OFFLINE → WAITING ROOM · v{APP_VERSION}
          </span>
        </div>
        <h1 className="bg-gradient-to-r from-pink-300 via-purple-200 to-amber-100 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
          V-Life 配信人生模擬器
        </h1>
        <p className="mt-2 text-xs font-black tracking-[0.28em] text-amber-200/90">
          v{APP_VERSION}
        </p>
        <p className="mt-4 text-sm leading-7 text-purple-300/70">
          36 個月、一條種子碼、無數次忘記關麥。這是台灣與日本 VTuber
          圈的迷因人生——出道、事故、炎上、圓滿達成。準備好按下開始錄製了嗎？
        </p>
        <button
          type="button"
          onClick={() => {
            setUnlockedIds(readUnlockedTitleIds());
            setAtlasOpen(true);
          }}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-amber-300/40 bg-gradient-to-r from-purple-600/30 to-amber-500/20 px-4 py-2.5 text-sm font-black text-amber-100 transition hover:brightness-110"
        >
          🏆 稱號圖鑑 ({countUnlockedTitles(unlockedIds)}/{TITLE_ATLAS_GOAL})
        </button>

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

        <div className="mt-6">
          <p className="mx-auto mb-1 inline-flex w-full items-center justify-center rounded-full border border-amber-300/50 bg-gradient-to-r from-purple-600/40 via-pink-500/30 to-amber-400/40 px-3 py-1.5 text-center text-[11px] font-black tracking-[0.18em] text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.28)]">
            ✦ 🌟 創作者星火天賦（局外成長） ✦
          </p>
          <p className="mt-1 text-center text-[11px] font-semibold tracking-wider text-purple-300/70">
            初始天賦（可選）
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(Object.values(TALENTS) as (typeof TALENTS)[TalentId][]).map(
              (item) => {
                const active = talent === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setTalent((current) =>
                        current === item.id ? null : item.id,
                      )
                    }
                    className={`rounded-2xl border p-3 text-left transition ${
                      active
                        ? "border-pink-400/60 bg-pink-500/15 shadow-[0_0_16px_rgba(236,72,153,0.25)]"
                        : "border-purple-300/20 bg-[#1a1625] hover:border-pink-400/40"
                    }`}
                  >
                    <p className="text-sm font-black text-purple-100">
                      {item.label}
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-purple-300/70">
                      {item.description}
                    </p>
                  </button>
                );
              },
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDebut(talent)}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-4 text-lg font-black tracking-wide text-white shadow-[0_0_28px_rgba(236,72,153,0.4)] transition hover:brightness-110"
        >
          <Sparkles className="h-5 w-5" />
          初配信出道！
        </button>
      </div>

      <div className="mx-auto mt-8 w-full max-w-3xl">
        <ColamoonHomeBanner />
      </div>
      {atlasOpen ? (
        <TitleAtlasModal
          unlockedIds={unlockedIds}
          onClose={() => setAtlasOpen(false)}
        />
      ) : null}
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
  sanMax,
  sanTone,
  talk,
  singing,
  tech,
  drama,
  careerBuffs,
  trafficStagnation,
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
  sanMax: number;
  sanTone: ReturnType<typeof sanBarClass>;
  talk: number;
  singing: number;
  tech: number;
  drama: number;
  careerBuffs: string[];
  trafficStagnation: boolean;
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
          <span className="font-mono text-sm text-purple-300/70">
            SEED {seed} · v{APP_VERSION}
          </span>
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
              {san}/{sanMax}
            </span>
          </div>
          <div
            className={`mt-4 h-3 overflow-hidden rounded-full bg-[#1a1625] ${sanTone.blink ? "animate-pulse ring-2 ring-red-500/70" : ""}`}
          >
            <div
              className={`h-full rounded-full ${sanTone.fill} ${sanTone.blink ? "animate-pulse" : ""}`}
              style={{ width: `${Math.min(100, (san / sanMax) * 100)}%` }}
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
              critical={drama >= 85}
            />
          </section>
          {getDynamicBuffs(
            { san, drama, talk, singing, tech },
            careerBuffs,
            trafficStagnation,
          ).map((buff) => (
            <div
              key={buff.id}
              className={`rounded-2xl border p-3.5 ${buff.tone}`}
            >
              <p className="text-sm font-black">{buff.label}</p>
              <p className="mt-1 text-xs leading-5 text-purple-200/80">
                {buff.description}
              </p>
            </div>
          ))}
          <ColamoonPromoBanner />
        </aside>

        <section className="relative flex h-auto min-h-[420px] flex-col rounded-2xl border border-purple-300/20 bg-[#251f35]/80 p-6 shadow-[0_0_36px_rgba(244,114,182,0.12)] lg:col-span-6">
          {drama >= 85 ? (
            <div className="mb-4 animate-pulse rounded-2xl border-2 border-red-500 bg-red-600/25 px-4 py-3 shadow-[0_0_28px_rgba(239,68,68,0.45)]">
              <p className="inline-flex items-start gap-2 text-sm font-black leading-6 text-red-100">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                ⚠️ 炎上值過高！請適度選擇【穩健】降低關注度。
              </p>
            </div>
          ) : null}
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
                  const chance = getEffectiveChance(
                    option,
                    { talk, singing, tech },
                    careerBuffs,
                  );
                  const boosted = chance > option.chance;
                  const exhaustedGamble =
                    san <= 30 && isGamblingOption(option);
                  return (
                    <button
                      key={option.label}
                      type="button"
                      disabled={resolveState != null || exhaustedGamble}
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
                          {exhaustedGamble ? "—" : `${chance}%`}
                          {!exhaustedGamble && boosted ? " ↑" : ""}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-purple-300/70">
                        {exhaustedGamble
                          ? "💔 精神耗盡，需先休養才能豪賭"
                          : optionEffectHint(option)}
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
                    ? "查看生涯成果報告"
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

function getAnniversaryBadges(input: {
  fans: number;
  peakFans: number;
  drama: number;
  peakDrama: number;
  san: number;
  months: number;
  talent: string | null;
  careerBuffs: string[];
  hasColamoonCollab: boolean;
  isColaMoonPartner: boolean;
}): { emoji: string; label: string }[] {
  const reach = Math.max(input.fans, input.peakFans);
  const candidates = [
    {
      hit:
        input.talent === "cola" ||
        input.hasColamoonCollab ||
        input.isColaMoonPartner,
      emoji: "🥤",
      label: "可樂單推人",
    },
    {
      hit: input.peakDrama >= 85 && input.drama < 100,
      emoji: "⚖️",
      label: "懸崖勒馬大師",
    },
    {
      hit: reach >= 10_000,
      emoji: "🚀",
      label: "萬定衝刺先鋒",
    },
    {
      hit: input.careerBuffs.includes("3d_debut"),
      emoji: "🎬",
      label: "3D 綜藝人",
    },
    {
      hit: input.talent === "sprint",
      emoji: "⚡",
      label: "四週年衝刺者",
    },
    {
      hit: input.talent === "horn",
      emoji: "🚀",
      label: "萬定先鋒號角",
    },
    {
      hit: input.talent === "mechanic",
      emoji: "🤖",
      label: "模型修復職人",
    },
    {
      hit: input.peakDrama >= 100 || input.drama >= 100,
      emoji: "🔥",
      label: "黑紅見證人",
    },
    {
      hit: input.san >= 85 && input.months >= 24,
      emoji: "🧘",
      label: "鋼鐵心智",
    },
    {
      hit: input.careerBuffs.includes("agency_indie_group"),
      emoji: "🌸",
      label: "星火社社員",
    },
  ];

  const picked = candidates.filter((item) => item.hit).slice(0, 3);
  if (picked.length === 0) {
    picked.push({ hit: true, emoji: "🎂", label: "四週年參與獎" });
  }

  return picked.map(({ emoji, label }) => ({ emoji, label }));
}

const GRADUATION_CARD_STYLE: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: "24px",
  border: "2px solid #c084fc",
  padding: "32px 32px 112px",
  background:
    "linear-gradient(160deg, #1a0828 0%, #16041f 45%, #2a0b24 100%)",
  color: "#faf5ff",
};

function waitForHtmlImage(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const finish = () => {
      img.removeEventListener("load", finish);
      img.removeEventListener("error", finish);
      resolve();
    };
    img.addEventListener("load", finish);
    img.addEventListener("error", finish);
  });
}

function waitForUrlImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = url;
  });
}

function collectBackgroundImageUrls(root: HTMLElement): string[] {
  const urls: string[] = [];
  const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))];

  for (const node of nodes) {
    const background = getComputedStyle(node).backgroundImage;
    if (!background || background === "none") {
      continue;
    }

    for (const match of background.matchAll(/url\((['"]?)(.*?)\1\)/g)) {
      const url = match[2];
      if (url) {
        urls.push(url);
      }
    }
  }

  return urls;
}

async function waitForCardAssets(root: HTMLElement): Promise<void> {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  await Promise.all(
    Array.from(root.querySelectorAll("img")).map(waitForHtmlImage),
  );
  await Promise.all(collectBackgroundImageUrls(root).map(waitForUrlImage));
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

async function exportGraduationPng(node: HTMLElement): Promise<string> {
  await waitForCardAssets(node);
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#16041f",
  });

  if (!dataUrl.startsWith("data:image") || dataUrl.length < 500) {
    throw new Error("graduation png is empty");
  }

  return dataUrl;
}

function GraduationScreen({
  name,
  seed,
  fans,
  drama,
  san,
  talk,
  singing,
  tech,
  peakFans,
  peakDrama,
  careerMonths,
  hasCollab,
  hasColamoonCollab,
  isColaMoonPartner,
  talent,
  careerBuffs,
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
  talk: number;
  singing: number;
  tech: number;
  peakFans: number;
  peakDrama: number;
  careerMonths: number;
  hasCollab: boolean;
  hasColamoonCollab: boolean;
  isColaMoonPartner: boolean;
  talent: string | null;
  careerBuffs: string[];
  topSkill: { label: string; value: number };
  downloading: boolean;
  copied: boolean;
  onDownload: () => void;
  onCopySeed: () => void;
  onReincarnate: () => void;
}) {
  const titleContext = {
    name,
    fans,
    peakFans,
    san,
    drama,
    peakDrama,
    talk,
    singing,
    tech,
    months: careerMonths,
    hasCollab,
    hasColamoonCollab,
    isColaMoonPartner,
    talent,
    careerBuffs,
  };
  const result = getVTuberTitle(titleContext);
  const title = result.title;
  const fandomTitle = result.title;
  const quote = result.quote;
  const epilogue = getEpilogue(titleContext);
  const badges = getAnniversaryBadges({
    fans,
    peakFans,
    drama,
    peakDrama,
    san,
    months: careerMonths,
    talent,
    careerBuffs,
    hasColamoonCollab,
    isColaMoonPartner,
  });
  const [cardImageUrl, setCardImageUrl] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const showHtmlCard = cardImageUrl == null;
  const isCrisisExit = drama >= 100 || peakDrama >= 100 || san <= 0;
  const recordSlogan = seedRecordSlogan(seed);
  const stampRateLine = seedStampRateLine(seed);

  useEffect(() => {
    unlockTitleId(result.id);
  }, [result.id]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const node = document.getElementById("export-card");
      if (!(node instanceof HTMLElement)) {
        if (!cancelled) {
          setPreviewFailed(true);
        }
        return;
      }

      try {
        const dataUrl = await exportGraduationPng(node);
        if (!cancelled) {
          setCardImageUrl(dataUrl);
        }
      } catch {
        if (!cancelled) {
          setPreviewFailed(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-4 py-6">
      <header className="mb-3 text-center">
        <p className="text-[10px] font-bold tracking-[0.35em] text-fuchsia-300/80">
          {isCrisisExit ? "FORCED RETIREMENT" : "MILESTONE"}
        </p>
        <h1 className="mt-1 text-xl font-black text-purple-50">
          {name} 的生涯成果報告
        </h1>
        <p
          className={`mt-2 text-sm font-black ${isCrisisExit ? "text-red-300" : "text-amber-200"}`}
        >
          {isCrisisExit
            ? "被迫無預警引退"
            : "🎉 創作者生涯圓滿達成！"}
        </p>
        <p className="mt-1 text-[10px] font-bold tracking-[0.28em] text-purple-300/70">
          v{APP_VERSION}
        </p>
      </header>

      {cardImageUrl ? (
        <img
          src={cardImageUrl}
          alt={`${name} 的 VTuber 生涯成果卡`}
          onClick={() => setZoomed(true)}
          className="block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-purple-300/25 bg-[#16041f] shadow-[0_12px_40px_rgba(88,28,135,0.45)]"
          style={{ touchAction: "pinch-zoom" }}
        />
      ) : null}

      <div
        id="export-card"
        aria-hidden={cardImageUrl ? true : undefined}
        className={
          showHtmlCard
            ? "relative w-full shadow-[0_12px_40px_rgba(88,28,135,0.45)]"
            : "pointer-events-none fixed top-0 left-[-10000px] w-[390px]"
        }
        style={{
          ...GRADUATION_CARD_STYLE,
          touchAction: showHtmlCard ? "pinch-zoom" : undefined,
        }}
      >
        <p className="text-xs font-bold tracking-[0.35em]" style={{ color: "#f0abfc" }}>
          VTUBER 生涯成果卡
        </p>
        <p
          className="mt-1 text-[10px] font-black tracking-[0.28em]"
          style={{ color: "#fde68a" }}
        >
          v{APP_VERSION}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Trophy className="h-6 w-6" style={{ color: "#f5d0fe" }} />
          <h1 className="text-3xl font-black">{name}</h1>
        </div>
        <p className="mt-2 font-mono text-xs" style={{ color: "#d8b4fe" }}>
          SEED {seed}
        </p>
        <div
          className="mt-3 rounded-xl px-3 py-2"
          style={{
            background:
              "linear-gradient(90deg, rgba(126,34,206,0.45) 0%, rgba(219,39,119,0.32) 50%, rgba(202,138,4,0.38) 100%)",
            border: "1px solid #fbbf24",
          }}
        >
          <p
            className="text-[10px] font-black tracking-[0.2em]"
            style={{ color: "#fde68a" }}
          >
            ⚔️ Seed #{seed} 賽馬戰績
          </p>
          <p className="mt-1 text-sm font-black leading-6" style={{ color: "#fffbeb" }}>
            {recordSlogan}
          </p>
        </div>
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
          className="mt-5 rounded-xl px-4 py-3"
          style={{
            backgroundColor: "rgba(244,114,182,0.12)",
            border: "1px solid rgba(244,114,182,0.45)",
          }}
        >
          <p
            className="text-[11px] font-bold tracking-[0.2em]"
            style={{ color: "#f9a8d4" }}
          >
            人生後日談
          </p>
          <p className="mt-2 text-sm leading-7" style={{ color: "#fce7f3" }}>
            {epilogue}
          </p>
        </div>

        <div className="mt-5">
          <p
            className="text-[11px] font-bold tracking-[0.2em]"
            style={{ color: "#fde68a" }}
          >
            ✦ 四週年限時成就 ✦
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  borderRadius: "9999px",
                  border: "1px solid #fbbf24",
                  background:
                    "linear-gradient(90deg, rgba(126,34,206,0.55) 0%, rgba(219,39,119,0.4) 100%)",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#fef3c7",
                }}
              >
                {badge.emoji} {badge.label}
              </span>
            ))}
          </div>
        </div>

        <div
          className="mt-6 rounded-2xl p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(88,28,135,0.7) 0%, rgba(126,34,206,0.45) 48%, rgba(161,98,7,0.42) 100%)",
            border: "1px solid #fbbf24",
          }}
        >
          <p className="text-sm font-black" style={{ color: "#fde68a" }}>
            💌 來自四週年先輩「可樂月月」的特邀祝賀
          </p>
          <p className="mt-2 text-sm leading-7" style={{ color: "#f5d0fe" }}>
            不論這段 VTuber
            生涯長短，感謝你帶給觀眾的陪伴與歡笑！可樂月月四週年萬定衝刺進行中，歡迎來頻道看看喔！
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

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "16px",
            bottom: "18px",
            width: "132px",
            minHeight: "72px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-8deg)",
            border: "2px solid #fbbf24",
            padding: "8px 10px",
            background:
              "linear-gradient(160deg, rgba(88,28,135,0.92) 0%, rgba(157,23,77,0.88) 100%)",
            boxShadow: "0 8px 18px rgba(88,28,135,0.45)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "10px",
              fontWeight: 900,
              lineHeight: 1.35,
              textAlign: "center",
              color: "#fef3c7",
            }}
          >
            ⚔️ Seed #{seed}
            <br />
            賽馬戰績
            <br />
            {stampRateLine}
          </p>
        </div>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "20px",
            bottom: "18px",
            width: "128px",
            height: "128px",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-16deg)",
            border: "3px solid #fbbf24",
            boxShadow:
              "0 0 0 5px rgba(192,132,252,0.55), 0 0 0 8px rgba(244,114,182,0.28), 0 8px 22px rgba(88,28,135,0.55)",
            background:
              "radial-gradient(circle at 32% 28%, rgba(253,230,138,0.42) 0%, rgba(244,114,182,0.38) 38%, rgba(126,34,206,0.92) 72%, rgba(88,28,135,0.96) 100%)",
          }}
        >
          <div
            style={{
              width: "108px",
              height: "108px",
              borderRadius: "9999px",
              border: "1.5px dashed rgba(253,230,138,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "10px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                fontWeight: 900,
                lineHeight: 1.35,
                letterSpacing: "0.04em",
                color: "#fef3c7",
                textShadow: "0 1px 2px rgba(88,28,135,0.85)",
              }}
            >
              【可樂月月
              <br />
              4th 萬定衝刺
              <br />
              認證章】
            </p>
          </div>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] leading-5 text-purple-300/75">
        {cardImageUrl
          ? "點擊放大 · 手機可長按圖片儲存至相簿"
          : previewFailed
            ? "已改以網頁版顯示生涯成果卡 · 可直接截圖儲存"
            : "正在產生分享圖……生涯成果卡已可先在上方閱讀"}
      </p>

      <div className="mt-3 flex flex-col gap-2">
        <a
          href={COLAMOON_YOUTUBE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-red-600 via-fuchsia-500 to-amber-400 px-4 py-4 text-center text-base font-black leading-snug text-white shadow-[0_12px_32px_rgba(244,114,182,0.5)] ring-2 ring-amber-300/70 transition hover:brightness-110"
        >
          🚀 前往 @colamoonie YouTube！為可樂月月四週年萬定衝刺加油！
        </a>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              window.open(buildXShareUrl(name, title, seed), "_blank", "noopener,noreferrer");
            }}
            className="inline-flex items-center justify-center rounded-xl bg-black px-3 py-2.5 text-sm font-bold text-white/90 transition hover:bg-zinc-800"
          >
            一鍵分享至 X
          </button>
          <button
            type="button"
            onClick={() => {
              window.open(
                buildThreadsShareUrl(name, title, seed),
                "_blank",
                "noopener,noreferrer",
              );
            }}
            className="inline-flex items-center justify-center rounded-xl bg-zinc-800 px-3 py-2.5 text-sm font-bold text-white/90 transition hover:bg-zinc-700"
          >
            一鍵分享至 Threads
          </button>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            if (cardImageUrl) {
              const link = document.createElement("a");
              link.download = `${name}-vlife-report.png`;
              link.href = cardImageUrl;
              link.click();
              return;
            }
            onDownload();
          }}
          disabled={downloading}
          className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-purple-300/25 bg-purple-500/10 px-3 py-2.5 text-sm font-bold text-purple-100 disabled:opacity-60"
        >
          {downloading ? "匯出中…" : "🖼️ 儲存生涯成果卡 (PNG)"}
        </button>
        <button
          type="button"
          onClick={onCopySeed}
          className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-purple-300/25 bg-[#251f35] px-3 py-2.5 text-sm font-bold text-purple-100 transition hover:border-amber-300/40 hover:text-amber-100"
        >
          {copied ? "已複製挑戰書！" : `📋 複製 Seed (#${seed}) 發起對決`}
        </button>
        <button
          type="button"
          onClick={onReincarnate}
          className="inline-flex w-full items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold text-purple-300/70 transition hover:text-purple-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          轉生
        </button>
      </div>

      {copied ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[60] w-[min(92vw,28rem)] -translate-x-1/2 rounded-2xl border border-amber-300/50 bg-[#1a1625]/95 px-4 py-3 text-center text-sm font-black text-amber-100 shadow-[0_12px_40px_rgba(251,191,36,0.35)] backdrop-blur"
        >
          📋 已複製 Seed 挑戰書！快把 #{seed} 丟出去發起對決吧
        </div>
      ) : null}

      {zoomed && cardImageUrl ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="生涯成果卡放大預覽"
        >
          <img
            src={cardImageUrl}
            alt={`${name} 的 VTuber 生涯成果卡（放大）`}
            className="max-h-full max-w-full cursor-zoom-out rounded-lg object-contain"
            style={{ touchAction: "pinch-zoom" }}
          />
        </div>
      ) : null}
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

function ColamoonHomeBanner() {
  return (
    <section className="overflow-hidden rounded-3xl border border-purple-400/30 bg-gradient-to-r from-purple-900/70 via-fuchsia-900/50 to-amber-700/40 p-6 shadow-[0_0_36px_rgba(244,114,182,0.22)]">
      <p className="text-center text-base font-black tracking-wide text-amber-100 sm:text-lg">
        ✦ 台灣 VTuber 可樂月月 4 週年紀念中！衝刺 10,000 訂閱 ✦
      </p>
      <p className="mt-2 text-center text-sm leading-6 text-purple-100/85">
        四週年萬定倒數中。看完創角，也來給先輩點一顆訂閱吧！
      </p>
      <div className="mt-4 flex justify-center">
        <a
          href={COLAMOON_YOUTUBE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-2.5 text-sm font-black text-white shadow-[0_0_20px_rgba(236,72,153,0.45)] transition hover:brightness-110"
        >
          👉 點我前往 YouTube 訂閱可樂月月
        </a>
      </div>
    </section>
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
  critical,
}: {
  label: string;
  value: number;
  icon?: ReactNode;
  accent?: boolean;
  critical?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        critical
          ? "animate-drama-shake animate-pulse border-red-500 bg-red-600/20 shadow-[0_0_24px_rgba(239,68,68,0.45)]"
          : accent
            ? "border-orange-400/30 bg-orange-500/10"
            : "border-purple-300/20 bg-[#251f35]/80"
      }`}
    >
      <p className="flex items-center gap-1 text-[11px] font-medium text-purple-300/70">
        {icon}
        {label}
      </p>
      <p
        className={`mt-1 font-mono text-2xl font-black ${critical ? "text-red-200" : "text-purple-100"}`}
      >
        {value}
      </p>
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
