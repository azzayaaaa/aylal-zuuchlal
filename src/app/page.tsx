import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  HelpCircle,
  Plane,
  Quote,
  ShieldCheck,
  Star,
} from "lucide-react";
import { ChatBot } from "@/components/chat-bot";
import { GsapLanding } from "@/components/gsap-landing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { destinations, japanImages } from "@/lib/travel-data";

const routeStops = [
  {
    name: "UB",
    day: "Day 1",
    title: "Улаанбаатар — Аялал эхлэх мөч",
    eyebrow: "Departure",
    routeLabel: "UB → Tokyo",
    copy: "Chinggis Khaan International Airport-оос зөөлөн тэнгэр рүү. Mongolia → Japan аялал эндээс эхэлнэ.",
    image: "/images/japan/airplane-ub-runway.png",
    x: 42,
    y: 84,
  },
  {
    name: "Tokyo",
    day: "Day 2",
    title: "Tokyo Arrival",
    eyebrow: "Narita / city lights",
    routeLabel: "Tokyo → Asakusa",
    copy: "Онгоц газардаж, Tokyo-ийн гэрэл аяллын эхний хотын хэмнэлийг нээнэ.",
    image: japanImages.skytreeRiver,
    x: 92,
    y: 122,
  },
  {
    name: "Asakusa",
    day: "Day 2",
    title: "Asakusa Senso-ji",
    eyebrow: "Lantern glow",
    routeLabel: "Asakusa → Skytree",
    copy: "Senso-ji-ийн дэнлүү, чулуун гудамж, хуучин Tokyo-ийн дулаан гэрэл.",
    image: japanImages.sensojiNight,
    x: 154,
    y: 76,
  },
  {
    name: "Skytree",
    day: "Day 3",
    title: "Skytree / Sumida River",
    eyebrow: "River reflection",
    routeLabel: "Skytree → Shibuya",
    copy: "Skytree усанд тусаж, Sumida River-ийн гэрэл аяллыг хотын кино болгоно.",
    image: japanImages.skytreeRiver,
    x: 228,
    y: 118,
  },
  {
    name: "Shibuya",
    day: "Day 4",
    title: "Shibuya Crossing",
    eyebrow: "Neon pulse",
    routeLabel: "Shibuya → Fuji",
    copy: "Неон, хөдөлгөөн, хүмүүсийн урсгал. Tokyo хамгийн хурдтайгаар амьсгална.",
    image: japanImages.shibuyaNight,
    x: 332,
    y: 164,
  },
  {
    name: "Fuji",
    day: "Day 5",
    title: "Mount Fuji",
    eyebrow: "Quiet ascent",
    routeLabel: "Fuji → Kawaguchiko",
    copy: "Хотын гэрлээс гарч Fuji-ийн нам гүм, цэвэр агаарт аялал зөөлөрнө.",
    image: japanImages.fujiSakura,
    x: 418,
    y: 232,
  },
  {
    name: "Kawaguchiko",
    day: "Day 5",
    title: "Lake Kawaguchiko",
    eyebrow: "Mirror lake",
    routeLabel: "Kawaguchiko → Oshino",
    copy: "Нуурын усанд Fuji тусаж, зураг шиг нам гүм өглөө эхэлнэ.",
    image: japanImages.kawaguchikoFuji,
    x: 338,
    y: 292,
  },
  {
    name: "Oshino",
    day: "Day 6",
    title: "Oshino Hakkai",
    eyebrow: "Water village",
    routeLabel: "Oshino → Gotemba",
    copy: "Булгийн тунгалаг ус, Fuji-ийн доорх жижиг тосгоны тайван хэмнэл.",
    image: japanImages.oshinoHakkai,
    x: 244,
    y: 344,
  },
  {
    name: "Gotemba",
    day: "Day 6",
    title: "Gotemba Premium Outlets",
    eyebrow: "Fuji shopping",
    routeLabel: "Gotemba → Disneyland",
    copy: "Брэнд shopping, кофе амралт, тэнгэр цэлмэг бол Fuji-ийн задгай үзэмж.",
    image: japanImages.gotembaOutlet,
    x: 348,
    y: 376,
  },
  {
    name: "Disneyland",
    day: "Day 7",
    title: "Tokyo Disneyland",
    eyebrow: "Final day",
    routeLabel: "Disneyland arrival",
    copy: "Disneyland-ийн өнгө, Tokyo-ийн сүүлчийн гэрэл. Аялал баярын мэдрэмжээр өндөрлөнө.",
    image: japanImages.disneylandNight,
    x: 462,
    y: 298,
  },
];

