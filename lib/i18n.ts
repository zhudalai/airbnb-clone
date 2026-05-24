const ja = {
  nav: {
    home: "ホーム",
    search: "検索",
    shareYourHome: "物件を掲載",
    login: "ログイン",
    signup: "新規登録",
    logout: "ログアウト",
    myTrips: "旅行",
    myFavorites: "お気に入り",
    myReservations: "予約管理",
    myProperties: "物件管理",
  },
  home: {
    title: "民泊物件を探す",
    subtitle: "日本全国の民泊・民宿を簡単に検索・予約",
    searchPlaceholder: "エリア、駅名、物件名で検索...",
  },
  listing: {
    perNight: "/泊",
    amenities: "設備・アメニティ",
    location: "所在地",
    reviews: "レビュー",
    bookNow: "今すぐ予約",
    guests: "ゲスト",
    bathrooms: "バスルーム",
    rooms: "部屋",
    nights: "泊",
    guestsUnit: "人",
  },
  categories: {
    Beach: "ビーチ",
    Windmills: "風車",
    Modern: "モダン",
    Countryside: "田園",
    Pools: "プール",
    Islands: "島",
    Lake: "湖",
    Skiing: "スキー",
    Castles: "城",
    Caves: "洞窟",
    Camping: "キャンプ",
    Arctic: "北極",
    Desert: "砂漠",
    Barns: "納屋",
    Lux: "ラグジュアリー",
  },
  search: {
    anywhere: "どこでも",
    anyWeek: "いつでも",
    addGuests: "ゲストを追加",
    guests: "ゲスト",
    days: "泊",
  },
  footer: {
    about: "会社概要",
    terms: "利用規約",
    privacy: "プライバシーポリシー",
    contact: "お問い合わせ",
  },
  common: {
    loading: "読み込み中...",
    noListings: "物件が見つかりません",
    looksLikeNoProperties: "表示する物件がないようです",
  },
};

export default ja;

export function t(key: string): string {
  const keys = key.split(".");
  let value: any = ja;
  for (const k of keys) {
    value = value?.[k];
  }
  return typeof value === "string" ? value : key;
}
