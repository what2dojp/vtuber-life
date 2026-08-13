export interface EventSuccess {
  log: string;
  fans?: number;
  san?: number;
  talk?: number;
  singing?: number;
  tech?: number;
  drama?: number;
}

export interface EventFailure {
  log: string;
  fans?: number;
  san?: number;
  drama?: number;
}

export interface EventOption {
  label: string;
  chance: number;
  success: EventSuccess;
  failure: EventFailure;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  options: EventOption[];
}

export const RANDOM_EVENTS: GameEvent[] = [
  {
    id: "colamoon_collab",
    title: "【先輩連動】與四周年先輩「可樂月月」合作直播！",
    description:
      "快要突破 10,000 訂閱的台灣 VTuber 可樂月月邀請你參加四周年紀念凸待，一起聊聊 VTuber 的心路歷程！",
    options: [
      {
        label: "【大聲宣傳】祝賀月月 4 周年快樂！(點擊同時引導開啟頻道)",
        chance: 92,
        success: {
          log: "你在連動裡拼命喊「可樂月月四周年快樂、衝刺萬定！」月月的觀眾湧進待機室，訂閱曲線直接起飛，SAN 也回滿了。",
          fans: 2000,
          san: 20,
          talk: 3,
          drama: 4,
        },
        failure: {
          log: "你太興奮把頻道網址唸成自己的。月月笑著幫你更正，宣傳還是傳到了，只是過程有點社死。",
          fans: 400,
          san: 8,
          drama: 8,
        },
      },
      {
        label: "專心連動，好好聽先輩分享四年來的故事",
        chance: 80,
        success: {
          log: "你沒有搶話，只是認真聽月月聊個人勢的四年。彈幕說這場凸待很溫柔，雜談力默默升級。",
          fans: 520,
          san: 10,
          talk: 4,
        },
        failure: {
          log: "你緊張到只會點頭。連動還是完成了，但精華剪輯裡你幾乎沒出聲，變成安靜的背景板。",
          fans: 120,
          san: 2,
        },
      },
    ],
  },
  {
    id: "mic-off-delivery",
    title: "【播後事故】忘記關麥克風！",
    description:
      "你以為已經下播，OBS 其實還在錄。外送員按門鈴，你用最市井的聲音大喊「來了來了、不要香菜、去骨、辣椒分開放！」彈幕已經從『草』刷到『中之人好真實』，連待機室的日文觀眾都在問「魯肉飯って何」。",
    options: [
      {
        label: "立刻角色化：這是深夜的戰鬥食物任務",
        chance: 72,
        success: {
          log: "下播忘關 OBS，外送對話全播出。你硬說是設定，彈幕反而愛上『不要香菜』這個新梗。",
          fans: 280,
          san: -4,
          talk: 2,
          drama: 6,
        },
        failure: {
          log: "你試圖用可愛聲音圓場，但『去骨』兩個字已經社死，切片標題寫著《VTuber 的真實胃》。",
          fans: 40,
          san: -12,
          drama: 14,
        },
      },
      {
        label: "直接破防道歉，順便開箱滷味",
        chance: 58,
        success: {
          log: "你邊道歉邊開箱，ASMR 咀嚼音意外成為本週最高同接。古參說這才是個人勢。",
          fans: 360,
          san: -8,
          talk: 3,
          drama: 8,
        },
        failure: {
          log: "道歉途中又對門外大喊『要吸管！』，PTT 八卦板已開好標題《又是皮套人破防》。",
          fans: -20,
          san: -16,
          drama: 18,
        },
      },
    ],
  },
  {
    id: "zero-guest-collab",
    title: "【萬粉紀念】凸待……零人？",
    description:
      "你隆重宣布萬粉慶祝凸待。待機室放了三小時的《夢が咲く春》。通訊錄已讀不回，最後只有一位走錯台的留言：「ここホロライブ？」同接還在，靈魂已經下班。",
    options: [
      {
        label: "分飾兩角，自己跟自己連動",
        chance: 64,
        success: {
          log: "萬粉凸待零人連線。你切兩個模型互虧，剪輯標題變成《孤獨的神回》，意外出圈。",
          fans: 520,
          san: -10,
          talk: 4,
          drama: 10,
        },
        failure: {
          log: "第二個聲音太像你自己。彈幕冷靜地打：『這不是分飾，這是多重人格。』",
          fans: 80,
          san: -18,
          drama: 16,
        },
      },
      {
        label: "發狂雜談三小時，把通訊錄逐一點名",
        chance: 48,
        success: {
          log: "你把已讀不回變成段子。觀眾說這比真正的凸待還好看，古參紛紛自願下次來。",
          fans: 240,
          san: -14,
          talk: 3,
          drama: 12,
        },
        failure: {
          log: "點名點到一半開始真的哭。切片被標成《零人凸待慘劇》，同情票與炎上同時到貨。",
          fans: 60,
          san: -22,
          drama: 22,
        },
      },
    ],
  },
  {
    id: "souls-endurance",
    title: "【魂系】十八小時還在打同一個 Boss",
    description:
      "從太陽出來打到太陽又出來。你的聲音已經不是人聲，彈幕分成『回去睡覺』和『再一隻就過了』。你第 47 次說『這次有感覺』，Boss 的第二階段依舊秒殺你。",
    options: [
      {
        label: "再一隻就過了（認真的）",
        chance: 36,
        success: {
          log: "第 18 小時終於過關。破嗓的『過了——』被做成音MAD，魂系觀眾湧入訂閱。",
          fans: 880,
          san: -24,
          talk: 1,
          tech: 5,
          drama: 8,
        },
        failure: {
          log: "再一隻沒過。你倒在鍵盤上睡著，麥克風錄到輕微的打呼與 Boss 勝利音樂。",
          fans: 120,
          san: -28,
          drama: 6,
        },
      },
      {
        label: "認輸切歌回，用沙啞的聲音唱《炎》",
        chance: 74,
        success: {
          log: "你投降後的沙啞歌回意外治癒。彈幕說『這才是真正的魂』，歌力評價微妙上升。",
          fans: 300,
          san: -6,
          singing: 3,
          drama: 4,
        },
        failure: {
          log: "切歌回後第一句就破音。觀眾以為還在打 Boss，刷起『You Died』。",
          fans: 40,
          san: -14,
          drama: 10,
        },
      },
    ],
  },
  {
    id: "past-account-leak",
    title: "【前世】Twitter 爆料帳號出現了",
    description:
      "一個叫 @vtuber_kurorekishi 的帳號貼出你出道前的巴哈文章：『VTuber 都是電子皮套人，看了會變笨。』底下有人回『所以你後來當了？』。熱搜正在靠近。",
    options: [
      {
        label: "發 3000 字お気持ち表明",
        chance: 55,
        success: {
          log: "長文承認前世黑歷史，結尾寫『那時候的我，還沒被皮套拯救』。轉推爆了，人設反而更立體。",
          fans: 420,
          san: -12,
          talk: 3,
          drama: 16,
        },
        failure: {
          log: "長文被解讀成甩鍋。PTT 出現《又是中之人反省文模板》，炎上值穩定上班。",
          fans: -80,
          san: -20,
          drama: 28,
        },
      },
      {
        label: "自嘲轉迷因：是的，我就是皮套人",
        chance: 78,
        success: {
          log: "你把黑歷史做成封面，標題《變笨成功》。巴哈鄉民反過來守護你，爆料帳號被反串到關站。",
          fans: 560,
          san: -6,
          talk: 2,
          drama: 8,
        },
        failure: {
          log: "自嘲太用力，被說沒有反省。舊帳號更多截圖流出，包含你曾經罵過的那個大手。",
          fans: -40,
          san: -18,
          drama: 24,
        },
      },
    ],
  },
  {
    id: "collab-unfollow-war",
    title: "【大解析時代】同箱通訊錄大亂鬥",
    description:
      "群組有人默默退追。有人截圖『已追蹤』變成『追蹤』。PTT 已經開好八卦文，巴哈有人做了關係圖 Excel。你還在直播唱《アイドル》，彈幕全在問『所以是誰先退的』。",
    options: [
      {
        label: "發文「大家還是好朋友喔♡」",
        chance: 52,
        success: {
          log: "官方聲明意外有效。同箱隔天一起開雜談裝沒事，觀眾罵歸罵，同接卻更高。",
          fans: 200,
          san: -8,
          talk: 2,
          drama: 14,
        },
        failure: {
          log: "『好朋友』三個字成為新迷因。解析帳號把它做成對照表，你被標成『塩対応』。",
          fans: -60,
          san: -16,
          drama: 26,
        },
      },
      {
        label: "關推特一週，只開台不解釋",
        chance: 70,
        success: {
          log: "你選擇當沈默的個人勢。熱度退去後，真正留下來的觀眾說『這才叫專業』。",
          fans: 80,
          san: 6,
          drama: 4,
        },
        failure: {
          log: "沈默被當成默認。大解析文寫到第三頁，你的名字出現在關係圖最中間。",
          fans: -120,
          san: -14,
          drama: 30,
        },
      },
      {
        label: "加入大解析，發 8000 字還原時間線",
        chance: 38,
        success: {
          log: "你的時間線文意外成為百科。有人做成簡報，你被封為『解析區新王』，這大概不算好事。",
          fans: 340,
          san: -18,
          talk: 4,
          drama: 22,
        },
        failure: {
          log: "8000 字裡有一處時間對不上。社群只記得那一處，你從當事人變成新的爆料素材。",
          fans: -150,
          san: -24,
          drama: 34,
        },
      },
    ],
  },
  {
    id: "3d-debut-clipping",
    title: "【3Dお披露目】極限動作後模型崩壞",
    description:
      "台上你跳了自己設計的必殺旋轉。頭髮穿過臉，左手留在原地，裙子變成現代藝術。彈幕齊聲『草』，導播已經不知道該切哪個鏡頭。",
    options: [
      {
        label: "把穿模當賣點，再跳一次",
        chance: 68,
        success: {
          log: "第二次旋轉更崩。你大喊『這就是 3D 的重量』，名場面被做成週年紀念表情貼。",
          fans: 640,
          san: -6,
          singing: 1,
          tech: 2,
          drama: 10,
        },
        failure: {
          log: "再跳一次後模型整顆頭消失。贊助商的 Logo 還掛在空氣中，直播被剪成事故合集。",
          fans: 90,
          san: -14,
          drama: 18,
        },
      },
      {
        label: "立刻切回 2D，假裝什麼都沒發生",
        chance: 60,
        success: {
          log: "你切回 2D 後若無其事繼續唱。古參懂了，新手以為 3D 只是幻覺，意外維持形象。",
          fans: 160,
          san: -4,
          drama: 6,
        },
        failure: {
          log: "切回 2D 時忘關 3D 音效。空蕩的舞台還在播碰撞音，彈幕問『左手還好嗎』。",
          fans: 30,
          san: -12,
          drama: 14,
        },
      },
    ],
  },
  {
    id: "sc-confession-crisis",
    title: "【公關危機】怪人觀眾現場告白",
    description:
      "雜談回突然出現一則超級留言，金額是一個月房租：『我已經買好戒指了，下播後來接你。請當我的嫁。』同接從 800 變成 8000，空氣已死。你的讀 SC 台詞卡在『感謝——』。",
    options: [
      {
        label: "專業公關：感謝支持，但請把推改成守護",
        chance: 66,
        success: {
          log: "你用標準營業拒絕化解告白危機。切片被標成《教科書級讀 SC》，雜談力被肯定。",
          fans: 380,
          san: -8,
          talk: 4,
          drama: 12,
        },
        failure: {
          log: "你緊張到把『守護』說成『結婚可以考慮』。Super Chat 又來一波，公關組（也就是你自己）加班。",
          fans: 140,
          san: -20,
          drama: 24,
        },
      },
      {
        label: "裝沒看到，跳去唸下一則『安安』",
        chance: 44,
        success: {
          log: "你華麗地無視。彈幕幫你擋槍，告白者被刷『待機室見』，你保住了人設與血壓。",
          fans: 120,
          san: -6,
          drama: 8,
        },
        failure: {
          log: "裝沒看到被說塩對応。對方加碼更長的一則，你最後還是得唸，社死值滿點。",
          fans: -30,
          san: -16,
          drama: 20,
        },
      },
    ],
  },
  {
    id: "subathon-1000",
    title: "【耐久】不唱到 1000 訂閱不下播",
    description:
      "歌喉在第六小時開始投降。點歌單上全是《紅蓮華》《夜に駆ける》《炎》。同情票正在湧入，你的 SAN 也正在離開。有人 SC：『再唱一首我就訂閱。』他已經說了十一遍。",
    options: [
      {
        label: "沙啞著繼續唱，用生命換訂閱",
        chance: 42,
        success: {
          log: "第 1000 訂閱進來的那一瞬間你哭著破音。同情票、歌回精華與潤喉糖廣告同時到達。",
          fans: 1000,
          san: -22,
          singing: 4,
          drama: 8,
        },
        failure: {
          log: "歌喉先抵達終點。你改成用氣音說話，被誤認為開了 ASMR，訂閱停在 997。",
          fans: 180,
          san: -26,
          drama: 10,
        },
      },
      {
        label: "改成雜談求訂閱，誠實說嗓子沒了",
        chance: 76,
        success: {
          log: "你放下麥克風喝水。觀眾說『這樣比較像人』，訂閱緩慢但穩定地跨過 1000。",
          fans: 420,
          san: -4,
          talk: 3,
          singing: 1,
        },
        failure: {
          log: "雜談變成抱怨大會。有人退訂說『不是來聽你感冒的』，耐久標題變成反指標。",
          fans: -50,
          san: -12,
          drama: 12,
        },
      },
    ],
  },
  {
    id: "copyright-waiting-room",
    title: "【待機所】BGM 被版權機器人抓走",
    description:
      "你精心挑選的待機曲是《可愛くてごめん》。開台前三分鐘，YouTube 靜音了整段待機室。觀眾進來看見你在無聲的畫面裡瘋狂揮手，字幕只剩自己打的『稍等一下喔』。",
    options: [
      {
        label: "改放自己唱的走音版本頂著",
        chance: 70,
        success: {
          log: "走音待機曲意外成為頻道特色。有人說比原曲更有記憶點，這不算誇獎但也沒辦法。",
          fans: 220,
          san: -4,
          singing: 2,
          tech: 1,
        },
        failure: {
          log: "自己的版本也被判版權。待機室徹底無聲，只剩你的滑鼠點擊，ASMR 非自願出道。",
          fans: 20,
          san: -10,
          drama: 8,
        },
      },
      {
        label: "直接開台，把事故當開場",
        chance: 80,
        success: {
          log: "你一開麥就說『機器人比觀眾早到』。彈幕大刷草，技術力人設從『會用OBS』升級成『會跟版權搏鬥』。",
          fans: 180,
          talk: 2,
          tech: 2,
        },
        failure: {
          log: "開台後發現不只 BGM，連前一場 VOD 也被吃。你花整晚跟 Content ID 互相了解。",
          fans: 10,
          san: -12,
          drama: 10,
        },
      },
    ],
  },
  {
    id: "earthquake-stream",
    title: "【臺灣限定】地震來了還在讀 SC",
    description:
      "畫面開始晃。你下意識說『沒關係沒關係，臺灣的朋友習慣了』。日本觀眾已經在刷『地震？大丈夫？』，你的吊飾在鏡頭前擺成鐘擺， Super Chat 還有三則沒唸。",
    options: [
      {
        label: "先報平安，把觀眾安頓好再繼續",
        chance: 82,
        success: {
          log: "你暫停讀 SC，認真報平安。臺日觀眾都留下了，有人說『這才是在地 VTuber』。",
          fans: 340,
          san: -2,
          talk: 3,
        },
        failure: {
          log: "報平安報到一半又來餘震。你下意識大叫，切片被標成《地震實況，包含真實尖叫》。",
          fans: 90,
          san: -10,
          drama: 8,
        },
      },
      {
        label: "把晃動當特效，繼續營業",
        chance: 46,
        success: {
          log: "你說『這是免費的 3D 舞台效果』。黑色幽默過關，臺灣觀眾笑到訂閱，日本觀眾存了新迷因。",
          fans: 260,
          san: -8,
          talk: 2,
          drama: 10,
        },
        failure: {
          log: "營業途中杯子掉下來。你真實地嚇到破音，被說『不要拿天災開玩笑』，炎上小火慢燉。",
          fans: -70,
          san: -16,
          drama: 20,
        },
      },
    ],
  },
  {
    id: "clip-out-of-context",
    title: "【切り抜き】切片標題黨讓你社死",
    description:
      "你昨天隨口說『我其實不太會唱歌』。今天精華標題是《VTuber 承認自己是假唱》。播放數比你本體高十倍。留言第一則：『沒想到中之人這麼誠實。』",
    options: [
      {
        label: "去切片底下澄清，順便導流本台",
        chance: 62,
        success: {
          log: "你在切片留言『請來看完整的，我真的有在唱（有在走音）』。導流成功，標題黨變成免費廣告。",
          fans: 480,
          san: -6,
          talk: 2,
          singing: 1,
          drama: 10,
        },
        failure: {
          log: "澄清被說心虛。標題黨又出續集《本人親自回應，情況超糟糕》，你開始理解為什麼大手都在躲剪輯。",
          fans: 40,
          san: -14,
          drama: 22,
        },
      },
      {
        label: "接受命運，把假唱當新人設",
        chance: 50,
        success: {
          log: "你下週歌回標題直接寫《假唱專場》。觀眾發現你是認真的，迷因完成閉環。",
          fans: 300,
          san: 4,
          singing: 2,
          drama: 8,
        },
        failure: {
          log: "新人們真的以為你假唱。點歌變少，雜談變多，歌力人設需要重新考證。",
          fans: -40,
          san: -8,
          drama: 12,
        },
      },
    ],
  },
  {
    id: "wrong-screen-share",
    title: "【畫面分享】Discord 私聊全播出",
    description:
      "連動前你想分享遊戲畫面。你點到的是那個叫『不要開台時看』的螢幕：裡面是你跟繪師的對話『這次嘴巴可以再開大一點嗎』，以及購物車裡的十箱泡麵。",
    options: [
      {
        label: "秒關分享，裝成技術事故",
        chance: 58,
        success: {
          log: "你以 0.2 秒的極限操作關掉畫面。彈幕只捕捉到泡麵，技術力傳聞從『會崩』變成『會秒切』。",
          fans: 140,
          san: -8,
          tech: 3,
          drama: 8,
        },
        failure: {
          log: "秒切失敗，私聊往上滾了一頁。觀眾讀到『直播好累想改當繪師』，你的人設出現裂痕。",
          fans: -90,
          san: -18,
          drama: 24,
        },
      },
      {
        label: "坦白：是的，中之人靠泡麵活著",
        chance: 74,
        success: {
          log: "你開箱購物車，把事故變成開箱回。個人勢真實感爆棚，有人 SC 說『我蓋一間泡麵神社』。",
          fans: 320,
          san: -2,
          talk: 3,
          drama: 6,
        },
        failure: {
          log: "坦白後繪師也被挖出來。對方的委託排程被圍觀，你被迫發致歉，關係變得很微妙。",
          fans: 20,
          san: -14,
          drama: 18,
        },
      },
    ],
  },
  {
    id: "new-outfit-wrong-model",
    title: "【新衣裝發表】忘了換模型",
    description:
      "你做了三週預告、抽獎、新封面、新待機圖。開台後你興奮地轉圈，觀眾沉默了三十秒，彈幕才出現：『……這不是上個月那套嗎？』OBS 的模型來源還停在 old_ver_final_最終版_真的最終.moc3。",
    options: [
      {
        label: "立刻換模，順便表演換裝魔術",
        chance: 72,
        success: {
          log: "你在直播中途換裝成功。事故變成彩蛋，新衣裝的第一個名場面是『啊我忘了』。",
          fans: 400,
          san: -4,
          tech: 3,
          drama: 6,
        },
        failure: {
          log: "換模換到崩潰，新衣裝的頭髮變成獨立生物。發表會變成除錯回，繪師在彈幕默默打『……』。",
          fans: 80,
          san: -16,
          drama: 14,
        },
      },
      {
        label: "硬凹：這叫復刻版，懂的都懂",
        chance: 45,
        success: {
          log: "你把舊衣裝講成『精神續作』。老粉笑到訂閱，新粉以為這是概念藝術，意外過關。",
          fans: 180,
          san: -6,
          talk: 3,
          drama: 10,
        },
        failure: {
          log: "硬凹失敗。預購週邊的人問能不能退款，你第一次理解什麼叫『商材事故』。",
          fans: -110,
          san: -14,
          drama: 20,
        },
      },
    ],
  },
  {
    id: "jp-tw-collab-chaos",
    title: "【同箱】中日雙語連動，翻譯組不在",
    description:
      "對方是日本個人勢，你是臺灣個人勢。你說『安安，今天很開心』，對方回『草』。你以為氣氛很好，其實對方聽成『 aman，今日は開金』。彈幕分成兩國頻道，翻譯組今天請假。",
    options: [
      {
        label: "靠肢體語言與『草』完成整場",
        chance: 68,
        success: {
          log: "整場只靠點頭、比讚和草。剪輯標題《無需語言的連動》，臺日觀眾都覺得自己懂了。",
          fans: 360,
          san: -4,
          talk: 2,
          drama: 4,
        },
        failure: {
          log: "你把『すごい』用在不該用的地方。對方笑容凍結，事後推特出現溫柔的『言語の壁は深い』。",
          fans: 40,
          san: -12,
          drama: 14,
        },
      },
      {
        label: "開啟自動翻譯，賭機器人的文采",
        chance: 50,
        success: {
          log: "翻譯把『我很緊張』變成『私は塩です』。雙方笑到破音，這場連動成為國際迷因。",
          fans: 500,
          san: -6,
          talk: 3,
          tech: 1,
          drama: 8,
        },
        failure: {
          log: "機器人把『凸待』譯成『凸待ち処刑』。對方的觀眾開始擔心，你的公關課又來了。",
          fans: -20,
          san: -16,
          drama: 18,
        },
      },
    ],
  },
  {
    id: "cat-keyboard",
    title: "【現場來賓】貓踩鍵盤，SC 金額亂飛",
    description:
      "你的貓走上桌。它先擋住鏡頭，再踩到熱鍵，接著在 Super Chat 輸入框留下『vvvvvvvv』並送出。金額不是你設的。觀眾看見一則來自你自己的 Super Chat：『vvvvvvvv』。",
    options: [
      {
        label: "正式介紹來賓：今晚的真正主角",
        chance: 84,
        success: {
          log: "貓出道成功。訂閱理由出現『為了貓』，你成為自己頻道的第二主角，這是正確的生態位。",
          fans: 460,
          san: 8,
          talk: 2,
        },
        failure: {
          log: "貓在你介紹時把麥克風推下去。接下來二十秒是地板視角與你的真實用詞，VOD 需要剪。",
          fans: 70,
          san: -10,
          drama: 12,
        },
      },
      {
        label: "試圖把貓請下去，維持專業",
        chance: 40,
        success: {
          log: "你成功請下貓，專業形象短暫回歸。彈幕卻開始刷『把貓還來』，你體會到誰才是看板。",
          fans: 60,
          san: -6,
          drama: 4,
        },
        failure: {
          log: "請貓失敗，還打翻水。Live2D 捕捉到你真實的表情，專業形象與鍵盤同時報銷。",
          fans: 20,
          san: -14,
          drama: 10,
        },
      },
    ],
  },
  {
    id: "algorithm-blessing",
    title: "【算法】YouTube 突然把你推給全世界",
    description:
      "你只是在週四下午開平常的雜談。同接從 73 跳到 7300。新手湧入問『這是 Hololive 嗎』『中文？臺灣？』『為什麼待機圖是未上色』。你的準備只有一杯珍奶。",
    options: [
      {
        label: "抓住流量，立刻自我介紹與精華導覽",
        chance: 60,
        success: {
          log: "你用三十秒自我介紹收服新觀眾。演算法的禮物被接住了，隔天訂閱曲線像是在爬魂系樓梯。",
          fans: 1200,
          san: -10,
          talk: 4,
          drama: 6,
        },
        failure: {
          log: "你緊張到只會重複『歡迎歡迎』。新手覺得沒內容，同接退得比來時更快，只留下『已讀』的創傷。",
          fans: 150,
          san: -16,
          drama: 8,
        },
      },
      {
        label: "誠實說：我也不知道為什麼你們會來",
        chance: 78,
        success: {
          log: "這句話成為新的出道宣言。個人勢真實感再次獲勝，有人說『就是要看這種』。",
          fans: 720,
          san: 4,
          talk: 3,
        },
        failure: {
          log: "誠實被當成不會營業。大手切片帳號寫下《流量來了卻不會抓》，你第一次被商業分析。",
          fans: 90,
          san: -8,
          drama: 12,
        },
      },
    ],
  },
  {
    id: "marshmallow-bomb",
    title: "【棉花糖】質問箱被塞了不該出現的題",
    description:
      "你興致勃勃抽棉花糖。第一則：『最喜歡的食物？』第二則：『出道前在哪裡畫過委託？』第三則直接貼了舊帳號網址。彈幕安靜，只有你的滑鼠滾輪聲音。",
    options: [
      {
        label: "跳過爆料題，只回答食物",
        chance: 66,
        success: {
          log: "你堅定地講了十分鐘滷味。觀眾接受『有些棉花糖會過期』，質問箱制度得以保住。",
          fans: 120,
          san: -4,
          talk: 2,
          drama: 6,
        },
        failure: {
          log: "跳過的動作太明顯。截圖流出，標題《讀到第幾則就沉默》，棉花糖變成新的解析材料。",
          fans: -50,
          san: -14,
          drama: 20,
        },
      },
      {
        label: "正面回應：舊帳號是前世，現在是V",
        chance: 54,
        success: {
          log: "你把棉花糖變成出道故事。前世與現世被觀眾整理成時間線，人設完整度上升。",
          fans: 380,
          san: -10,
          talk: 4,
          drama: 12,
        },
        failure: {
          log: "回應時不小心承認太多。隔天出現第二波棉花糖，題目越來越像面試。",
          fans: 30,
          san: -20,
          drama: 26,
        },
      },
    ],
  },
  {
    id: "membership-overshare",
    title: "【メン限】會員限定講太開心",
    description:
      "會員場你太放鬆。你聊了睡眠時間、委託單價、以及『其實昨天那句台詞是讀稿』。下播後會員剪輯流出到公開區，標題叫做《本體比皮套有趣》。",
    options: [
      {
        label: "把外流當預告，公開部分內容",
        chance: 64,
        success: {
          log: "你將外流內容編成『會員精華試吃』。有人因此加入會員，有人說你很會行銷，你自己也不確定。",
          fans: 280,
          san: -6,
          talk: 3,
          drama: 10,
        },
        failure: {
          log: "公開後舊會員覺得不專屬了。退會與新加入同時發生，你的表格出現人生第一次的淨零。",
          fans: -30,
          san: -12,
          drama: 16,
        },
      },
      {
        label: "拜託不要外流，並改掉讀稿習慣",
        chance: 58,
        success: {
          log: "你認真道歉並開始練習不讀稿。雜談變得更亂也更像你，這或許才是升級。",
          fans: 160,
          san: -2,
          talk: 4,
          drama: 4,
        },
        failure: {
          log: "拜託文被截成『果然有讀稿』。下一次公開雜談，彈幕會在你停頓時打『稿呢』。",
          fans: -70,
          san: -14,
          drama: 18,
        },
      },
    ],
  },
  {
    id: "thumbnail-bait",
    title: "【封面詐欺】縮圖比內容刺激十倍",
    description:
      "你用了『淚目』『重大發表』『可能是最後一次』。實際內容是你宣布下週休息一天去看牙醫。點進來的觀眾比平常多，離開的速度也比平常快。",
    options: [
      {
        label: "承認封面詐欺，並真的講一件小事",
        chance: 76,
        success: {
          log: "你承認標題黨，然後認真分享看牙醫的恐懼。奇怪的是這比重大發表更有人看。",
          fans: 200,
          san: 2,
          talk: 3,
          drama: 6,
        },
        failure: {
          log: "承認後被說『果然沒內容』。封面風格被做成迷因模板，之後每張圖都會被問是不是又詐。",
          fans: -40,
          san: -8,
          drama: 14,
        },
      },
      {
        label: "把牙醫升級成『口腔の3Dお披露目』",
        chance: 48,
        success: {
          log: "你把看牙講得像新衣裝發表。黑色幽默過關，有牙醫粉衝進來，頻道定位更加混亂。",
          fans: 260,
          san: -4,
          talk: 2,
          drama: 8,
        },
        failure: {
          log: "升級失敗，被說消費焦慮。你第一次收到『請好好休息』的 Super Chat，心情很複雜。",
          fans: -20,
          san: -10,
          drama: 12,
        },
      },
    ],
  },
  {
    id: "april-fools-graduate",
    title: "【愚人節】宣布畢業，有人當真",
    description:
      "你以為很有趣：發了畢業公告、淚目封面、還錄了『謝謝你們出現在我的三年』。十分鐘後有人開始做感謝剪輯，有人哭著 SC，有人已經在寫維基的畢業頁。今天是 4 月 1 日。",
    options: [
      {
        label: "立刻澄清：愚人節快樂……？",
        chance: 70,
        success: {
          log: "你火速澄清。有人罵，有人笑，播放數卻創了今年新高。愚人節成為你最危險的行銷課。",
          fans: 340,
          san: -10,
          talk: 2,
          drama: 16,
        },
        failure: {
          log: "澄清來得太晚。感謝剪輯已經發布，你看著自己的『遺言』被配上感人 BGM，SAN 直接扣血。",
          fans: 80,
          san: -22,
          drama: 24,
        },
      },
      {
        label: "演到底，隔天再說『還有下一世』",
        chance: 36,
        success: {
          log: "你把愚人節畢業演成回歸劇。有人說太扯，有人說這才是 VTuber。訂閱曲線像心電圖。",
          fans: 700,
          san: -16,
          talk: 3,
          drama: 20,
        },
        failure: {
          log: "演到底的代價是信任。有人真的退訂，留言『不要拿畢業開玩笑』，你把這個梗從年度計畫刪掉。",
          fans: -180,
          san: -24,
          drama: 32,
        },
      },
    ],
  },
  {
    id: "live2d-mouth-desync",
    title: "【技術事故】Live2D 嘴型跟聲音分手",
    description:
      "你在說話，嘴巴不開。你閉上，嘴巴開到最大。彈幕開始配音：『這是當代藝術。』捕捉攝影機對準的可能是你的手，也可能是你的靈魂。",
    options: [
      {
        label: "當場除錯，讓觀眾看個人勢後台",
        chance: 62,
        success: {
          log: "你直播修參數。嘴型對回來的那一刻彈幕歡呼，技術力從迷因變成實力，雖然過程很痛。",
          fans: 240,
          san: -8,
          tech: 4,
          drama: 4,
        },
        failure: {
          log: "越修越崩。最後你只好用『沉默的V』人設撐完整場，ASMR 再次非自願出道。",
          fans: 50,
          san: -14,
          drama: 10,
        },
      },
      {
        label: "放棄同步，改走抽象派口技",
        chance: 80,
        success: {
          log: "你宣布這是新的表演形式。有人做成『嘴巴 independently 營業』迷因，意外的品牌識別誕生。",
          fans: 280,
          san: 2,
          talk: 2,
          tech: 1,
          drama: 6,
        },
        failure: {
          log: "抽象派沒有觀眾緣。新手以為是故障一直重整，同接變成載入動畫。",
          fans: -10,
          san: -8,
          drama: 8,
        },
      },
    ],
  },
  {
    id: "typhoon-stream",
    title: "【颱風假】全臺灣放假，你還是開台",
    description:
      "風很大，雨很大，你的麥克風在收屋頂的聲音。彈幕有人說『不要開了去收衣服』，有人說『颱風天就是要看V』。你的窗戶在唱和聲，比你的歌回還準。",
    options: [
      {
        label: "改成颱風雜談，陪大家度過停電前",
        chance: 82,
        success: {
          log: "你陪觀眾收心。有人邊聽邊關窗戶，這場颱風回意外成為年度最溫柔的雜談。",
          fans: 300,
          san: 6,
          talk: 3,
        },
        failure: {
          log: "雜談到一半真的停電。畫面黑掉前你說『沒關係——』，VOD 停在最有張力的地方。",
          fans: 80,
          san: -10,
          drama: 6,
        },
      },
      {
        label: "硬開歌回，跟窗戶對唱",
        chance: 50,
        success: {
          log: "窗戶的和聲成為本週名場面。有人說這是自然的 3D 音效，你的歌回多了一位固定來賓。",
          fans: 260,
          san: -6,
          singing: 3,
          drama: 4,
        },
        failure: {
          log: "風聲蓋過你的高音。觀眾只聽見氣象局，點歌單變成『請去安全的地方』。",
          fans: 30,
          san: -12,
          drama: 8,
        },
      },
    ],
  },
  {
    id: "merch-shipping-hell",
    title: "【週邊】福袋延遲，親筆簽名還拼錯名",
    description:
      "出貨日過了兩週。有人收到的是空盒，有人收到兩份，有人的簽名被寫成相近的名字。你的 DMs 變成客服中心，而你只是一個會開 OBS 的個人勢。",
    options: [
      {
        label: "公開進度表，一份一份對到完",
        chance: 68,
        success: {
          log: "你用試算表跟觀眾對帳。雖然很累，但『個人勢有在負責』的評價留下來，客服技能非自願升級。",
          fans: 160,
          san: -12,
          talk: 2,
          tech: 2,
          drama: 8,
        },
        failure: {
          log: "進度表有一列對錯。那一列被截圖放大，客服事故變成新的解析文。",
          fans: -80,
          san: -18,
          drama: 22,
        },
      },
      {
        label: "加碼補寄，並在直播公開認錯",
        chance: 74,
        success: {
          log: "你認錯、補寄、還多畫了小卡。錢包在哭，觀眾在原諒，週邊風波勉強收尾。",
          fans: 220,
          san: -8,
          drama: 6,
        },
        failure: {
          log: "補寄後物流再次迷路。你開始懷疑福袋被加上了魂系機制，必須打兩次才會掉落。",
          fans: -40,
          san: -16,
          drama: 16,
        },
      },
    ],
  },
  {
    id: "always-late-stream",
    title: "【開台】遲到一小時，第一句仍是「稍等一下喔」",
    description:
      "待機室從 20:00 等到 21:07。你上線第一句是招牌的『稍等一下喔，麥克風有沒有 OK』。麥克風沒有 OK。彈幕已經準備好了：『準時遲到的個人勢。』",
    options: [
      {
        label: "把遲到編成固定單元：準時的晚點",
        chance: 77,
        success: {
          log: "你宣布以後都會晚點，這叫風格。觀眾把 21:07 寫進日程，你的準時遲到成為品牌。",
          fans: 240,
          san: 4,
          talk: 3,
          drama: 4,
        },
        failure: {
          log: "風格論沒說服到要早起的人。有人退訂留言『我的待機生命不是用來等稍等一下喔』。",
          fans: -60,
          san: -8,
          drama: 10,
        },
      },
      {
        label: "認真道歉，並當場把麥克風調好",
        chance: 70,
        success: {
          log: "你道歉、調麥、準時開始（相對於遲到而言）。專業形象回血，雖然下週可能還是會晚。",
          fans: 120,
          san: -2,
          tech: 2,
        },
        failure: {
          log: "調麥調了二十分鐘。『稍等一下喔』變成這場的主題曲，技術事故與遲到完成雙連擊。",
          fans: 10,
          san: -10,
          drama: 8,
        },
      },
    ],
  },
];
