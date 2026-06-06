import { destinations } from "@/lib/travel-data";

export type AvailabilityDay = {
  date: string;
  label: string;
  seatsLeft: number;
  demand: "low" | "medium" | "high";
  note: string;
};

export type DiscountResult = {
  code: string;
  label: string;
  amount: number;
};

export const bookingProgressSteps = [
  { key: "new", label: "Захиалга ирсэн", detail: "Таны хүсэлт системд бүртгэгдлээ." },
  { key: "contacted", label: "Менежер холбогдсон", detail: "Маршрут, суудал, төлбөрийг баталгаажуулна." },
  { key: "paid", label: "Төлбөр баталгаажсан", detail: "Урьдчилгаа эсвэл бүтэн төлбөр шалгагдсан." },
  { key: "documents", label: "Виз / паспорт", detail: "Аяллын бичиг баримтыг нягталж байна." },
  { key: "ready", label: "Аялал бэлэн", detail: "Нислэг, буудал, itinerary эцэслэгдсэн." },
] as const;

export const paymentProofOptions = [
  "QPay screenshot",
  "Дансны шилжүүлгийн зураг",
  "Гүйлгээний дугаар",
];

export const seasonalPromoCodes = [
  { code: "SAKURA10", percent: 10, label: "Сакура улирлын 10% хөнгөлөлт" },
  { code: "FAMILY4", percent: 7, label: "4+ хүнтэй гэр бүлийн bonus" },
  { code: "FUJI5", percent: 5, label: "Fuji photo route bonus" },
];

export function formatMoney(value: number) {
  return `${new Intl.NumberFormat("mn-MN").format(Math.max(0, Math.round(value)))}₮`;
}

export function getAvailabilityCalendar(slug: string, baseSeats?: number): AvailabilityDay[] {
  const seed = slug.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const today = new Date();
  const tour = destinations.find((item) => item.slug === slug);
  const seats = baseSeats ?? tour?.seatsLeft ?? 8;

  return Array.from({ length: 14 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index + 2);
    const dateKey = date.toISOString().slice(0, 10);
    const seatsLeft = Math.max(1, Math.min(12, seats + ((seed + index * 3) % 7) - 3));
    const demand = seatsLeft <= 3 ? "high" : seatsLeft <= 6 ? "medium" : "low";

    return {
      date: dateKey,
      label: new Intl.DateTimeFormat("mn-MN", { month: "short", day: "numeric", weekday: "short" }).format(date),
      seatsLeft,
      demand,
      note:
        demand === "high"
          ? "Эрэлт өндөр, хурдан баталгаажуулахад тохиромжтой."
          : demand === "medium"
            ? "Дундаж эрэлттэй, жижиг группт боломжтой."
            : "Суудал тайван, family/group сонголт хийхэд эвтэйхэн.",
    };
  });
}

export function getAvailabilityForDate(slug: string, date: string) {
  return getAvailabilityCalendar(slug).find((item) => item.date === date) ?? null;
}

export function calculateDiscount({
  promoCode,
  subtotal,
  travelers,
  selectedSlug,
  interests,
}: {
  promoCode: string;
  subtotal: number;
  travelers: number;
  selectedSlug: string;
  interests: string[];
}): DiscountResult | null {
  const code = promoCode.trim().toUpperCase();
  const manual = seasonalPromoCodes.find((item) => item.code === code);
  const automaticFamily = travelers >= 4;
  const automaticFuji = selectedSlug === "tokyo-fuji" && interests.some((item) => item.toLowerCase().includes("fuji"));
  const percent = manual?.percent ?? (automaticFamily ? 5 : automaticFuji ? 3 : 0);

  if (!percent) return null;

  return {
    code: manual?.code ?? (automaticFamily ? "GROUP4" : "FUJI-BONUS"),
    label: manual?.label ?? (automaticFamily ? "4+ хүнтэй группийн автомат хөнгөлөлт" : "Fuji interest bonus"),
    amount: Math.round((subtotal * percent) / 100),
  };
}

export function recommendPackage({
  selectedSlug,
  groupType,
  interests,
  budget,
  travelers,
}: {
  selectedSlug: string;
  groupType: string;
  interests: string[];
  budget: string;
  travelers: number;
}) {
  const text = `${groupType} ${interests.join(" ")} ${budget}`.toLowerCase();
  const budgetNumber = Number((budget.match(/\d+/g) ?? []).join(""));
  let slug = selectedSlug;
  let reason = "Таны сонголт itinerary болон бүлгийн төрлөөр сайн таарч байна.";

  if (text.includes("disney") || text.includes("гэр") || text.includes("хүүх")) {
    slug = "disney";
    reason = "Гэр бүл, хүүхэдтэй аялалд Disneyland route хамгийн тайван төлөвлөгөөтэй.";
  } else if (text.includes("anime") || text.includes("shopping") || text.includes("akihabara") || (budgetNumber && budgetNumber <= 4)) {
    slug = "shopping";
    reason = "Shopping/anime сонирхол болон богино төсөвт Токио premium shopping багц илүү ононо.";
  } else if (text.includes("fuji") || text.includes("зураг") || text.includes("хос")) {
    slug = "tokyo-fuji";
    reason = "Fuji, Kawaguchiko, Shibuya хосолсон cinematic route зураг авахад хамгийн гоё.";
  }

  const destination = destinations.find((item) => item.slug === slug) ?? destinations[0];
  const confidence = Math.min(98, 78 + interests.length * 4 + (travelers >= 4 ? 6 : 0));

  return {
    destination,
    confidence,
    reason,
    changed: slug !== selectedSlug,
  };
}

export function progressIndex(status: string, paymentStatus: string) {
  if (["cancelled"].includes(status)) return 0;
  if (["ready"].includes(status)) return 4;
  if (["documents"].includes(status)) return 3;
  if (paymentStatus === "success" || status === "paid" || status === "confirmed") return 2;
  if (status === "contacted") return 1;
  return 0;
}

export function parseBookingPrefill(input: string | null | undefined) {
  const source = String(input ?? "").toLowerCase();
  const interests = [
    source.includes("fuji") || source.includes("фүжи") ? "Fuji зураг" : "",
    source.includes("disney") || source.includes("дисней") ? "Disney" : "",
    source.includes("shopping") || source.includes("шоп") ? "Shopping" : "",
    source.includes("anime") || source.includes("аниме") ? "Anime" : "",
    source.includes("food") || source.includes("хоол") ? "Food tour" : "",
  ].filter(Boolean);
  const groupType = source.includes("гэр") || source.includes("family")
    ? "Гэр бүл"
    : source.includes("хос")
      ? "Хос"
      : source.includes("найз")
        ? "Найзууд"
        : "";
  const budgetMatch = source.match(/(\d+(?:[.,]\d+)?)\s*(сая|say|m|million)/i);
  const budget = budgetMatch ? `${budgetMatch[1].replace(",", ".")} сая ₮` : "";
  const tour = source.includes("disney")
    ? "disney"
    : source.includes("anime") || source.includes("shopping")
      ? "shopping"
      : source.includes("fuji") || source.includes("фүжи")
        ? "tokyo-fuji"
        : "";

  return { interests, groupType, budget, tour };
}