const routePath =
  "M42 84 C72 68 86 94 92 122 C98 148 132 102 154 76 C188 40 206 92 228 118 C260 154 300 132 332 164 C382 196 450 184 418 232 C392 270 358 272 338 292 C312 318 286 332 244 344 C282 376 318 390 348 376 C392 354 426 326 462 298";

const journeyScenes = [
  {
    slug: "ub-departure",
    title: "Day 1 — Улаанбаатар",
    eyebrow: "Mongolia sky",
    windowImage: "/images/japan/ub-airport-departure.jpg",
    left: {
      name: "UB Departure",
      line: "Chinggis Khaan Airport-аас Japan чиглэлд хөөрнө.",
      image: "/images/japan/airplane-ub-runway.png",
      tour: "ub-departure",
    },
    right: {
      name: "Mongolia Sky",
      line: "Цонхоор үүл, тал, аяллын эхний гэрэл харагдана.",
      image: japanImages.fujiSakura,
      tour: "ub-departure",
    },
  },
  {
    slug: "tokyo-arrival",
    title: "Day 2 — Tokyo Arrival",
    eyebrow: "City lights below",
    windowImage: japanImages.skytreeRiver,
    left: {
      name: "Tokyo Skyline",
      line: "Хотын гэрэл дээрээсээ аяллын эхний Tokyo кадр.",
      image: japanImages.skytreeRiver,
      tour: "tokyo-arrival",
    },
    right: {
      name: "Arrival Night",
      line: "Transfer, hotel check-in, city night mood.",
      image: japanImages.shibuyaNight,
      tour: "tokyo-arrival",
    },
  },
  {
    slug: "asakusa-sensoji",
    title: "Day 2 — Asakusa & Sensoji",
    eyebrow: "Old Tokyo lanterns",
    windowImage: japanImages.sensojiNight,
    left: {
      name: "Asakusa",
      line: "Нарийн гудамж, дэлгүүр, Tokyo-ийн хуучин уур амьсгал.",
      image: japanImages.sensojiNight,
      tour: "asakusa-sensoji",
    },
    right: {
      name: "Sensoji Temple",
      line: "Дэнлүү, сүмийн гэрэл, оройн алхалтын маршрут.",
      image: japanImages.sensojiNight,
      tour: "asakusa-sensoji",
    },
  },
  {
    slug: "skytree-shibuya",
    title: "Day 3 — Skytree & Shibuya",
    eyebrow: "Skyline to neon",
    windowImage: japanImages.shibuyaNight,
    left: {
      name: "Tokyo Skytree",
      line: "Sumida River дээр туссан Skytree night view.",
      image: japanImages.skytreeRiver,
      tour: "skytree-shibuya",
    },
    right: {
      name: "Shibuya Crossing",
      line: "Неон, хүмүүсийн урсгал, Tokyo-ийн хамгийн амьд хэмнэл.",
      image: japanImages.shibuyaNight,
      tour: "skytree-shibuya",
    },
  },
  {
    slug: "fuji-kawaguchiko",
    title: "Day 4 — Fuji & Kawaguchiko",
    eyebrow: "Mountain air",
    windowImage: japanImages.kawaguchikoFuji,
    left: {
      name: "Mount Fuji",
      line: "Fuji-ийн панорама, сакура, зураг авах цэгүүд.",
      image: japanImages.fujiSakura,
      tour: "fuji-kawaguchiko",
    },
    right: {
      name: "Lake Kawaguchiko",
      line: "Нуурын усанд туссан Fuji, тайван өглөөний маршрут.",
      image: japanImages.kawaguchikoFuji,
      tour: "fuji-kawaguchiko",
    },
  },
  {
    slug: "oshino-gotemba",
    title: "Day 5 — Oshino & Gotemba",
    eyebrow: "Village to shopping",
    windowImage: japanImages.oshinoHakkai,
    left: {
      name: "Oshino Hakkai",
      line: "Булгийн тунгалаг ус, Fuji доорх жижиг тосгон.",
      image: japanImages.oshinoHakkai,
      tour: "oshino-gotemba",
    },
    right: {
      name: "Gotemba Outlets",
      line: "Premium shopping, cafe break, Fuji view боломжтой.",
      image: japanImages.gotembaOutlet,
      tour: "oshino-gotemba",
    },
  },
  {
    slug: "disneyland-akihabara",
    title: "Day 6 — Disneyland & Akihabara",
    eyebrow: "Final city glow",
    windowImage: japanImages.disneylandNight,
    left: {
      name: "Tokyo Disneyland",
      line: "Family day, parade light, relaxed park route.",
      image: japanImages.disneylandNight,
      tour: "disneyland-akihabara",
    },
    right: {
      name: "Akihabara",
      line: "Anime, electronics, neon street photo walk.",
      image: japanImages.akihabaraNeon,
      tour: "disneyland-akihabara",
    },
  },
];

