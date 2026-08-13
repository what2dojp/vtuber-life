export interface EventOption {
  label: string;
  type: "steady" | "standard" | "gambling" | "meme";
  chance: number;
  success: {
    log: string;
    fans?: number;
    san?: number;
    talk?: number;
    singing?: number;
    tech?: number;
    drama?: number;
  };
  failure: {
    log: string;
    fans?: number;
    san?: number;
    talk?: number;
    singing?: number;
    tech?: number;
    drama?: number;
  };
}

export type EventSuccess = EventOption["success"];
export type EventFailure = EventOption["failure"];

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  options: EventOption[];
}

const OPTION_PREFIX = {
  steady: "【穩健】",
  standard: "【標準】",
  gambling: "【豪賭】",
  meme: "【迷因】",
} as const;

function opt(
  type: EventOption["type"],
  chance: number,
  label: string,
  success: EventSuccess,
  failure: EventFailure,
): EventOption {
  return {
    type,
    chance,
    label: `${OPTION_PREFIX[type]}${label}`,
    success,
    failure,
  };
}

export const RANDOM_EVENTS: GameEvent[] = [
  {
    id: "colamoon_collab",
    title: "【大先輩連動】四週年特別企劃！與「可樂月月」合作直播！",
    description:
      "快要突破 10,000 訂閱大關的台灣 VTuber 先輩「可樂月月」邀請你參加四週年紀念凸待！直播間瞬間湧入大量熱情觀眾，彈幕刷爆！",
    options: [
      {
        label: "【穩健】禮貌獻上四週年祝福，擔任貼心綠葉與主持人。",
        type: "steady",
        chance: 95,
        success: {
          log: "直播氣氛極度溫馨！獲得月月粉絲的一致好評，吸粉無數！",
          fans: 1500,
          san: 15,
          talk: 5,
        },
        failure: {
          log: "因為太過緊張講話有點結巴，但大家依然覺得你很可愛。",
          fans: 500,
          san: 5,
        },
      },
      {
        label: "【標準】現場大聲宣傳：『祝賀月月 4 週年快樂！快去訂閱 @colamoonie！』",
        type: "standard",
        chance: 85,
        success: {
          log: "【大聲宣傳】成功拉滿氣氛！月月頻道與你的直播間同喜，粉絲暴增！",
          fans: 3000,
          san: 20,
          drama: -5,
        },
        failure: {
          log: "宣傳過於賣力導致麥克風爆音，不過大家都感受到了你的真誠。",
          fans: 1200,
          san: 10,
        },
      },
      {
        label: "【豪賭】現場發起 1V1 歌藝對決，賭上珍藏的可樂庫存！",
        type: "gambling",
        chance: 60,
        success: {
          log: "兩人的歌聲驚艷全場！合唱精彩絕倫，剪輯精華在 Twitter 瘋傳！",
          fans: 6000,
          singing: 10,
          san: 15,
        },
        failure: {
          log: "在高音部分嚴重破音倒嗓，變成了爆笑迷因精華……",
          fans: 1000,
          san: -10,
          drama: 10,
        },
      },
      {
        label: "【迷因】突發奇想在凸待現場表演「可樂噴泉」吸管雜技！",
        type: "meme",
        chance: 50,
        success: {
          log: "抽象的節目效果讓月月與全場觀眾笑到肚子痛！成為社群名場面！",
          fans: 5000,
          san: 25,
          drama: 15,
        },
        failure: {
          log: "把飲料打翻在鍵盤上，直播被迫緊急中斷……",
          fans: -500,
          san: -20,
          drama: 20,
        },
      },
    ],
  },
  {
    id: "mic_accident",
    title: "【播後事故】忘記關麥克風！外送員撞門現場！",
    description:
      "下播後忘記關閉 OBS 麥克風，結果跟外送員大聲喊「多給一包辣椒醬謝謝」的對話全部被錄進去，觀眾在聊天室狂刷草草草！",
    options: [
      {
        label: "【穩健】火速切斷電源，並在 Twitter 發文親切致歉表示吃很飽。",
        type: "steady",
        chance: 90,
        success: {
          log: "觀眾覺得你非常接地氣，社群風向一片溫馨化解危機。",
          fans: 800,
          san: 5,
        },
        failure: {
          log: "切斷電源太急拔錯插頭，電腦資料差點遺失。",
          san: -10,
        },
      },
      {
        label: "【標準】順水推舟開台「吃播檢討會」，順便開箱外送餐點！",
        type: "standard",
        chance: 75,
        success: {
          log: "宵夜吃播吸引了無數夜貓子觀眾，同看人數創下新高！",
          fans: 2500,
          talk: 5,
          san: 10,
        },
        failure: {
          log: "宵夜吃太多熱量超標，隔天精神不濟歌力下降……",
          san: -10,
        },
      },
      {
        label: "【豪賭】承認那是你請的「虛擬外送員」，現場玩起即興情境劇！",
        type: "gambling",
        chance: 50,
        success: {
          log: "神級反應力與演技震驚全台，被剪成精華登上熱門推薦！",
          fans: 5500,
          talk: 12,
          drama: 10,
        },
        failure: {
          log: "演得太過尷尬，聊天室充斥著『我到底看了什麼』的彈幕……",
          fans: -300,
          san: -15,
          drama: 15,
        },
      },
      {
        label: "【迷因】將外送員的對話改編成饒舌歌曲《辣椒醬之歌》現場開唱！",
        type: "meme",
        chance: 40,
        success: {
          log: "洗腦神曲在 TikTok 與 Short 洗版！吸引無數路人粉絲同樂！",
          fans: 7000,
          singing: 8,
          drama: 20,
        },
        failure: {
          log: "鄰居以為發生治安事件打電話檢舉，遭鄰居關切……",
          san: -25,
          drama: 30,
        },
      },
    ],
  },
  {
    id: "totsu_disaster",
    title: "【悲報】萬粉慶祝「零人凸待」慘劇！",
    description:
      "為了慶祝里程碑開了凸待連線直播，結果整整 2 個小時都沒有任何同伴或繪師媽媽連線進來，畫面一度十分尷尬……",
    options: [
      {
        label: "【穩健】臨危不亂改為個人單口相聲，感謝觀眾一路陪伴。",
        type: "steady",
        chance: 85,
        success: {
          log: "展現極高情商與單口相聲功力，同看人數穩健成長。",
          fans: 1200,
          talk: 8,
        },
        failure: {
          log: "講到一半忍不住掉眼淚，觀眾紛紛安慰你別哭。",
          san: -5,
        },
      },
      {
        label: "【標準】開啟「同人熱情聊天室」，開放觀眾 Discord 現場連線！",
        type: "standard",
        chance: 70,
        success: {
          log: "怪人觀眾們各顯神通，現場笑料百出，歡樂滿滿！",
          fans: 3200,
          talk: 6,
          drama: 5,
        },
        failure: {
          log: "遇到怪怪觀眾現場發狂，緊急切斷連線險象環生！",
          san: -15,
          drama: 20,
        },
      },
      {
        label: "【豪賭】現場分飾兩角，扮演自己的「前世」與自己現場對談！",
        type: "gambling",
        chance: 45,
        success: {
          log: "病嬌精神分裂演出震撼社群！迷因精華突破十萬次觀看！",
          fans: 6500,
          talk: 15,
          drama: 25,
        },
        failure: {
          log: "精神損耗過大，被觀眾懷疑是不是真的瘋了……",
          san: -30,
          drama: 25,
        },
      },
      {
        label: "【迷因】直接在直播間安詳躺平，開啟 8 小時「睡覺耐久」！",
        type: "meme",
        chance: 60,
        success: {
          log: "掛機觀眾越來越多，甚至有人開始在聊天室玩起猜拳！",
          fans: 4000,
          san: 20,
        },
        failure: {
          log: "睡覺打呼聲被清晰錄下，成為終身無法洗刷的黑歷史……",
          fans: 800,
          san: -10,
          drama: 15,
        },
      },
    ],
  },
  {
    id: "dark_souls_marathon",
    title: "【耐久配信】魂系遊戲極限 24 小時不間斷通關！",
    description:
      "卡在絕望的 Boss 前整整 12 個小時，你的精神 SAN 值與嗓子都已經來到崩潰邊緣……",
    options: [
      {
        label: "【穩健】體會精神極限，果斷宣布先下播休息明天再戰。",
        type: "steady",
        chance: 90,
        success: {
          log: "觀眾讚許你的健康作息，熱情留言預約明天通關時刻！",
          fans: 1000,
          san: 15,
        },
        failure: {
          log: "下播後依然念念不忘卡關，做夢都在閃躲 Boss 的招式……",
          san: -10,
        },
      },
      {
        label: "【標準】邀請高玩觀眾進行「線上遠端教練」指導戰術！",
        type: "standard",
        chance: 75,
        success: {
          log: "在教練指導下順利通關！全場聊天室狂刷 77777！",
          fans: 3000,
          tech: 5,
        },
        failure: {
          log: "聽信場外鍵盤指導，連死 50 次精神值狂扣……",
          san: -20,
        },
      },
      {
        label: "【豪賭】立下誓言：『沒通關就不下播也不吃飯！』極限燃燒生命！",
        type: "gambling",
        chance: 40,
        success: {
          log: "在第 22 小時絕境逆轉！全台同看人數突破萬人血脈噴張！",
          fans: 8500,
          tech: 12,
          san: -20,
        },
        failure: {
          log: "體力耗盡倒在鍵盤上，被工作人員強制切斷直播……",
          fans: 1500,
          san: -35,
          drama: 15,
        },
      },
      {
        label: "【迷因】開啟「念力通關法」，請出家中的貓咪來替你按攻擊鍵！",
        type: "meme",
        chance: 55,
        success: {
          log: "貓貓隨便一踩居然打出了暴擊打倒 Boss！主子被封為神貓！",
          fans: 6000,
          san: 30,
        },
        failure: {
          log: "貓咪直接把主機電源線拔掉，進度瞬間化為烏有……",
          san: -30,
          drama: 20,
        },
      },
    ],
  },
  {
    id: "copyright_strike",
    title: "【著作權警告】經典歌回遭遇 YouTube 版權警告（Strike）！",
    description:
      "昨天自認超滿意的歌回直播，今天收到版權砲打擊，影片遭到強制下架甚至有封頻道風險！",
    options: [
      {
        label: "【穩健】迅速刪除爭議存檔，發文向版權方申訴與說明。",
        type: "steady",
        chance: 90,
        success: {
          log: "處理迅速得當，頻道警告順利撤銷，危機解除。",
          fans: 500,
          san: 5,
        },
        failure: {
          log: "申訴流程繁瑣耗時，這幾天心情大受影響。",
          san: -10,
        },
      },
      {
        label: "【標準】將所有歌曲改編為「無版權自製口技（Beatbox）版」重唱！",
        type: "standard",
        chance: 70,
        success: {
          log: "極具個人特色的口技歌曲驚艷所有人，甚至吸引原作者轉發！",
          fans: 4000,
          singing: 8,
        },
        failure: {
          log: "口技發音過於詭異，變成了鬼畜音效庫……",
          fans: 300,
          san: -10,
        },
      },
      {
        label: "【豪賭】直接聯絡版權原作者，邀請對方來頻道進行「合唱連動」！",
        type: "gambling",
        chance: 35,
        success: {
          log: "原作者竟然也是你的粉絲！促成世紀神級連動，紅遍日台！",
          fans: 12000,
          singing: 15,
          san: 20,
        },
        failure: {
          log: "遭對方經紀公司冷漠拒絕，並收到正式律師警告函……",
          san: -30,
          drama: 35,
        },
      },
      {
        label: "【迷因】創作一首《無版權之歌》抱怨演算法，全文只用清唱！",
        type: "meme",
        chance: 60,
        success: {
          log: "自嘲洗腦歌詞在社群爆紅，被稱為「演算法抗爭先鋒」！",
          fans: 5500,
          singing: 5,
          drama: 15,
        },
        failure: {
          log: "清唱音準嚴重偏離，被音樂系觀眾抓包校正……",
          san: -15,
        },
      },
    ],
  },
  {
    id: "past_identity_leaked",
    title: "【魂黑歷史爆料】Twitter 爆料帳號貼出前世舊帳號！",
    description:
      "社群突發爆料帳號指名道姓貼出你中人前世的中二病舊推文與黑歷史照片，引發爆量討論！",
    options: [
      {
        label: "【穩健】不予理會冷處理，專注於當前直播內容品質。",
        type: "steady",
        chance: 85,
        success: {
          log: "粉絲們自主幫忙檢舉爆料，事件在一週內冷卻平息。",
          fans: 1000,
          san: 5,
        },
        failure: {
          log: "心中難免耿耿於懷，直播時顯得有點心神不寧。",
          san: -15,
        },
      },
      {
        label: "【標準】大方承認並開台「中二病黑歷史朗讀會」，與觀眾同樂！",
        type: "standard",
        chance: 75,
        success: {
          log: "高情商的大方態度讓黑粉無話可說，路人紛紛轉粉！",
          fans: 4500,
          talk: 8,
          drama: -10,
        },
        failure: {
          log: "朗讀到以前寫的黑歷史情書時，當場尷尬到想挖地洞……",
          san: -20,
          drama: 10,
        },
      },
      {
        label: "【豪賭】宣稱那是你設定中的「平行宇宙分身」，引出龐大世界觀！",
        type: "gambling",
        chance: 45,
        success: {
          log: "龐大且嚴謹的世界觀補完震撼圈內！被封為設定狂魔！",
          fans: 7500,
          talk: 12,
          san: 10,
        },
        failure: {
          log: "設定講得前後矛盾，被爆料者繼續揪出語病……",
          san: -25,
          drama: 25,
        },
      },
      {
        label: "【迷因】將黑歷史推文做成「迷因 T 恤」公開販售同人週邊！",
        type: "meme",
        chance: 50,
        success: {
          log: "自嘲商業化行為爆紅！週邊上架 3 分鐘被搶購一空！",
          fans: 8000,
          drama: 20,
        },
        failure: {
          log: "被指責過度炒作，受到部分老粉的批評……",
          fans: -1000,
          san: -20,
          drama: 30,
        },
      },
    ],
  },
  {
    id: "model_glitch_3d",
    title: "【事故】Live2D / 3D 披露會極限穿模崩壞！",
    description:
      "在萬眾矚目的新衣服披露會上，因為動捕軟體故障，模型的頭部突然旋轉 360 度且身體嚴重拉伸！",
    options: [
      {
        label: "【穩健】緊急切換回預設靜態待機圖，冷靜聯繫繪師與模型師修復。",
        type: "steady",
        chance: 90,
        success: {
          log: "反應迅速得當，繪師媽媽迅速連線救援完成修正。",
          fans: 800,
          tech: 5,
        },
        failure: {
          log: "披露會時間大幅縮短，錯失了部分展示環節。",
          san: -10,
        },
      },
      {
        label: "【標準】直接配合崩壞模型，開始表演「驚悚異形喜劇小品」！",
        type: "standard",
        chance: 70,
        success: {
          log: "爆笑效果堪稱年度名場面！剪輯精華觀看數破百萬！",
          fans: 5500,
          talk: 10,
          drama: 10,
        },
        failure: {
          log: "部分幼年觀眾被嚇到離開直播間……",
          fans: -500,
          san: -15,
        },
      },
      {
        label: "【豪賭】宣稱這是「特別設計的現代藝術風格」，現場進行舞蹈表演！",
        type: "gambling",
        chance: 40,
        success: {
          log: "前衛的抽象美學引發同人繪師狂熱創作潮流，直接爆紅破圈！",
          fans: 9000,
          tech: 10,
          drama: 20,
        },
        failure: {
          log: "模型徹底當機卡死，畫面直接變成一片藍畫面死機……",
          san: -30,
          drama: 25,
        },
      },
      {
        label: "【迷因】將崩壞模型命名為「新夥伴怪獸」，現場開啟寵物養成！",
        type: "meme",
        chance: 60,
        success: {
          log: "怪獸獲得了比主帳號更高的超高人氣，甚至擁有了獨立粉絲團！",
          fans: 6500,
          san: 20,
        },
        failure: {
          log: "觀眾紛紛表示只要看怪獸不想看本尊，主客易位……",
          fans: -800,
          san: -15,
        },
      },
    ],
  },
  {
    id: "sc_confession_crisis",
    title: "【告白危機】怪人觀眾現場 SC 告白與求婚！",
    description:
      "直播中突發有綠界大戶連續砸下大額紅色 Super Chat，內容卻是偏執的真情告白與情緒勒索要求交往……",
    options: [
      {
        label: "【穩健】委婉且明確地表明 VTuber 與觀眾的界線，感謝支持。",
        type: "steady",
        chance: 85,
        success: {
          log: "處理得體維護了直播間秩序，獲得全體觀眾的尊重。",
          fans: 1500,
          san: 10,
        },
        failure: {
          log: "綠界大戶玻璃心碎，退追並要求退款 SC……",
          fans: -300,
          san: -10,
        },
      },
      {
        label: "【標準】發揮單口相聲本領，將告白轉化為爆笑「相聲對談」！",
        type: "standard",
        chance: 70,
        success: {
          log: "歡樂的氣氛成功化解了尷尬情緒，綠界大戶也心服口服。",
          fans: 3500,
          talk: 8,
        },
        failure: {
          log: "玩笑尺度沒拿捏好，引發了兩派觀眾在聊天室吵架。",
          san: -15,
          drama: 15,
        },
      },
      {
        label: "【豪賭】開玩笑提出「不可能的考驗」：『去把全台可樂買光再說！』",
        type: "gambling",
        chance: 50,
        success: {
          log: "綠界大戶真的跑去包下超商飲料架！成為新聞奇談！",
          fans: 8000,
          drama: 25,
        },
        failure: {
          log: "被指責誘導不理性消費，遭受部分論壇網友攻擊……",
          fans: -1200,
          san: -25,
          drama: 35,
        },
      },
      {
        label: "【迷因】切換為「極道大哥人格」，現場給綠界大戶來一堂社會教育！",
        type: "meme",
        chance: 55,
        success: {
          log: "霸氣的反差魅力反而吸引了更多「抖 M」抖內狂熱者！",
          fans: 6000,
          talk: 10,
          san: 15,
        },
        failure: {
          log: "語氣太過兇狠嚇跑了許多剛進來的新觀眾……",
          fans: -500,
          san: -10,
        },
      },
    ],
  },
  {
    id: "collab_drama_breakup",
    title: "【同箱決裂】同箱連動成員突發 Twitter 相互退追！",
    description:
      "社群偵探發現你與同箱的好友 VTuber 突然取消關注對方，全平台開啟「大解析時代」猜測內部霸凌！",
    options: [
      {
        label: "【穩健】發佈聯合聲明澄清只是系統 Bug，並曬出私下合照。",
        type: "steady",
        chance: 90,
        success: {
          log: "迅速平息不實傳言，箱推粉絲紛紛鬆了一口氣。",
          fans: 1000,
          san: 10,
        },
        failure: {
          log: "依然有少數陰謀論者在論壇持續造謠。",
          san: -10,
          drama: 10,
        },
      },
      {
        label: "【標準】當晚直接開啟「兩人大亂鬥遊戲連動」，破除謠言！",
        type: "standard",
        chance: 80,
        success: {
          log: "直播中相親相愛的爆笑互動讓所有謠言不攻自破！",
          fans: 4000,
          san: 15,
        },
        failure: {
          log: "遊戲中玩得太火爆，反而被截圖說是在「真打」……",
          san: -15,
          drama: 20,
        },
      },
      {
        label: "【豪賭】順水推舟舉辦「同箱世紀拳上擂台（遊戲角力）」大賽！",
        type: "gambling",
        chance: 50,
        success: {
          log: "將社群話題度轉化為爆量人氣！全平台同看人數刷新紀錄！",
          fans: 10000,
          drama: 30,
        },
        failure: {
          log: "粉絲兩極分化嚴重，雙方留言區陷入漫長謾罵戰……",
          fans: -2000,
          san: -30,
          drama: 45,
        },
      },
      {
        label: "【迷因】發表一篇滿是「抽象密碼」的廢文，讓社群偵探通宵解析！",
        type: "meme",
        chance: 60,
        success: {
          log: "網友們通宵寫出 5000 字解析長文，結果發現密碼是晚餐歌單！",
          fans: 7000,
          san: 25,
          drama: 15,
        },
        failure: {
          log: "被認為是在拿粉絲情感開玩笑，引來部分反彈……",
          fans: -1000,
          san: -15,
        },
      },
    ],
  },
  {
    id: "sponsorship_fail",
    title: "【工商事故】贊助商產品現場宣傳踩雷大翻車！",
    description:
      "接到了高額廠商工商，但在現場試用時產品突然故障，甚至不小心脫口說出產品的缺點……",
    options: [
      {
        label: "【穩健】冷靜打圓場，強調是個人操作問題，並順利完成流程。",
        type: "steady",
        chance: 85,
        success: {
          log: "敬業與臨場反應獲得廠商讚許，順利結案拿到尾款。",
          fans: 1000,
          san: 5,
        },
        failure: {
          log: "廠商雖然沒追究，但下次合作機會可能沒了。",
          san: -10,
        },
      },
      {
        label: "【標準】用高超的幽默感將缺點包裝為「適合特定人群的特色」！",
        type: "standard",
        chance: 70,
        success: {
          log: "真誠又幽默的推薦反而讓產品銷量大增！廠商追加預算！",
          fans: 4500,
          talk: 10,
        },
        failure: {
          log: "廠商認為不夠專業，發文表達遺憾……",
          san: -20,
          drama: 20,
        },
      },
      {
        label: "【豪賭】現場發起「極限破壞測試」，證明產品的耐用極限！",
        type: "gambling",
        chance: 40,
        success: {
          log: "硬核測試爆紅！影片被廠商拿去當作官方廣告宣傳！",
          fans: 9000,
          tech: 10,
          drama: 15,
        },
        failure: {
          log: "真的把產品當場用壞，被廠商要求依照合約賠償……",
          fans: -500,
          san: -35,
          drama: 30,
        },
      },
      {
        label: "【迷因】直接開啟「逆向業配」，開始宣傳競爭對手的產品！",
        type: "meme",
        chance: 30,
        success: {
          log: "兩家競品廠商在 Twitter 現場打起公關戰！流量賺飽飽！",
          fans: 11000,
          drama: 40,
        },
        failure: {
          log: "違約金金額高達百萬，收到正式律師函告誡……",
          fans: -2000,
          san: -40,
          drama: 50,
        },
      },
    ],
  },
  {
    id: "debut_anniversary_marathon",
    title: "【週年耐久】1000 人訂閱衝刺歌回耐久！",
    description:
      "為了衝刺目標訂閱數，開啟了不設終點的唱歌耐久直播，喉嚨與精力都面臨重大考驗！",
    options: [
      {
        label: "【穩健】準備充足的溫開水與護嗓配方，穩定輸出優美歌聲。",
        type: "steady",
        chance: 90,
        success: {
          log: "歌聲始終維持高水準，順利達成訂閱目標且喉嚨無負擔！",
          fans: 2000,
          singing: 8,
          san: 10,
        },
        failure: {
          log: "時間拉得有點長，最後階段聲音稍微有點沙啞。",
          singing: 2,
          san: -5,
        },
      },
      {
        label: "【標準】每增加 100 訂閱就切換一種「特殊唱腔」（如：美聲、蘿莉、極道）！",
        type: "standard",
        chance: 75,
        success: {
          log: "多變的聲線展現了驚人實力！吸引無數音樂迷加入單推！",
          fans: 5000,
          singing: 12,
        },
        failure: {
          log: "聲線切換過度導致嗓子嚴重發炎，需要休養一週……",
          singing: -5,
          san: -20,
        },
      },
      {
        label: "【豪賭】邀請 10 位同業 VTuber 進行「通宵接力合唱」挑戰！",
        type: "gambling",
        chance: 55,
        success: {
          log: "社群盛況空前！不僅快速破萬定，更奠定了圈內好人緣！",
          fans: 8500,
          singing: 10,
          san: 20,
        },
        failure: {
          log: "因為時差與連線問題，直播間一片混亂……",
          san: -15,
          drama: 15,
        },
      },
      {
        label: "【迷因】將所有抒情歌全部用「電音洗腦台客風格」改編爆唱！",
        type: "meme",
        chance: 60,
        success: {
          log: "嗨翻全場的夜店風格震撼圈內！被封為 VTuber 界的夜店 DJ！",
          fans: 7000,
          singing: 6,
          drama: 20,
        },
        failure: {
          log: "老粉紛紛表示耳朵受不了逃離直播間……",
          fans: -800,
          san: -10,
        },
      },
    ],
  },
  {
    id: "algorithm_blessing",
    title: "【演算法降臨】演算法神明眷顧！精華烤肉 Short 病毒式傳播爆紅！",
    description:
      "一位海外烤肉 Man（剪輯師）幫你製作的 15 秒搞笑精華 Short，突然被 YouTube 演算法狂推！觀看數衝破 200 萬！",
    options: [
      {
        label: "【穩健】在 Short 留言區親切用英文 / 日文留言感謝，引導路人關注。",
        type: "steady",
        chance: 90,
        success: {
          log: "國際化形象提升，成功將路過流量轉化為長期海外訂閱者！",
          fans: 3500,
          san: 15,
        },
        failure: {
          log: "翻譯軟體翻譯出奇怪語意，引起小小的語言誤會。",
          fans: 1000,
          san: -5,
        },
      },
      {
        label: "【標準】火速順應熱度，連續三天開啟「海外觀眾多語互動雜談」！",
        type: "standard",
        chance: 80,
        success: {
          log: "熱度完美接軌！同看人數創下歷史新高紀錄！",
          fans: 6500,
          talk: 10,
        },
        failure: {
          log: "語言能力有限，中間出現許多尷尬的冷場時刻……",
          fans: 1500,
          san: -10,
        },
      },
      {
        label: "【豪賭】直接將該 Short 製作成「全平台迷因音樂 Remix」發行數位單曲！",
        type: "gambling",
        chance: 45,
        success: {
          log: "單曲登上 Spotify 迷因榜前十名！獲得商業化成功！",
          fans: 12000,
          singing: 10,
          drama: 15,
        },
        failure: {
          log: "與剪輯師發生版權收益爭議，引發小規模社群討論……",
          fans: -500,
          san: -25,
          drama: 30,
        },
      },
      {
        label: "【迷因】親自去該烤肉 Man 的頻道「抖內大額 SC」並留言要求當助手！",
        type: "meme",
        chance: 65,
        success: {
          log: "「V 主播親自給剪輯師抖內」的名場面登上各大迷因粉專！",
          fans: 8000,
          san: 25,
        },
        failure: {
          log: "被質疑是在炒作人設，引來部分反對聲浪……",
          san: -15,
          drama: 20,
        },
      },
    ],
  },
  {
    id: "asmr_clipping",
    title: "【ASMR 事故】觸發器突然爆音，耳機黨集體慘叫！",
    description:
      "精心準備的耳語 ASMR 正要進入高潮，麥克風靈敏度突然拉滿，刮過防噴罩的爆音直接把同接送進醫院。",
    options: [
      opt("steady", 92, "立刻調低增益並道歉，改播輕柔雨聲收尾。", { log: "耳機黨總算活下來了，深夜台口碑反而上升。", fans: 900, san: 8, talk: 3 }, { log: "道歉太長，聊天室開始催你快點下播……", san: -8 }),
      opt("standard", 78, "把爆音當節目效果，開一場「耳機傷害檢討會」。", { log: "檢討會笑料不斷，切片標題全是慘叫！", fans: 2800, talk: 6 }, { log: "有觀眾真的耳鳴退訂，公關危機萌芽……", fans: -200, san: -12, drama: 10 }),
      opt("gambling", 42, "宣稱這是「實驗性噪音藝術」，繼續加大音量！", { log: "噪音藝術意外出圈，前衛樂迷湧入直播間！", fans: 7200, talk: 8, drama: 18 }, { log: "平台收到大量檢舉，音訊被強制靜音……", fans: -1600, san: -28, drama: 32 }),
      opt("meme", 55, "切換成施工現場 ASMR，直播敲桌、砸罐、吹哨。", { log: "工地 ASMR 成為迷因，烤肉 Man 連夜出片！", fans: 5400, san: 12, drama: 12 }, { log: "鄰居報警關心，當晚只好提前下播……", fans: -500, san: -16, drama: 18 }),
    ],
  },
  {
    id: "late_start_disaster",
    title: "【開台事故】檔期寫 20:00，實際進待機室已 22:17！",
    description:
      "你睡過頭又卡在更新 OBS，待機室已經被「主播還活著嗎」刷爆，預定連動對象也在 Discord 已讀不回。",
    options: [
      opt("steady", 90, "誠懇道歉並縮短台時，把內容做紮實。", { log: "遲到雖恨，態度加分，老粉表示理解。", fans: 700, san: 10 }, { log: "道歉唸了二十分鐘，正片只剩十分鐘……", san: -8 }),
      opt("standard", 76, "開台先播「遲到懲罰雜談」，把黑歷史當節目。", { log: "懲罰企劃意外好玩，同看不減反增！", fans: 2600, talk: 7 }, { log: "懲罰太弱被嫌假，聊天室開始挑剔……", fans: 400, san: -10, drama: 8 }),
      opt("gambling", 48, "宣布今晚改打 8 小時補時耐久，通宵賠罪！", { log: "通宵補時感動全場，被封為最有責任感的個人勢！", fans: 6800, san: -12, talk: 6 }, { log: "撐到凌晨直接沒電，後半段變成睡覺台……", fans: 800, san: -30, drama: 12 }),
      opt("meme", 58, "假裝這是「時光旅人設定」，堅稱現在才是 20:00。", { log: "世界觀補完笑死聊天室，遲到變成人設名場面！", fans: 5000, talk: 8, drama: 14 }, { log: "設定越圓越破，被抓包時間戳打臉……", fans: -400, san: -14, drama: 20 }),
    ],
  },
  {
    id: "sc_missed_read",
    title: "【綠界事故】漏讀高額 Super Chat，大戶當眾破防！",
    description:
      "有人砸下五位數紅色 SC 告白應援，你卻沉浸在遊戲裡連讀三次隔壁的「安安」，聊天室開始集體暴動。",
    options: [
      opt("steady", 88, "立刻補讀並私訊致歉，之後加設 SC 音效提醒。", { log: "補讀真誠，大戶消氣還加碼一筆！", fans: 1400, san: 8, talk: 3 }, { log: "補讀時唸錯金額，場面更尷尬了……", san: -10, drama: 8 }),
      opt("standard", 74, "開「漏讀懺悔回」，把所有未讀 SC 一次清完。", { log: "懺悔回變成暖心朗讀會，綠界大戶全回來了！", fans: 3200, talk: 8 }, { log: "唸太久變成流水帳，同看開始掉……", fans: 600, san: -8 }),
      opt("gambling", 40, "宣稱漏讀是「命運的考驗」，請對方再砸一次證明緣分！", { log: "對方真的加碼砸下，名場面登上烤肉精華！", fans: 8500, drama: 22 }, { log: "被罵消費粉絲感情，炎上值瞬間飆升……", fans: -1800, san: -26, drama: 38 }),
      opt("meme", 52, "把漏讀編成《讀不到的 SC》即興歌回。", { log: "自嘲神曲洗腦全台，漏讀反而成了週邊文案！", fans: 6100, singing: 7, drama: 12 }, { log: "歌詞太酸，當事人覺得被公開處刑……", fans: -700, san: -18, drama: 24 }),
    ],
  },
  {
    id: "anti_raid",
    title: "【黑粉突襲】協調式洗版，聊天室變成修羅場！",
    description:
      "開台十分鐘後，陌生帳號同步湧入刷負評與惡意剪輯連結，同接數字很漂亮，空氣卻難聞到不行。",
    options: [
      opt("steady", 86, "開啟慢速模式與關鍵字屏蔽，專注把台開完。", { log: "穩穩撐完全場，老粉幫忙清場，風評止穩。", fans: 1100, san: 6, tech: 4 }, { log: "關鍵字誤殺太多，連「草」都被屏蔽……", san: -12 }),
      opt("standard", 72, "請管理員與烤肉 Man 幫忙闢謠，自己繼續雜談。", { log: "箱推自衛隊出動，黑粉攻勢被化解！", fans: 3000, talk: 5, drama: -8 }, { log: "闢謠文越寫越長，變成新一輪論戰……", san: -16, drama: 22 }),
      opt("gambling", 38, "直接點開惡意切片逐條反駁，開「對線台」。", { log: "對線金句連發，路人反而倒戈成粉絲！", fans: 7800, talk: 12, drama: 20 }, { log: "越描越黑，截圖被斷章取義二次傳播……", fans: -2200, san: -32, drama: 45 }),
      opt("meme", 50, "把洗版彈幕讀成抽象詩，現場舉辦朗讀會。", { log: "把惡意變成藝術，黑粉自己都笑出來退場！", fans: 5600, talk: 8, san: 10 }, { log: "朗讀到敏感詞，平台警告來了……", fans: -400, san: -20, drama: 28 }),
    ],
  },
  {
    id: "obs_crash_vod",
    title: "【技術災難】OBS 當機，整晚存檔蒸發！",
    description:
      "歌回唱到副歌最動人的段落，畫面突然黑掉。重開電腦後發現 VOD 沒存到，烤肉 Man 在 Discord 崩潰。",
    options: [
      opt("steady", 90, "立刻備份設定、發推說明，改日補檔重唱。", { log: "危機處理得宜，技術力口碑微妙上升。", fans: 800, tech: 6, san: 6 }, { log: "補檔當天又當一次，信心受到打擊……", san: -12, tech: -2 }),
      opt("standard", 75, "改開「事故檢討雜談」，現場重現崩潰過程。", { log: "教學向事故台意外熱門，技術粉加訂！", fans: 3400, tech: 8, talk: 4 }, { log: "講到一半又當機，成為雙重事故……", fans: 500, san: -14, drama: 10 }),
      opt("gambling", 44, "宣布今晚改打「無存檔高難度」，當成限定神回。", { log: "無存檔傳說吸引獵奇觀眾，同看爆衝！", fans: 7000, drama: 16, tech: 5 }, { log: "沒存檔又沒內容，觀眾覺得被放鳥……", fans: -900, san: -24, drama: 18 }),
      opt("meme", 60, "把黑畫面當成新皮，開始對「暗黑模型」說話。", { log: "暗黑模型迷因爆紅，甚至有人出同人圖！", fans: 5800, san: 14, drama: 12 }, { log: "對黑畫面說話太久，被當成中之人崩潰……", fans: -300, san: -18, drama: 20 }),
    ],
  },
  {
    id: "family_cameo",
    title: "【中之人危機】家人推門進來喊你小名！",
    description:
      "週末下午台正熱，房門被推開，家人端著水果用本名叫你吃飯，麥克風全錄進去，聊天室瞬間凍結。",
    options: [
      opt("steady", 88, "立刻切待機圖致歉，請家人迴避後繼續。", { log: "處理迅速，隱私疑慮被壓下來。", fans: 600, san: 5 }, { log: "切圖太慢，小名已經被截成迷因……", san: -16, drama: 18 }),
      opt("standard", 70, "大大方方介紹「家庭來賓」，改成短短吃播。", { log: "家庭來賓反差萌炸裂，暖心精華瘋傳！", fans: 4100, talk: 7, san: 8 }, { log: "家人開始念你房間太亂，社死現場……", fans: 900, san: -14, drama: 16 }),
      opt("gambling", 36, "堅稱那是「世界觀裡的管家 NPC」，繼續演下去。", { log: "NPC 設定補完成功，世界觀粉瘋狂加訂！", fans: 7600, talk: 10, drama: 14 }, { log: "家人當場拆台叫本名，人設崩壞……", fans: -1200, san: -30, drama: 36 }),
      opt("meme", 54, "跟水果合照，開「孝順 VTuber 試吃會」。", { log: "孝順人設出圈，阿姨粉湧入聊天室！", fans: 5300, san: 16, drama: 8 }, { log: "試吃到一半被念沒洗碗，直播變成家庭會議……", fans: 200, san: -12, drama: 14 }),
    ],
  },
  {
    id: "typhoon_blackout",
    title: "【天災台】颱風夜停電，只剩手機熱點與手電筒！",
    description:
      "預告的週年歌回遇上颱風停電，桌機全滅。你只剩手機、殘電筆電與窗外雨聲，聊天室卻意外湧進來看災難現場。",
    options: [
      opt("steady", 91, "宣布改期並安全下播，提醒觀眾注意風雨。", { log: "安全第一獲得好評，改期預告被認真等待。", fans: 500, san: 12 }, { log: "下播後被說掃興，少數人噓聲……", san: -6 }),
      opt("standard", 77, "改用手機開「颱風雜談」，配窗外雨聲。", { log: "雨聲雜談意外治癒，同看比正片還穩！", fans: 2900, talk: 6, san: 10 }, { log: "訊號斷斷續續，觀眾失去耐心……", fans: 400, san: -10 }),
      opt("gambling", 46, "堅持用熱點把歌回唱完，賭殘電能撐到副歌。", { log: "停電歌回成為傳奇，被稱為颱風夜神回！", fans: 8200, singing: 10, drama: 10 }, { log: "唱到一半徹底斷電，VOD 只剩尖叫……", fans: 700, san: -22, drama: 14 }),
      opt("meme", 57, "改開「末日生存 ASMR」，直播吃乾糧、聽風聲。", { log: "末日 ASMR 爆紅，颱風夜成為年度切片！", fans: 6400, san: 18, drama: 12 }, { log: "風聲太大被當成恐怖片，幼齡觀眾被嚇跑……", fans: -200, san: -10, drama: 10 }),
    ],
  },
  {
    id: "merch_shipping_delay",
    title: "【週邊炎上】出貨延期三個月，買家在時間軸排隊！",
    description:
      "生日週邊預購結束後工廠跳票，物流又塞港。時間軸出現「出貨了嗎」陣列，連箱推都開始覺得尷尬。",
    options: [
      opt("steady", 87, "公開時程表與部分退款方案，逐則回覆買家。", { log: "透明溝通止血成功，老粉選擇再等。", fans: 400, san: 4, drama: -6 }, { log: "時程表又跳票一次，信任度再掉……", fans: -600, san: -14, drama: 18 }),
      opt("standard", 73, "加贈貼紙與親筆感謝卡，開「等待室雜談」。", { log: "等待室變成社群夜話，怒氣被暖下來！", fans: 2400, talk: 6, drama: -10 }, { log: "贈品也被說廉價，火越澆越旺……", fans: -400, san: -12, drama: 20 }),
      opt("gambling", 41, "宣布加開「遲到補償演唱會」，免費給預購者看。", { log: "補償演唱會爆滿，週邊黑歷史被翻成佳話！", fans: 9000, singing: 8, drama: -5 }, { log: "演唱會也出包，被笑連道歉都事故……", fans: -1500, san: -28, drama: 34 }),
      opt("meme", 49, "畫一張「還在船上」的迷因週報，每天更新船位。", { log: "船位週報變成迷因連載，連路人都來追更！", fans: 4700, talk: 5, drama: 10 }, { log: "被罵消費買家情緒，迷因週報緊急停更……", fans: -800, san: -16, drama: 26 }),
    ],
  },
  {
    id: "birthday_stream_flop",
    title: "【生日祭慘案】蛋糕點好，同接卻比平時更少！",
    description:
      "籌備一個月的生日 3D 小劇場，開場同接只有平時的一半。待機室安靜到只剩你自己唱生日歌。",
    options: [
      opt("steady", 89, "不當回事，把準備好的內容好好做完。", { log: "內容品質撐住場面，事後 VOD 回補很香。", fans: 1000, san: 8, singing: 3 }, { log: "情緒明顯低落，觀眾也跟著沉默……", san: -10 }),
      opt("standard", 74, "改成「生日雜談夜話」，跟來的人深度聊天。", { log: "小而美的夜話成為溫馨名場面！", fans: 2700, talk: 8, san: 12 }, { log: "話題挖太深，氣氛變得沉重……", fans: 500, san: -8 }),
      opt("gambling", 43, "現場加碼抽 Super Chat 大獎，賭一把翻盤。", { log: "大獎刺激綠界，同接後半段暴衝！", fans: 7500, drama: 12 }, { log: "大獎成本爆炸，帳上短暫見紅……", fans: 1200, san: -20, drama: 16 }),
      opt("meme", 62, "自己跟蛋糕合唱，開「零人慶生耐久」。", { log: "零人慶生反而爆紅，被封為最孤獨也最強的生日祭！", fans: 6600, san: 20, drama: 14 }, { log: "對蛋糕說話太久，被剪成恐怖精華……", fans: 800, san: -12, drama: 18 }),
    ],
  },
  {
    id: "collab_noshow",
    title: "【連動放鳥】對方到點沒上線，凸待變成單口！",
    description:
      "預告兩週的跨箱連動，對方 Discord 突然已讀。你的待機室擠滿對方箱推，空氣安靜得能聽見滑鼠聲。",
    options: [
      opt("steady", 90, "說明狀況並改為個人雜談，不公開指責。", { log: "高情商處理獲得圈內好評，對方事後也來道歉。", fans: 1200, talk: 5, san: 8 }, { log: "解釋太模糊，被猜是不是吵架了……", san: -10, drama: 12 }),
      opt("standard", 76, "開放聊天室連線，讓觀眾來當臨時凸待。", { log: "觀眾凸待笑料百出，危機變契機！", fans: 3600, talk: 7, drama: 6 }, { log: "連到奇怪的人，只好緊急切斷……", fans: 400, san: -14, drama: 18 }),
      opt("gambling", 40, "公開點名「放鳥罰酒」，邀請對方今晚必須上。", { log: "對方真的連滾帶爬上線，雙人修羅場變神回！", fans: 8800, talk: 8, drama: 20 }, { log: "公開處刑引發對方箱推出征……", fans: -2000, san: -28, drama: 42 }),
      opt("meme", 56, "用兩個視窗分飾兩角，自己連動自己。", { log: "一人分飾爆紅，被稱為最穩的連動對象就是自己！", fans: 5900, talk: 10, drama: 12 }, { log: "聲線切換失敗，被說人格分裂……", fans: 600, san: -16, drama: 16 }),
    ],
  },
  {
    id: "clip_out_of_context",
    title: "【切片斷章】十秒精華把玩笑變成「失言現場」！",
    description:
      "有人把你雜談裡的反串玩笑剪成「真面目暴露」，標題黨在時間軸擴散，不認識你的路人開始轉發。",
    options: [
      opt("steady", 85, "補充完整語境並釘選澄清，不跟風罵戰。", { log: "完整語境被頂上去，風向逐漸回流。", fans: 900, drama: -8, san: 6 }, { log: "澄清文沒人看，切片繼續傳……", san: -14, drama: 16 }),
      opt("standard", 71, "開「原片對照回」，把前後十分鐘完整重播。", { log: "對照回打臉標題黨，老粉團結護航！", fans: 3300, talk: 6, drama: -12 }, { log: "重播太長，新觀眾看到一半就走……", fans: 700, san: -8 }),
      opt("gambling", 37, "直接引用切片開「失言演唱會」，把負評唱回去。", { log: "把炎上編成專輯，路人反而變粉絲！", fans: 8100, singing: 9, drama: 18 }, { log: "被說消費爭議，二次炎上開始……", fans: -1700, san: -30, drama: 40 }),
      opt("meme", 53, "把斷章金句印成貼紙，公開嘲諷標題黨。", { log: "貼紙週邊秒殺，斷章取義變成品牌資產！", fans: 5700, drama: 14, talk: 4 }, { log: "當事人覺得被二次傷害，社群氣氛變差……", fans: -600, san: -18, drama: 26 }),
    ],
  },
  {
    id: "nsfw_fanart_drama",
    title: "【同人尺度】R18 扇圖被推到官方標籤底下！",
    description:
      "有繪師把尺度很大的同人圖打上你的官方標籤。未成年觀眾家長開始出現在留言區，箱推分成兩派吵架。",
    options: [
      opt("steady", 88, "溫和請繪師改標，並重申台的年齡分級。", { log: "處理得體，兩邊都給面子，風波快速過去。", fans: 700, drama: -6, san: 5 }, { log: "用詞太官方，被說沒有同人友善……", fans: -200, san: -10, drama: 10 }),
      opt("standard", 74, "開「同人規約說明會」，清楚畫出能轉推的線。", { log: "規約透明化，繪師社群反而更敢投稿！", fans: 2500, talk: 5, drama: -8 }, { log: "說明會變成辯論社，越開越亂……", san: -14, drama: 20 }),
      opt("gambling", 34, "親自點評該作構圖，當成「藝術鑑賞回」。", { log: "大膽點評吸引成熟受眾，訂閱層級上升！", fans: 6900, talk: 8, drama: 22 }, { log: "被檢舉年齡分級不當，推薦流量被砍……", fans: -1400, san: -26, drama: 36 }),
      opt("meme", 48, "畫一張「請打對標籤」的抽象反擊圖。", { log: "反擊圖本身變成更強的迷因，標籤終於被清乾淨！", fans: 4400, drama: 10, san: 8 }, { log: "抽象圖被誤解成默許，火再燒一輪……", fans: -500, san: -16, drama: 24 }),
    ],
  },
  {
    id: "tweet_ratio",
    title: "【時間軸出征】一則半夜推文被出征到外站！",
    description:
      "你隨口推了一句圈內迷因，被斷章翻譯後送到外站論壇。早上醒來通知爆炸，時間軸已經不是你認識的時間軸。",
    options: [
      opt("steady", 86, "刪文、致歉、暫停社群一天，先把台開好。", { log: "降溫策略有效，一週後熱度自然散。", fans: 300, san: 6, drama: -10 }, { log: "刪文被說心虛，截圖流傳更廣……", fans: -800, san: -16, drama: 22 }),
      opt("standard", 70, "發長文補充語境，並置頂直播預告把人帶回台。", { log: "長文寫得清楚，路人看完反而訂閱！", fans: 3100, talk: 7, drama: -6 }, { log: "長文被挑語病，第二輪出征開始……", san: -18, drama: 26 }),
      opt("gambling", 39, "不刪文，開「對線空間」把話一次講完。", { log: "空間金句連發，危機變成曝光高峰！", fans: 8400, talk: 11, drama: 24 }, { log: "空間失控爆粗，企業勢邀約全泡湯……", fans: -2100, san: -34, drama: 48 }),
      opt("meme", 51, "把出征通知做成節奏遊戲，直播閃躲回覆。", { log: "閃躲通知的音 Game 爆紅，炎上被玩成節目！", fans: 6200, tech: 6, drama: 16 }, { log: "被罵毫無反省，迷因玩太大……", fans: -900, san: -20, drama: 30 }),
    ],
  },
  {
    id: "payment_gateway_down",
    title: "【金流掛了】綠界與 Super Chat 同時維護！",
    description:
      "週年耐久正要衝萬定，金流與 SC 同時維護。聊天室只剩「我想抖內卻抖不了」的哀號，進度條卡住不動。",
    options: [
      opt("steady", 93, "改衝訂閱與分享，等金流恢復再補讀。", { log: "不強求當下金額，觀眾感念你的穩。", fans: 1100, san: 10 }, { log: "氣氛冷掉，耐久後半段有點空……", fans: 200, san: -6 }),
      opt("standard", 78, "開「口頭抖內」環節，先記小本本之後補。", { log: "口頭抖內溫馨爆棚，金流恢復後真的有人補！", fans: 3000, talk: 6, san: 8 }, { log: "小本本記亂，事後對不上帳……", san: -12, drama: 8 }),
      opt("gambling", 45, "改收實體零食應援，直播公布超商代碼。", { log: "零食山堆起來了，新聞都來拍！", fans: 7700, drama: 18 }, { log: "被說誘導消費，金流恢復後仍被唸……", fans: -600, san: -22, drama: 28 }),
      opt("meme", 59, "發明「精神抖內」，聊天室刷 1 就等於 NT$ 1。", { log: "精神抖內成為年度迷因，數字比真 SC 還壯觀！", fans: 5800, san: 16, drama: 10 }, { log: "數字刷到平台限流，聊天室直接卡死……", fans: 400, san: -10, tech: -2 }),
    ],
  },
  {
    id: "costume_leak",
    title: "【新衣外流】披露前一晚，建模截圖出現在論壇！",
    description:
      "新衣披露倒數 18 小時，論壇已經在傳建模後台截圖。繪師媽媽氣到要連線對質，粉絲則分成「想看」與「想檢舉」。",
    options: [
      opt("steady", 87, "請論壇下架，原時程照常披露，不多解釋。", { log: "節奏沒被帶跑，正式披露依然感動。", fans: 1500, san: 6, drama: -4 }, { log: "截圖還是傳開，驚喜感打折……", fans: 400, san: -8 }),
      opt("standard", 75, "提前兩小時披露，把外流變成「搶先公開」。", { log: "搶先公開化解尷尬，觀看數還更高！", fans: 3800, talk: 4, drama: -6 }, { log: "倉促披露出包，穿模被抓包……", fans: 800, san: -12, tech: -3 }),
      opt("gambling", 42, "加開第二套隱藏服裝，當晚雙披露。", { log: "雙服裝奇蹟，外流反而成了最好的預熱！", fans: 9500, drama: 8, singing: 4 }, { log: "第二套沒趕完，現場只剩待機圖……", fans: -500, san: -26, drama: 20 }),
      opt("meme", 50, "把外流截圖當成「平行宇宙皮」，開設定講座。", { log: "平行宇宙皮設定爆紅，外流變成世界觀的一部分！", fans: 5600, talk: 9, drama: 12 }, { log: "設定講太複雜，觀眾只想看正皮……", fans: 300, san: -10 }),
    ],
  },
  {
    id: "cooking_stream_fire",
    title: "【料理台】油鍋起煙，直播差點變成消防車 ASMR！",
    description:
      "第一次料理台要做可樂雞翅，油溫太高開始冒煙。警報器在背景尖叫，聊天室已經在貼消防局電話。",
    options: [
      opt("steady", 90, "立刻關火開窗，改切預錄食譜結束。", { log: "安全下莊，觀眾誇你有常識。", fans: 800, san: 10 }, { log: "關火後還是很慌，後半段講不出話……", san: -8 }),
      opt("standard", 73, "改做成「失敗料理檢討」，把焦掉的翅吃完。", { log: "失敗也很香，吃播意外加分！", fans: 3100, talk: 6, san: 6 }, { log: "硬吃焦翅腸胃抗議，下一場沒聲音……", singing: -3, san: -12 }),
      opt("gambling", 40, "堅持把雞翅救回來，現場研究分子料理。", { log: "絕境翻盤，焦翅變成暗黑料理名店！", fans: 7400, talk: 5, drama: 14 }, { log: "警報器招來真的關心，直播被迫中斷……", fans: 200, san: -28, drama: 22 }),
      opt("meme", 58, "宣布新企劃《消防廳合作的可能》，對警報器唱歌。", { log: "對警報器合唱成為迷因神回！", fans: 6100, singing: 6, drama: 16 }, { log: "鄰居報案，當晚只能提前下播……", fans: -300, san: -16, drama: 18 }),
    ],
  },
  {
    id: "horror_scream",
    title: "【恐怖遊戲】破膽尖叫把變聲器喊裂！",
    description:
      "為了漲技術力接了最新恐怖遊戲。跳臉的瞬間你用本聲尖叫，變聲器跟不上，聊天室開始討論「這是中之人嗎」。",
    options: [
      opt("steady", 88, "暫停調麥，承認太可怕並改玩和平模式。", { log: "誠實很可愛，膽小人設被瞬間愛上。", fans: 1600, san: 8, talk: 3 }, { log: "改和平模式被嫌掃興……", fans: 200, san: -6 }),
      opt("standard", 74, "開「膽小觀察日記」，把尖叫當節目效果。", { log: "膽小觀察日記訂閱暴增，剪輯超好用！", fans: 3900, talk: 7, drama: 6 }, { log: "尖叫太多，語音被平台降音量……", fans: 800, san: -10 }),
      opt("gambling", 47, "關掉遊戲音效，改用 ASMR 耳語通關。", { log: "耳語通關反差爆紅，恐怖粉與 ASMR 粉同時湧入！", fans: 8000, talk: 6, tech: 5 }, { log: "耳語到一半又破音，人設更崩……", fans: 500, san: -22, drama: 16 }),
      opt("meme", 61, "每次跳臉就切換極道大哥聲線反罵鬼魂。", { log: "罵鬼名場面誕生，被封為最不怕死的個人勢！", fans: 6700, talk: 8, drama: 12 }, { log: "罵太兇被小孩觀眾檢舉口語……", fans: -400, san: -14, drama: 20 }),
    ],
  },
  {
    id: "drinking_stream",
    title: "【酒回失控】第二杯之後，世界觀設定全說出來了！",
    description:
      "週年酒回本來只想小酌。兩杯下去後你開始公布沒寫進設定集的前世、箱推內幕與明天的企劃，管理員已經在私訊求救。",
    options: [
      opt("steady", 84, "立刻切汽水，宣布酒回提前結束。", { log: "停損及時，秘密還沒完全泄漏。", fans: 600, san: 8, drama: -4 }, { log: "切汽水後明顯不適，台氣掉很快……", san: -12 }),
      opt("standard", 68, "請管理員控場，改玩安全的飲酒遊戲。", { log: "控場成功，酒回變成歡樂派對！", fans: 3400, talk: 8, san: 4 }, { log: "遊戲罰則太重，又開始亂說話……", fans: 700, san: -16, drama: 18 }),
      opt("gambling", 33, "乾脆開「真心話設定披露」，把能說的一次說完。", { log: "大解析時代被你自己引爆，訂閱曲線垂直上升！", fans: 9200, talk: 12, drama: 28 }, { log: "說太深，隔天必須發長文滅火……", fans: -800, san: -36, drama: 50 }),
      opt("meme", 46, "把酒話當成「平行宇宙廣播」，堅持全是角色在說話。", { log: "角色喝醉的設定太可愛，切片瘋傳！", fans: 5500, talk: 7, drama: 14 }, { log: "沒人信，被說中之人酒後真情……", fans: -200, san: -20, drama: 26 }),
    ],
  },
  {
    id: "english_only_flop",
    title: "【海外雜談】全英語挑戰，單字在第三句用盡！",
    description:
      "為了接住 Short 湧入的海外觀眾，你宣布 English Only。三分鐘後只會說 Thank you、so cute 與 wait wait wait。",
    options: [
      opt("steady", 90, "誠實切回中文，並請翻譯組幫忙重點回覆。", { log: "不硬撐的態度加分，海外粉也覺得可愛。", fans: 1300, talk: 4, san: 6 }, { log: "切太快被說沒誠意……", fans: 300, san: -6 }),
      opt("standard", 76, "改用中英夾雜，現場學五句常用句。", { log: "教學向雜談意外好評，單字量慢慢上升！", fans: 2800, talk: 8 }, { log: "發音被母語觀眾溫柔糾正到破防……", san: -10 }),
      opt("gambling", 44, "請海外觀眾當老師，直播公開處刑自己的文法。", { log: "公開處刑變成語言交換神回，海外訂閱暴增！", fans: 7100, talk: 10, drama: 8 }, { log: "被糾正到沉默，冷場長達八分鐘……", fans: 400, san: -22 }),
      opt("meme", 57, "發明只有三個單字的「V 語」，逼聊天室跟你說。", { log: "V 語迷因傳染全平台，連月月箱推都來學！", fans: 6300, talk: 6, drama: 14 }, { log: "V 語太抽象，海外觀眾直接離開……", fans: -500, san: -12, drama: 10 }),
    ],
  },
  {
    id: "membership_launch",
    title: "【會員開通】徽章、表情與權限一次全炸！",
    description:
      "第一次開會員，徽章顯示錯誤、表情貼不上、會員限定台卻讓所有人進來。付費觀眾開始在聊天室問「我錢去哪了」。",
    options: [
      opt("steady", 89, "暫停新加入、發文說明並延長體驗週。", { log: "延期補償被接受，風波沒有擴大。", fans: 900, san: 7, tech: 3 }, { log: "說明寫太官腔，被說像企業客服……", san: -9, drama: 8 }),
      opt("standard", 74, "開「會員除錯直播」，現場跟技術一起修。", { log: "除錯台意外好看，技術粉覺得你很實在！", fans: 3200, tech: 8, talk: 4 }, { log: "修一個壞兩個，除錯台變成災難片……", fans: 500, san: -14, tech: -2 }),
      opt("gambling", 41, "宣布今天所有人暫時當會員，權限全開狂歡。", { log: "全開狂歡帶來爆炸曝光，事後真會員不減反增！", fans: 8600, drama: 10, san: 6 }, { log: "真會員覺得權益被稀釋，退會潮出現……", fans: -1300, san: -24, drama: 30 }),
      opt("meme", 52, "把錯誤徽章當成「詛咒印記」，開設定補完。", { log: "詛咒徽章成為限定迷因，壞掉的 UI 被當週邊！", fans: 5400, talk: 7, drama: 12 }, { log: "設定沒人買帳，還是一直被問退款……", fans: -400, san: -16, drama: 18 }),
    ],
  },
  {
    id: "ai_cover_drama",
    title: "【AI 翻唱】有人用你的聲線出了沒授權的封面曲！",
    description:
      "時間軸出現「你的」翻唱專輯，播放數比正片還高。歌勢觀眾很興奮，聲線權與 AI 倫理爭論同時爆炸。",
    options: [
      opt("steady", 86, "發聲明不授權，並請平台下架未授權音源。", { log: "態度清楚，音樂圈給出尊重。", fans: 800, drama: -6, san: 5 }, { log: "下架引發「打壓同人」質疑……", fans: -300, san: -12, drama: 16 }),
      opt("standard", 72, "開「人聲 vs AI」對決歌回，讓觀眾自己聽。", { log: "對決回證明本尊不可取代，歌力口碑大勝！", fans: 4100, singing: 10, drama: -4 }, { log: "有人覺得你在碰瓷 AI，評論區開戰……", san: -14, drama: 18 }),
      opt("gambling", 38, "直接跟製作者談正式合作，把 AI 曲收編成官方。", { log: "化敵為友，數位單曲真的上架成功！", fans: 8800, singing: 8, drama: 12 }, { log: "合約談崩，雙方粉絲互相出征……", fans: -1600, san: -30, drama: 40 }),
      opt("meme", 49, "用更爛的變聲器翻唱回去，宣布「反 AI 噪音專輯」。", { log: "反擊噪音專輯笑死全場，議題被你收成節目！", fans: 6000, singing: 5, drama: 16 }, { log: "噪音被檢舉擾民，推薦被限……", fans: -700, san: -18, drama: 22 }),
    ],
  },
  {
    id: "rookie_award_nom",
    title: "【新人賞】入圍了，但入圍感言還沒寫！",
    description:
      "圈內新人賞突然公布入圍名單，你的名字在上面。箱推開始催感言、催服裝、催是否要去現場，而你今晚只排了遊戲台。",
    options: [
      opt("steady", 91, "發短感謝文，今晚照常開台不炒作。", { log: "佛系入圍意外加分，被誇很穩。", fans: 1800, san: 10 }, { log: "太佛系被說不珍惜機會……", fans: 400, san: -6 }),
      opt("standard", 77, "改開「感謝雜談」，逐一點名箱推與繪師。", { log: "點名感謝暖爆，社群凝聚力上升！", fans: 3600, talk: 7, san: 8 }, { log: "漏點重要的人，私訊區開始微妙……", fans: 800, san: -10, drama: 8 }),
      opt("gambling", 50, "宣布若得獎就做 3D 披露，先把話放話出去。", { log: "放話成功激勵投票，熱度與期待值拉滿！", fans: 8300, drama: 10, singing: 4 }, { log: "最後沒得獎，放話變成壓力……", fans: 600, san: -24, drama: 16 }),
      opt("meme", 55, "用待機圖穿紙做的獎盃，開「自制頒獎典禮」。", { log: "紙獎盃典禮爆紅，比正式頒獎還有話題！", fans: 6400, talk: 6, drama: 12 }, { log: "被說不尊重評審，空氣短暫尷尬……", fans: -200, san: -12, drama: 14 }),
    ],
  },
  {
    id: "schedule_clash",
    title: "【檔期撞車】兩個連動寫在同一個晚上！",
    description:
      "行事曆出包，你同時答應了歌勢連動與遊戲凸待。兩邊箱推都已經開始待機，Discord 有兩通來電。",
    options: [
      opt("steady", 88, "立刻溝通改期，優先赴較早確認的那場。", { log: "誠懇改期，兩邊都給面子，信用保住。", fans: 700, san: 6, talk: 3 }, { log: "改期訊息發太晚，還是有人覺得被放鳥……", fans: -300, san: -12, drama: 14 }),
      opt("standard", 73, "開三方短連動，把兩邊拉進同一間房。", { log: "三方意外合拍，變成跨圈大台！", fans: 4800, talk: 8, singing: 4 }, { log: "三方話題合不來，冷場到結束……", fans: 600, san: -14, drama: 10 }),
      opt("gambling", 42, "兩場都開，用雙開視窗當「量子連動」。", { log: "量子連動名場面誕生，技術力被神格化！", fans: 9100, tech: 10, drama: 16 }, { log: "雙開爆音又穿模，兩邊都不滿意……", fans: -1100, san: -28, drama: 24 }),
      opt("meme", 54, "請箱推投票決定你的命運，直播開票。", { log: "開票過程比連動還好看，參與感爆棚！", fans: 5200, talk: 6, drama: 8 }, { log: "票數接近引發兩派吵架……", fans: -200, san: -16, drama: 22 }),
    ],
  },
  {
    id: "voice_leak_rumor",
    title: "【聲線謠言】有人堅稱抓到你的「素聲」影片！",
    description:
      "論壇出現一段模糊的通話錄音，被說是你的中之人。聲線確實有點像，箱推開始做聲紋對照影片。",
    options: [
      opt("steady", 87, "不回應猜測，只重申不會公開中之人。", { log: "冷處理成功，一週後沒人再追。", fans: 500, san: 8, drama: -6 }, { log: "沉默被當成默認，謠言多活幾天……", san: -12, drama: 14 }),
      opt("standard", 74, "開台用各種變聲示範「這才叫像」，把謠言玩掉。", { log: "示範太好玩，謠言被笑著結束！", fans: 3500, talk: 8, drama: -8 }, { log: "示範反而讓人更去對照……", fans: 800, san: -10, drama: 12 }),
      opt("gambling", 36, "發布律師函警告轉傳者，走正式途徑。", { log: "強硬路線嚇阻散播，專業形象上升。", fans: 1200, drama: -4, san: 4 }, { log: "被說欺負個人，公關形象受傷……", fans: -1800, san: -22, drama: 34 }),
      opt("meme", 50, "把謠言錄音當 BGM，開「尋找中之人」假實境秀。", { log: "假實境秀太荒謬，謠言被解構成迷因！", fans: 6100, talk: 7, drama: 12 }, { log: "玩太大，真的有人開始人肉……", fans: -700, san: -24, drama: 30 }),
    ],
  },
  {
    id: "game_account_ban",
    title: "【帳號被 ban】排位打到一半，螢幕跳出永久停權！",
    description:
      "你在連動排位裡剛要 C 起來，帳號因為「異常行為」被永久停權。隊友還在語音裡問你是不是開外掛。",
    options: [
      opt("steady", 90, "停止遊戲、送申訴，改開雜談說明情況。", { log: "申訴態度端正，觀眾相信你是誤傷。", fans: 900, talk: 4, san: 6 }, { log: "申訴被制式回覆，心情跌到谷底……", san: -14 }),
      opt("standard", 75, "改用新號從零開始，直播「重生之我是鐵牌」。", { log: "鐵牌重生記意外好看，遊戲台人氣回升！", fans: 3300, talk: 5, tech: 3 }, { log: "新號又被連坐檢測，觀眾開始懷疑……", fans: 400, san: -16, drama: 12 }),
      opt("gambling", 43, "公開對戰紀錄自證清白，跟檢舉者對線。", { log: "數據打臉成功，外掛謠言平反！", fans: 7000, drama: 10, talk: 6 }, { log: "對線翻車，被挖到更多尷尬戰績……", fans: -900, san: -26, drama: 28 }),
      opt("meme", 58, "宣布轉職「被 ban 評論家」，專開事故遊戲台。", { log: "事故評論家定位成立，獵奇觀眾全來了！", fans: 5600, talk: 8, drama: 14 }, { log: "定位太負面，贊助商悄悄消失……", fans: 200, san: -12, drama: 16 }),
    ],
  },
  {
    id: "clickbait_thumbnail",
    title: "【標題黨】縮圖寫「畢業？」其實只是打噴嚏！",
    description:
      "你隨手做的 Short 縮圖用了哭哭表情與「結束了嗎」。演算法推爆了，點進來的人發現只是你被辣椒嗆到。",
    options: [
      opt("steady", 88, "改縮圖並置頂說明，之後標題保守一點。", { log: "及時修正，信任沒有崩盤。", fans: 600, drama: -8, san: 6 }, { log: "改太慢，留言區已被畢業文洗版……", fans: -400, san: -10, drama: 14 }),
      opt("standard", 74, "開「標題黨懺悔回」，教觀眾識破自己的壞習慣。", { log: "懺悔回誠實又好笑，訂閱不減反增！", fans: 2900, talk: 7 }, { log: "懺悔太長，被說又在消費情緒……", fans: 500, san: -8, drama: 10 }),
      opt("gambling", 40, "真的做一場「假畢業」劇情，再揭曉是企劃。", { log: "假畢業反轉成功，成為年度劇本神回！", fans: 9800, talk: 9, drama: 20 }, { log: "有人當真大哭，揭曉後被罵過頭……", fans: -2000, san: -30, drama: 44 }),
      opt("meme", 56, "把所有影片縮圖都改成同一張噴嚏臉。", { log: "噴嚏臉成為品牌識別，連週邊都要印！", fans: 5100, drama: 10, san: 8 }, { log: "識別度是有了，專業形象歸零……", fans: 800, san: -10, drama: 12 }),
    ],
  },
  {
    id: "translator_team_quit",
    title: "【翻譯組請假】海外同看還在，字幕卻消失了！",
    description:
      "長期幫忙的翻譯組因現實生活暫停。今晚海外同看依舊進來，聊天室開始出現一堆問號與翻譯腔崩潰。",
    options: [
      opt("steady", 90, "事先說明並放慢語速，關鍵句自己重講一次。", { log: "放慢節奏有效，海外粉覺得被照顧到。", fans: 1400, talk: 5, san: 6 }, { log: "講太慢，本國觀眾開始催……", fans: 200, san: -6 }),
      opt("standard", 76, "募集新翻譯志工，現場面試聊天室人才。", { log: "現場面試很好玩，新翻譯組誕生！", fans: 3100, talk: 7, drama: 4 }, { log: "面試到奇葩，直播變成災難選秀……", fans: 600, san: -12, drama: 12 }),
      opt("gambling", 45, "改用即時 AI 字幕，賭今晚能看。", { log: "AI 字幕意外能用，技術實驗成功！", fans: 5200, tech: 8 }, { log: "AI 把「凸待」翻成奇怪的東西，現場社死……", fans: 300, san: -18, drama: 16 }),
      opt("meme", 60, "只准用表情符號交流，開「無語言之夜」。", { log: "表情符號之夜成為國際迷因，語言不再是障礙！", fans: 6800, talk: 4, drama: 12 }, { log: "表情戰太抽象，海外粉更混亂……", fans: -200, san: -10 }),
    ],
  },
  {
    id: "forgot_to_archive",
    title: "【沒存檔】神回結束才發現沒開 VOD！",
    description:
      "今晚即興雜談被公認是出道以來最有趣的一場。下播後才發現沒開存檔，烤肉 Man 在頻道留言崩潰。",
    options: [
      opt("steady", 91, "道歉並根據記憶寫重點摘要發文。", { log: "文字紀錄安撫了沒趕上的人。", fans: 700, talk: 3, san: 6 }, { log: "摘要寫得乾，被說完全不是那味……", san: -8 }),
      opt("standard", 75, "隔天開「神回重製版」，嘗試復刻金句。", { log: "重製版意外一樣好笑，成為雙神回！", fans: 3600, talk: 8 }, { log: "復刻失敗，金句變冷笑話……", fans: 400, san: -12 }),
      opt("gambling", 42, "懸賞聊天室錄屏，組成民間 VOD 修復隊。", { log: "民間修復成功，社群凝聚力爆棚！", fans: 7900, drama: 8, talk: 5 }, { log: "錄屏對不上時間軸，修復變成修羅場……", fans: 200, san: -20, drama: 14 }),
      opt("meme", 58, "宣布這是「只能活在記憶裡的傳說台」。", { log: "傳說台人設成立，沒看到的人更想追你！", fans: 5400, san: 14, drama: 10 }, { log: "被說在逃避責任，氣氛有點僵……", fans: -300, san: -12, drama: 12 }),
    ],
  },
  {
    id: "charity_stream_audit",
    title: "【慈善台】善款明細被要求公開！",
    description:
      "你為災後募款開了 12 小時慈善台。隔天有人要求看明細與收據，聊天室開始討論「VTuber 能不能經手善款」。",
    options: [
      opt("steady", 89, "立刻公布明細與匯款截圖，並請會計朋友覆核。", { log: "透明化過關，公信力上升。", fans: 1600, san: 8, drama: -10 }, { log: "表格難懂，還是有人質疑……", san: -10, drama: 8 }),
      opt("standard", 74, "開「善款說明會」，逐筆講用途與剩餘款。", { log: "說明會認真，社群給予信任投票！", fans: 2800, talk: 6, drama: -8 }, { log: "講太細變成流水帳，同看掉光……", fans: 500, san: -8 }),
      opt("gambling", 35, "加碼自己對捐一筆，並請第三方單位接管。", { log: "對捐與第三方接管讓質疑消失，形象大勝！", fans: 6400, drama: -12, san: 6 }, { log: "金額承諾太高，私下財務吃緊……", fans: 800, san: -26, drama: 10 }),
      opt("meme", 40, "用遊戲代幣比喻善款流向，開「財政模擬器」。", { log: "比喻意外好懂，嚴肅議題被溫柔講完！", fans: 4200, talk: 7 }, { log: "被說不夠嚴肅，第二輪質疑出現……", fans: -600, san: -18, drama: 24 }),
    ],
  },
  {
    id: "piano_cramp",
    title: "【樂器台】鋼琴彈到一半手指抽筋！",
    description:
      "第一次鋼琴歌回彈到副歌，左手突然抽筋。鏡頭還在，你維持著奇怪的手勢，聊天室已經截成貼圖。",
    options: [
      opt("steady", 92, "停手休息、喝水，改清唱把歌唱完。", { log: "應變得宜，清唱反而更動人。", fans: 1500, singing: 6, san: 8 }, { log: "停太久，氣氛散掉……", san: -6 }),
      opt("standard", 77, "改彈超簡單的練習曲，開「復健音樂會」。", { log: "復健音樂會可愛爆棚，技術力人設更親民！", fans: 2700, singing: 4, talk: 4 }, { log: "練習曲太單調，同看開始掉……", fans: 400, san: -8 }),
      opt("gambling", 46, "改用腳趾與手肘繼續彈，挑戰殘障演奏。", { log: "怪彈法成為神回，樂器區記住你的名字！", fans: 7300, singing: 7, drama: 12 }, { log: "真的拉傷，接下來一週不能開歌回……", singing: -4, san: -24, drama: 10 }),
      opt("meme", 63, "把抽筋手勢命名為新的應援動作。", { log: "抽筋應援在現場跟跳，週邊構想立刻出現！", fans: 5800, drama: 10, san: 12 }, { log: "應援太難跟，現場只有你一個人在抽……", fans: 600, san: -8, drama: 8 }),
    ],
  },
  {
    id: "sleep_talk_leak",
    title: "【睡覺台】說夢話把明天的企劃全招了！",
    description:
      "耐久睡覺台本來只想賺掛機同接。你在夢裡用本聲唸出未公開的連動名單與週邊價格，剪輯已經開始動工。",
    options: [
      opt("steady", 88, "下播後發文：夢話不作數，企劃照原時程。", { log: "幽默切割成功，驚喜感還在。", fans: 900, san: 8, drama: -4 }, { log: "沒人信，時間軸已經當正式公告……", san: -10, drama: 10 }),
      opt("standard", 73, "開「夢話對照會」，承認哪幾句是真的。", { log: "半真半假的對照會很好看，參與感滿滿！", fans: 3400, talk: 7, drama: 6 }, { log: "承認太多，後面沒驚喜了……", fans: 800, san: -8 }),
      opt("gambling", 41, "乾脆提前公開全部企劃，把事故當發佈會。", { log: "事故發佈會熱度爆棚，預熱一次到位！", fans: 8100, talk: 6, drama: 12 }, { log: "夥伴還沒同意就被公開，關係變僵……", fans: -500, san: -24, drama: 28 }),
      opt("meme", 57, "宣稱那是「潛意識 VTuber」在開台，幫他做設定。", { log: "潛意識分身成為新角色，同人圖連夜出現！", fans: 6000, talk: 8, drama: 14 }, { log: "人設疊太多重，觀眾開始分不清……", fans: 400, san: -12, drama: 10 }),
    ],
  },
  {
    id: "studio_light_explode",
    title: "【燈光事故】應援燈與環形燈同時閃爆！",
    description:
      "3D 小劇場彩排到高潮，環形燈啪一聲熄滅，只剩螢幕光。你的臉變成只有下巴有光的都市傳說。",
    options: [
      opt("steady", 91, "切待機圖換燈，用手電筒應急把台開完。", { log: "應急成功，專業度沒有崩。", fans: 800, tech: 5, san: 6 }, { log: "換燈太久，觀眾等到去別台……", fans: 100, san: -8 }),
      opt("standard", 76, "改成燭光（LED）夜話，把事故當氣氛。", { log: "燭光夜話意外浪漫，切片超好剪！", fans: 3000, talk: 6, san: 10 }, { log: "LED 也沒電，夜話變成純黑……", fans: 400, san: -10 }),
      opt("gambling", 44, "宣布這是「黑暗 3D」，繼續跳完整支舞。", { log: "黑暗舞蹈超有魄力，前衛形象成立！", fans: 7600, singing: 5, drama: 14 }, { log: "黑暗中撞到麥架，直播出現巨響……", fans: 300, san: -22, tech: -3, drama: 12 }),
      opt("meme", 60, "只露出眼睛，開「只有眼睛的都市傳說台」。", { log: "眼睛都市傳說爆紅，新衣還沒出就先有了恐怖皮！", fans: 6500, drama: 16, talk: 5 }, { log: "太恐怖，被年齡分級警告……", fans: -400, san: -14, drama: 18 }),
    ],
  },
  {
    id: "discord_mod_meltdown",
    title: "【管理員暴走】伺服器公告變成個人心情文！",
    description:
      "資深管理員在 Discord 發了三千字心情文，點名觀眾與其他箱推。你還在睡覺，醒來時伺服器已經分成三個陣營。",
    options: [
      opt("steady", 86, "私訊安撫、暫時下架公告，稍後發官方說明。", { log: "內部處理得宜，伺服器慢慢恢復平靜。", fans: 500, san: 6, drama: -8 }, { log: "說明來得太慢，已經有人退群……", fans: -400, san: -12, drama: 16 }),
      opt("standard", 72, "開「社群圓桌」，讓雙方把話說完。", { log: "圓桌出乎意料地成熟，社群規則被補完！", fans: 2600, talk: 8, drama: -10 }, { log: "圓桌變成修羅場，你成了主持人地獄……", fans: 200, san: -20, drama: 24 }),
      opt("gambling", 37, "公開撤銷管理員並現場徵新血。", { log: "換血成功，社群效率不減反增！", fans: 4800, drama: 12, talk: 4 }, { log: "元老粉絲出走，氣氛冷了半個月……", fans: -1600, san: -26, drama: 32 }),
      opt("meme", 48, "把心情文朗讀成廣播劇，讓當事人自己聽有多長。", { log: "廣播劇化解尷尬，連管理員都來笑了！", fans: 4300, talk: 7, san: 8 }, { log: "當事人覺得被公開處刑，私訊戰開始……", fans: -700, san: -18, drama: 28 }),
    ],
  },
  {
    id: "platform_outage",
    title: "【平台當機】YouTube 掛了，待機室進不去！",
    description:
      "準時開台卻只看到轉圈圈。Twitter 上所有 VTuber 都在發「我不是沒開，是平台沒了」，觀眾已經開始流浪。",
    options: [
      opt("steady", 93, "發社群通知改期，請大家先去休息。", { log: "不硬撐的決定被讚賞，改期台更穩。", fans: 400, san: 10 }, { log: "有人沒看到通知，以為你放鳥……", san: -6 }),
      opt("standard", 78, "改去 Twitch 開臨時台，把流浪觀眾接住。", { log: "跨平台救援成功，還認識新觀眾！", fans: 3500, tech: 5, talk: 4 }, { log: "Twitch 設定全錯，音畫不同步……", fans: 600, san: -12, tech: -2 }),
      opt("gambling", 48, "開「平台當機連動」，把其他流浪 V 拉進語音。", { log: "災難連動成為圈內佳話，人脈爆增！", fans: 8700, talk: 8, drama: 8 }, { log: "語音房爆滿當機，二次災難……", fans: 500, san: -18, drama: 12 }),
      opt("meme", 64, "在推特開文字直播，用打字完成整場雜談。", { log: "文字直播成為年度迷因，鍵盤同接破萬！", fans: 6200, talk: 10, drama: 10 }, { log: "打字打到抽筋，訊息還被限流……", fans: 700, san: -14 }),
    ],
  },
  {
    id: "new_model_delay",
    title: "【新皮延期】披露日到了，檔案還在繪師硬碟裡！",
    description:
      "新皮披露倒數八小時，模型師來訊：綁骨還沒完。待機室已經掛上「新衣」預告圖，你必須決定怎麼面對今晚。",
    options: [
      opt("steady", 90, "誠實延期並展示製作花絮，今晚改雜談。", { log: "花絮安撫期待，觀眾願意再等。", fans: 1100, talk: 4, san: 8 }, { log: "花絮太短，被說沒誠意……", fans: 200, san: -8 }),
      opt("standard", 75, "用舊皮加新配件「半披露」，把能秀的先秀。", { log: "半披露反而有層次，正式檔更被期待！", fans: 3000, tech: 5, talk: 3 }, { log: "配件跟舊皮不合，畫面很尷尬……", fans: 500, san: -10, tech: -2 }),
      opt("gambling", 43, "現場連線模型師，直播綁骨到天亮。", { log: "公開製作過程超有教育性，技術粉暴動！", fans: 8400, tech: 12, drama: 8 }, { log: "連線到一半檔案損毀，披露遙遙無期……", fans: -400, san: -30, drama: 18 }),
      opt("meme", 55, "用小畫家自製臨時皮，宣布「24 小時限定紙片人」。", { log: "紙片人皮爆紅，正式新衣還沒出就先有週邊梗！", fans: 7000, drama: 14, san: 12 }, { log: "小畫家皮被嫌太醜，期待值受傷……", fans: -300, san: -14, drama: 10 }),
    ],
  },
  {
    id: "ai_voice_controversy",
    title: "【AI 聲優事件】粉絲自製你的 AI 語音模型歌唱！",
    description:
      "有技術高超的粉絲用你的聲音訓練了 AI 模型翻唱熱門歌曲，在社群引發「著作權與聲音肖像權」的大論戰！",
    options: [
      opt("steady", 90, "發表理性聲明，感謝熱情但希望粉絲停止商業化使用。", { log: "理性溝通獲得全平台大讚，展現了成熟創作者的高度！", fans: 1500, san: 10 }, { log: "部分 AI 技術狂熱者在討論區開酸……", san: -10 }),
      opt("standard", 75, "現場開台與自己的「AI 分身」進行歌唱 1 對 1 對決！", { log: "人類真聲的感情震撼全場！完美打敗 AI 模型獲得爆量大讚！", fans: 5000, singing: 10 }, { log: "AI 調得太完美，觀眾竟然開玩笑說 AI 唱得比較好……", san: -20, drama: 15 }),
      opt("gambling", 45, "直接將 AI 分身吸收為「正式二號機」，嘗試雙聲道合唱！", { log: "賽博龐克雙聲道合唱爆紅破圈！開創 VTuber 界新歷史！", fans: 11000, tech: 12, drama: 20 }, { log: "遭音樂圈前輩聯名抵制，遭受不小輿論壓力……", fans: -1200, san: -30, drama: 35 }),
      opt("meme", 65, "用 AI 語音給自己做「無厘頭笑話語音包」開箱！", { log: "爆笑語音包被做成音效板，成為各大實況主愛用的梗！", fans: 6500, talk: 8 }, { log: "語音包發音過於詭異，變成鬼畜音效……", san: -10 }),
    ],
  },
  {
    id: "apex_collab_betrayal",
    title: "【遊戲連動】大逃殺比賽最後關頭「誤射友軍」！",
    description:
      "在萬人同看的盃賽決賽圈，緊張之際你一個手滑爆頭射倒了連動的大先輩隊友……",
    options: [
      opt("steady", 90, "當場鞠躬大聲道歉，並在賽後送上高級禮盒謝罪。", { log: "前輩大方原諒，觀眾也覺得你的謝罪反應非常可愛。", fans: 1200, san: 5 }, { log: "前輩的極端粉絲在你的 Twitter 留言洗版……", san: -15, drama: 15 }),
      opt("standard", 80, "將這次誤射做成「背刺戰術檢討會」節目爆笑復盤！", { log: "爆笑的罪惡感演出成為迷因，前輩也親自留言互動！", fans: 4800, talk: 8 }, { log: "被部分鍵盤教練指責技術太爛……", san: -10, tech: -2 }),
      opt("gambling", 40, "順水推舟切換為「黑化叛徒人格」，現場補槍收掉隊友！", { log: "節目效果轟動全台！被稱為「VTuber 界的頂級刺客」！", fans: 9500, drama: 30 }, { log: "被指責缺乏體育精神，同看人數瞬間下跌……", fans: -1800, san: -30, drama: 40 }),
      opt("meme", 60, "宣稱是「麥克風與手把產生自我意識」，當場給手把進行心理輔導！", { log: "給手把做心理輔導的抽象演出笑翻全場，登上熱門精華！", fans: 6000, talk: 10 }, { log: "觀眾紛紛表示：『這人是不是壓力太大瘋了？』", san: -15 }),
    ],
  },
  {
    id: "unarchived_karaoke_disaster",
    title: "【限時歌回】不留存檔歌回忘記切斷備份，精華全平台流傳！",
    description:
      "原本標榜「不留存檔（Unarchived）」的高難度歌曲歌回，因為 OBS 設定錯誤不小心錄下了完整 1080P 高畫質檔案……",
    options: [
      opt("steady", 85, "冷靜發文說明是系統失誤，請求粉絲不要二次上傳。", { log: "粉絲們自主維護秩序，協力檢舉非法上傳檔案。", fans: 1000, san: 5 }, { log: "影片依然在部分影音平台被偷偷傳播。", san: -10 }),
      opt("standard", 80, "順水推舟將存檔解鎖為「限時 24 小時限定公開」，衝刺訂閱！", { log: "飢餓行銷策略大成功！24 小時內湧入數萬路人觀看！", fans: 6000, singing: 8 }, { log: "被部分準時守候的老粉抱怨不公平……", san: -10, drama: 10 }),
      opt("gambling", 40, "直接將該存檔製作為「首張數位音樂專輯」上架 Spotify！", { log: "高品質歌聲登上音樂榜！正式跨界成為音樂創作者！", fans: 12000, singing: 15, san: 20 }, { log: "因歌曲版權問題遭到線上音樂平台強制下架……", san: -30, drama: 35 }),
      opt("meme", 60, "將高音破音部分剪成「倒退播放版」，當成全新魔性歌曲上傳！", { log: "倒放魔性歌曲洗腦全平台！TikTok 出現爆量跟風舞蹈！", fans: 7500, singing: 5, drama: 15 }, { log: "音樂系觀眾留言分析音準，場面尷尬……", san: -10 }),
    ],
  },
  {
    id: "keyboard_asmr_accident",
    title: "【打字事故】開台打遊戲打字太用力，機械軸爆音狂洗！",
    description:
      "換了青軸機械鍵盤，結果直播時打字敲擊聲比你說話的聲音還大，聊天室狂刷『噠噠噠噠噠』！",
    options: [
      opt("steady", 90, "火速更換靜音紅軸，並調整麥克風降噪設定。", { log: "音訊品質恢復專業，獲得老粉的一致好評。", fans: 800, tech: 5 }, { log: "換鍵盤浪費了 20 分鐘直播時間。", san: -5 }),
      opt("standard", 75, "順勢轉型為「極速打字競賽 + 敲擊樂 ASMR」特別企劃！", { log: "1 秒 12 字的極速手速驚艷觀眾！打字聲被讚極度療癒！", fans: 3800, tech: 8 }, { log: "手關節打到發酸，隔天無法操作遊戲……", san: -15 }),
      opt("gambling", 50, "用鍵盤敲擊聲作為伴奏，現場來一段《打字機饒舌》！", { log: "打字聲與饒舌完美融合！社群稱為賽博龐克打字員！", fans: 8000, singing: 8, talk: 8 }, { log: "節奏完全對不上，變成單純的噪音轟炸……", fans: -600, san: -20 }),
      opt("meme", 60, "宣稱那是「虛擬打字機精靈」在給觀眾報密碼！", { log: "觀眾開始在聊天室玩起密碼解讀遊戲，氣氛歡樂！", fans: 5500, san: 15 }, { log: "觀眾表示耳朵快被震聾了……", san: -10 }),
    ],
  },
  {
    id: "artist_revision_war",
    title: "【繪師爭議】新衣修改到第 17 次，繪師媽媽在時間軸放閃！",
    description:
      "新衣企劃的修改意見越寫越長，繪師公開表示「這已經不是調整，是重畫」。箱推分成護航繪師與護航你兩派。",
    options: [
      opt("steady", 88, "公開道歉、凍結修改、付清尾款並另開時程。", { log: "態度端正止血成功，繪師社群給予尊重。", fans: 900, san: 6, drama: -8 }, { log: "時程再延，部分粉絲覺得新衣遙遙無期……", fans: -200, san: -12 }),
      opt("standard", 74, "開「設計說明會」，把世界觀需求一次講清楚。", { log: "說明會意外專業，路人開始期待成品！", fans: 3200, talk: 6, drama: -6 }, { log: "越講越多新需求，繪師更火了……", san: -16, drama: 20 }),
      opt("gambling", 38, "當場加價請繪師連線，直播一起改稿到完稿。", { log: "公開共創成為神回，成品熱度爆棚！", fans: 8800, tech: 8, drama: 10 }, { log: "連線變成修羅場，合作關係破裂……", fans: -1400, san: -28, drama: 36 }),
      opt("meme", 52, "把 17 版草稿做成「進化史」迷因圖鑑公開。", { log: "進化史圖鑑爆紅，連失敗稿都有人想收進週邊！", fans: 6100, talk: 5, drama: 12 }, { log: "繪師覺得草稿被消費，私訊氣氛急凍……", fans: -600, san: -18, drama: 24 }),
    ],
  },
  {
    id: "overseas_culture_shock",
    title: "【海外衝擊】歐美粉進聊天室，直球提問把待機室凍住！",
    description:
      "Short 爆紅後湧入大量海外觀眾。有人用英文直球問中之人、薪資與感情狀況，本國箱推與海外粉開始互相教訓禮儀。",
    options: [
      opt("steady", 87, "用中英夾雜重申界線，並置頂常見問題。", { log: "界線清楚，兩邊都慢慢適應新聊天室文化。", fans: 1600, talk: 5, san: 8 }, { log: "置頂沒人看，直球問題還是一直來……", san: -10, drama: 8 }),
      opt("standard", 76, "開「跨文化雜談」，請翻譯組當現場外交官。", { log: "外交官雜談很好玩，海外訂閱留下了！", fans: 4200, talk: 8, san: 6 }, { log: "翻譯來不及，現場變成各說各話……", fans: 800, san: -12 }),
      opt("gambling", 42, "宣布今晚全程英文答辯，把敏感題一次拆完。", { log: "英文答辯意外堂堂正正，國際形象大勝！", fans: 7800, talk: 10, drama: 8 }, { log: "單字用盡又講錯，截圖流傳成迷因……", fans: -500, san: -24, drama: 22 }),
      opt("meme", 55, "發明「直球問題鈴」，答對就喝一口可樂。", { log: "可樂鈴成為國際迷因，提問變成遊戲！", fans: 6400, talk: 7, drama: 10 }, { log: "喝太快開始亂答，界線又糊了……", fans: 400, san: -16, drama: 14 }),
    ],
  },
  {
    id: "esports_caster_unbox",
    title: "【賽事開箱】受邀當盃賽嘉賓，聯名週邊現場拆到穿模！",
    description:
      "經典大逃殺聯賽請你當開箱嘉賓。鏡頭對準的瞬間，聯名外套的拉鍊卡住，模型手穿過袖口，導播已經切特寫。",
    options: [
      opt("steady", 89, "暫停展示、切待機圖，請工作人員處理服裝。", { log: "處理得宜，賽事官方私訊說下次還想找你。", fans: 1400, san: 6, tech: 3 }, { log: "暫停太久，導播切走你的段落……", fans: 300, san: -8 }),
      opt("standard", 75, "把穿模當「限定特效」，繼續介紹選手與週邊。", { log: "臨場反應獲讚，開箱精華觀看數破表！", fans: 4600, talk: 7, drama: 6 }, { log: "解說講錯選手名字，論壇開始截圖……", fans: 700, san: -12, drama: 10 }),
      opt("gambling", 44, "現場發起「穿模也能 C」挑戰，跟職業選手連線一局。", { log: "嘉賓局爆紅，你被稱為最會事故的賽評！", fans: 9200, tech: 6, drama: 14 }, { log: "連線延遲害隊伍團滅，彈幕開始出征……", fans: -900, san: -26, drama: 28 }),
      opt("meme", 58, "宣布這是「賽博義肢新衣」，給穿模手取名字。", { log: "義肢新衣設定笑死全場，聯賽官方也轉推！", fans: 6800, talk: 8, drama: 12 }, { log: "官方覺得不夠嚴肅，嘉賓邀約泡湯……", fans: -400, san: -14, drama: 16 }),
    ],
  },
  {
    id: "art_theft_alert",
    title: "【盜圖警報】你的立繪出現在來路不明的週邊攤！",
    description:
      "同人展前夕，粉絲回報有攤位在賣未授權立繪抱枕。繪師媽媽震怒，律師與箱推都在等你表態。",
    options: [
      opt("steady", 90, "發聲明譴責盜圖，並協助繪師走下架程序。", { log: "立場清楚，繪師與粉絲都覺得被保護到。", fans: 1200, san: 8, drama: -6 }, { log: "下架太慢，展會當天還是有人遇到……", san: -10, drama: 10 }),
      opt("standard", 77, "開「正版週邊導覽」，把官方與授權攤一次講完。", { log: "導覽超實用，正版攤位反而被帶爆！", fans: 3900, talk: 6, drama: -8 }, { log: "講到一半講錯攤位，現場好尷尬……", fans: 500, san: -8 }),
      opt("gambling", 36, "親自跑展會對質，直播「抓盜圖」實況。", { log: "抓盜圖實況話題爆炸，正版意識大勝！", fans: 8600, drama: 18, talk: 5 }, { log: "對質影片被剪成霸凌，公關危機擴大……", fans: -1600, san: -32, drama: 42 }),
      opt("meme", 50, "畫一張「這不是我」的超醜反盜圖圖發出去。", { log: "超醜反擊圖成為防盜迷因，轉發量比聲明還高！", fans: 5400, drama: 10, san: 10 }, { log: "被說不夠嚴肅，繪師覺得你在玩……", fans: -300, san: -14, drama: 16 }),
    ],
  },
  {
    id: "rigger_burnout",
    title: "【綁骨過勞】模型師交稿前夜說「我可能撐不住了」！",
    description:
      "3D 披露倒數，綁骨師私訊崩潰：物理、碰撞與表情檔都還沒收。你必須在公開延期與硬上未完成模型之間做選擇。",
    options: [
      opt("steady", 91, "立刻延期並讓模型師休息，今晚改播舊皮。", { log: "人比檔期重要的決定，圈內好評如潮。", fans: 800, san: 12, drama: -4 }, { log: "部分觀眾已請假看披露，情緒有點失落……", fans: 200, san: -6 }),
      opt("standard", 73, "只公開已完成的部位，做成「半成品鑑賞會」。", { log: "半成品鑑賞意外有教育意義，技術粉加訂！", fans: 3400, tech: 8, talk: 4 }, { log: "半成品被截成缺陷圖，期待值受傷……", fans: 600, san: -12, drama: 12 }),
      opt("gambling", 41, "你自己接手綁骨，通宵直播趕工。", { log: "個人勢工匠傳說誕生，披露當天奇跡完成！", fans: 9700, tech: 14, san: -18 }, { log: "檔案救不回來，披露全面停擺……", fans: -800, san: -34, drama: 22 }),
      opt("meme", 54, "讓未綁好的模型以「鬼魂模式」出場，飄就對了。", { log: "鬼魂皮爆紅，未完成也變成世界觀的一部分！", fans: 6200, drama: 14, tech: 5 }, { log: "飄太久觀眾頭暈，同看掉很快……", fans: -200, san: -10 }),
    ],
  },
  {
    id: "mislabelled_clip",
    title: "【切片誤標】烤肉精華被標成大型箱推，你的名字消失了！",
    description:
      "一則高播放 Short 用了你的畫面，標題卻寫成別的大型箱推成員。演算法把流量全送去對方，你的頻道卻沒被標註。",
    options: [
      opt("steady", 88, "禮貌留言更正，並私訊剪輯者補標。", { log: "剪輯者秒改，還倒流一批新觀眾過來。", fans: 1800, san: 8 }, { log: "留言被淹沒，誤標繼續傳播……", san: -8 }),
      opt("standard", 76, "自己重發「正確字幕版」，把語境補齊。", { log: "正確版反而更好看，播放數後來居上！", fans: 4100, talk: 5, singing: 3 }, { log: "重發被演算法當成重複內容限流……", fans: 500, san: -10 }),
      opt("gambling", 43, "公開點名該帳號，要求演算法還公道。", { log: "點名成功上熱門，誤標事件變成曝光！", fans: 8300, drama: 16, talk: 4 }, { log: "被說碰瓷大箱，對家粉絲湧入出征……", fans: -1500, san: -28, drama: 34 }),
      opt("meme", 57, "把誤標當成「平行宇宙的我」，開設定講座。", { log: "平行宇宙設定笑死兩邊箱推，誤標變連動伏筆！", fans: 5900, talk: 8, drama: 10 }, { log: "對方經紀公司來函希望你不要再玩……", fans: 400, san: -14, drama: 18 }),
    ],
  },
  {
    id: "fan_meetup_crash",
    title: "【線下翻車】見面會音響炸裂，你在台上只能比手畫腳！",
    description:
      "第一次線下見面會，音響回授尖叫、投影當機。觀眾已經進場，你必須決定要不要繼續、怎麼繼續。",
    options: [
      opt("steady", 86, "暫停活動、發放飲水，等設備恢復再短短見面。", { log: "安全第一獲得體諒，現場氣氛回溫。", fans: 1100, san: 8 }, { log: "等待太久，有人開始退場……", fans: -200, san: -10 }),
      opt("standard", 74, "改成簽名與合照優先，歌唱改清唱一小段。", { log: "清唱小段意外動人，線下粉全部融化！", fans: 4800, singing: 6, san: 10 }, { log: "動線混亂，合照排到閉館……", fans: 800, san: -12 }),
      opt("gambling", 40, "不插電開「街頭突擊直播」，把大家帶出戶外。", { log: "突擊戶外成為傳奇見面會，新聞都來了！", fans: 9100, talk: 8, drama: 16 }, { log: "戶外噪音檢舉，活動被勸離……", fans: -700, san: -26, drama: 22 }),
      opt("meme", 56, "改玩默劇與燈牌猜拳，宣稱這是「靜音世界觀」。", { log: "靜音見面會成為迷因，燈牌照片洗版時間軸！", fans: 6700, talk: 6, drama: 12 }, { log: "有人以為真的壞掉，開始幫你報修……", fans: 300, san: -8 }),
    ],
  },
  {
    id: "spoiler_collab",
    title: "【劇透連動】前輩還沒看的劇情，你在凸待裡講完了！",
    description:
      "同看動畫連動進行到一半，你習慣性劇透了下季結局。前輩表情凍結，聊天室分成劇透派與保護派。",
    options: [
      opt("steady", 90, "立刻道歉並請前輩決定要不要切台。", { log: "道歉夠快，前輩笑著原諒，風波沒擴大。", fans: 1000, san: 6, drama: -4 }, { log: "前輩的劇情粉還是在你頻道掛了一晚……", san: -12, drama: 12 }),
      opt("standard", 78, "開「劇透懺悔室」，後半段改聊沒雷的周邊。", { log: "懺悔室很好笑，連動關係沒裂！", fans: 3600, talk: 7 }, { log: "越懺悔雷越多，前輩伸手擋麥……", fans: 400, san: -14, drama: 10 }),
      opt("gambling", 37, "宣稱那是「平行世界結局」，現場編一套新劇情。", { log: "現場編造的平行結局意外被官方式玩梗！", fans: 7400, talk: 10, drama: 14 }, { log: "沒人信，被說破壞同看體驗……", fans: -800, san: -22, drama: 26 }),
      opt("meme", 53, "每次快劇透就喝可樂，用氣泡打斷自己。", { log: "可樂打斷器成為連動名場面，前輩也跟著喝！", fans: 5800, talk: 5, san: 12 }, { log: "喝到打嗝，劇透還是漏出去……", fans: 200, san: -10, drama: 8 }),
    ],
  },
  {
    id: "tax_invoice_panic",
    title: "【稅務衝擊】會計來訊：去年 Super Chat 要補申報！",
    description:
      "個人勢第一次面對發票與所得。會計列出一長串綠界、SC 與週邊款，你今晚本想開遊戲台，現在桌面全是試算表。",
    options: [
      opt("steady", 92, "停播一晚，把帳目交給會計處理。", { log: "成年人選擇，粉絲誇你有在當創作者。", fans: 600, san: 10 }, { log: "停播被說消失，少量退訂……", fans: -100, san: -6 }),
      opt("standard", 74, "開「個人勢報稅雜談」，邊問邊學邊直播。", { log: "報稅雜談意外實用，創作者同業狂轉！", fans: 3500, talk: 8, tech: 3 }, { log: "講錯稅法被專業觀眾糾正，有點社死……", fans: 700, san: -12 }),
      opt("gambling", 33, "現場承諾「稅務透明化」，把部分數字公開。", { log: "透明化引發討論，信任度不減反增！", fans: 7200, drama: 12, talk: 6 }, { log: "數字被斷章，引來仇富與質疑……", fans: -1300, san: -30, drama: 32 }),
      opt("meme", 48, "把國稅局做成魔王，開「報稅魂系」通關台。", { log: "報稅魂系成為四月限定迷因，會計都來看！", fans: 5100, talk: 7, drama: 8 }, { log: "被說諷刺公家機關，留言區開始嚴肅……", fans: -400, san: -16, drama: 18 }),
    ],
  },
  {
    id: "duet_credit_fight",
    title: "【合唱署名】合作曲上架，你的名字被寫成 Feat. 不明！",
    description:
      "與歌勢前輩的合唱數位單曲上架後，平台顯示的主辦與分潤比例和當初說的不一樣。粉絲已經開始做對照表。",
    options: [
      opt("steady", 87, "私下溝通更正，不在公開場合開火。", { log: "私下修好了，單曲頁面隔天更新正確署名。", fans: 900, san: 7, drama: -6 }, { log: "對方已讀不回，粉絲比你還焦急……", san: -14, drama: 12 }),
      opt("standard", 72, "發共同聲明說明是平台設定錯誤。", { log: "共同聲明平息猜測，播放數還往上走！", fans: 3300, singing: 4, drama: -8 }, { log: "聲明用詞被挑，第二輪解析文出現……", san: -12, drama: 16 }),
      opt("gambling", 39, "公開自己的版本，要求平台與對方針對。", { log: "公開對質讓分潤透明化，獨立音樂人聲援！", fans: 8100, drama: 20, singing: 5 }, { log: "合作關係破裂，單曲被下架……", fans: -1800, san: -32, drama: 40 }),
      opt("meme", 51, "把錯誤署名當成「神秘 Feat.」，開猜謎歌回。", { log: "猜謎歌回把爭議玩成節目，連對方都來留言！", fans: 5600, singing: 6, talk: 5 }, { log: "被說消費合作關係，空氣變冷……", fans: -500, san: -18, drama: 22 }),
    ],
  },
  {
    id: "vrchat_avatar_glitch",
    title: "【VRChat 連動】公開房撞模，你的皮在別人身上跑走！",
    description:
      "首次 VRChat 連動進入公開房，有人套了相似模型在你旁邊跳舞。鏡頭看起來像你有分身，聊天室已經在問「哪一個是本尊」。",
    options: [
      opt("steady", 88, "立刻改私房並更換識別配件，先把連動做完。", { log: "危機處理迅速，連動後半段恢復正常。", fans: 1100, tech: 5, san: 6 }, { log: "改私房太慢，截圖已經傳開……", san: -10, drama: 8 }),
      opt("standard", 75, "跟「分身」玩捉迷藏，讓觀眾投票找本尊。", { log: "找本尊遊戲超好玩，VR 連動成為熱門精華！", fans: 4500, talk: 7, tech: 4 }, { log: "投錯人，本尊危機變成迷因……", fans: 800, san: -8, drama: 10 }),
      opt("gambling", 46, "宣布進行「真假 V 對決」，輸的人要唱罰歌。", { log: "真假對決爆紅，連假皮都變成臨時箱推！", fans: 8900, singing: 6, drama: 16 }, { log: "對決中模型崩潰，兩人都穿模落地……", fans: 400, san: -22, tech: -3, drama: 14 }),
      opt("meme", 60, "把所有相似皮拉進合照，開「克隆人家族聚會」。", { log: "克隆人聚會成為 VR 名場面，世界觀直接擴張！", fans: 7000, talk: 8, drama: 12 }, { log: "人太多當機，連動提早結束……", fans: 500, san: -12 }),
    ],
  },
];
