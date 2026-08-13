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
];