const cinematicStoryScenes = [
  { slug: "ub", day: "Day 1 / Day 7", title: "Улаанбаатар — Аялал эхлэх мөч", image: "/images/japan/airplane-ub-runway.png", tone: "Airport departure", routeLabel: "UB → Tokyo", copy: "Mongolia → Japan аялал зөөлөн тэнгэрээр эхэлнэ.", x: 42, y: 84 },
  { slug: "tokyo", day: "Day 2 / Day 7", title: "Tokyo Arrival", image: japanImages.skytreeRiver, tone: "City lights", routeLabel: "Tokyo → Asakusa", copy: "Хотын гэрэл, анхны оройн алхалт, Tokyo-ийн хэмнэл.", x: 92, y: 122 },
  { slug: "asakusa", day: "Day 2 / Day 7", title: "Asakusa / Sensoji", image: japanImages.sensojiNight, tone: "Old Tokyo", routeLabel: "Asakusa → Skytree", copy: "Дэнлүү, сүмийн гудамж, хуучин Tokyo-ийн дулаан гэрэл.", x: 154, y: 76 },
  { slug: "skytree", day: "Day 3 / Day 7", title: "Skytree / Sumida River", image: japanImages.skytreeRiver, tone: "River skyline", routeLabel: "Skytree → Shibuya", copy: "Sumida River дагуу Skytree усанд туссан night view.", x: 228, y: 118 },
  { slug: "shibuya", day: "Day 4 / Day 7", title: "Shibuya Night", image: japanImages.shibuyaNight, tone: "Night crossing", routeLabel: "Shibuya → Fuji", copy: "Неон, хүмүүсийн урсгал, Tokyo хамгийн эрчтэйгээр амьсгална.", x: 332, y: 164 },
  { slug: "fuji", day: "Day 5 / Day 7", title: "Mount Fuji", image: japanImages.fujiSakura, tone: "Mountain view", routeLabel: "Fuji → Kawaguchiko", copy: "Хотын гэрлээс гарч Fuji-ийн нам гүм панорама руу.", x: 418, y: 232 },
  { slug: "kawaguchiko", day: "Day 5 / Day 7", title: "Lake Kawaguchiko", image: japanImages.kawaguchikoFuji, tone: "Lake reflection", routeLabel: "Kawaguchiko → Oshino", copy: "Нуурын усанд туссан Fuji, тайван өглөөний аялал.", x: 338, y: 292 },
  { slug: "oshino", day: "Day 6 / Day 7", title: "Oshino Hakkai", image: japanImages.oshinoHakkai, tone: "Spring village", routeLabel: "Oshino → Gotemba", copy: "Булгийн тунгалаг ус, Fuji доорх жижиг тосгоны хэмнэл.", x: 244, y: 344 },
  { slug: "gotemba", day: "Day 6 / Day 7", title: "Gotemba Premium Outlets", image: japanImages.gotembaOutlet, tone: "Premium shopping", routeLabel: "Gotemba → Disneyland", copy: "Premium shopping, cafe break, Fuji view боломжтой өдөр.", x: 348, y: 376 },
  { slug: "disneyland", day: "Day 7 / Day 7", title: "Disneyland / Akihabara", image: japanImages.disneylandNight, tone: "Final night", routeLabel: "Tokyo → Disneyland / Akihabara", copy: "Final night glow, family route эсвэл anime city walk.", x: 462, y: 298 },
];

const bookingSteps = [
  "Нэвтрэх",
  "Аялал сонгох",
  "Огноо + хүн тоо",
  "Төлбөр баталгаажуулах",
];

const reviews = [
  ["Фүжи нуурын өглөө, Asakusa-ийн үдэш хоёр яг кино шиг мэдрэмжтэй байсан.", "Б. Номин"],
  ["Хүүхэдтэй Disneyland өдөр маш тайван, дараалал, хоол, буудлын зөвлөгөө бүгд хэрэг болсон.", "Г. Энхжин"],
  ["Shopping болон зураг авах цэгүүдийг өдөр өдрөөр нь маш цэгцтэй төлөвлөсөн.", "С. Тэмүүлэн"],
];

