export interface TitleContext {
  name: string;
  fans: number;
  peakFans: number;
  san: number;
  drama: number;
  peakDrama: number;
  talk: number;
  singing: number;
  tech: number;
  months: number;
  hasCollab: boolean;
  hasColamoonCollab: boolean;
  isColaMoonPartner: boolean;
  talent?: string | null;
}

export interface VTuberTitle {
  id: string;
  title: string;
  quote: string;
}

export interface TitleDefinition {
  id: string;
  title: string;
  description: string;
  condition: (stats: TitleContext) => boolean;
}

function isHighestSkill(
  value: number,
  talk: number,
  singing: number,
  tech: number,
): boolean {
  return value >= talk && value >= singing && value >= tech;
}

function reachOf(stats: TitleContext): number {
  return Math.max(stats.fans, stats.peakFans);
}

function heatOf(stats: TitleContext): number {
  return Math.max(stats.drama, stats.peakDrama);
}

export const TITLES: TitleDefinition[] = [
  {
    id: "san-zero",
    title: "【SAN 歸零】精神崩潰的極限發狂人",
    description:
      "SAN 值歸零了。不是畢業，是被彈幕讀完。待機室還在刷「中之人還好嗎」，下次轉生記得先關麥克風。",
    condition: (s) => s.san <= 0,
  },
  {
    id: "yandere-cult",
    title: "【病嬌發狂人】精神崩潰的抽象靈魂",
    description:
      "SAN 值長期見底，但瘋癲抽象的直播風格反而吸引了一大批狂熱教徒！",
    condition: (s) => s.san <= 10 && reachOf(s) >= 15_000,
  },
  {
    id: "gold-shield",
    title: "【金盾級】全平台頂流神級 VTuber",
    description:
      "訂閱突破百萬大關！你的名字已經成為 VTuber 史上抹不掉的傳奇標誌！",
    condition: (s) => reachOf(s) >= 1_000_000,
  },
  {
    id: "song-ceiling",
    title: "【歌藝天花板】靈魂派絕世歌姬",
    description:
      "歌力壓倒性突破！每一次歌回都讓全平台起雞皮疙瘩，聽哭無數人。",
    condition: (s) =>
      s.singing >= 85 && isHighestSkill(s.singing, s.talk, s.singing, s.tech),
  },
  {
    id: "talk-ceiling",
    title: "【單口相聲家】雜談天花板單口大師",
    description:
      "就算完全沒有遊戲畫面，單靠一張嘴就能開 8 小時雜談，把全場笑翻！",
    condition: (s) =>
      s.talk >= 85 && isHighestSkill(s.talk, s.talk, s.singing, s.tech),
  },
  {
    id: "tech-ceiling",
    title: "【個人勢工匠】全能 3D 技術狂魔",
    description:
      "模型自己刷、動捕自己寫、場景自己渲染，連官方工作人員都想請教你！",
    condition: (s) =>
      s.tech >= 85 && isHighestSkill(s.tech, s.talk, s.singing, s.tech),
  },
  {
    id: "hexagon-god",
    title: "【三棲六邊形】全能型神級創作者",
    description:
      "歌力、雜談、技術力全部爆表！圈內公認毫無死角的全能型王者！",
    condition: (s) => s.talk >= 70 && s.singing >= 70 && s.tech >= 70,
  },
  {
    id: "flame-legend",
    title: "【全平台圍剿】炎上系傳說",
    description:
      "解析文比 VOD 還長，你還是撐到了畢業。炎上是修羅場，也是名場面。",
    condition: (s) => heatOf(s) >= 90,
  },
  {
    id: "black-red-king",
    title: "【黑紅也是紅】炎上界絕世魔王",
    description:
      "論壇天天都在討論你！每次黑歷史爆發都能轉化為源源不絕的爆量人氣！",
    condition: (s) => heatOf(s) >= 80 && reachOf(s) >= 30_000,
  },
  {
    id: "controversy-beast",
    title: "【社群核彈】爭議性爆播野獸",
    description:
      "發言總在規範邊緣試探，讓經紀人與觀眾每天都捏一把冷汗！",
    condition: (s) => heatOf(s) >= 70 && s.san <= 40,
  },
  {
    id: "silver-shield",
    title: "【銀盾級】百萬預備軍頂尖主播",
    description:
      "成功跨越十萬訂閱門檻！無論走到哪裡都是聊天室的核心焦點！",
    condition: (s) => reachOf(s) >= 100_000,
  },
  {
    id: "drama-queen",
    title: "【話題女王】黑粉比真愛還多",
    description:
      "黑粉、箱推、路人一起把熱度養肥。時間軸比節目表熱鬧，這就是話題的代價與報酬。",
    condition: (s) => heatOf(s) >= 60 && reachOf(s) >= 30_000,
  },
  {
    id: "gambling-soul",
    title: "【豪賭體質】全押了兄弟們",
    description:
      "每次都選最刺激的那條路。心臟受不了的是觀眾，歷史會記住的是你。",
    condition: (s) => heatOf(s) >= 40 && s.san <= 50 && reachOf(s) >= 8_000,
  },
  {
    id: "cola-believer",
    title: "【可樂神水信徒】碳酸飲料代言人",
    description:
      "直播時可樂不離手，靠著可樂神水的加護，一次又一次把迷因變成奇蹟！",
    condition: (s) => s.talent === "cola",
  },
  {
    id: "sprint-vanguard",
    title: "【四週年衝刺者】萬定應援先鋒",
    description:
      "帶著可樂月月四週年應援入場。雜談火力全開，聊天室已經在預支恭喜萬定。",
    condition: (s) => s.talent === "sprint",
  },
  {
    id: "model-speedrunner",
    title: "【模型修復極速手】穿模也能當節目",
    description:
      "OBS、綁骨、藍畫面全部自己修。技術力不是後台，是你的第二個角色。",
    condition: (s) => s.talent === "mechanic",
  },
  {
    id: "iron-mind",
    title: "【鋼鐵心智】不動如山的精神大師",
    description:
      "經歷無數次黑粉攻擊與開台事故，SAN 值依然穩如泰山！",
    condition: (s) => s.san >= 90 && s.months >= 36,
  },
  {
    id: "sleep-king",
    title: "【睡覺耐久王者】掛機系地下偶像",
    description:
      "靠著睡覺掛機與擺爛吸引大批猜拳觀眾，堪稱 VTuber 界的奇蹟躺平大師！",
    condition: (s) => s.talk < 30 && reachOf(s) >= 10_000,
  },
  {
    id: "delivery-killer",
    title: "【外送員殺手】宵夜吃播代言人",
    description:
      "每次忘記關麥都在訂宵夜，你的外送菜單已經成為社群粉絲的熱門跟風聖地。",
    condition: (s) => s.talk >= 60 && heatOf(s) >= 30,
  },
  {
    id: "zero-totsu-survivor",
    title: "【零人凸待倖存者】孤高單口傳奇",
    description:
      "經歷過最慘烈的零人凸待，如今已經無所畏懼，一個人就是一座舞台！",
    condition: (s) => s.san >= 50 && s.talk >= 65 && s.months >= 24,
  },
  {
    id: "song-monster",
    title: "【歌姬怪物】被 VTuber 耽誤的演唱會",
    description:
      "副歌一開，同接比世界觀還準。出道是為了聊天，結果觀眾是來聽演唱會的。",
    condition: (s) =>
      s.singing >= 80 && isHighestSkill(s.singing, s.talk, s.singing, s.tech),
  },
  {
    id: "talk-monster",
    title: "【雜談怪物】單口相聲系夜場",
    description:
      "沒有腳本也沒有冷場。一張嘴就能把待機室變成夜場，這才叫個人勢的核心競爭力。",
    condition: (s) =>
      s.talk >= 80 && isHighestSkill(s.talk, s.talk, s.singing, s.tech),
  },
  {
    id: "tech-artisan",
    title: "【技術過剩】個人勢工作室本體",
    description:
      "OBS、模型、音訊全部自己修。直播間是工作室，崩潰畫面是限量週邊。",
    condition: (s) =>
      s.tech >= 80 && isHighestSkill(s.tech, s.talk, s.singing, s.tech),
  },
  {
    id: "tri-athlete",
    title: "【三棲帝王】同人技能樹全點滿",
    description:
      "雜談、歌回、事故維修全點滿。不是萬能，只是把三條技能樹都點到會發光。",
    condition: (s) => s.talk >= 60 && s.singing >= 60 && s.tech >= 60,
  },
  {
    id: "cola-10k-teammate",
    title: "【可樂月月萬定隊友】四週年先鋒",
    description:
      "成功突破萬定大關！與可樂月月一同登上萬人訂閱的星火之巔！",
    condition: (s) =>
      reachOf(s) >= 10_000 &&
      reachOf(s) < 100_000 &&
      (s.hasColamoonCollab || s.isColaMoonPartner),
  },
  {
    id: "colamoon-partner",
    title: "【凸待認證】可樂月月萬定衝刺最佳夥伴",
    description:
      "四週年的麥克風曾遞給你。前輩衝刺萬定的路上，這份凸待與應援會一起被寫進年報。",
    condition: (s) =>
      (s.hasColamoonCollab || s.isColaMoonPartner) && reachOf(s) >= 5_000,
  },
  {
    id: "spark-heir",
    title: "【同人奇蹟】星火傳承者",
    description:
      "在同人社群中發光發熱，與無數同好共同織造最溫馨快樂的 VTuber 人生！",
    condition: (s) => s.hasCollab && reachOf(s) >= 20_000,
  },
  {
    id: "spark-member",
    title: "【箱推牽絆】可樂星火社榮譽成員",
    description:
      "連動不是路過，是把名字寫進同一個待機室。互相拉拔，這才叫同人箱推。",
    condition: (s) => s.hasCollab && reachOf(s) >= 10_000,
  },
  {
    id: "10k-vanguard",
    title: "【萬定衝刺】先鋒隊",
    description:
      "萬粉不是天花板，是起跑槍。訂閱曲線還在爬，聊天室已經開始預支「恭喜萬定」。",
    condition: (s) => reachOf(s) >= 8_000 && reachOf(s) < 100_000,
  },
  {
    id: "late-bloomer",
    title: "【大器晚成】第二年才開始發光",
    description:
      "前半段默默積累，後半段曲線陡升。有些個人勢的神回，發生在大家以為要畢業的時候。",
    condition: (s) =>
      s.months >= 24 && reachOf(s) >= 5_000 && reachOf(s) < 20_000,
  },
  {
    id: "asmr-night",
    title: "【耳語夜貓】ASMR 與雜談的交界",
    description:
      "不靠高難度技術，靠聲音與陪伴把深夜台變成習慣。耳機黨已經把你排進睡前儀式。",
    condition: (s) => s.talk >= 40 && s.singing >= 40 && s.tech < 30,
  },
  {
    id: "song-diva",
    title: "【歌力全開】百萬歌姬預備役",
    description: "音準比世界觀可靠。一開口，演算法就知道這台今晚不是來睡覺的。",
    condition: (s) => s.singing >= 70,
  },
  {
    id: "talk-ceo",
    title: "【雜談台】靈魂企業家",
    description: "沒有大事務所也有大話題。用一張嘴把個人勢做成品牌，客服就是自己。",
    condition: (s) => s.talk >= 70,
  },
  {
    id: "model-fixer",
    title: "【模型修復專家】事故也是節目效果",
    description: "穿模、爆音、藍畫面，全部當節目效果。技術力不是後台，是第二個角色。",
    condition: (s) => s.tech >= 70,
  },
  {
    id: "zen-high-san",
    title: "【佛系高 SAN】不生氣的直播機器人",
    description:
      "粉絲不多，心卻穩。把崩潰排進行事曆以外的時段，待機室的 BGM 還在。",
    condition: (s) => s.san >= 80 && reachOf(s) < 5_000 && s.months >= 24,
  },
  {
    id: "archive-legend",
    title: "【平安高粉】溫柔走完三年的人氣勢",
    description:
      "不靠炎上堆數字，靠陪伴把訂閱養大。這是一場溫柔且完整的三年。",
    condition: (s) => s.months >= 36 && reachOf(s) >= 5_000 && heatOf(s) < 30,
  },
  {
    id: "shooting-star",
    title: "【閃電隕落】流星般短暫的個人勢",
    description:
      "雖然陪伴大家的時間短暫，但留下的迷因名場面將永遠流傳在烤肉 Short 中。",
    condition: (s) => s.months < 12,
  },
  {
    id: "underground-legend",
    title: "【地下傳奇】佛系直播的零同接神話",
    description:
      "同接不一定會來，但你有來。三年很短，待機室的 BGM 還在。零人凸待也可以是神回。",
    condition: (s) => reachOf(s) < 1_000 && s.months >= 36,
  },
  {
    id: "cozy-indie",
    title: "【底層同人】暖心小同好",
    description:
      "雖然訂閱數不多，但每個來到直播間的觀眾都成為了私下無話不談的好朋友。",
    condition: (s) => reachOf(s) < 2_000 && s.months >= 36,
  },
  {
    id: "zero-totsu",
    title: "【零人凸待】慘劇主角",
    description:
      "通訊錄已讀不回，待機室比正片熱鬧。你依然開台了——這才是個人勢的勇氣。",
    condition: (s) => reachOf(s) < 3_000,
  },
  {
    id: "balanced-indie",
    title: "【均衡個人勢】什麼都沾一點的三年",
    description:
      "不是天花板，也不是墊底。雜談、歌回、事故都經歷過，這就是最標準的同人履歷。",
    condition: (s) => s.months >= 24,
  },
  {
    id: "peaceful-grad",
    title: "【平安畢業】溫馨佛系同好",
    description:
      "不追求爆量人氣，平安順利地走完了這段 VTuber 生涯。謝謝每一則 Super Chat 與每一次「草」。",
    condition: () => true,
  },
];

export const EXTRA_TITLES = TITLES;

export function getVTuberTitle(context: TitleContext): VTuberTitle {
  const match =
    TITLES.find((entry) => entry.condition(context)) ?? TITLES[TITLES.length - 1];

  return {
    id: match.id,
    title: match.title,
    quote: `${context.name}——${match.description}`,
  };
}
