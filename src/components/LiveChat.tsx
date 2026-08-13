"use client";

import { MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface ChatLine {
  id: number;
  user: string;
  text: string;
  color: string;
  badge?: "MOD" | "SUB" | "VIP";
  highlight?: boolean;
}

export interface ChatBurst {
  token: number;
  lines: ChatLine[];
}

const CHAT_COLORS = [
  "#f9a8d4",
  "#e9d5ff",
  "#fbcfe8",
  "#c4b5fd",
  "#fda4af",
  "#ddd6fe",
  "#f5d0fe",
  "#a5b4fc",
];

const USER_NAMES = [
  "待機古參",
  "箱推A",
  "clip_職人",
  "翻譯組請假中",
  "野うさぎ",
  "同接73",
  "PTT鄉民",
  "巴哈仔",
  "Holomem誤入",
  "月月箱推",
  "不要香菜教",
  "SAN監視員",
  "綠界小金剛",
  "月月單推人",
  "路過黑粉",
  "箱推大客",
  "全勤觀眾",
  "無課金戰士",
  "SC大暴戶",
  "DD三千",
  "烤肉 Man",
  "鍵盤教練",
  "貼貼狂魔",
  "吟遊詩人",
];

const MEME_COMMENTS = {
  steady: [
    "初見安安！",
    "今天也是和平的一天呢",
    "推推！",
    "好聽！",
    "卡位",
    "辛苦了！",
    "今天主播也卡哇伊",
    "貼貼！",
    "聽著聽著就睡著了（讚賞意）",
    "金牌主播穩的",
    "這是可以免費看的嗎？",
    "默默點贊",
  ],
  standard: [
    "草草草草草",
    "7777777",
    "8888888",
    "笑死ｗ",
    "主播你皮掉了啦！",
    "這也是初配信的一環嗎？",
    "懂喔！",
    "前方高能！",
    "我推的 VTuber 今天也在發光",
    "真不愧是影之強者",
    "這波操作滿分",
    "快看那個迷因",
    "給開司一碗熱湯",
    "恭喜萬定衝刺！",
    "月月讚讚！",
  ],
  gambling: [
    "???",
    "要爆了要爆了！",
    "心臟受不了！",
    "這真的可以播嗎？？",
    "大團圓預備！",
    "全押了兄弟們！",
    "領域展開！",
    "這是我最後的波紋了！",
    "無敵的吧！",
    "隊友在戳！",
    "倒在血泊中",
    "抖內 NT$ 1500：壓上了！",
    "抖內 NT$ 3000：請收下我的腎",
    "神台預定！",
    "歷史會記住這一天",
  ],
  meme: [
    "我到底看了什麼ｗｗｗ",
    "這台太抽象了",
    "阿嬤都播得比你好",
    "前世是大牌？",
    "請教我貼貼！",
    "抖內 NT$ 75：安安可以叫我名字嗎",
    "救命啊ｗｗｗ",
    "破防了破防了",
    "這不是我認識的 V",
    "畫面太美不敢看",
    "笑到肚子痛",
    "聽說這裡有怪人",
    "這是人類能做出來的節目嗎",
    "全網大解析時代",
    "草（日文）",
  ],
} as const;

const IDLE_CHAT = [
  "安安",
  "草",
  "www",
  "稍等一下喔",
  "麥克風有沒有 OK",
  "今天也來了",
  "待機室比正片熱鬧",
  "ここホロライブ？",
  "訂了",
  "草草",
  ...MEME_COMMENTS.steady,
  ...MEME_COMMENTS.standard,
];

const CHAT_BY_MOOD: Record<string, string[]> = {
  safe: [...MEME_COMMENTS.steady],
  standard: [...MEME_COMMENTS.standard],
  gamble: [...MEME_COMMENTS.gambling],
  meme: [...MEME_COMMENTS.meme],
  promo: [
    "恭喜萬定！",
    "月月加油",
    "四周年快樂——",
    "訂閱了訂閱了",
    "先輩凸待草",
    "衝刺 10000",
    "台灣 V 加油",
  ],
  fail: [
    "這是在播什麼",
    "中之人還好嗎",
    "草草草",
    "VOD 需要剪",
    "公關組（你自己）加油",
    "SAN 歸零倒數",
    "切片標題已經想好了",
  ],
};

let chatSeq = 0;

function createChatLine(
  text: string,
  options?: Pick<ChatLine, "badge" | "highlight" | "user">,
): ChatLine {
  chatSeq += 1;
  return {
    id: chatSeq,
    user: options?.user ?? USER_NAMES[chatSeq % USER_NAMES.length],
    text,
    color: CHAT_COLORS[chatSeq % CHAT_COLORS.length],
    badge: options?.badge,
    highlight: options?.highlight,
  };
}

function pickChat(texts: string[]): string {
  return texts[Math.floor(Math.random() * texts.length)] ?? texts[0];
}

function moodFromOption(label: string, success: boolean): keyof typeof CHAT_BY_MOOD {
  if (label.includes("大聲宣傳") || label.includes("月月")) {
    return "promo";
  }
  if (!success) {
    return "fail";
  }
  if (label.includes("豪賭")) {
    return "gamble";
  }
  if (label.includes("迷因")) {
    return "meme";
  }
  if (label.includes("穩健")) {
    return "safe";
  }
  return "standard";
}

export function buildChatBurst(
  label: string,
  success: boolean,
  fans: number,
): ChatLine[] {
  const mood = moodFromOption(label, success);
  const pool = CHAT_BY_MOOD[mood];
  const extra: ChatLine[] = [];

  if (success && fans >= 10_000) {
    extra.push(
      createChatLine("恭喜萬定！", {
        badge: "SUB",
        highlight: true,
        user: "箱推大客",
      }),
    );
  }
  if (label.includes("豪賭")) {
    extra.push(
      createChatLine("全押了兄弟們！", { badge: "VIP", user: "綠界小金剛" }),
      createChatLine("這真的可以播嗎？？", { user: "鍵盤教練" }),
    );
  }
  if (label.includes("迷因")) {
    extra.push(createChatLine("這台太抽象了", { user: "烤肉 Man" }));
  }

  const count = 6 + Math.floor(Math.random() * 4);
  const lines = Array.from({ length: count }, () =>
    createChatLine(pickChat(pool)),
  );
  return [...extra, ...lines].slice(0, 12);
}

function seedIdleChat(): ChatLine[] {
  return [
    createChatLine("初配信出道！", { badge: "MOD", user: "全勤觀眾" }),
    createChatLine("初見安安！", { user: "月月單推人" }),
    createChatLine("卡位", { user: "貼貼狂魔" }),
    createChatLine("這是可以免費看的嗎？", { user: "無課金戰士" }),
    createChatLine("推推！", { user: "箱推A" }),
  ];
}

export default function LiveChat({
  burst,
  className = "",
}: {
  burst: ChatBurst | null;
  className?: string;
}) {
  const [lines, setLines] = useState<ChatLine[]>(() => seedIdleChat());
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLines((current) =>
        [...current, createChatLine(pickChat(IDLE_CHAT))].slice(-50),
      );
    }, 3200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!burst) {
      return;
    }

    const timers = burst.lines.map((line, index) =>
      window.setTimeout(() => {
        setLines((current) => [...current, line].slice(-50));
      }, index * 70),
    );

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [burst]);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) {
      return;
    }
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [lines]);

  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-2xl border border-purple-300/20 bg-[#251f35]/80 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-purple-300/20 px-4 py-3">
        <p className="inline-flex items-center gap-2 text-sm font-bold text-purple-100">
          <MessageSquare className="h-4 w-4 text-pink-300" />
          Stream Chat
        </p>
        <span className="text-[10px] font-semibold tracking-widest text-purple-300/70">
          LIVE
        </span>
      </div>
      <div
        ref={scrollerRef}
        className="min-h-0 flex-1 space-y-1.5 overflow-y-auto px-3 py-2 scrollbar-thin"
      >
        {lines.map((line) => (
          <p
            key={line.id}
            className={`animate-chat-in text-sm leading-5 ${line.highlight ? "rounded-md bg-pink-500/15 px-2 py-1" : ""}`}
          >
            {line.badge ? (
              <span className="mr-1 rounded bg-gradient-to-r from-pink-500 to-purple-500 px-1 py-px text-[9px] font-black text-white">
                {line.badge}
              </span>
            ) : null}
            <span className="mr-1.5 font-semibold" style={{ color: line.color }}>
              {line.user}
            </span>
            <span className="text-purple-100">{line.text}</span>
          </p>
        ))}
      </div>
      <div className="border-t border-purple-300/20 px-3 py-2">
        <p className="rounded-lg bg-[#1a1625] px-3 py-2 text-[11px] text-purple-300/70">
          發送訊息（觀眾端模擬中）
        </p>
      </div>
    </section>
  );
}

