export interface CareerOption {
  id: string;
  title: string;
  description: string;
  tag: string;
  effects: {
    fansBoost?: number;
    sanBoost?: number;
    dramaBoost?: number;
    passiveBuffDescription: string;
  };
  logText: string;
}

export interface CareerChoicePhase {
  month: number;
  phaseTitle: string;
  subtitle: string;
  description: string;
  options: CareerOption[];
}

export const CAREER_CHOICES: Record<number, CareerChoicePhase> = {
  12: {
    month: 12,
    phaseTitle: "【第 12 個月】職涯重大轉折：企業勢選秀與路線決擇",
    subtitle:
      "活動滿一週年！你的知名度吸引了多家 Vtuber 經紀公司與箱推的關注...",
    description:
      "面對逐漸停滯的訂閱成長與高昂的營運成本，你決定對未來的 VTuber 生涯做出重大抉擇：",
    options: [
      {
        id: "agency_black",
        title: "簽約黑心企業勢「黑潮娛樂」",
        tag: "【高流量/高壓力】",
        description:
          "獲得強大的資源推廣與箱推連動，但合同極度嚴苛，抽成 90% 且每個月都要達到 KPIs！",
        effects: {
          fansBoost: 15000,
          sanBoost: -25,
          dramaBoost: 15,
          passiveBuffDescription:
            "獲得「企業勢光環」：之後每月獲得粉絲 +50%，但事件損失 SAN 值 +30%",
        },
        logText:
          "【第 12 個月人生抉擇】簽約黑心企業勢「黑潮娛樂」！流量暴增但精神壓力極大！",
      },
      {
        id: "keep_indie",
        title: "堅持個人勢！自由萬歲！",
        tag: "【穩健/高自由度】",
        description:
          "拒絕所有資本綁架，保持自由創作者身份。雖然沒有資源，但擁有 100% 的粉絲愛心與心靈自由。",
        effects: {
          fansBoost: 2000,
          sanBoost: 30,
          dramaBoost: -10,
          passiveBuffDescription: "獲得「堅毅個人勢」：每個月自動恢復 5 點 SAN 值",
        },
        logText:
          "【第 12 個月人生抉擇】拒絕經紀公司邀請，選擇保持個人勢自由創作！",
      },
      {
        id: "agency_indie_group",
        title: "加入同人箱推「可樂星火社」",
        tag: "【溫馨互助/均衡】",
        description:
          "與志同道合的小V組成同人社團，互相拉拔與凸待，共同衝刺四周年萬定！",
        effects: {
          fansBoost: 6000,
          sanBoost: 15,
          dramaBoost: 0,
          passiveBuffDescription: "獲得「箱推牽絆」：觸發連動事件時效果翻倍",
        },
        logText:
          "【第 12 個月人生抉擇】加入同人箱推「可樂星火社」，與夥伴們攜手奮鬥！",
      },
    ],
  },
  24: {
    month: 24,
    phaseTitle: "【第 24 個月】兩週年突破：3D 披露與營運重組",
    subtitle: "活動滿兩週年！你的 VTuber 事業來到了全新瓶頸與高峰期...",
    description:
      "面對技術演進與觀眾的麻木感，你必須決定兩週年紀念配信的重大企劃方向：",
    options: [
      {
        id: "3d_debut",
        title: "賭上積蓄！舉辦全 3D 披露演唱會",
        tag: "【極限豪賭/高回報】",
        description:
          "砸下所有積蓄租用專業動捕棚，進行極限 3D 披露！如果失敗可能會因技術穿模變成迷因事故。",
        effects: {
          fansBoost: 30000,
          sanBoost: -15,
          dramaBoost: 10,
          passiveBuffDescription:
            "獲得「3D 模型實體化」：歌唱與技術屬性收益永久 +50%",
        },
        logText:
          "【第 24 個月人生抉擇】砸重金舉辦全 3D 披露演唱會！震驚全台 VTuber 圈！",
      },
      {
        id: "reincarnation",
        title: "轉生爆料！轉戰「前世皮」開小號",
        tag: "【迷因/高風險】",
        description:
          "在 Twitter 刻意洩漏前世舊帳號，引發爆量話題度！雖然伴隨炎上風險，但話題度拉滿！",
        effects: {
          fansBoost: 20000,
          sanBoost: -20,
          dramaBoost: 40,
          passiveBuffDescription:
            "獲得「前世大解析」：事件觸發【迷因】選項成功率增加 20%",
        },
        logText:
          "【第 24 個月人生抉擇】引爆「前世轉生」話題！引發社群大解析時代！",
      },
      {
        id: "collab_marathon",
        title: "舉辦 24 小時四周年跨界連動馬拉松",
        tag: "【溫馨/穩定】",
        description:
          "邀請包括可樂月月在內的 24 位同仁 VTuber 接力直播，將社群溫暖度拉到最高！",
        effects: {
          fansBoost: 12000,
          sanBoost: 20,
          dramaBoost: -20,
          passiveBuffDescription: "獲得「人脈王」：接下來所有事件的失敗懲罰減半",
        },
        logText:
          "【第 24 個月人生抉擇】成功舉辦 24 小時連動馬拉松！獲得社群極高評價！",
      },
    ],
  },
};
