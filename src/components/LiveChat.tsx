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

const CHAT_USERS = [
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
];

const MEME_COMMENTS = {
  safe: [
    "初見安安",
    "今天也是和平的一天",
    "辛苦了！",
    "好聽！",
    "推推",
    "卡",
  ],
  standard: [
    "草草草",
    "7777777",
    "這台很有梗",
    "主播皮掉了啦",
    "888888",
    "這也是初配信的一環嗎",
  ],
  gamble: [
    "要爆了要爆了",
    "心臟受不了",
    "這真的可以播嗎",
    "抖內 NT$ 1500：壓上了！",
    "大團圓預備",
    "全押了兄弟們",
  ],
  meme: [
    "???",
    "我到底看了什麼",
    "這台太抽象了",
    "阿嬤都播得比你好",
    "抖內 NT$ 75：安安",
    "救命啊ｗｗｗ",
    "前世是大牌？",
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
  ...MEME_COMMENTS.safe,
  ...MEME_COMMENTS.standard,
];

const CHAT_BY_MOOD: Record<string, string[]> = {
  safe: [
    "穩",
    "好好休息",
    "專業",
    "這才叫個人勢",
    "晚安",
    "今天也辛苦了",
    "不開太拚的比較好",
    ...MEME_COMMENTS.safe,
  ],
  standard: [
    "草",
    "名場面",
    "訂了",
    "這集可以剪",
    "待機室見",
    "www",
    "經典",
    ...MEME_COMMENTS.standard,
  ],
  gamble: [
    "草草草",
    "這是在播什麼",
    "中之人還好嗎",
    "再一隻就過了",
    "SAN 值看起來比 HP 低",
    "這不是直播這是社會事件",
    "神回預定",
    "You Died",
    ...MEME_COMMENTS.gamble,
  ],
  meme: [
    "草草草",
    "當代藝術",
    "這是在播什麼",
    "抽象",
    "www 這就是個人勢",
    "ここホロライブ？",
    "嘴巴 independently 營業",
    "不要香菜www",
    ...MEME_COMMENTS.meme,
  ],
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
    user: options?.user ?? CHAT_USERS[chatSeq % CHAT_USERS.length],
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
        user: "箱推A",
      }),
    );
  }
  if (label.includes("豪賭")) {
    extra.push(
      createChatLine("草草草", { badge: "VIP", user: "待機古參" }),
      createChatLine("這是在播什麼", { user: "SAN監視員" }),
    );
  }
  if (label.includes("迷因")) {
    extra.push(createChatLine("當代藝術＋1", { user: "clip_職人" }));
  }

  const count = 6 + Math.floor(Math.random() * 4);
  const lines = Array.from({ length: count }, () =>
    createChatLine(pickChat(pool)),
  );
  return [...extra, ...lines].slice(0, 12);
}

function seedIdleChat(): ChatLine[] {
  return [
    createChatLine("初配信出道！", { badge: "MOD", user: "待機古參" }),
    createChatLine("安安", { user: "箱推A" }),
    createChatLine("稍等一下喔"),
    createChatLine("麥克風有沒有 OK"),
    createChatLine("草"),
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
