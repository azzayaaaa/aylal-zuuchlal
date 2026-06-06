"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpDown,
  BedDouble,
  Bus,
  CalendarDays,
  Filter,
  MapPin,
  ShieldCheck,
  Ticket,
  UserRoundCheck,
  X,
} from "lucide-react";
import type { Destination } from "@/lib/travel-data";
import { Reveal } from "@/components/reveal";

type DestinationExplorerProps = {
  destinations: Destination[];
};

const filters = [
  { value: "all", label: "Бүгд" },
  { value: "tokyo", label: "Tokyo" },
  { value: "fuji", label: "Fuji" },
  { value: "kyoto", label: "Kyoto" },
  { value: "disney", label: "Disneyland" },
  { value: "family", label: "Family" },
];

const badgeTone: Record<Destination["badge"], string> = {
  Hot: "bg-[#ffe2e9] text-[#b0184c]",
  New: "bg-[#e3f2ed] text-[#276457]",
  Featured: "bg-[#fff0c9] text-[#876016]",
  Family: "bg-[#e7edff] text-[#2d4f9e]",
  "Sakura Season": "bg-[#ffe5f1] text-[#a51252]",
};

const includeIcons = [BedDouble, UserRoundCheck, Bus, ShieldCheck];

export function DestinationExplorer({ destinations }: DestinationExplorerProps) {
  const [selected, setSelected] = useState<Destination | null>(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recommended");

  const visibleDestinations = useMemo(() => {
    const filtered = destinations.filter((destination) => {
      if (filter === "all") return true;
      return (
        destination.category === filter ||
        destination.tags.some((tag) => tag.toLowerCase() === filter)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "seats") return a.seatsLeft - b.seatsLeft;
      return 0;
    });
  }, [destinations, filter, sort]);

  return (
    <>
      <div className="mt-10 flex flex-col gap-3 rounded-[24px] bg-white/85 p-3 shadow-sm ring-1 ring-[#ead9c4] backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex h-10 items-center gap-2 px-2 text-sm font-semibold text-[#34443e]">
            <Filter className="h-4 w-4" />
            Filter
          </span>
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`h-10 rounded-full px-4 text-sm font-semibold transition ${
                filter === item.value
                  ? "bg-[#276457] text-white"
                  : "bg-[#fbf7ef] text-[#34443e] hover:bg-[#f4e9d8]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-[#34443e]">
          <ArrowUpDown className="h-4 w-4" />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-10 rounded-full border border-[#d8cebd] bg-white px-4 outline-none focus:border-[#276457]"
          >
            <option value="recommended">Санал болгох</option>
            <option value="price-asc">Үнэ өсөхөөр</option>
            <option value="price-desc">Үнэ буурахаар</option>
            <option value="seats">Суудал цөөнөөр</option>
          </select>
        </label>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {visibleDestinations.map((destination) => (
          <Reveal
            key={destination.title}
            className="group overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-[#ead9c4] transition duration-500 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="grid h-full md:grid-cols-[0.95fr_1.05fr]">
              <button
                type="button"
                onClick={() => setSelected(destination)}
                className="relative min-h-80 overflow-hidden text-left"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${destination.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${badgeTone[destination.badge]}`}
                >
                  {destination.badge}
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-sm text-white/78">{destination.route}</p>
                  <h3 className="mt-2 text-2xl font-semibold leading-tight">
                    {destination.title}
                  </h3>
                </div>
              </button>

              <div className="flex flex-col p-5 sm:p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#eef8f3] px-3 py-1 text-sm font-semibold text-[#276457]">
                    {destination.duration}
                  </span>
                  <span className="rounded-full bg-[#fff4d8] px-3 py-1 text-sm font-semibold text-[#876016]">
                    {destination.seatsLeft} суудал үлдсэн
                  </span>
                </div>
                <p className="mt-4 leading-7 text-[#5d655f]">
                  {destination.description}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {destination.includes.map((item, index) => {
                    const Icon = includeIcons[index % includeIcons.length];
                    return (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-2xl bg-[#fbf7ef] p-3 text-sm font-medium text-[#43504a]"
                      >
                        <Icon className="h-4 w-4 text-[#276457]" />
                        {item}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-auto pt-6">
                  <p className="text-sm text-[#6b716b]">Үнэ эхлэх</p>
                  <p className="text-2xl font-semibold text-[#18211f]">
                    {destination.priceFrom}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setSelected(destination)}
                      className="inline-flex h-12 items-center justify-center rounded-full border border-[#d8cebd] px-5 font-semibold text-[#34443e] transition hover:border-[#276457]"
                    >
                      Дэлгэрэнгүй
                    </button>
                    <a
                      href={`/?destination=${encodeURIComponent(destination.title)}#booking`}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#276457] px-5 font-semibold text-white transition hover:bg-[#1f5146]"
                    >
                      Захиалах
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div className="mx-auto max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]">
            <div className="relative h-72 overflow-hidden sm:h-96">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${selected.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/88 text-[#18211f]"
                aria-label="Хаах"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f4c76b]">
                  Аяллын хөтөлбөр
                </p>
                <h3 className="mt-2 text-3xl font-semibold sm:text-4xl">
                  {selected.title}
                </h3>
              </div>
            </div>

            <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1fr_0.85fr]">
              <div>
                <div className="grid gap-3 sm:grid-cols-4">
                  {[
                    ["Хугацаа", selected.duration],
                    ["Route", selected.route],
                    ["Улирал", selected.bestSeason],
                    ["Үнэ", selected.priceFrom],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-[#fbf7ef] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b716b]">
                        {label}
                      </p>
                      <p className="mt-2 font-semibold text-[#18211f]">{value}</p>
                    </div>
                  ))}
                </div>

                <h4 className="mt-7 flex items-center gap-2 text-lg font-semibold">
                  <CalendarDays className="h-5 w-5 text-[#276457]" />
                  Itinerary timeline
                </h4>
                <ol className="mt-5 space-y-3">
                  {selected.itinerary.map((item, index) => (
                    <li key={item} className="grid grid-cols-[42px_1fr] gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#276457] font-mono text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <p className="rounded-2xl border border-[#ead9c4] p-3 text-sm leading-6 text-[#5d655f]">
                        {item}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-lg font-semibold">
                  <Ticket className="h-5 w-5 text-[#276457]" />
                  Included
                </h4>
                <div className="mt-4 grid gap-3">
                  {selected.includes.map((item, index) => {
                    const Icon = includeIcons[index % includeIcons.length];
                    return (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-2xl bg-[#eef8f3] p-4 text-[#1f5146]"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-semibold">{item}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 rounded-3xl bg-[#10201d] p-5 text-white">
                  <MapPin className="h-6 w-6 text-[#f4c76b]" />
                  <p className="mt-4 text-sm text-white/70">Route</p>
                  <p className="mt-1 text-xl font-semibold">{selected.route}</p>
                  <p className="mt-4 text-sm text-white/70">Remaining seats</p>
                  <p className="mt-1 text-xl font-semibold">
                    {selected.seatsLeft} суудал үлдсэн
                  </p>
                </div>
                <a
                  href={`/?destination=${encodeURIComponent(selected.title)}#booking`}
                  onClick={() => setSelected(null)}
                  className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#d7a34f] px-5 font-semibold text-[#1c1710] transition hover:bg-[#f4c76b]"
                >
                  Энэ аяллаар захиалах
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
