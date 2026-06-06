export type Destination = {
  slug: string;
  title: string;
  shortTitle: string;
  category: "tokyo" | "fuji" | "osaka" | "kyoto" | "disney" | "family";
  tags: string[];
  description: string;
  image: string;
  badge: "Hot" | "New" | "Featured" | "Family" | "Sakura Season";
  days: string;
  nights: string;
  duration: string;
  route: string;
  bestSeason: string;
  groupSize: string;
  seatsLeft: number;
  price: number;
  priceFrom: string;
  includes: string[];
  itinerary: string[];
};

export type BlogPost = {
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
};

export const japanImages = {
  fujiSakura: "/images/japan/fuji-sakura.jpg",
  sensojiNight: "/images/japan/sensoji-night.jpg",
  skytreeRiver: "/images/japan/skytree-river.jpg",
  shibuyaNight: "/images/japan/shibuya-night.jpg",
  kawaguchikoFuji: "/images/japan/kawaguchiko-fuji.jpg",
  oshinoHakkai: "/images/japan/oshino-hakkai.jpg",
  oishiPark: "/images/japan/oishi-park.jpg",
  gotembaOutlet: "/images/japan/gotemba-outlet.jpg",
  disneylandNight: "/images/japan/disneyland-night.jpg",
  akihabaraNeon: "/images/japan/akihabara-neon.jpg",
  harajukuStreet: "/images/japan/harajuku-street.jpg",
} as const;

export const company = {
  name: "Sakura Travel",
  tagline: "Япон аялал, маршрут, буудал, тээвэр, захиалгыг нэг дор.",
  phone: "7011 1179",
  email: "info@sakuratravel.mn",
  location: "UBH Center 15 давхар, #1516 тоот. Багшийн дээдийн урд, Сүхбаатар дүүрэг, Улаанбаатар",
};

export const tokyoFujiJourney = [
  {
    day: "01",
    title: "Улаанбаатар → Токио",
    place: "Narita arrival",
    image: japanImages.fujiSakura,
    summary: "Оройн нислэг, буудалдаа тайван байрлаад маргаашийн хотын аялалдаа бэлдэнэ.",
  },
  {
    day: "02",
    title: "Asakusa Senso-ji + Skytree",
    place: "Old Tokyo at night",
    image: japanImages.sensojiNight,
    summary: "Дэнлүүний гэрэл, сүмийн гудамж, Sumida River-ийн дагуух шөнийн алхалт.",
  },
  {
    day: "03",
    title: "Shibuya night",
    place: "Tokyo city lights",
    image: japanImages.shibuyaNight,
    summary: "Scramble crossing, rooftop view, неон гэрэлтэй Токиогийн хамгийн эрчтэй үдэш.",
  },
  {
    day: "04",
    title: "Mount Fuji + Lake Kawaguchiko",
    place: "Fuji lakeside",
    image: japanImages.kawaguchikoFuji,
    summary: "Нуурын тусгал, цаст оргил, сакура эсвэл улирлын онцгой фото цэгүүд.",
  },
  {
    day: "05",
    title: "Oshino Hakkai + Oishi Park",
    place: "Village and garden",
    image: japanImages.oshinoHakkai,
    summary: "Цэвэр булгийн тосгон, Fuji-ийн тайван панорама, Oishi Park-ийн улирлын цэцэгс.",
  },
  {
    day: "06",
    title: "Gotemba Premium Outlets",
    place: "Shopping under Fuji",
    image: japanImages.gotembaOutlet,
    summary: "Брэнд shopping, кафе амралт, цаг агаар таарвал Fuji харагдах задгай орчин.",
  },
  {
    day: "07",
    title: "Disneyland эсвэл Akihabara / Harajuku",
    place: "Free day",
    image: japanImages.disneylandNight,
    summary: "Гэр бүл бол Disneyland, anime сонирхолтой бол Akihabara, street fashion бол Harajuku.",
  },
];

