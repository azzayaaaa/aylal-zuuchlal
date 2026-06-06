import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Bot, CheckCircle2, Database, Gauge, LayoutDashboard, Mail, ShieldCheck } from "lucide-react";
import { japanImages } from "@/lib/travel-data";

const stack = ["Next.js App Router", "React", "TypeScript", "Prisma", "MySQL", "Vercel", "GSAP", "Nodemailer", "Vercel AI SDK"];

const features = [
  {
    icon: Bot,
    title: "AI itinerary assistant",
    text: "Монгол хэлээр хэрэглэгчийн төсөв, хоног, хүмүүсийн төрөл, Fuji/Disney/shopping/anime сонирхлоор хурдан аяллын санал өгдөг.",
  },
  {
    icon: CheckCircle2,
    title: "Smart booking wizard",
    text: "Аялал, огноо, хүний тоо, бүлгийн төрөл, сонирхол, төлбөрийн сонголтыг нэгтгээд захиалгын request үүсгэнэ.",
  },
  {
    icon: Mail,
    title: "Transactional email",
    text: "Захиалга үүсэхэд хэрэглэгчид аяллын дэлгэрэнгүй мэдээлэлтэй confirmation email илгээхэд бэлэн workflow.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin operations",
    text: "Захиалга хайх, status/payment update хийх, revenue estimate болон хэрэглэгчийн detail view харах dashboard.",
  },
  {
    icon: Gauge,
    title: "Performance polish",
    text: "Local quick replies, DB indexes, build-safe server code, responsive layout, loading/error states дээр төвлөрсөн.",
  },
  {
    icon: ShieldCheck,
    title: "Production readiness",
    text: "Vercel production deploy, env based config, auth-protected admin, gateway fallback, mobile-first UI.",
  },
];

const flow = [
  "Хэрэглэгч landing page дээр аяллын санал ойлгоно.",
  "AI чат эсвэл smart booking wizard-аар сонирхол, төсөв, хоногоо тодруулна.",
  "Booking request үүсч database-д хадгалагдана.",
  "Email confirmation хэрэглэгч рүү илгээгдэх workflow ажиллана.",
  "Admin dashboard дээр manager status, payment, follow-up-г удирдана.",
];

export default function CaseStudyPage() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-[#17211d]">
      <section className="relative isolate overflow-hidden bg-[#10201d] text-white">
        <Image src={japanImages.kawaguchikoFuji} alt="Sakura Travel case study" fill priority sizes="100vw" className="pointer-events-none -z-30 object-cover object-center opacity-32" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(105deg,rgba(7,18,15,0.94),rgba(7,18,15,0.72)_48%,rgba(7,18,15,0.34))]" />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-5 lg:px-8">
          <Link href="/" className="inline-flex h-11 items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 text-sm font-semibold text-white/86 backdrop-blur transition hover:bg-white/16">
            <ArrowLeft className="h-4 w-4" />
            Нүүр рүү буцах
          </Link>
          <div className="max-w-4xl py-16 sm:py-24">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#e8b95e]">Engineering case study</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.98] text-[#fff8e7] sm:text-7xl">
              Sakura Travel production demo.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
              Монгол хэрэглэгчдэд зориулсан Япон аяллын захиалга, AI itinerary зөвлөгөө, email notification, admin operations dashboard бүхий full-stack travel platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {stack.map((item) => (
                <span key={item} className="rounded-full border border-white/14 bg-white/10 px-3 py-2 text-sm font-semibold text-white/82 backdrop-blur">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b0184c]">Problem</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Аяллын сайт хэрэглэгчид шууд ойлгомжтой, manager-т бодитоор ажилладаг байх ёстой.</h2>
          <p className="mt-5 text-lg leading-8 text-[#5d655f]">
            Зорилго нь зүгээр гоё landing page биш. Хэрэглэгч маршрут сонгоод, өөрийн нөхцөлөө бөглөөд, захиалга үүсгээд, manager тэр захиалгыг admin dashboard дээр удирдаж чаддаг product flow бүтээх байсан.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-[8px] border border-[#ead9c4] bg-white p-5 shadow-sm">
              <Icon className="h-5 w-5 text-[#276457]" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5d655f]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#10201d] py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-5 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#e8b95e]">System flow</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">User journey-гээс admin operations хүртэл.</h2>
          </div>
          <div className="relative space-y-3">
            <div className="absolute bottom-0 left-5 top-0 w-px bg-white/12" />
            {flow.map((item, index) => (
              <div key={item} className="relative rounded-[8px] border border-white/12 bg-white/8 p-5 pl-14 backdrop-blur">
                <span className="absolute left-[13px] top-5 grid h-4 w-4 place-items-center rounded-full bg-[#e8b95e] text-[10px] font-bold text-[#17211d]">{index + 1}</span>
                <p className="font-semibold text-[#fff8e7]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-5 lg:px-8">
        <div className="grid gap-6 rounded-[8px] border border-[#ead9c4] bg-white p-6 shadow-sm lg:grid-cols-[0.75fr_1.25fr] lg:p-8">
          <div>
            <Database className="h-7 w-7 text-[#276457]" />
            <h2 className="mt-4 text-3xl font-semibold">What I would explain in an interview</h2>
          </div>
          <div className="grid gap-3 text-sm leading-6 text-[#5d655f] sm:grid-cols-2">
            <p>Би product flow-г эхлээд хэрэглэгчийн шийдвэр гаргах замаар зурагласан: ойлгох, асуух, сонгох, захиалах, баталгаажуулах.</p>
            <p>AI хэсгийг удаан LLM call дээр бүрэн найдаагүй. Local fast answers болон structured prompts-оор Монгол хэлний чанар, latency-г сайжруулсан.</p>
            <p>Admin dashboard-г “table” биш operations tool гэж үзээд хайлт, filter, status update, revenue estimate нэмсэн.</p>
            <p>Frontend дээр visual polish-оос гадна mobile overflow, loading/error states, sticky nav, ScrollTrigger behavior-г шалгаж зассан.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
