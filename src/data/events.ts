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
      "待機室還沒開麥，彈幕已經分成兩國語言在吵架。🇹🇼「月月！！四周年快樂——」🇯🇵「草　万定いける」還有人認真問「ここホロライブ？」\n\n快要突破 10,000 訂閱的台灣 VTuber 可樂月月，邀請你參加四周年紀念凸待，一起聊個人勢怎麼活過四年、怎麼跟觀眾一起變老。她的待機圖在閃，你的手在抖。這不是普通連動，這是前輩把麥克風遞給你的瞬間。💌✨",
    options: [
      {
        label: "【穩健】當好後輩，安靜聽月月分享四年來的故事",
        chance: 88,
        success: {
          log: "你幾乎沒搶話，只在該笑的地方笑。彈幕刷「好後輩」「這才叫連動」。月月的觀眾有人留下來看你下次開台。",
          fans: 320,
          san: 8,
          talk: 3,
        },
        failure: {
          log: "你緊張到只會點頭。精華剪輯裡你像一張會眨眼的待機圖，被標成《安靜的凸待家具》。",
          fans: 80,
          san: 2,
        },
      },
      {
        label: "【大聲宣傳】祝賀月月 4 周年快樂！",
        chance: 92,
        success: {
          log: "你在連動裡拼命喊「可樂月月四周年快樂、衝刺萬定！」月月的觀眾湧進待機室，訂閱曲線直接起飛，SAN 也回了一大格。",
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
        label: "【豪賭】當場提議雙人萬定耐久，不達標不下播",
        chance: 34,
        success: {
          log: "你跟月月一起把凸待變成衝刺台。彈幕從「草」變成「訂了訂了」，兩台同接互相餵養，這晚直接寫進雙方年報。",
          fans: 3200,
          san: -16,
          talk: 4,
          drama: 12,
        },
        failure: {
          log: "耐久開到第三小時雙方都開始講疊句。有人說「這不是連動，這是互相消耗」，熱度退去後只剩沙啞。",
          fans: 180,
          san: -22,
          drama: 18,
        },
      },
      {
        label: "【迷因】把彈幕讀成只會喊「月月加油」的讀稿機",
        chance: 52,
        success: {
          log: "你把整場變成應援 vocoded。月月笑到破音，切片標題《後輩是一台應援機器》，抽象但有效。",
          fans: 640,
          san: 4,
          talk: 2,
          drama: 8,
        },
        failure: {
          log: "讀稿機卡在「月月加油」循環。連動變成 ASMR 洗腦，對方觀眾開始擔心你中之人還好嗎。",
          fans: 90,
          san: -8,
          drama: 14,
        },
      },
    ],
  },
  {
    id: "mic_accident",
    title: "【播後事故】忘記關麥克風！",
    description:
      "你以為已經下播。OBS 右下角那顆紅點，其實還在跳。🚪叮咚——外送員的聲音比你的角色設定更真實：「不好意思，魯肉飯不要香菜、去骨、辣椒分開放，對對對吸管也要！」\n\n彈幕瞬間活過來：\n「草」\n「www 中之人好市井」\n「魯肉飯って何」\n「不要香菜是新的結束台詞嗎」\n\n待機室的日文觀眾正在 Google 翻譯『去骨』。你的皮套還在笑，你的靈魂已經在玄關。🍜🎤",
    options: [
      {
        label: "【穩健】秒關 OBS，假裝全世界都沒聽見",
        chance: 86,
        success: {
          log: "你以 0.3 秒極限關台。彈幕只捕捉到『不要香——』，古參當成都市傳說，形象勉強保住。",
          fans: 60,
          san: -4,
          tech: 1,
        },
        failure: {
          log: "關台關到當機。那句『辣椒分開放』被完整錄進 VOD，成為本週最高播放的 8 秒。",
          fans: 20,
          san: -10,
          drama: 12,
        },
      },
      {
        label: "【標準】立刻角色化：這是深夜的戰鬥食物任務",
        chance: 68,
        success: {
          log: "你硬說是設定。彈幕反而愛上『不要香菜』這個新梗，結束畫面被做成表情貼。",
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
        label: "【豪賭】直接破防道歉，順便開箱滷味當 ASMR",
        chance: 36,
        success: {
          log: "你邊道歉邊開箱。咀嚼音意外成為本週最高同接，古參說這才是個人勢，新粉是衝著滷味來的。",
          fans: 720,
          san: -10,
          talk: 4,
          drama: 10,
        },
        failure: {
          log: "道歉途中又對門外大喊『要吸管！』PTT 八卦板已開好標題《又是皮套人破防》。",
          fans: -20,
          san: -18,
          drama: 22,
        },
      },
      {
        label: "【迷因】把「不要香菜」登記成新的結束台詞並申請商標",
        chance: 48,
        success: {
          log: "下週每場結尾你都喊不要香菜。彈幕自動接話，這比『おつパカ』還好記，抽象品牌誕生。",
          fans: 410,
          san: 2,
          talk: 3,
          drama: 8,
        },
        failure: {
          log: "有人真的去查商標。你收到一封很有禮貌的信件，開頭是『關於香菜』，SAN 值微微下降。",
          fans: 70,
          san: -8,
          drama: 16,
        },
      },
    ],
  },
  {
    id: "totsu_disaster",
    title: "【萬粉紀念】凸待……零人？",
    description:
      "你隆重宣布萬粉慶祝凸待。📅待機室放了三小時《夢が咲く春》，通訊錄已讀不回，最後只有一位走錯台的留言：「ここホロライブ？」\n\n彈幕從期待變成考古：\n「通訊錄是空氣嗎」\n「自己跟自己連動吧」\n「零人凸待也是一種神回」\n「www 這就是個人勢」\n\n同接還在，靈魂已經下班。你盯著空的 Discord 通話，第一次理解什麼叫『待機室比正片熱鬧』。📞💔",
    options: [
      {
        label: "【穩健】取消凸待，改成 Super Chat 感謝回",
        chance: 90,
        success: {
          log: "你誠實說前輩們可能在睡覺。感謝回很溫柔，有人 SC：『零人也沒關係，我們在。』",
          fans: 180,
          san: 6,
          talk: 2,
        },
        failure: {
          log: "取消文被解讀成『沒人緣還怪別人』。你只是想好好結束，標題黨已經寫好《萬粉孤獨》。",
          fans: -30,
          san: -8,
          drama: 12,
        },
      },
      {
        label: "【標準】分飾兩角，自己跟自己連動",
        chance: 64,
        success: {
          log: "你切兩個模型互虧。剪輯標題變成《孤獨的神回》，意外出圈，凸待失敗學成了新流派。",
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
        label: "【豪賭】發狂雜談三小時，把通訊錄逐一點名",
        chance: 32,
        success: {
          log: "你把已讀不回變成段子。觀眾說這比真正的凸待還好看，隔天真的有人傳訊說下次會來。",
          fans: 680,
          san: -20,
          talk: 5,
          drama: 18,
        },
        failure: {
          log: "點名點到一半開始真的哭。切片被標成《零人凸待慘劇》，同情票與炎上同時到貨。",
          fans: 60,
          san: -26,
          drama: 24,
        },
      },
      {
        label: "【迷因】把空通話畫面做成『當代藝術：等待』並收門票",
        chance: 50,
        success: {
          log: "你宣布這是行為藝術。有人真的 SC 買票，彈幕開始用藝評口吻分析你的孤獨，抽象勝利。",
          fans: 360,
          san: 4,
          talk: 2,
          drama: 8,
        },
        failure: {
          log: "藝術論沒人買帳。待機 BGM 播完第三輪，同接剩下機器人與一位還在問是不是 Hololive 的人。",
          fans: 10,
          san: -12,
          drama: 10,
        },
      },
    ],
  },
  {
    id: "souls-endurance",
    title: "【魂系】十八小時還在打同一個 Boss",
    description:
      "從太陽出來打到太陽又出來。☀️🌙 你的聲音已經不是人聲。第 47 次『這次有感覺』，Boss 第二階段依舊秒殺你。\n\n彈幕分裂成兩個宗教：\n「回去睡覺」\n「再一隻就過了」\n「You Died 是結束畫面也是人生」\n「SAN 值看起來比 HP 低」\n\n你的手把在發光，你的喉嚨在報銷。魂系觀眾還在，你的中之人已經在讀檔。⚔️💀",
    options: [
      {
        label: "【穩健】認輸切歌回，用沙啞的聲音唱《炎》",
        chance: 84,
        success: {
          log: "投降後的沙啞歌回意外治癒。彈幕說『這才是真正的魂』，歌力評價微妙上升。",
          fans: 300,
          san: -4,
          singing: 3,
          drama: 4,
        },
        failure: {
          log: "切歌回後第一句就破音。觀眾以為還在打 Boss，刷起『You Died』。",
          fans: 40,
          san: -12,
          drama: 10,
        },
      },
      {
        label: "【標準】喝水、看攻略、用大腦打而不是用生命",
        chance: 66,
        success: {
          log: "你終於打開攻略。十分鐘後過關，彈幕罵你為什麼不早點看，但還是刷了訂閱。",
          fans: 240,
          san: -6,
          tech: 2,
          talk: 1,
        },
        failure: {
          log: "攻略是英文的，你邊打邊翻譯邊死。技術力沒升，只升了對自動翻譯的仇恨。",
          fans: 50,
          san: -14,
          drama: 6,
        },
      },
      {
        label: "【豪賭】再一隻就過了（認真的，第 48 次）",
        chance: 28,
        success: {
          log: "第 18 小時終於過關。破嗓的『過了——』被做成音MAD，魂系觀眾湧入訂閱。",
          fans: 1100,
          san: -26,
          tech: 5,
          drama: 8,
        },
        failure: {
          log: "再一隻沒過。你倒在鍵盤上睡著，麥克風錄到輕微的打呼與 Boss 勝利音樂。",
          fans: 120,
          san: -30,
          drama: 6,
        },
      },
      {
        label: "【迷因】把每次死亡編成拍子，做成《You Died 交響曲》",
        chance: 46,
        success: {
          log: "死亡音效對上了 BPM。有人當成音樂台進來，你成為最痛苦的節奏遊戲實況者。",
          fans: 480,
          san: -8,
          singing: 2,
          tech: 2,
          drama: 6,
        },
        failure: {
          log: "你數拍子數到走音。Boss 不配合你的編曲，彈幕只留下『請回去打遊戲』。",
          fans: 30,
          san: -16,
          drama: 8,
        },
      },
    ],
  },
  {
    id: "past-account-leak",
    title: "【前世】Twitter 爆料帳號出現了",
    description:
      "一個叫 @vtuber_kurorekishi 的帳號貼出你出道前的巴哈文章：『VTuber 都是電子皮套人，看了會變笨。』底下第一則回覆：『所以你後來當了？』👍🔥\n\n彈幕開始考古：\n「前世好毒」\n「這叫命運的迴旋」\n「電子皮套人現在就是你」\n「お気持ち表明準備好了嗎」\n\n熱搜正在靠近。你的現世還在唱《アイドル》，你的前世已經在被告。📜",
    options: [
      {
        label: "【穩健】裝死一週，只開台不解釋",
        chance: 82,
        success: {
          log: "你選擇當沈默的個人勢。熱度退去後，留下來的觀眾說『這才叫專業』。",
          fans: 90,
          san: 4,
          drama: 4,
        },
        failure: {
          log: "沈默被當成默認。解析文寫到第三頁，你的名字出現在關係圖最中間。",
          fans: -90,
          san: -12,
          drama: 26,
        },
      },
      {
        label: "【標準】自嘲轉迷因：是的，我就是皮套人",
        chance: 70,
        success: {
          log: "你把黑歷史做成封面《變笨成功》。巴哈鄉民反過來守護你，爆料帳號被反串到關站。",
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
      {
        label: "【豪賭】發 3000 字お気持ち表明，把前世講成出道故事",
        chance: 38,
        success: {
          log: "長文結尾寫『那時候的我，還沒被皮套拯救』。轉推爆了，人設反而更立體。",
          fans: 640,
          san: -14,
          talk: 4,
          drama: 18,
        },
        failure: {
          log: "長文被解讀成甩鍋。PTT 出現《又是中之人反省文模板》，炎上值穩定上班。",
          fans: -80,
          san: -22,
          drama: 30,
        },
      },
      {
        label: "【迷因】開台只讀那篇黑歷史，並逐句吐槽過去的自己",
        chance: 54,
        success: {
          log: "你把爆料文變成讀稿回。彈幕笑到訂閱，前世與現世完成同台，這很抽象但很有效。",
          fans: 420,
          san: -4,
          talk: 3,
          drama: 10,
        },
        failure: {
          log: "吐槽到一半你開始同意前世。觀眾困惑地看完一場自我辯論，標題變成《VTuber 討厭 VTuber》。",
          fans: 40,
          san: -14,
          drama: 16,
        },
      },
    ],
  },
  {
    id: "collab-unfollow-war",
    title: "【大解析時代】同箱通訊錄大亂鬥",
    description:
      "群組有人默默退追。有人截圖『已追蹤』變成『追蹤』。PTT 已經開好八卦文，巴哈有人做了關係圖 Excel。📊💥\n\n你還在直播唱《アイドル》，彈幕全在問：\n「所以是誰先退的」\n「大解析開始了」\n「好朋友♡ 準備好了嗎」\n「塩対応？」\n\n同箱的空氣比待機室更安靜。你的通訊錄正在變成史料。📱",
    options: [
      {
        label: "【穩健】關推特一週，只開台不解釋",
        chance: 84,
        success: {
          log: "你選擇當沈默的個人勢。熱度退去後，真正留下來的觀眾說這才叫專業。",
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
        label: "【標準】發文「大家還是好朋友喔♡」",
        chance: 58,
        success: {
          log: "官方聲明意外有效。同箱隔天一起開雜談裝沒事，觀眾罵歸罵，同接卻更高。",
          fans: 200,
          san: -8,
          talk: 2,
          drama: 14,
        },
        failure: {
          log: "『好朋友』三個字成為新迷因。解析帳號把它做成對照表，你被標成塩対応。",
          fans: -60,
          san: -16,
          drama: 26,
        },
      },
      {
        label: "【豪賭】加入大解析，發 8000 字還原時間線",
        chance: 30,
        success: {
          log: "你的時間線文意外成為百科。有人做成簡報，你被封為解析區新王，這大概不算好事。",
          fans: 420,
          san: -20,
          talk: 4,
          drama: 28,
        },
        failure: {
          log: "8000 字裡有一處時間對不上。社群只記得那一處，你從當事人變成新的爆料素材。",
          fans: -160,
          san: -26,
          drama: 36,
        },
      },
      {
        label: "【迷因】開台只唱《朋友》，並把歌詞對應到每個退追的人",
        chance: 44,
        success: {
          log: "你把歌回變成點名回。抽象、殘忍、又很好笑，切片在兩國同時轉。",
          fans: 380,
          san: -8,
          singing: 2,
          talk: 2,
          drama: 16,
        },
        failure: {
          log: "對到第三個名字時你自己也難過了。歌回變成告解室，彈幕請你去休息。",
          fans: 20,
          san: -18,
          drama: 20,
        },
      },
    ],
  },
  {
    id: "3d-debut-clipping",
    title: "【3Dお披露目】極限動作後模型崩壞",
    description:
      "台上你跳了自己設計的必殺旋轉。💫 頭髮穿過臉，左手留在原地，裙子變成現代藝術。導播已經不知道該切哪個鏡頭。\n\n彈幕齊聲：\n「草」\n「左手還好嗎」\n「這就是 3D 的重量」\n「當代藝術＋1」\n\n贊助商 Logo 還掛在你消失的肩膀上。這是披露會，也是物理引擎的葬禮。💃🦴",
    options: [
      {
        label: "【穩健】立刻切回 2D，假裝什麼都沒發生",
        chance: 86,
        success: {
          log: "你切回 2D 後若無其事繼續唱。古參懂了，新手以為 3D 只是幻覺，意外維持形象。",
          fans: 160,
          san: -4,
          drama: 6,
        },
        failure: {
          log: "切回 2D 時忘關 3D 音效。空蕩的舞台還在播碰撞音，彈幕問左手還好嗎。",
          fans: 30,
          san: -12,
          drama: 14,
        },
      },
      {
        label: "【標準】把穿模當賣點，再跳一次",
        chance: 64,
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
        label: "【豪賭】當場承認建模是自己，並直播修模到修好",
        chance: 33,
        success: {
          log: "除錯回意外成為技術力證明。修好的那一刻彈幕歡呼，你從事故主角變成工程師。",
          fans: 780,
          san: -18,
          tech: 6,
          drama: 8,
        },
        failure: {
          log: "越修越崩。披露會變成四小時 Blender 教學，觀眾學到了什麼是權重塗壞。",
          fans: 70,
          san: -22,
          drama: 16,
        },
      },
      {
        label: "【迷因】宣布左手獨立出道，並幫它開分台",
        chance: 47,
        success: {
          log: "左手帳號真的有人追。你的 3D 事故變成最便宜的新角色開發案，抽象商才。",
          fans: 500,
          san: 2,
          talk: 2,
          drama: 12,
        },
        failure: {
          log: "左手沒有人設也沒有麥克風。分台只有碰撞音，被說消費事故，你把帳號默默刪了。",
          fans: 40,
          san: -10,
          drama: 14,
        },
      },
    ],
  },
  {
    id: "sc-confession-crisis",
    title: "【公關危機】怪人觀眾現場告白",
    description:
      "雜談回突然出現一則超級留言，金額是一個月房租。💍『我已經買好戒指了，下播後來接你。請當我的嫁。』同接從 800 變成 8000，空氣已死。\n\n彈幕分裂：\n「報警」\n「祝福？」\n「讀出來啊」\n「公關組（你自己）加油」\n\n你的讀 SC 台詞卡在『感謝——』。這不是營業，這是現場危機處理考。🚨💗",
    options: [
      {
        label: "【穩健】專業公關：感謝支持，但請把推改成守護",
        chance: 84,
        success: {
          log: "你用標準營業拒絕化解告白危機。切片被標成《教科書級讀 SC》，雜談力被肯定。",
          fans: 380,
          san: -6,
          talk: 4,
          drama: 10,
        },
        failure: {
          log: "你緊張到把『守護』說成『結婚可以考慮』。Super Chat 又來一波，公關組加班。",
          fans: 140,
          san: -18,
          drama: 22,
        },
      },
      {
        label: "【標準】裝沒看到，跳去唸下一則『安安』",
        chance: 60,
        success: {
          log: "你華麗地無視。彈幕幫你擋槍，告白者被刷『待機室見』，你保住了人設與血壓。",
          fans: 140,
          san: -4,
          drama: 8,
        },
        failure: {
          log: "裝沒看到被說塩対応。對方加碼更長的一則，你最後還是得唸，社死值滿點。",
          fans: -30,
          san: -16,
          drama: 20,
        },
      },
      {
        label: "【豪賭】把這則 SC 變成整場主題，開『界線講座』",
        chance: 35,
        success: {
          log: "你認真講推與守護的差別。意外成為本月最有營養的雜談，有人說這台有社會責任。",
          fans: 620,
          san: -12,
          talk: 5,
          drama: 16,
        },
        failure: {
          log: "講座開成說教。告白者覺得被公開處刑，留言區變成修羅場，你第一次請人幫忙看留言。",
          fans: -70,
          san: -20,
          drama: 28,
        },
      },
      {
        label: "【迷因】用唱歌回答：點播《紅蓮華》然後不解釋",
        chance: 50,
        success: {
          log: "你唱完一句就繼續雜談。彈幕完成了所有解讀，你什麼都沒承認，這叫高階營業。",
          fans: 300,
          san: -2,
          singing: 2,
          drama: 8,
        },
        failure: {
          log: "你選錯歌，唱成《告白氣球》。公關危機升級成音樂危機，彈幕已經在寫婚書。",
          fans: 80,
          san: -14,
          drama: 18,
        },
      },
    ],
  },
  {
    id: "subathon-1000",
    title: "【耐久】不唱到 1000 訂閱不下播",
    description:
      "歌喉在第六小時開始投降。點歌單上全是《紅蓮華》《夜に駆ける》《炎》。有人 SC：『再唱一首我就訂閱。』他已經說了十一遍。🥹🎤\n\n彈幕在接力：\n「喝水」\n「997 了」\n「同情票準備中」\n「這不是歌回這是馬拉松」\n\n你的 SAN 正在離開，訂閱曲線正在爬樓梯。潤喉糖已經從道具變成信仰。🔥",
    options: [
      {
        label: "【穩健】改成雜談求訂閱，誠實說嗓子沒了",
        chance: 86,
        success: {
          log: "你放下麥克風喝水。觀眾說這樣比較像人，訂閱緩慢但穩定地跨過 1000。",
          fans: 420,
          san: -2,
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
      {
        label: "【標準】沙啞著繼續唱，用生命換訂閱",
        chance: 55,
        success: {
          log: "第 1000 訂閱進來的那一瞬間你哭著破音。同情票、歌回精華與潤喉糖廣告同時到達。",
          fans: 1000,
          san: -20,
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
        label: "【豪賭】宣布沒到 1000 就唱到明天早上",
        chance: 30,
        success: {
          log: "你真的唱到天亮。太陽出來時訂閱破千，你的聲音留下了永久的回憶與輕微的沙啞人設。",
          fans: 1600,
          san: -28,
          singing: 5,
          drama: 12,
        },
        failure: {
          log: "早上你已經不成人聲。觀眾開始勸退，耐久變成社會事件，你被請去睡覺。",
          fans: 90,
          san: -32,
          drama: 16,
        },
      },
      {
        label: "【迷因】改唱自己的待機 BGM，單曲循環到訂閱自己來",
        chance: 48,
        success: {
          log: "待機曲被唱成洗腦神曲。有人為了讓你停下來而訂閱，這是一種很有效的威脅。",
          fans: 540,
          san: -6,
          singing: 2,
          drama: 6,
        },
        failure: {
          log: "單曲循環被版權機器人靜音。耐久變成默劇，你只能用字幕求訂閱。",
          fans: 40,
          san: -14,
          drama: 8,
        },
      },
    ],
  },
  {
    id: "copyright-waiting-room",
    title: "【待機所】BGM 被版權機器人抓走",
    description:
      "你精心挑選的待機曲是《可愛くてごめん》。開台前三分鐘，YouTube 靜音了整段待機室。😶觀眾進來看見你在無聲的畫面裡瘋狂揮手，字幕只剩自己打的『稍等一下喔』。\n\n彈幕：\n「機器人比觀眾早到」\n「這是現代藝術嗎」\n「麥克風有沒有 OK（沒有聲音可以證明）」\n\nContent ID 比你的觀眾更準時。🎧🤖",
    options: [
      {
        label: "【穩健】直接開台，把事故當開場",
        chance: 88,
        success: {
          log: "你一開麥就說機器人比觀眾早到。彈幕大刷草，技術力人設從會用 OBS 升級成會跟版權搏鬥。",
          fans: 180,
          talk: 2,
          tech: 2,
        },
        failure: {
          log: "開台後發現連前一場 VOD 也被吃。你花整晚跟 Content ID 互相了解。",
          fans: 10,
          san: -12,
          drama: 10,
        },
      },
      {
        label: "【標準】改放自己唱的走音版本頂著",
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
        label: "【豪賭】當下申訴，並直播跟機器人對線",
        chance: 32,
        success: {
          log: "你邊開台邊填申訴表。意外過關，這場成為『個人勢 vs 資本主義』名場面。",
          fans: 560,
          san: -10,
          tech: 4,
          talk: 2,
          drama: 8,
        },
        failure: {
          log: "申訴被秒拒。你在直播中唸拒絕信，氣氛像讀訃聞，待機室依然沒有聲音。",
          fans: 30,
          san: -16,
          drama: 12,
        },
      },
      {
        label: "【迷因】宣布進入『無聲時代』，整場只用彈幕交流",
        chance: 50,
        success: {
          log: "你把事故變成沈默遊戲。彈幕自己完成整場雜談，你成為最安靜的 V，反而有人愛上。",
          fans: 300,
          san: 4,
          talk: 1,
          drama: 4,
        },
        failure: {
          log: "無聲時代持續太久。新手以為當機一直重整，同接變成載入動畫。",
          fans: -10,
          san: -8,
          drama: 8,
        },
      },
    ],
  },
  {
    id: "earthquake-stream",
    title: "【臺灣限定】地震來了還在讀 SC",
    description:
      "畫面開始晃。你下意識說『沒關係沒關係，臺灣的朋友習慣了』。🇯🇵 觀眾已經在刷『地震？大丈夫？』你的吊飾在鏡頭前擺成鐘擺，Super Chat 還有三則沒唸。🌏🔔\n\n彈幕：\n「先報平安」\n「杯子！杯子！」\n「這是免費 3D 舞台效果嗎」\n「中之人去桌底下」\n\n你的角色還在營業笑，你的房間正在參加地震實況。",
    options: [
      {
        label: "【穩健】先報平安，把觀眾安頓好再繼續",
        chance: 90,
        success: {
          log: "你暫停讀 SC，認真報平安。臺日觀眾都留下了，有人說這才是在地 VTuber。",
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
        label: "【標準】把晃動當特效，繼續營業",
        chance: 52,
        success: {
          log: "你說這是免費的 3D 舞台效果。黑色幽默過關，臺灣觀眾笑到訂閱，日本觀眾存了新迷因。",
          fans: 260,
          san: -8,
          talk: 2,
          drama: 10,
        },
        failure: {
          log: "營業途中杯子掉下來。你真實地嚇到破音，被說不要拿天災開玩笑，炎上小火慢燉。",
          fans: -70,
          san: -16,
          drama: 20,
        },
      },
      {
        label: "【豪賭】改成防災宣導回，把 SC 預算拿去講避難包",
        chance: 40,
        success: {
          log: "雜談變成防災課。有人說學到了，有人說這台太台灣，訂閱理由出現『因為地震』。",
          fans: 480,
          san: -6,
          talk: 4,
          drama: 6,
        },
        failure: {
          log: "宣導太長，像在上課。有人退到別台看唱歌，你的避難包比同接還滿。",
          fans: 40,
          san: -10,
          drama: 8,
        },
      },
      {
        label: "【迷因】跟著吊飾的節奏點頭，把地震當 BPM",
        chance: 46,
        success: {
          log: "你把晃動編成即興歌回。彈幕給 BPM，這是全世界最不該成功的節奏遊戲。",
          fans: 310,
          san: -6,
          singing: 2,
          drama: 8,
        },
        failure: {
          log: "你點頭點到暈。日本觀眾以為你在開玩笑，臺灣觀眾請你去安全的地方，兩頭不是人。",
          fans: -20,
          san: -14,
          drama: 14,
        },
      },
    ],
  },
  {
    id: "clip-out-of-context",
    title: "【切り抜き】切片標題黨讓你社死",
    description:
      "你昨天隨口說『我其實不太會唱歌』。今天精華標題是《VTuber 承認自己是假唱》。播放數比你本體高十倍。📈💔\n\n留言第一則：『沒想到中之人這麼誠實。』\n彈幕本尊台：\n「那不是那個意思」\n「切片又來了」\n「導流還是社死？」\n「封面詐欺的親戚出現了」\n\n你點進去，看到自己的臉被配上悲傷 BGM。🎬",
    options: [
      {
        label: "【穩健】去切片底下澄清，順便導流本台",
        chance: 72,
        success: {
          log: "你留言『請來看完整的，我真的有在唱（有在走音）』。導流成功，標題黨變成免費廣告。",
          fans: 480,
          san: -6,
          talk: 2,
          singing: 1,
          drama: 10,
        },
        failure: {
          log: "澄清被說心虛。標題黨又出續集《本人親自回應，情況超糟糕》。",
          fans: 40,
          san: -14,
          drama: 22,
        },
      },
      {
        label: "【標準】接受命運，把假唱當新人設",
        chance: 60,
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
      {
        label: "【豪賭】做一支更標題黨的自製精華反擊",
        chance: 34,
        success: {
          log: "你的自製切片比對方還扯。演算法愛慘了你，你成為自己的剪輯帳號，流量留下了。",
          fans: 900,
          san: -12,
          talk: 3,
          tech: 2,
          drama: 14,
        },
        failure: {
          log: "自製精華被說更假。兩支片子互相報導，你被捲進自己的資訊戰。",
          fans: 20,
          san: -18,
          drama: 24,
        },
      },
      {
        label: "【迷因】之後每句話後面都加『以上內容請完整觀看』",
        chance: 56,
        success: {
          log: "這句話成為新口癖。切片帳號開始怕你，觀眾當成防盜浮水印，意外有效。",
          fans: 220,
          san: 2,
          talk: 2,
          drama: 6,
        },
        failure: {
          log: "口癖太長，雜談變得很難聽。有人做成喝令音，你自己也被洗腦。",
          fans: 50,
          san: -8,
          drama: 8,
        },
      },
    ],
  },
  {
    id: "wrong-screen-share",
    title: "【畫面分享】Discord 私聊全播出",
    description:
      "連動前你想分享遊戲畫面。你點到的是那個叫『不要開台時看』的螢幕：裡面是你跟繪師的對話『這次嘴巴可以再開大一點嗎』，以及購物車裡的十箱泡麵。🍜🖥️\n\n彈幕已讀：\n「泡麵神社成立」\n「嘴巴開大一點 www」\n「中之人靠這個活著」\n「秒切！秒切！」\n\n你的滑鼠在顫抖，私聊還在往上滾。",
    options: [
      {
        label: "【穩健】秒關分享，裝成技術事故",
        chance: 78,
        success: {
          log: "你以 0.2 秒極限操作關掉畫面。彈幕只捕捉到泡麵，技術力傳聞從會崩變成會秒切。",
          fans: 140,
          san: -8,
          tech: 3,
          drama: 8,
        },
        failure: {
          log: "秒切失敗，私聊往上滾了一頁。觀眾讀到『直播好累想改當繪師』，人設出現裂痕。",
          fans: -90,
          san: -18,
          drama: 24,
        },
      },
      {
        label: "【標準】坦白：是的，中之人靠泡麵活著",
        chance: 70,
        success: {
          log: "你開箱購物車，把事故變成開箱回。個人勢真實感爆棚，有人 SC 說要蓋一間泡麵神社。",
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
      {
        label: "【豪賭】把購物車直播結帳，讓觀眾決定你今晚吃什麼",
        chance: 36,
        success: {
          log: "觀眾把泡麵加成一個月份。這場成為最昂貴的互動回，也是最真實的個人勢。",
          fans: 700,
          san: -8,
          talk: 3,
          drama: 10,
        },
        failure: {
          log: "購物車被加進奇怪的東西。你結帳前才看見，信用卡與人設同時報銷。",
          fans: 80,
          san: -16,
          drama: 16,
        },
      },
      {
        label: "【迷因】對繪師對話逐條現場回覆，開成委託進度說明會",
        chance: 48,
        success: {
          log: "你把事故變成製作花絮。觀眾第一次理解嘴巴為什麼要開那麼大，技術向粉絲增加。",
          fans: 260,
          san: -4,
          tech: 2,
          talk: 2,
          drama: 6,
        },
        failure: {
          log: "說明會變成你跟繪師的公開審核。彈幕開始給建模意見，你的 DMs 爆炸。",
          fans: 40,
          san: -12,
          drama: 14,
        },
      },
    ],
  },
  {
    id: "new-outfit-wrong-model",
    title: "【新衣裝發表】忘了換模型",
    description:
      "你做了三週預告、抽獎、新封面、新待機圖。開台後你興奮地轉圈，觀眾沉默了三十秒，彈幕才出現：『……這不是上個月那套嗎？』👗😅\n\nOBS 的模型來源還停在 `old_ver_final_最終版_真的最終.moc3`。\n「復刻？」\n「精神續作」\n「繪師在彈幕打……」\n「這就是個人勢」\n\n新衣裝在資料夾裡哭泣。",
    options: [
      {
        label: "【穩健】立刻換模，順便表演換裝魔術",
        chance: 80,
        success: {
          log: "你在直播中途換裝成功。事故變成彩蛋，新衣裝的第一個名場面是『啊我忘了』。",
          fans: 400,
          san: -4,
          tech: 3,
          drama: 6,
        },
        failure: {
          log: "換模換到崩潰，新衣裝的頭髮變成獨立生物。發表會變成除錯回，繪師在彈幕默默打……",
          fans: 80,
          san: -16,
          drama: 14,
        },
      },
      {
        label: "【標準】硬凹：這叫復刻版，懂的都懂",
        chance: 50,
        success: {
          log: "你把舊衣裝講成精神續作。老粉笑到訂閱，新粉以為這是概念藝術，意外過關。",
          fans: 180,
          san: -6,
          talk: 3,
          drama: 10,
        },
        failure: {
          log: "硬凹失敗。預購週邊的人問能不能退款，你第一次理解什麼叫商材事故。",
          fans: -110,
          san: -14,
          drama: 20,
        },
      },
      {
        label: "【豪賭】當場宣布舊衣裝畢業，新衣裝改下周，今晚改成告別回",
        chance: 34,
        success: {
          log: "告別回意外催淚。舊衣裝得到了它應得的燈光，新衣裝預告熱度不減反增。",
          fans: 640,
          san: -10,
          talk: 3,
          singing: 1,
          drama: 8,
        },
        failure: {
          log: "觀眾覺得被放鴿子。抽獎與預告全部延期，你的時程表開始過著魂系人生。",
          fans: -80,
          san: -16,
          drama: 18,
        },
      },
      {
        label: "【迷因】把檔名念出來當咒語：最終版真的最終",
        chance: 58,
        success: {
          log: "檔名成為新迷因。之後每次更新模型，彈幕都會要求你念咒，這是一種很煩的傳統。",
          fans: 240,
          san: 2,
          tech: 1,
          talk: 2,
          drama: 6,
        },
        failure: {
          log: "咒語太長唸錯。模型還是舊的，你只是多了一段沒人想看的讀檔 ASMR。",
          fans: 20,
          san: -8,
          drama: 8,
        },
      },
    ],
  },
  {
    id: "jp-tw-collab-chaos",
    title: "【同箱】中日雙語連動，翻譯組不在",
    description:
      "對方是日本個人勢，你是臺灣個人勢。你說『安安，今天很開心』，對方回『草』。你以為氣氛很好，其實對方聽成完全另一件事。🌏💬\n\n彈幕分成兩個頻道：\n🇹🇼「她聽不懂啦」\n🇯🇵「台湾の方ですね」\n「翻譯組今天請假」\n「草　草　草」\n\n語言的牆比綠幕還厚。你只能點頭、比讚，還有草。🌿",
    options: [
      {
        label: "【穩健】靠肢體語言與『草』完成整場",
        chance: 82,
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
        label: "【標準】開啟自動翻譯，賭機器人的文采",
        chance: 56,
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
      {
        label: "【豪賭】改用臺語＋關西腔互嗆，看誰先投降",
        chance: 30,
        success: {
          log: "誰都聽不懂，所以大家都在笑。這場成為年度最混亂連動，播放數卻莫名其妙地高。",
          fans: 820,
          san: -12,
          talk: 4,
          drama: 14,
        },
        failure: {
          log: "互嗆被聽成互罵。事後兩邊粉絲開始翻譯戰，你學會了什麼叫國際炎上。",
          fans: -100,
          san: -20,
          drama: 26,
        },
      },
      {
        label: "【迷因】兩人改用只有 Emoji 的讀 SC",
        chance: 50,
        success: {
          log: "🎉🔥草✨ 成為你們的共同語言。切片不需要字幕，這是全球化的終極解答。",
          fans: 340,
          san: 4,
          talk: 1,
          drama: 6,
        },
        failure: {
          log: "Emoji 被讀成不同意思。你比了愛心，對方以為在喊暫停，連動在溫柔的誤會中結束。",
          fans: 60,
          san: -8,
          drama: 10,
        },
      },
    ],
  },
  {
    id: "cat-keyboard",
    title: "【現場來賓】貓踩鍵盤，SC 金額亂飛",
    description:
      "你的貓走上桌。它先擋住鏡頭，再踩到熱鍵，接著在 Super Chat 輸入框留下『vvvvvvvv』並送出。金額不是你設的。🐱💸\n\n觀眾看見一則來自你自己的 Super Chat：vvvvvvvv\n「把貓還來」\n「真正的主角出現了」\n「今晚的看板是誰？」\n「專業形象已讀不回」\n\n你成為自己頻道的第二主角，這是正確的生態位。",
    options: [
      {
        label: "【穩健】正式介紹來賓：今晚的真正主角",
        chance: 90,
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
        label: "【標準】試圖把貓請下去，維持專業",
        chance: 42,
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
      {
        label: "【豪賭】幫貓開分台，宣布雙人經營",
        chance: 33,
        success: {
          log: "貓的分台比你先被推薦。你迅速接受命運，成為最成功的寵物 V 經紀。",
          fans: 880,
          san: 4,
          talk: 2,
          drama: 8,
        },
        failure: {
          log: "分台沒人看，本台的人覺得你在逃避。貓踩完鍵盤就走了，你獨自面對雙倍的待機室。",
          fans: -40,
          san: -12,
          drama: 10,
        },
      },
      {
        label: "【迷因】把 vvvvvvvv 解釋成新的結束咒語並帶觀眾一起念",
        chance: 58,
        success: {
          log: "vvvvvvvv 成為結束畫面。比任何設計過的台詞都好記，貓是你最好的企劃。",
          fans: 300,
          san: 6,
          talk: 2,
          drama: 4,
        },
        failure: {
          log: "咒語太長，讀 SC 系統開始誤判。你的錢包與彈幕同時出現 v，這不是迷因這是事故。",
          fans: 40,
          san: -8,
          drama: 12,
        },
      },
    ],
  },
  {
    id: "algorithm-blessing",
    title: "【算法】YouTube 突然把你推給全世界",
    description:
      "你只是在週四下午開平常的雜談。同接從 73 跳到 7300。新手湧入問『這是 Hololive 嗎』『中文？臺灣？』『為什麼待機圖是未上色』。你的準備只有一杯珍奶。🧋📈\n\n彈幕刷新速度快到像在攻擊：\n「安安？」\n「誰？」\n「推薦來的」\n「稍等一下喔（經典）」\n\n演算法的禮物很重，你的稿只有『歡迎歡迎』。",
    options: [
      {
        label: "【穩健】誠實說：我也不知道為什麼你們會來",
        chance: 84,
        success: {
          log: "這句話成為新的出道宣言。個人勢真實感再次獲勝，有人說就是要看這種。",
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
      {
        label: "【標準】抓住流量，立刻自我介紹與精華導覽",
        chance: 62,
        success: {
          log: "你用三十秒自我介紹收服新觀眾。演算法的禮物被接住了，隔天訂閱曲線像在爬魂系樓梯。",
          fans: 1200,
          san: -10,
          talk: 4,
          drama: 6,
        },
        failure: {
          log: "你緊張到只會重複歡迎歡迎。新手覺得沒內容，同接退得比來時更快。",
          fans: 150,
          san: -16,
          drama: 8,
        },
      },
      {
        label: "【豪賭】立刻切歌回，用一首歌定生死",
        chance: 28,
        success: {
          log: "你唱對了那一首。推薦來的人留下，這晚的精華會被看十年，嗓子也會被記得。",
          fans: 2200,
          san: -14,
          singing: 5,
          drama: 8,
        },
        failure: {
          log: "你唱走音了。推薦流量看完事故就走，隔天只剩下『那個會破音的 V』的印象。",
          fans: 200,
          san: -20,
          drama: 14,
        },
      },
      {
        label: "【迷因】用珍奶當導覽，逐口介紹臺灣與個人勢",
        chance: 54,
        success: {
          log: "珍奶 ASMR 意外成為國際交流。有人是來學怎麼點半糖少冰的，順便訂閱了你。",
          fans: 560,
          san: 2,
          talk: 3,
          drama: 4,
        },
        failure: {
          log: "你喝太快被嗆到。國際觀眾以為這是才藝，本國觀眾請你去喝水，演算法有點困惑。",
          fans: 80,
          san: -8,
          drama: 8,
        },
      },
    ],
  },
  {
    id: "marshmallow-bomb",
    title: "【棉花糖】質問箱被塞了不該出現的題",
    description:
      "你興致勃勃抽棉花糖。第一則：『最喜歡的食物？』第二則：『出道前在哪裡畫過委託？』第三則直接貼了舊帳號網址。🍬💣\n\n彈幕安靜，只有你的滑鼠滾輪聲音。\n「跳過……？」\n「讀到第幾則就沉默」\n「棉花糖過期了」\n「面試開始了」\n\n質問箱從甜點變成考古現場。你還笑著，你的游標已經不會動。",
    options: [
      {
        label: "【穩健】跳過爆料題，只回答食物",
        chance: 80,
        success: {
          log: "你堅定地講了十分鐘滷味。觀眾接受有些棉花糖會過期，質問箱制度得以保住。",
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
        label: "【標準】正面回應：舊帳號是前世，現在是 V",
        chance: 58,
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
      {
        label: "【豪賭】把質問箱權限打開，現場跟彈幕一起審題",
        chance: 32,
        success: {
          log: "透明化意外加分。觀眾幫你擋爆料題，質問箱從陷阱變成社群遊戲。",
          fans: 500,
          san: -8,
          talk: 3,
          drama: 10,
        },
        failure: {
          log: "審題變成圍觀。爆料題被唸得更完整，你等於自己主持了考古直播。",
          fans: -60,
          san: -22,
          drama: 28,
        },
      },
      {
        label: "【迷因】之後只抽食物題，把頻道定位轉成吃播",
        chance: 50,
        success: {
          log: "吃播人設意外成立。有人是來看你念菜單的，雜談力與胃同時升級。",
          fans: 280,
          san: 6,
          talk: 2,
          drama: 4,
        },
        failure: {
          log: "食物題用完了。你開始念外送 App，彈幕說這不是棉花糖這是廣告。",
          fans: 20,
          san: -6,
          drama: 8,
        },
      },
    ],
  },
  {
    id: "membership-overshare",
    title: "【メン限】會員限定講太開心",
    description:
      "會員場你太放鬆。你聊了睡眠時間、委託單價、以及『其實昨天那句台詞是讀稿』。下播後會員剪輯流出到公開區，標題叫做《本體比皮套有趣》。🔓😅\n\n公開區彈幕：\n「果然有讀稿」\n「會員福利是真實」\n「本體出道了」\n「專屬感呢？」\n\n你的表格出現人生第一次的進進出出。會員是溫床，也是外流現場。",
    options: [
      {
        label: "【穩健】拜託不要外流，並改掉讀稿習慣",
        chance: 76,
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
      {
        label: "【標準】把外流當預告，公開部分內容",
        chance: 64,
        success: {
          log: "你將外流內容編成會員精華試吃。有人因此加入會員，有人說你很會行銷，你自己也不確定。",
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
        label: "【豪賭】乾脆公開全部，把會員改成『更早看到事故』",
        chance: 30,
        success: {
          log: "定位意外清晰。會員變成事故預告板，有人說這才誠實，付費點從神祕變成陪伴。",
          fans: 540,
          san: -10,
          talk: 4,
          drama: 12,
        },
        failure: {
          log: "全公開後沒人覺得需要付費。會員數下滑，你學會了什麼叫把福利發完。",
          fans: -90,
          san: -16,
          drama: 14,
        },
      },
      {
        label: "【迷因】之後會員場只講天氣，公開場反而更破防",
        chance: 52,
        success: {
          log: "倒反的經營學成立。有人加入會員是為了看你多無聊，這很抽象，但月費進來了。",
          fans: 200,
          san: 4,
          talk: 2,
          drama: 6,
        },
        failure: {
          log: "天氣講了四十分鐘。會員覺得被耍，公開場的人又覺得你在會員講真話，兩頭不是人。",
          fans: -40,
          san: -10,
          drama: 12,
        },
      },
    ],
  },
  {
    id: "thumbnail-bait",
    title: "【封面詐欺】縮圖比內容刺激十倍",
    description:
      "你用了『淚目』『重大發表』『可能是最後一次』。實際內容是你宣布下週休息一天去看牙醫。🦷😭\n\n點進來的觀眾比平常多，離開的速度也比平常快。\n「又是牙醫」\n「重大發表是智齒？」\n「封面詐欺＋1」\n「口腔の3Dお披露目」\n\n標題黨很有效，信任值正在讀秒。",
    options: [
      {
        label: "【穩健】承認封面詐欺，並真的講一件小事",
        chance: 84,
        success: {
          log: "你承認標題黨，然後認真分享看牙醫的恐懼。奇怪的是這比重大發表更有人看。",
          fans: 200,
          san: 2,
          talk: 3,
          drama: 6,
        },
        failure: {
          log: "承認後被說果然沒內容。封面風格被做成迷因模板，之後每張圖都會被問是不是又詐。",
          fans: -40,
          san: -8,
          drama: 14,
        },
      },
      {
        label: "【標準】把牙醫升級成『口腔の3Dお披露目』",
        chance: 55,
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
      {
        label: "【豪賭】真的宣布一件大事來配這張封面",
        chance: 28,
        success: {
          log: "你臨時宣布新衣裝月。封面不再是詐欺，變成預言，觀眾覺得你在下棋。",
          fans: 700,
          san: -14,
          talk: 2,
          drama: 10,
        },
        failure: {
          log: "大事沒準備好。你說了會做，時程卻是空氣，下個月的你會謝謝這個月的你。",
          fans: 80,
          san: -18,
          drama: 16,
        },
      },
      {
        label: "【迷因】之後每張封面都寫『這次真的沒詐欺』",
        chance: 60,
        success: {
          log: "這句話本身變成詐欺。觀眾當迷因點進來，你的點擊率穩定地建立在元梗上。",
          fans: 240,
          san: 2,
          talk: 1,
          drama: 8,
        },
        failure: {
          log: "真的沒詐欺的那次反而沒人點。你被自己的迷因反噬，演算法也不知道你在做什麼。",
          fans: -20,
          san: -6,
          drama: 8,
        },
      },
    ],
  },
  {
    id: "april-fools-graduate",
    title: "【愚人節】宣布畢業，有人當真",
    description:
      "你以為很有趣：發了畢業公告、淚目封面、還錄了『謝謝你們出現在我的三年』。十分鐘後有人開始做感謝剪輯，有人哭著 SC，有人已經在寫維基的畢業頁。今天是 4 月 1 日。📅💔\n\n彈幕：\n「愚人節快樂……？」\n「不要拿畢業開玩笑」\n「VOD 還在」\n「這梗從年度計畫刪掉」\n\n你的遺言被配上感人 BGM。這不是笑話，這是公關課。",
    options: [
      {
        label: "【穩健】立刻澄清：愚人節快樂……？",
        chance: 78,
        success: {
          log: "你火速澄清。有人罵，有人笑，播放數卻創了今年新高。愚人節成為你最危險的行銷課。",
          fans: 340,
          san: -10,
          talk: 2,
          drama: 16,
        },
        failure: {
          log: "澄清來得太晚。感謝剪輯已經發布，你看著自己的遺言被配上感人 BGM，SAN 直接扣血。",
          fans: 80,
          san: -22,
          drama: 24,
        },
      },
      {
        label: "【標準】演到底，隔天再說『還有下一世』",
        chance: 42,
        success: {
          log: "你把愚人節畢業演成回歸劇。有人說太扯，有人說這才是 VTuber。訂閱曲線像心電圖。",
          fans: 700,
          san: -16,
          talk: 3,
          drama: 20,
        },
        failure: {
          log: "演到底的代價是信任。有人真的退訂，留言不要拿畢業開玩笑，你把這個梗從年度計畫刪掉。",
          fans: -180,
          san: -24,
          drama: 32,
        },
      },
      {
        label: "【豪賭】順便公布真的會做的週年計畫，把恐慌轉成預告",
        chance: 36,
        success: {
          log: "恐慌轉成期待。畢業是假的，週年是真的，你險勝這場最危險的行銷。",
          fans: 860,
          san: -12,
          talk: 3,
          drama: 14,
        },
        failure: {
          log: "週年計畫聽起來比畢業還假。觀眾兩頭不信，你的預告變成新的愚人節。",
          fans: -40,
          san: -18,
          drama: 22,
        },
      },
      {
        label: "【迷因】之後每天都說今天畢業，直到沒人相信",
        chance: 44,
        success: {
          log: "狼來了成功。真正休息那天反而沒人慌，你獲得了最奇怪的行程自由度。",
          fans: 260,
          san: 2,
          talk: 2,
          drama: 10,
        },
        failure: {
          log: "有一天你真的感冒沒開台。大家都以為又在玩梗，你獨自畢業在床上。",
          fans: -30,
          san: -10,
          drama: 12,
        },
      },
    ],
  },
  {
    id: "live2d-mouth-desync",
    title: "【技術事故】Live2D 嘴型跟聲音分手",
    description:
      "你在說話，嘴巴不開。你閉上，嘴巴開到最大。彈幕開始配音：『這是當代藝術。』捕捉攝影機對準的可能是你的手，也可能是你的靈魂。👄🎭\n\n「嘴巴 independently 營業」\n「參數在抗議」\n「ASMR 非自願出道」\n「除錯回＋1」\n\n你的人設還在營業，你的模型已經在即興表演。",
    options: [
      {
        label: "【穩健】當場除錯，讓觀眾看個人勢後台",
        chance: 74,
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
        label: "【標準】放棄同步，改走抽象派口技",
        chance: 68,
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
      {
        label: "【豪賭】開 24 小時除錯耐久，修好才下播",
        chance: 30,
        success: {
          log: "你真的修好了。技術向觀眾留下，這場 VOD 成為新手 V 的教材，也成為你的黑眼圈來源。",
          fans: 640,
          san: -22,
          tech: 6,
          drama: 6,
        },
        failure: {
          log: "修到凌晨模型比開始更糟。你帶著一張不會閉的嘴進入睡眠，彈幕請你去睡覺。",
          fans: 40,
          san: -24,
          drama: 10,
        },
      },
      {
        label: "【迷因】讓嘴巴當主角，你只負責配音",
        chance: 50,
        success: {
          log: "角色反轉成功。有人說這才是 Live2D 的正確用法，你的嘴巴比你紅。",
          fans: 360,
          san: 4,
          talk: 2,
          drama: 8,
        },
        failure: {
          log: "嘴巴搶戲搶過頭。觀眾開始只截嘴巴，你的臉變成背景，這不是迷因這是失業。",
          fans: 30,
          san: -8,
          drama: 10,
        },
      },
    ],
  },
  {
    id: "typhoon-stream",
    title: "【颱風假】全臺灣放假，你還是開台",
    description:
      "風很大，雨很大，你的麥克風在收屋頂的聲音。🪟🌀 彈幕有人說『不要開了去收衣服』，有人說『颱風天就是要看 V』。你的窗戶在唱和聲，比你的歌回還準。\n\n「氣象局＋1」\n「窗戶來賓」\n「先去安全的地方」\n「這是自然的 3D 音效」\n\n全臺灣放假，你的待機室沒有放假。",
    options: [
      {
        label: "【穩健】改成颱風雜談，陪大家度過停電前",
        chance: 90,
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
        label: "【標準】硬開歌回，跟窗戶對唱",
        chance: 55,
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
      {
        label: "【豪賭】宣布颱風不停台，當成人間發電機",
        chance: 28,
        success: {
          log: "你真的撐過停電前最後一小時。有人說太拚，有人訂閱是因為被這種執著嚇到。",
          fans: 520,
          san: -18,
          talk: 2,
          drama: 10,
        },
        failure: {
          log: "發電機是比喻，電是真的沒了。你在黑暗裡跟觀眾道別，這不是豪賭這是物理。",
          fans: 40,
          san: -14,
          drama: 8,
        },
      },
      {
        label: "【迷因】把氣象局當成連動來賓，逐句吐槽預報",
        chance: 58,
        success: {
          log: "氣象局連動意外成立。有人是來看預報的，順便認識你，這是最在地的節目策劃。",
          fans: 280,
          san: 2,
          talk: 3,
          drama: 4,
        },
        failure: {
          log: "吐槽到預報說中你這邊會更糟。彈幕請你去收衣服，連動來賓贏了。",
          fans: 50,
          san: -8,
          drama: 6,
        },
      },
    ],
  },
  {
    id: "merch-shipping-hell",
    title: "【週邊】福袋延遲，親筆簽名還拼錯名",
    description:
      "出貨日過了兩週。有人收到的是空盒，有人收到兩份，有人的簽名被寫成相近的名字。你的 DMs 變成客服中心，而你只是一個會開 OBS 的個人勢。📦😭\n\n「客服組（你）在嗎」\n「福袋是魂系掉落嗎」\n「簽名是誰」\n「進度表＋1」\n\n錢包在哭，物流在迷路，粉絲在等。你的試算表比 VOD 還長。",
    options: [
      {
        label: "【穩健】公開進度表，一份一份對到完",
        chance: 78,
        success: {
          log: "你用試算表跟觀眾對帳。雖然很累，但個人勢有在負責的評價留下來，客服技能非自願升級。",
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
        label: "【標準】加碼補寄，並在直播公開認錯",
        chance: 72,
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
      {
        label: "【豪賭】宣布重做全部福袋，舊的當贈品",
        chance: 30,
        success: {
          log: "重做方案震撼市場。錢包很痛，風評很好，你成為傳說中會負責的個人勢。",
          fans: 480,
          san: -20,
          drama: 8,
        },
        failure: {
          log: "重做後又延遲。你現在有兩批迷路的福袋，物流副本進入第二階段。",
          fans: -70,
          san: -24,
          drama: 20,
        },
      },
      {
        label: "【迷因】把拼錯的名字當成限定隱藏款",
        chance: 46,
        success: {
          log: "隱藏款理論意外有人信。收到錯名的人開始炫耀，你的品管事故變成收藏學。",
          fans: 200,
          san: -4,
          talk: 2,
          drama: 10,
        },
        failure: {
          log: "隱藏款沒人想藏。客服信變成論文，你把這個梗從客服話術裡刪掉。",
          fans: -50,
          san: -14,
          drama: 16,
        },
      },
    ],
  },
  {
    id: "always-late-stream",
    title: "【開台】遲到一小時，第一句仍是「稍等一下喔」",
    description:
      "待機室從 20:00 等到 21:07。你上線第一句是招牌的『稍等一下喔，麥克風有沒有 OK』。麥克風沒有 OK。⏰🎤\n\n彈幕已經準備好了：\n「準時遲到的個人勢」\n「稍等一下喔（主題曲）」\n「21:07 寫進日程」\n「我的待機生命不是用來等這個」\n\n你的準時是一種藝術，也是一種傷害。觀眾比你更懂你的時間表。",
    options: [
      {
        label: "【穩健】認真道歉，並當場把麥克風調好",
        chance: 82,
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
      {
        label: "【標準】把遲到編成固定單元：準時的晚點",
        chance: 74,
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
        label: "【豪賭】宣布下次提早一小時，然後真的準時",
        chance: 34,
        success: {
          log: "你真的準時了。觀眾不習慣，以為進錯台，訂閱卻因為這個奇蹟多了一截。",
          fans: 400,
          san: -8,
          talk: 2,
          tech: 1,
          drama: 4,
        },
        failure: {
          log: "提早一小時的預告讓待機室從 19:00 等到 21:07。傷害加倍，你的品牌更加一致。",
          fans: -40,
          san: -12,
          drama: 10,
        },
      },
      {
        label: "【迷因】開台第一句改成『我來晚了是因為在跟時間對線』",
        chance: 56,
        success: {
          log: "對線理論成為新設定。有人當真，有人當梗，你的遲到有了世界觀，這很 VTuber。",
          fans: 220,
          san: 2,
          talk: 3,
          drama: 6,
        },
        failure: {
          log: "世界觀太複雜。觀眾只想看你調麥克風，你花十分鐘解釋時間的敵人，麥還是沒 OK。",
          fans: 20,
          san: -6,
          drama: 6,
        },
      },
    ],
  },
];