const faqs = [
  [
    "Захиалга хийхэд login хэрэгтэй юу?",
    "Тийм. Сайтаар чөлөөтэй үзэж болно. Харин захиалах дарахад нэвтрээгүй бол /login?redirect=/booking руу шилжинэ.",
  ],
  [
    "AI туслах юунд зөвлөдөг вэ?",
    "Төсөв, хоногийн тоо, гэр бүл/хос/найзууд, anime, shopping, Fuji, Disneyland сонирхлоор itinerary санал болгоно.",
  ],
  [
    "Үнэ юунаас хамаарах вэ?",
    "Хүн тоо, явах өдөр, буудлын түвшин, нислэг, нэмэлт үйлчилгээ болон улирлын эрэлтээс хамаарна.",
  ],
];

const featuredTourCards = [
  {
    slug: "tokyo-fuji",
    title: "Tokyo City Experience",
    location: "Asakusa · Skytree · Shibuya",
    day: "Day 2-4",
    image: japanImages.sensojiNight,
    description: "Old Tokyo lanterns, Sumida reflections, and Shibuya neon in one elegant city arc.",
    highlights: ["Senso-ji night walk", "Skytree river view", "Shibuya crossing"],
    packageText: "Tokyo-Fuji package included",
  },
  {
    slug: "tokyo-fuji",
    title: "Fuji Nature Experience",
    location: "Fuji · Kawaguchiko · Oshino · Oishi Park",
    day: "Day 5-6",
    image: japanImages.kawaguchikoFuji,
    description: "A calmer chapter with lake reflections, spring water villages, and Mount Fuji scenery.",
    highlights: ["Lake Kawaguchiko", "Oshino Hakkai", "Fuji photo points"],
    packageText: "Nature route included",
  },
  {
    slug: "disney",
    title: "Disney Family Day",
    location: "Tokyo Disneyland / DisneySea",
    day: "Day 7",
    image: japanImages.disneylandNight,
    description: "A colorful family finale with practical routing, timing tips, and a relaxed return plan.",
    highlights: ["Park planning", "Family route", "Evening lights"],
    packageText: "Family package",
  },
  {
    slug: "shopping",
    title: "Shopping & Anime",
    location: "Gotemba · Akihabara · Harajuku · Shibuya",
    day: "Free route",
    image: japanImages.akihabaraNeon,
    description: "Premium outlet shopping, anime culture, street fashion, and Tokyo night energy.",
    highlights: ["Gotemba outlet", "Akihabara anime", "Harajuku fashion"],
    packageText: "Shopping package",
  },
].map((card) => {
  const destination = destinations.find((item) => item.slug === card.slug) ?? destinations[0];
  return {
    ...card,
    price: destination.priceFrom,
    seatsLeft: destination.seatsLeft,
    duration: destination.duration,
  };
});