export const destinations: Destination[] = [
  {
    slug: "tokyo-fuji",
    title: "Токио & Фүжи уулын аялал",
    shortTitle: "Токио Фүжи",
    category: "fuji",
    tags: ["tokyo", "fuji", "sakura", "photo"],
    description:
      "Сакура улирал, Фүжи уулын үзэмж, Токиогийн night view, shopping, Oshino Hakkai багтсан хамгийн эрэлттэй premium багц.",
    image: japanImages.fujiSakura,
    badge: "Hot",
    days: "7 өдөр",
    nights: "6 шөнө",
    duration: "7 өдөр / 6 шөнө",
    route: "UB → Tokyo → Fuji → Shibuya",
    bestSeason: "Сакура болон намрын улирал",
    groupSize: "4-18 хүн",
    seatsLeft: 8,
    price: 3990000,
    priceFrom: "3,990,000₮-с",
    includes: ["Hotel", "Guide", "Transport", "Itinerary"],
    itinerary: tokyoFujiJourney.map((item) => `Day ${Number(item.day)}: ${item.title}`),
  },
  {
    slug: "disney",
    title: "Tokyo Disneyland гэр бүлийн аялал",
    shortTitle: "Disneyland",
    category: "disney",
    tags: ["family", "kids", "tokyo"],
    description:
      "Хүүхэдтэй гэр бүлд зориулсан Disneyland, DisneySea, Odaiba, хотын хөнгөн маршруттай premium family багц.",
    image: japanImages.disneylandNight,
    badge: "Family",
    days: "6 өдөр",
    nights: "5 шөнө",
    duration: "6 өдөр / 5 шөнө",
    route: "UB → Tokyo → Disneyland → Odaiba",
    bestSeason: "Сургуулийн амралтаар",
    groupSize: "3-14 хүн",
    seatsLeft: 5,
    price: 4590000,
    priceFrom: "4,590,000₮-с",
    includes: ["Hotel", "Disney tips", "Transport", "Park planning"],
    itinerary: [
      "Day 1: Токиод ирж family friendly hotel-д байрлана.",
      "Day 2: Tokyo Disneyland.",
      "Day 3: DisneySea эсвэл чөлөөт family day.",
      "Day 4: Odaiba, TeamLab, shopping.",
      "Day 5: Ueno эсвэл хүүхдийн сонирхолд тохирсон маршрут.",
      "Day 6: Буцах нислэг.",
    ],
  },
  {
    slug: "shopping",
    title: "Токио premium shopping аялал",
    shortTitle: "Токио Shopping",
    category: "tokyo",
    tags: ["shopping", "city", "akihabara", "shibuya"],
    description:
      "Shibuya, Harajuku, Akihabara, Ginza, Gotemba outlet чиглэлтэй богино хугацааны хотын аялал.",
    image: japanImages.akihabaraNeon,
    badge: "Featured",
    days: "5 өдөр",
    nights: "4 шөнө",
    duration: "5 өдөр / 4 шөнө",
    route: "UB → Tokyo → Shibuya → Akihabara",
    bestSeason: "Жилийн турш",
    groupSize: "2-10 хүн",
    seatsLeft: 6,
    price: 3290000,
    priceFrom: "3,290,000₮-с",
    includes: ["Hotel", "Shopping route", "Transport", "Concierge"],
    itinerary: [
      "Day 1: Токиод ирж хотын төвд байрлана.",
      "Day 2: Shibuya, Harajuku, Omotesando.",
      "Day 3: Ginza эсвэл Gotemba outlet.",
      "Day 4: Akihabara, anime/game culture, night view.",
      "Day 5: Буцах нислэг.",
    ],
  },
];

export const destinationSpots = [
  { name: "Mount Fuji Sakura", image: japanImages.fujiSakura },
  { name: "Senso-ji Night", image: japanImages.sensojiNight },
  { name: "Skytree River", image: japanImages.skytreeRiver },
  { name: "Shibuya", image: japanImages.shibuyaNight },
  { name: "Kawaguchiko", image: japanImages.kawaguchikoFuji },
  { name: "Oshino Hakkai", image: japanImages.oshinoHakkai },
  { name: "Oishi Park", image: japanImages.oishiPark },
  { name: "Gotemba", image: japanImages.gotembaOutlet },
  { name: "Disneyland", image: japanImages.disneylandNight },
  { name: "Akihabara", image: japanImages.akihabaraNeon },
  { name: "Harajuku", image: japanImages.harajukuStreet },
];

export const services = [
  "Japan tour package болон private itinerary",
  "Flight, hotel, train, city transfer зөвлөгөө",
  "Family, couple, group аяллын тусгай санал",
  "Booking болон payment status admin workflow",
  "Gmail notification-ready booking flow",
];

export const blogPosts: BlogPost[] = [
  {
    title: "Сакура улиралд Токиод хаана зураг авах вэ?",
    category: "Аяллын зөвлөгөө",
    excerpt: "Ueno, Meguro, Shinjuku Gyoen зэрэг алдартай цэгүүдийг хэрхэн төлөвлөх тухай.",
    readTime: "5 мин",
  },
  {
    title: "Disneyland руу хүүхэдтэй явахад бэлдэх зүйлс",
    category: "Гэр бүл",
    excerpt: "Ticket, stroller, хоол, амралтын цаг, hotel location сонгох практик зөвлөгөө.",
    readTime: "3 мин",
  },
];

export const siteKnowledge = `
Sakura Travel нь Япон аялал, маршрут, захиалгын аялал зуучлалын компани.
Үндсэн аяллууд: Токио & Фүжи уулын аялал, Tokyo Disneyland гэр бүлийн аялал, Токио premium shopping.
Үйлчилгээ: Japan package, private itinerary, flight/hotel/transport зөвлөгөө, payment болон booking status.
Холбоо барих: 7011 1179, info@sakuratravel.mn.
Хаяг: UBH Center 15 давхар #1516 тоот, Багшийн дээдийн урд, Сүхбаатар дүүрэг.
`;
