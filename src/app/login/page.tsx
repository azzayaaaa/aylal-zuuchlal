import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, LockKeyhole, Phone, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { japanImages } from "@/lib/travel-data";

const loginBenefits = [
  { icon: Phone, text: "Утасны дугаараар хурдан нэвтрэх" },
  { icon: CalendarCheck, text: "Сонгосон аялал booking руу шууд орно" },
  { icon: LockKeyhole, text: "Захиалгын мэдээлэл хамгаалалттай" },
];

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.redirect ?? "/booking";

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#07120f] px-4 py-5 text-[#fff8e7] sm:px-5 lg:px-8">
      <Image
        src={japanImages.shibuyaNight}
        alt="Tokyo night travel atmosphere"
        fill
        sizes="100vw"
        className="-z-30 object-cover object-center opacity-50"
        priority
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(105deg,rgba(5,14,11,0.94),rgba(7,18,15,0.78)_45%,rgba(7,18,15,0.52))]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-72 bg-gradient-to-t from-[#07120f] to-transparent" />

      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col">
        <Link
          href="/"
          className="inline-flex h-11 w-fit items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 text-sm font-semibold text-white/86 shadow-sm backdrop-blur transition hover:bg-white/14"
        >
          <ArrowLeft className="h-4 w-4" />
          Нүүр рүү буцах
        </Link>

        <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="max-w-2xl">
            <Image
              src="/sakura-travel-logo.svg"
              alt="Sakura Travel logo"
              width={84}
              height={84}
              className="h-20 w-20 rounded-[8px] bg-white object-contain p-2 shadow-2xl shadow-black/25"
            />
            <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#e8c77a]/24 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#e8c77a] backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Sakura secure booking
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.95] text-[#fff8e7] sm:text-7xl">
              Аяллаа үргэлжлүүлэхийн тулд нэвтэрнэ үү
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/76">
              Google эсвэл утасны дугаараар хурдан нэвтэрч, сонгосон Tokyo-Fuji аяллын захиалгаа шууд үргэлжлүүлээрэй.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {loginBenefits.map(({ icon: Icon, text }) => (
                <div key={text} className="rounded-[8px] border border-white/12 bg-white/8 p-4 backdrop-blur">
                  <Icon className="h-5 w-5 text-[#e8c77a]" />
                  <p className="mt-3 text-sm font-semibold leading-6 text-white/82">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[8px] border border-[#e8c77a]/18 bg-[#fff8e7]/96 p-5 text-[#17211d] shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b0184c]">
              Sakura Travel
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Нэвтрэх / бүртгүүлэх</h2>
            <p className="mt-3 text-sm leading-6 text-[#5d655f]">
              Нэвтэрсний дараа booking wizard шууд нээгдэнэ.
            </p>
            <LoginForm next={next} userOnly />
          </section>
        </div>
      </div>
    </main>
  );
}