export default function Home() {
  const mainTour = destinations[0];

  return (
    <main className="overflow-hidden bg-[#0e211c] text-[#f8f0df]">
      <GsapLanding />
      <SiteHeader />
      <section id="top" className="gsap-hero relative isolate min-h-[100svh] overflow-hidden pt-16 text-white">
        <video
          className="gsap-hero-bg absolute inset-0 -z-30 h-full w-full object-cover"
          src="/videos/sakura-hero.mp4"
          autoPlay
          muted
          playsInline
          preload="metadata"
          poster={japanImages.fujiSakura}
          aria-label="Japan travel cinematic background video"
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(105deg,rgba(8,20,17,0.78),rgba(8,20,17,0.38)_45%,rgba(8,20,17,0.08))]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-[#0e211c] to-transparent" />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 13 }).map((_, index) => (
            <span key={index} className="hero-petal petal absolute h-3 w-5 rounded-[100%_0_100%_0] bg-[#f4b7c9]/75 blur-[0.2px]" style={{ left: `${7 + index * 7}%`, top: `${-20 - index * 9}%` }} />
          ))}
        </div>

        <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl items-end px-4 pb-16 sm:px-5 lg:px-8">
          <div className="max-w-5xl">
            <h1 className="overflow-hidden text-5xl font-semibold leading-[0.96] tracking-normal sm:text-7xl lg:text-8xl">
              <span className="split-line block">Sakura Travel</span>
              <span className="split-line block">Tokyo-Fuji аялал</span>
            </h1>
            <p className="split-line mt-6 max-w-2xl text-base leading-8 text-white/84 sm:text-xl">
              Улаанбаатараас Tokyo, Asakusa, Skytree, Shibuya, Fuji, Kawaguchiko, Disneyland хүртэл
              хөдөлгөөнт маршрутаар дагах premium аялал.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/booking" className="magnetic-cta inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#e8b95e] px-6 py-4 font-semibold text-[#1c1710] shadow-2xl shadow-[#e8b95e]/25 transition hover:bg-[#f6cf7a]">
                Захиалах
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#journey" className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-white/35 px-6 py-4 font-semibold text-white transition hover:bg-white/12">
                Маршрут үзэх
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="journey" className="journey-section relative min-h-screen bg-[#07120f] text-white" data-legacy-stops={routeStops.length} data-legacy-path={routePath.length} data-legacy-scenes={journeyScenes.length}>
        <div className="cinematic-journey-pin relative h-screen w-screen overflow-hidden bg-[#07120f]">
          {cinematicStoryScenes.map((scene, index) => (
            <Image key={scene.slug} src={scene.image} alt={scene.title} fill priority={index === 0} sizes="100vw" className="cinematic-scene-image object-cover" data-cinematic-scene={index} />
          ))}

          <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(4,10,8,0.68),rgba(4,10,8,0.24)_38%,rgba(4,10,8,0.08)_66%,rgba(4,10,8,0.42))]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-72 bg-gradient-to-t from-black/62 to-transparent" />
          <div className="journey-warm-wipe pointer-events-none absolute inset-y-0 left-[-30%] z-20 w-[54vw] opacity-0" />
          <div className="journey-cloud-veil pointer-events-none absolute inset-0 z-20 opacity-0" />
          <div className="journey-bokeh pointer-events-none absolute inset-0 z-20 opacity-0" />
          <div className="journey-mist pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[58vh] opacity-0" />
          <div className="journey-neon-sheen pointer-events-none absolute inset-0 z-20 opacity-0" />
          <div className="journey-light-rays pointer-events-none absolute inset-0 z-20 opacity-0" />
          <div className="cinematic-grain pointer-events-none absolute inset-0 z-30" />

          <div className="cinematic-scene-copy-panel absolute bottom-14 left-5 z-40 max-w-[min(720px,calc(100vw-2.5rem))] sm:bottom-20 sm:left-10 lg:left-16">
            <p className="journey-story-cue mb-4 inline-flex rounded-full border border-[#e8c77a]/24 bg-black/24 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e8c77a] opacity-0 backdrop-blur-md">Departure pulse</p>
            <p className="cinematic-scene-tone text-xs font-semibold uppercase tracking-[0.28em] text-[#f4b7c9]">{cinematicStoryScenes[0].tone}</p>
            <p className="cinematic-scene-day mt-5 text-sm font-semibold uppercase tracking-[0.26em] text-[#e8c77a]">{cinematicStoryScenes[0].day}</p>
            <h2 className="cinematic-scene-title mt-3 text-[clamp(2.35rem,12vw,4.5rem)] font-semibold leading-[0.96] text-[#fff8e7] [text-shadow:0_3px_28px_rgba(0,0,0,0.68)] sm:text-7xl lg:text-8xl">{cinematicStoryScenes[0].title}</h2>
            <p className="cinematic-scene-copy mt-5 max-w-xl text-base leading-7 text-white/78 sm:text-lg">{cinematicStoryScenes[0].copy}</p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#e8c77a]/28 bg-black/24 px-4 py-2 text-sm font-semibold text-[#fff8e7] shadow-2xl shadow-black/20 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e8c77a] shadow-[0_0_14px_rgba(232,199,122,0.9)]" />
              <span className="cinematic-route-label">{cinematicStoryScenes[0].routeLabel}</span>
            </div>
          </div>

          <div className="cinematic-route-overlay absolute bottom-8 right-4 z-40 w-[min(330px,calc(100vw-2rem))] rounded-[8px] border border-[#e8c77a]/18 bg-[#07120f]/42 p-4 shadow-2xl shadow-black/24 backdrop-blur-md sm:right-8 lg:bottom-10 lg:right-12">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8c77a]">Route</p>
              <p className="cinematic-stop-count rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">Stop 1 / 10</p>
            </div>
            <div className="relative mx-auto aspect-[520/420] w-full">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 520 420" aria-label="Tokyo Fuji route">
                <defs>
                  <filter id="premiumRouteGlow" x="-35%" y="-35%" width="170%" height="170%">
                    <feGaussianBlur stdDeviation="2.2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path d={routePath} fill="none" stroke="rgba(255,248,231,0.2)" strokeLinecap="round" strokeWidth="1.2" />
                <path className="cinematic-route-path" d={routePath} fill="none" stroke="#e8c77a" strokeLinecap="round" strokeWidth="2" filter="url(#premiumRouteGlow)" />
                {cinematicStoryScenes.map((stop, index) => (
                  <g key={stop.slug} className="cinematic-route-stop" data-route-stop={index} transform={`translate(${stop.x} ${stop.y})`}>
                    <circle className="cinematic-route-stop-glow" r="8" fill="#e8c77a" opacity="0" />
                    <circle r="3.2" fill="#fff8e7" stroke="#e8c77a" strokeWidth="1" />
                  </g>
                ))}
              </svg>
              <Plane className="cinematic-route-plane pointer-events-none absolute left-0 top-0 h-4 w-4 text-[#e8c77a] drop-shadow-[0_4px_12px_rgba(232,199,122,0.5)]" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/58 sm:grid-cols-3">
              {cinematicStoryScenes.map((stop, index) => (
                <span key={stop.slug} className="cinematic-route-label-item truncate" data-route-label={index}>{stop.slug === "ub" ? "UB" : stop.title.split(" / ")[0]}</span>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-50 h-1 bg-white/12">
            <div className="cinematic-bottom-progress h-full origin-left bg-[#e8c77a]" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </section>
      <section id="tours" className="tour-package-section relative isolate overflow-hidden py-24 text-white sm:py-28">
        <Image src={japanImages.kawaguchikoFuji} alt="Fuji travel package atmosphere" fill sizes="100vw" className="parallax-bg -z-30 object-cover object-center opacity-30" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(105deg,rgba(5,15,12,0.9),rgba(7,18,15,0.7)_42%,rgba(7,18,15,0.54))]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-44 bg-gradient-to-t from-[#10201d] to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-5 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="blur-reveal text-sm font-semibold uppercase tracking-[0.22em] text-[#e8c77a]">Main package</p>
            <h2 className="blur-reveal mt-4 max-w-2xl text-4xl font-semibold leading-tight text-[#fff8e7] sm:text-6xl">{mainTour.title}</h2>
            <p className="blur-reveal mt-5 max-w-xl text-lg leading-8 text-white/72">{mainTour.description}</p>
            <div className="blur-reveal mt-8 flex flex-wrap gap-3">
              {mainTour.includes.map((item) => (
                <span key={item} className="rounded-full border border-[#e8c77a]/24 bg-white/8 px-4 py-2 text-sm font-semibold text-[#fff8e7] shadow-lg shadow-black/10 backdrop-blur-md">{item}</span>
              ))}
            </div>
            <Link href="/booking" className="magnetic-cta mt-8 inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#e8c77a] px-6 py-4 font-semibold text-[#17211d] shadow-[0_18px_45px_rgba(232,199,122,0.24)] transition hover:bg-[#f3d88d]">
              Захиалга эхлүүлэх
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-5">
            <div className="mask-reveal group relative aspect-[16/10] overflow-hidden rounded-[8px] border border-[#e8c77a]/18 shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
              <Image src={japanImages.kawaguchikoFuji} alt="Lake Kawaguchiko with Mount Fuji" fill sizes="(min-width: 1024px) 54vw, 100vw" className="object-cover object-center transition duration-1000 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(232,199,122,0.12),transparent_32%,rgba(244,183,201,0.08)_80%)] opacity-80" />
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4 text-white">
                <div>
                  <p className="text-sm text-white/70">{mainTour.duration}</p>
                  <p className="text-3xl font-semibold">{mainTour.priceFrom}</p>
                </div>
                <p className="rounded-full border border-white/16 bg-white/14 px-4 py-2 text-sm backdrop-blur">{mainTour.seatsLeft} суудал үлдсэн</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Route", mainTour.route],
                ["Season", mainTour.bestSeason],
                ["Group", mainTour.groupSize],
              ].map(([label, value]) => (
                <div key={label} className="tilt-card rounded-[8px] border border-[#e8c77a]/18 bg-[#fff8e7]/94 p-5 text-[#17211d] shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b0184c]">{label}</p>
                  <p className="mt-3 font-semibold text-[#263b34]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="destination-gallery overflow-hidden bg-[#0e211c] py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
          <p className="blur-reveal text-sm font-semibold uppercase tracking-[0.22em] text-[#e8b95e]">Destination gallery</p>
          <h2 className="blur-reveal mt-3 max-w-3xl text-4xl font-semibold sm:text-5xl">Tokyo, Fuji, Disney, shopping нэг cinematic урсгалд.</h2>
        </div>
        <div className="destination-track mt-10 flex w-max flex-row gap-4 px-4 will-change-transform sm:mt-12 sm:gap-5 sm:px-5 lg:px-8">
          {featuredTourCards.map((card) => (
            <article key={`${card.title}-${card.slug}`} className="editorial-tour-card tilt-card group relative min-h-[520px] w-[86vw] max-w-[520px] shrink-0 overflow-hidden rounded-[8px] border border-white/12 bg-white/8 shadow-2xl shadow-black/20 sm:min-h-[560px] md:w-[520px]">
              <Image src={card.image} alt={card.title} fill sizes="(min-width: 768px) 520px, 86vw" className="object-cover object-center transition duration-700 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,14,0.05),rgba(7,17,14,0.42)_42%,rgba(7,17,14,0.92))]" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-4 p-5">
                <span className="rounded-full border border-[#e8c77a]/35 bg-black/22 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e8c77a] backdrop-blur">
                  {card.day}
                </span>
                <span className="rounded-full border border-white/16 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/82 backdrop-blur">
                  {card.seatsLeft} seats
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4b7c9]">{card.location}</p>
                <h3 className="mt-3 text-3xl font-semibold leading-tight">{card.title}</h3>
                <p className="mt-3 leading-7 text-white/78">{card.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {card.highlights.map((item) => (
                    <span key={item} className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-xs font-semibold text-white/78 backdrop-blur">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-4 border-t border-white/14 pt-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e8c77a]">{card.packageText}</p>
                    <p className="mt-1 text-2xl font-semibold">{card.price}</p>
                    <p className="mt-1 text-sm text-white/58">{card.duration}</p>
                  </div>
                  <Link href={`/booking?tour=${card.slug}`} className="magnetic-cta inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#e8b95e] px-5 font-semibold text-[#1c1710] transition hover:bg-[#f6cf7a]">
                    Захиалах
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="fuji-depth-section relative isolate min-h-screen overflow-hidden bg-[#07120f] text-white">
        <Image src={japanImages.kawaguchikoFuji} alt="Lake Kawaguchiko sky" fill sizes="100vw" className="fuji-depth-layer -z-30 object-cover object-center opacity-70" data-depth="4" />
        <Image src={japanImages.fujiSakura} alt="Mount Fuji sakura depth" fill sizes="100vw" className="fuji-depth-layer -z-20 object-cover object-center mix-blend-screen opacity-54" data-depth="12" />
        <div className="fuji-depth-layer pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[52vh] bg-[radial-gradient(circle_at_18%_22%,rgba(244,183,201,0.28),transparent_28%),linear-gradient(0deg,rgba(7,18,15,0.72),transparent)] blur-[1px]" data-depth="24" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,18,15,0.74),rgba(7,18,15,0.18)_52%,rgba(7,18,15,0.48))]" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-4 pb-16 sm:px-5 lg:px-8">
          <div className="max-w-3xl">
            <p className="fuji-depth-copy text-sm font-semibold uppercase tracking-[0.24em] text-[#e8c77a]">Fuji depth parallax</p>
            <h2 className="fuji-depth-copy mt-4 text-5xl font-semibold leading-[0.95] text-[#fff8e7] sm:text-7xl">Fuji & Kawaguchiko</h2>
            <p className="fuji-depth-copy mt-5 max-w-xl text-xl leading-8 text-white/78">Японы хамгийн мартагдашгүй өдөр</p>
          </div>
        </div>
      </section>

      <section className="shibuya-neon-section relative isolate min-h-screen overflow-hidden bg-[#07120f] text-white">
        <Image src={japanImages.shibuyaNight} alt="Shibuya night wet street" fill sizes="100vw" className="-z-30 object-cover object-center" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(4,8,10,0.72),rgba(4,8,10,0.22)_48%,rgba(4,8,10,0.58))]" />
        <div className="shibuya-neon-glow pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_28%,rgba(244,183,201,0.26),transparent_28%),radial-gradient(circle_at_43%_42%,rgba(232,185,94,0.18),transparent_32%)] opacity-45 mix-blend-screen" />
        <div className="shibuya-reflection pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-70" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-4 pb-16 sm:px-5 lg:px-8">
          <div className="max-w-3xl">
            <p className="shibuya-copy text-sm font-semibold uppercase tracking-[0.24em] text-[#f4b7c9]">Tokyo never sleeps</p>
            <h2 className="shibuya-copy mt-4 text-5xl font-semibold leading-[0.95] text-[#fff8e7] sm:text-7xl">Shibuya Night</h2>
            <p className="shibuya-copy mt-5 max-w-xl text-lg leading-8 text-white/78">Neon, wet reflections, and the pulse of Tokyo after dark.</p>
          </div>
        </div>
      </section>
      <section className="booking-timeline-section bg-[#f8f0df] py-16 text-[#15211d] sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="blur-reveal text-sm font-semibold uppercase tracking-[0.22em] text-[#b0184c]">How booking works</p>
              <h2 className="blur-reveal mt-3 text-3xl font-semibold sm:text-4xl">Дөрвөн алхамтай цэвэр захиалга.</h2>
            </div>
            <div className="relative grid gap-3">
              <div className="booking-timeline-line absolute bottom-4 left-[21px] top-4 hidden w-px bg-[#d8c9aa] sm:block">
                <div className="booking-timeline-fill h-full origin-top scale-y-0 bg-[#d7a34f]" />
              </div>
              {bookingSteps.map((item, index) => (
                <div key={item} className="booking-step blur-reveal relative grid grid-cols-[44px_1fr] items-center gap-4 border-b border-[#d8c9aa] py-3.5">
                  <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full bg-[#f8f0df] font-mono text-xl font-semibold text-[#2f6b5d] ring-1 ring-[#d8c9aa]">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-lg font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="reviews-section bg-[#f8f0df] py-20 text-[#15211d]">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
          <p className="blur-reveal text-sm font-semibold uppercase tracking-[0.22em] text-[#b0184c]">Reviews</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {reviews.map(([text, name]) => (
              <div key={name} className="review-card tilt-card rounded-[8px] bg-[#fffaf0] p-7 shadow-[0_24px_70px_rgba(45,32,16,0.10)] ring-1 ring-[#ead9c4]">
                <div className="flex items-center justify-between">
                  <Quote className="h-6 w-6 text-[#b0184c]/75" />
                  <div className="flex gap-1 text-[#d7a34f]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="review-star h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mt-6 text-lg leading-8 text-[#36443d]">{text}</p>
                <p className="mt-5 font-semibold">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="faq-section bg-[#fffaf0] py-16 text-[#15211d] sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-5 lg:px-8">
          <p className="blur-reveal text-sm font-semibold uppercase tracking-[0.22em] text-[#b0184c]">FAQ</p>
          <div className="mt-8 space-y-3">
            {faqs.map(([question, answer]) => (
              <div key={question} className="faq-item blur-reveal rounded-[8px] bg-white p-5 ring-1 ring-[#ead9c4]">
                <h3 className="flex items-center gap-2 font-semibold">
                  <HelpCircle className="h-5 w-5 text-[#276457]" />
                  {question}
                </h3>
                <p className="mt-3 leading-7 text-[#5d655f]">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="disney-finale relative isolate min-h-screen overflow-hidden px-4 py-20 text-white sm:px-5 lg:px-8">
        <Image src={japanImages.disneylandNight} alt="Tokyo Disneyland night finale" fill sizes="100vw" className="-z-30 object-cover object-center" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(7,18,15,0.76),rgba(7,18,15,0.22)_52%,rgba(7,18,15,0.58))]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_68%_30%,rgba(232,185,94,0.28),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 24 }).map((_, index) => (
            <span key={index} className="firework-particle absolute h-1.5 w-1.5 rounded-full bg-[#e8c77a] shadow-[0_0_14px_rgba(232,199,122,0.9)]" style={{ left: `${18 + (index * 7) % 68}%`, top: `${24 + (index * 11) % 36}%` }} />
          ))}
        </div>
        <div className="final-cta disney-finale-copy mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl items-end">
          <div className="max-w-3xl border-y border-white/12 py-10">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#e8b95e]">
              <ShieldCheck className="h-4 w-4" />
              Protected booking
            </p>
            <h2 className="mt-3 text-5xl font-semibold leading-[0.96] text-[#fff8e7] sm:text-7xl">Start Your Japan Journey</h2>
            <p className="mt-5 max-w-2xl text-xl leading-8 text-white/76">{"\u0422\u0430\u043d\u044b \u0422\u043e\u043a\u0438\u043e-\u0424\u04af\u0436\u0438 \u0430\u044f\u043b\u0430\u043b \u044d\u043d\u0434\u044d\u044d\u0441 \u044d\u0445\u044d\u043b\u043d\u044d"}</p>
            <Link href="/booking" className="magnetic-cta mt-8 inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#e8b95e] px-6 py-4 font-semibold text-[#1c1710] transition hover:bg-[#f6cf7a]">
              <CalendarDays className="h-4 w-4" />
              {"\u0410\u044f\u043b\u0430\u043b \u0437\u0430\u0445\u0438\u0430\u043b\u0430\u0445"}
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
      <ChatBot />
    </main>
  );
}




