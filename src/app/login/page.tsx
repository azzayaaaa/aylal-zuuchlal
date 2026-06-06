import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, LockKeyhole, Phone, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { japanImages } from "@/lib/travel-data";

const loginBenefits = [
  { icon: Phone, text: "Утас эсвэл имэйлээр хурдан нэвтрэх" },
  { icon: CalendarCheck, text: "Сонгосон аяллын захиалга руу шууд орно" },
  { icon: LockKeyhole, text: "Захиалгын мэдээлэл хамгаалалттай" },
];

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.redirect ?? "/booking";

  return (
    <main className="relative isolate min-h-svh overflow-hidden bg-[#07120f] px-4 py-4 text-[#fff8e7] sm:px-5 sm:py-5 lg:px-8">
      <Image
        src={japanImages.shibuyaNight}
        alt="Tokyo night travel atmosphere"
        fill
        sizes="100vw"
        className="-z-30 object-cover object-center opacity-50"
        priority
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(105deg,rgba(5,14,11,0.94),rgba(7,18,15,0.8)_45%,rgba(7,18,15,0.56))]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-72 bg-gradient-to-t from-[#07120f] to-transparent" />

      <div className="mx-auto flex min-h-[calc(100svh-2rem)] max-w-6xl flex-col">
        <Link
          href="/"
          className="inline-flex h-10 w-fit items-center gap-2 rounded-full border border-white/14 bg-white/8 px-3 text-sm font-semibold text-white/86 shadow-sm backdrop-blur transition hover:bg-white/14 sm:h-11 sm:px-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Нүүр рүү буцах
        </Link>

        <div className="grid flex-1 items-center gap-5 py-5 md:py-7 lg:grid-cols-[0.92fr_0.82fr] lg:gap-10">
          <section className="order-2 max-w-2xl lg:order-1">
            <Image
              src="/sakura-travel-logo.svg"
              alt="Sakura Travel logo"
              width={84}
              height={84}
              className="hidden h-20 w-20 rounded-[8px] bg-white object-contain p-2 shadow-2xl shadow-black/25 sm:block"
            />
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e8c77a]/24 bg-black/20 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e8c77a] backdrop-blur sm:mt-8 sm:px-4 sm:text-xs sm:tracking-[0.22em]">
              <Sparkles className="h-4 w-4" />
              Sakura secure booking
            </p>
            <h1 className="mt-4 max-w-2xl text-[clamp(2.35rem,11vw,4.5rem)] font-semibold leading-[0.98] text-[#fff8e7] sm:mt-5 lg:text-7xl">
              Аяллаа үргэлжлүүлэхийн тулд нэвтэрнэ үү
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/76 sm:mt-6 sm:text-lg sm:leading-8">
              Google, утас эсвэл имэйлээр хурдан нэвтрээд сонгосон Tokyo-Fuji аяллын захиалгаа шууд үргэлжлүүлээрэй.
            </p>
            <div className="mt-5 grid gap-2 sm:mt-8 sm:grid-cols-3 sm:gap-3">
              {loginBenefits.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 rounded-[8px] border border-white/12 bg-white/8 p-3 backdrop-blur sm:block sm:p-4">
                  <Icon className="h-5 w-5 shrink-0 text-[#e8c77a]" />
                  <p className="text-sm font-semibold leading-5 text-white/82 sm:mt-3 sm:leading-6">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="order-1 rounded-[8px] border border-[#e8c77a]/18 bg-[#fff8e7]/96 p-4 text-[#17211d] shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-6 lg:order-2 lg:p-7">
            <div className="flex items-center gap-3 sm:hidden">
              <Image
                src="/sakura-travel-logo.svg"
                alt="Sakura Travel logo"
                width={52}
                height={52}
                className="h-12 w-12 rounded-[8px] bg-white object-contain p-1 shadow-sm ring-1 ring-[#ead9c4]"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b0184c]">
                  Sakura Travel
                </p>
                <h2 className="mt-1 text-xl font-semibold">Нэвтрэх</h2>
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b0184c]">
                Sakura Travel
              </p>
              <h2 className="mt-2 text-3xl font-semibold">Нэвтрэх / бүртгүүлэх</h2>
              <p className="mt-3 text-sm leading-6 text-[#5d655f]">
                Нэвтэрсний дараа booking wizard шууд нээгдэнэ.
              </p>
            </div>
            <LoginForm next={next} userOnly />
          </section>
        </div>
      </div>
    </main>
  );
}
