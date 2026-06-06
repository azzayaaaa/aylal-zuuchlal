"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Check, ChevronLeft, ChevronRight, Headphones, MapPin, ShieldCheck } from "lucide-react";
import { BookingForm } from "@/components/booking-form";
import { destinations, japanImages } from "@/lib/travel-data";

const highlights = [
  { icon: CalendarDays, label: "Улиралд таарсан өдөр сонголт" },
  { icon: Headphones, label: "Менежер захиалгыг баталгаажуулна" },
  { icon: ShieldCheck, label: "Төлбөр болон хувийн мэдээлэл хамгаалалттай" },
];

type BookingExperienceProps = {
  initialTourSlug?: string;
  initialEmail?: string;
  initialPhone?: string;
};

export function BookingExperience({ initialTourSlug, initialEmail = "", initialPhone = "" }: BookingExperienceProps) {
  const initialIndex = Math.max(0, destinations.findIndex((item) => item.slug === initialTourSlug));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const selectedTour = destinations[activeIndex] ?? destinations[0];

  const routeNumber = useMemo(() => String(activeIndex + 1).padStart(2, "0"), [activeIndex]);

  function goNext() {
    setActiveIndex((current) => (current + 1) % destinations.length);
  }

  function goPrev() {
    setActiveIndex((current) => (current - 1 + destinations.length) % destinations.length);
  }

  function selectBySlug(slug: string) {
    const nextIndex = destinations.findIndex((item) => item.slug === slug);
    if (nextIndex >= 0) {
      setActiveIndex(nextIndex);
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#07120f] text-[#fff8e7]">
      <div key={`page-bg-${selectedTour.slug}`} className="booking-bg-reveal absolute inset-0 -z-30">
        <Image
          src={selectedTour.image ?? japanImages.fujiSakura}
          alt={selectedTour.title}
          fill
          sizes="100vw"
          className="object-cover object-center opacity-62"
          priority
        />
      </div>
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(105deg,rgba(5,14,11,0.92),rgba(7,18,15,0.68)_42%,rgba(7,18,15,0.42))]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-72 bg-gradient-to-t from-[#07120f] to-transparent" />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-5 lg:px-8">
        <Link
          href="/"
          className="inline-flex h-11 w-fit items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 text-sm font-semibold text-white/86 shadow-sm backdrop-blur transition hover:bg-white/14"
        >
          <ArrowLeft className="h-4 w-4" />
          Нүүр рүү буцах
        </Link>

        <div className="grid flex-1 gap-5 py-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
          <section className="relative min-h-[62vh] overflow-hidden rounded-[8px] border border-[#e8c77a]/18 bg-[#10201d]/72 text-white shadow-2xl shadow-black/35 backdrop-blur-xl lg:min-h-full">
            <div key={`panel-bg-${selectedTour.slug}`} className="booking-image-reveal absolute inset-0">
              <Image
                src={selectedTour.image ?? japanImages.fujiSakura}
                alt={selectedTour.title}
                fill
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,18,15,0.88),rgba(7,18,15,0.36)_52%,rgba(7,18,15,0.18)),linear-gradient(0deg,rgba(7,18,15,0.92),transparent_45%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(232,199,122,0.2),transparent_28%)]" />

            <div className="relative z-10 flex min-h-[62vh] flex-col justify-between p-5 sm:p-8 lg:min-h-full">
              <div className="flex items-start justify-between gap-4">
                <p className="inline-flex w-fit rounded-full border border-[#e8c77a]/30 bg-black/24 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#e8c77a] backdrop-blur">
                  Secure booking
                </p>
                <span className="rounded-full border border-white/16 bg-white/10 px-4 py-2 font-mono text-sm text-white/78 backdrop-blur">
                  {routeNumber} / {destinations.length}
                </span>
              </div>

              <div className="max-w-2xl">
                <p className="booking-kicker text-sm font-semibold uppercase tracking-[0.24em] text-[#f4b7c9]">
                  {selectedTour.badge} route
                </p>
                <h1 key={`title-${selectedTour.slug}`} className="booking-title-reveal mt-4 max-w-xl text-5xl font-semibold leading-[0.9] text-[#fff8e7] sm:text-7xl">
                  {selectedTour.shortTitle}
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-8 text-white/78">
                  {selectedTour.description}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold text-white/78">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#e8c77a]" />
                    {selectedTour.route}
                  </span>
                  <span className="text-[#e8c77a]">·</span>
                  <span>{selectedTour.duration}</span>
                  <span className="text-[#e8c77a]">·</span>
                  <span>{selectedTour.priceFrom}</span>
                </div>
                <button
                  type="button"
                  onClick={() => selectBySlug(selectedTour.slug)}
                  className="magnetic-cta mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#e8b95e] px-6 font-semibold text-[#17211d] shadow-2xl shadow-[#e8b95e]/25 transition hover:bg-[#f6cf7a]"
                >
                  <Check className="h-4 w-4" />
                  Сонгох
                </button>
              </div>

              <div className="mt-8">
                <div className="grid gap-3 sm:grid-cols-3">
                  {highlights.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 rounded-[8px] border border-white/10 bg-white/8 p-3 backdrop-blur">
                      <Icon className="h-4 w-4 shrink-0 text-[#e8c77a]" />
                      <span className="text-xs font-semibold leading-5 text-white/84">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-end gap-3">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/16 bg-white/10 text-white backdrop-blur transition hover:bg-white/18 sm:inline-flex"
                    aria-label="Өмнөх маршрут"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="booking-thumb-row flex min-w-0 flex-1 gap-3 overflow-x-auto pb-1">
                    {destinations.map((item, index) => {
                      const active = item.slug === selectedTour.slug;
                      return (
                        <button
                          key={item.slug}
                          type="button"
                          onClick={() => setActiveIndex(index)}
                          className={`group relative h-32 min-w-[168px] overflow-hidden rounded-[8px] border text-left shadow-xl shadow-black/20 transition duration-300 sm:h-36 sm:min-w-[190px] ${
                            active ? "border-[#e8b95e] ring-2 ring-[#e8b95e]/40" : "border-white/16 hover:border-white/42"
                          }`}
                        >
                          <Image src={item.image} alt={item.shortTitle} fill sizes="190px" className="object-cover object-center transition duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.72),transparent_58%)]" />
                          <div className="absolute inset-x-0 bottom-0 p-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8b95e]">{item.badge}</p>
                            <p className="mt-1 line-clamp-2 text-sm font-semibold text-white">{item.shortTitle}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/16 bg-white/10 text-white backdrop-blur transition hover:bg-white/18"
                    aria-label="Дараагийн маршрут"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-3 h-px overflow-hidden rounded-full bg-white/18">
                  <div className="h-full bg-[#e8b95e] transition-all duration-500" style={{ width: `${((activeIndex + 1) / destinations.length) * 100}%` }} />
                </div>
              </div>
            </div>
          </section>

          <BookingForm
            initialTourSlug={selectedTour.slug}
            selectedTourSlug={selectedTour.slug}
            onTourSelect={selectBySlug}
            initialEmail={initialEmail}
            initialPhone={initialPhone}
          />
        </div>
      </div>
    </main>
  );
}