const DANMAKU_TEXTS = [
  "草草草草草",
  "7777777",
  "這真的可以播嗎ｗ",
  "恭喜萬定！",
  "神台預定！",
  "www",
  "要爆了要爆了",
  "全押了兄弟們",
  "這台太抽象了",
  "888888",
  "我到底看了什麼",
  "救命啊ｗｗｗ",
];

const DANMAKU_COLORS = [
  "#f472b6",
  "#e879f9",
  "#c084fc",
  "#818cf8",
  "#67e8f9",
  "#fbbf24",
  "#fb7185",
  "#a78bfa",
  "#34d399",
];

interface DanmakuItem {
  id: string;
  text: string;
  top: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  italic: boolean;
}

export function shouldTriggerDanmaku(label: string, success: boolean): boolean {
  if (label.includes("迷因")) {
    return true;
  }
  return label.includes("豪賭") && success;
}

export function FullScreenDanmaku({ trigger }: { trigger: number | null }) {
  const [items, setItems] = useState<DanmakuItem[]>([]);

  useEffect(() => {
    if (trigger == null) {
      return;
    }

    const spawned: DanmakuItem[] = Array.from({ length: 42 }, (_, index) => ({
      id: `${trigger}-${index}`,
      text: DANMAKU_TEXTS[index % DANMAKU_TEXTS.length],
      top: 4 + Math.random() * 88,
      size: 22 + Math.floor(Math.random() * 38),
      color: DANMAKU_COLORS[index % DANMAKU_COLORS.length],
      duration: 1.55 + Math.random() * 0.85,
      delay: Math.random() * 0.55,
      italic: index % 3 !== 0,
    }));

    setItems(spawned);
    const timer = window.setTimeout(() => setItems([]), 2500);

    return () => window.clearTimeout(timer);
  }, [trigger]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {items.map((item) => (
        <span
          key={item.id}
          className={`absolute left-0 whitespace-nowrap font-black tracking-wide animate-danmaku-fly ${item.italic ? "italic" : ""}`}
          style={{
            top: `${item.top}%`,
            color: item.color,
            fontSize: `${item.size}px`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            textShadow: `0 0 10px ${item.color}, 0 0 22px ${item.color}, 0 0 36px ${item.color}88`,
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
