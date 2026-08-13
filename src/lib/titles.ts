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
}

export interface VTuberTitle {
  id: string;
  title: string;
  quote: string;
}

function isHighestSkill(
  value: number,
  talk: number,
  singing: number,
  tech: number,
): boolean {
  return value >= talk && value >= singing && value >= tech;
}

export function getVTuberTitle(context: TitleContext): VTuberTitle {
  const {
    name,
    fans,
    peakFans,
    san,
    drama,
    peakDrama,
    talk,
    singing,
    tech,
    months,
    hasCollab,
    hasColamoonCollab,
    isColaMoonPartner,
  } = context;
  const reach = Math.max(fans, peakFans);
  const heat = Math.max(drama, peakDrama);

  if (san <= 0) {
    return {
      id: "san-zero",
      title: "精神崩潰的極限發狂人",
      quote: `${name} 的 SAN 值歸零了。不是畢業，是被彈幕讀完。待機室還在刷「中之人還好嗎」，下次轉生記得先關麥克風。`,
    };
  }

  if (reach >= 1_000_000) {
    return {
      id: "million-box",
      title: "百萬級同人箱推霸主",
      quote: `從個人勢走到百萬訂閱。${name} 把「稍等一下喔」做成品牌，箱推永遠在待機室等你。`,
    };
  }

  if (heat >= 85) {
    return {
      id: "flame-legend",
      title: "全平台圍剿的炎上系傳說",
      quote: `解析文比 VOD 還長，${name} 還是撐到了畢業。炎上是修羅場，也是名場面，歷史會記住這一天。`,
    };
  }

  if (talk >= 60 && singing >= 60 && tech >= 60) {
    return {
      id: "tri-athlete",
      title: "三棲全能型的同人帝王",
      quote: `雜談、歌回、事故維修全點滿。${name} 不是萬能，只是把三條技能樹都點到會發光。`,
    };
  }

  if (singing >= 80 && isHighestSkill(singing, talk, singing, tech)) {
    return {
      id: "song-monster",
      title: "被 VTuber 耽誤的歌姬怪物",
      quote: `副歌一開，同接比世界觀還準。${name} 出道是為了聊天，結果觀眾是來聽演唱會的。`,
    };
  }

  if (talk >= 80 && isHighestSkill(talk, talk, singing, tech)) {
    return {
      id: "talk-monster",
      title: "單口相聲系雜談怪物",
      quote: `沒有腳本也沒有冷場。${name} 一張嘴就能把待機室變成夜場，這才叫個人勢的核心競爭力。`,
    };
  }

  if (tech >= 80 && isHighestSkill(tech, talk, singing, tech)) {
    return {
      id: "tech-artisan",
      title: "技術力過剩的個人勢工匠",
      quote: `OBS、模型、音訊，全部自己修。${name} 的直播間是工作室，崩潰畫面是限量週邊。`,
    };
  }

  if (reach >= 100_000) {
    return {
      id: "silver-shield",
      title: "銀盾級金句製造機",
      quote: `十萬粉不是終點，是切片工廠開始量產的證明。${name} 的金句比 Super Chat 還保值。`,
    };
  }

  if (heat >= 60 && reach >= 30_000) {
    return {
      id: "drama-queen",
      title: "黑粉比真愛還多的話題女王",
      quote: `黑粉、箱推、路人一起把熱度養肥。${name} 的時間軸比節目表熱鬧，這就是話題的代價與報酬。`,
    };
  }

  if (san >= 85 && months >= 36) {
    return {
      id: "iron-mind",
      title: "鋼鐵心智的直播機器人",
      quote: `三十六個月，SAN 還在高位。${name} 不是沒有感情，是把崩潰排進行事曆以外的時段。`,
    };
  }

  if (reach < 1_000 && months >= 36) {
    return {
      id: "underground-legend",
      title: "佛系直播的地下傳奇",
      quote: `同接不一定會來，但 ${name} 有來。三年很短，待機室的 BGM 還在。零人凸待也可以是神回。`,
    };
  }

  if (months < 12) {
    return {
      id: "shooting-star",
      title: "閃電畢業的流星個人勢",
      quote: `${name} 的活動期像流星：很短、很亮、切片還在。有些故事不需要滿三十六個月才完整。`,
    };
  }

  if (
    (hasColamoonCollab || isColaMoonPartner) &&
    reach >= 5_000
  ) {
    return {
      id: "colamoon-partner",
      title: "可樂月月萬定衝刺最佳夥伴",
      quote: `四週年的麥克風曾遞給 ${name}。前輩衝刺萬定的路上，這份凸待與應援會一起被寫進年報。`,
    };
  }

  if (hasCollab && reach >= 10_000) {
    return {
      id: "spark-member",
      title: "可樂星火社榮譽成員",
      quote: `連動不是路過，是把名字寫進同一個待機室。${name} 與夥伴互相拉拔，這才叫同人箱推。`,
    };
  }

  if (reach >= 8_000 && reach < 100_000) {
    return {
      id: "10k-vanguard",
      title: "萬定衝刺先鋒隊",
      quote: `萬粉不是天花板，是起跑槍。${name} 的訂閱曲線還在爬，聊天室已經開始預支「恭喜萬定」。`,
    };
  }

  if (singing >= 70) {
    return {
      id: "song-diva",
      title: "歌力全開的百萬歌姬",
      quote: `音準比世界觀可靠。${name} 一開口，演算法就知道這台今晚不是來睡覺的。`,
    };
  }

  if (talk >= 70) {
    return {
      id: "talk-ceo",
      title: "雜談台的靈魂企業家",
      quote: `沒有大事務所也有大話題。${name} 用一張嘴把個人勢做成品牌，客服就是自己。`,
    };
  }

  if (tech >= 70) {
    return {
      id: "model-fixer",
      title: "模型修復專家",
      quote: `穿模、爆音、藍畫面，全部當節目效果。${name} 的技術力不是後台，是第二個角色。`,
    };
  }

  if (reach < 3_000) {
    return {
      id: "zero-totsu",
      title: "零人凸待慘劇主角",
      quote: `通訊錄已讀不回，待機室比正片熱鬧。${name} 依然開台了——這才是個人勢的勇氣。`,
    };
  }

  return {
    id: "peaceful-grad",
    title: "平安畢業的溫馨系 VTuber",
    quote: `謝謝每一則 Super Chat 與每一次「草」。${name} 的皮套會褪色，切片還在。這是一場溫柔且完整的三年。`,
  };
}
