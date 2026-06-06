"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Check,
  CreditCard,
  MapPin,
  Minus,
  Plane,
  Plus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Ticket,
  UploadCloud,
} from "lucide-react";
import { destinations } from "@/lib/travel-data";
import {
  calculateDiscount,
  formatMoney,
  getAvailabilityCalendar,
  getAvailabilityForDate,
  parseBookingPrefill,
  recommendPackage,
} from "@/lib/travel-logic";

const steps = [
  { label: "Аялал", caption: "Багц сонгох" },
  { label: "Огноо", caption: "Суудал + хүн" },
  { label: "Төлбөр", caption: "Холбоо + proof" },
  { label: "Баталгаажив", caption: "Boarding pass" },
];

const CHILD_PRICE_RATE = 0.8;
const groupTypes = ["Гэр бүл", "Хос", "Найзууд", "Ажил/баг"];
const interestOptions = ["Fuji зураг", "Disney", "Shopping", "Anime", "Сүм хийд", "Food tour"];

const planByInterest: Record<string, string> = {
  "Fuji зураг": "Fuji, Kawaguchiko, Oshino Hakkai дээр өглөөний зураг авалттай өдөр нэмнэ.",
  Disney: "Disneyland эсвэл DisneySea өдрийг queue, ticket, хүүхэдтэй амралтын хэмнэлтэй тааруулна.",
  Shopping: "Shibuya, Ginza, Gotemba outlet-ийг budget болон brand сонирхолд тааруулна.",
  Anime: "Akihabara, character store, game center, Harajuku street culture-ийг багтаана.",
  "Сүм хийд": "Asakusa Senso-ji, Meiji Shrine, хуучин Tokyo алхалтыг тайван хуваарьт оруулна.",
  "Food tour": "Ramen, sushi, street snack, cafe stop-уудыг өдрийн маршруттай холбож өгнө.",
};

type BookingFormProps = {
  initialTourSlug?: string;
  selectedTourSlug?: string;
  onTourSelect?: (slug: string) => void;
  initialEmail?: string;
  initialPhone?: string;
  prefillText?: string;
};

export function BookingForm({
  initialTourSlug,
  selectedTourSlug,
  onTourSelect,
  initialEmail = "",
  initialPhone = "",
  prefillText = "",
}: BookingFormProps) {
  const prefill = useMemo(() => parseBookingPrefill(prefillText), [prefillText]);
  const initialSlug = prefill.tour || destinations.find((item) => item.slug === initialTourSlug)?.slug || destinations[0].slug;
  const [step, setStep] = useState(1);
  const [internalSelectedSlug, setInternalSelectedSlug] = useState(initialSlug);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [preferredDate, setPreferredDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("deposit");
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [paymentProofName, setPaymentProofName] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [budget, setBudget] = useState(prefill.budget);
  const [groupType, setGroupType] = useState(prefill.groupType || groupTypes[0]);
  const [interests, setInterests] = useState<string[]>(prefill.interests.length ? prefill.interests : ["Fuji зураг"]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState(prefillText);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState("");

  const selectedSlug = selectedTourSlug ?? internalSelectedSlug;
  const selected = useMemo(() => destinations.find((item) => item.slug === selectedSlug) ?? destinations[0], [selectedSlug]);
  const availability = useMemo(() => getAvailabilityCalendar(selected.slug, selected.seatsLeft), [selected.seatsLeft, selected.slug]);
  const selectedAvailability = preferredDate ? getAvailabilityForDate(selected.slug, preferredDate) : null;
  const adultUnitPrice = selected.price;
  const childUnitPrice = Math.round((selected.price * CHILD_PRICE_RATE) / 10000) * 10000;
  const adultTotal = adults * adultUnitPrice;
  const childTotal = children * childUnitPrice;
  const subtotal = adultTotal + childTotal;
  const travelers = adults + children;
  const discount = calculateDiscount({ promoCode, subtotal, travelers, selectedSlug: selected.slug, interests });
  const grandTotal = Math.max(0, subtotal - (discount?.amount ?? 0));
  const recommendation = recommendPackage({ selectedSlug: selected.slug, groupType, interests, budget, travelers });
  const canContinue =
    step === 1 ||
    (step === 2 && adults >= 1 && preferredDate) ||
    (step === 3 && name.trim() && phone.trim());
  const generatedPlan = useMemo(() => {
    const selectedInterests = interests.length ? interests : ["Fuji зураг"];
    return [
      `${groupType} аялалд ${selected.duration} хугацаатай ${selected.shortTitle} багц хамгийн тохиромжтой.`,
      selectedAvailability ? `${selectedAvailability.label}: ${selectedAvailability.seatsLeft} суудал үлдсэн. ${selectedAvailability.note}` : "",
      ...selectedInterests.slice(0, 4).map((interest) => planByInterest[interest]),
      discount ? `${discount.label}: -${formatMoney(discount.amount)}.` : "",
      `Урьдчилсан нийт дүн: ${formatMoney(grandTotal)}. Эцсийн үнэ нислэг, буудал, нэмэлт үзвэрээс хамаарна.`,
    ].filter(Boolean);
  }, [discount, grandTotal, groupType, interests, selected.duration, selected.shortTitle, selectedAvailability]);

  function chooseTour(slug: string) {
    setInternalSelectedSlug(slug);
    onTourSelect?.(slug);
  }

  function toggleInterest(interest: string) {
    setInterests((current) =>
      current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest],
    );
  }

  function applyRecommendation() {
    chooseTour(recommendation.destination.slug);
  }

  async function handleProof(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPaymentProofName(file.name);
    setPaymentProofUrl(`Proof uploaded: ${file.name}`);
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canContinue || submitting) return;

    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }

    setSubmitting(true);
    setError("");

    const response = await fetch("/api/gateway/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        destination: selected.title,
        adults,
        children,
        preferredDate,
        paymentMethod,
        paymentProofUrl,
        budget,
        message: [
          message.trim(),
          "",
          "Smart trip profile:",
          `Group: ${groupType}`,
          `Interests: ${interests.join(", ") || "Not selected"}`,
          `Availability: ${selectedAvailability ? `${selectedAvailability.date}, ${selectedAvailability.seatsLeft} seats` : "Not selected"}`,
          `Promo: ${discount ? `${discount.code} / ${formatMoney(discount.amount)}` : "None"}`,
          `Recommendation: ${recommendation.destination.title} (${recommendation.confidence}%)`,
          ...generatedPlan,
        ].filter(Boolean).join("\n"),
      }),
    });

    const data = (await response.json()) as { message?: string; error?: string; bookingCode?: string };
    setSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "Захиалга илгээхэд алдаа гарлаа.");
      return;
    }

    setResult(data.message ?? "Захиалга бүртгэгдлээ.");
    setBookingId(data.bookingCode ?? `SAK-${Date.now().toString(36).toUpperCase().slice(-6)}`);
    setStep(4);
  }

  return (
    <form onSubmit={submitBooking} className="booking-shell flex max-h-none min-h-[70vh] flex-col overflow-hidden rounded-[8px] border border-[#e8c77a]/18 bg-[#fff8e7]/96 text-[#17211d] shadow-2xl shadow-black/35 backdrop-blur-xl lg:max-h-[calc(100vh-6.5rem)]">
      <div className="border-b border-[#e7d8bb] bg-[#fffaf0] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b0184c]">Sakura Travel</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Аяллын захиалга</h2>
          </div>
          <div className="rounded-[8px] border border-[#e8c77a]/24 bg-white/75 px-4 py-3 text-sm text-[#56645f] shadow-sm">
            <span className="font-semibold text-[#17211d]">{formatMoney(grandTotal)}</span>
            <span className="mx-2 text-[#c49a52]">·</span>
            {selectedAvailability ? `${selectedAvailability.seatsLeft} суудал үлдсэн` : `${selected.seatsLeft} суудал`}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-2">
          {steps.map((item, index) => {
            const active = index + 1 <= step;
            return (
              <div key={item.label} className="min-w-0">
                <div className={`h-2 rounded-full transition ${active ? "bg-[#276457]" : "bg-[#ead9c4]"}`} />
                <p className={`mt-2 truncate text-xs font-semibold ${active ? "text-[#276457]" : "text-[#8a8173]"}`}>{item.label}</p>
                <p className="hidden truncate text-[11px] text-[#8a8173] sm:block">{item.caption}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div key={step} className="booking-step-panel flex-1 overflow-y-auto p-5 sm:p-6">
        {step === 1 ? (
          <div>
            <SectionTitle icon={Ticket} title="Аялал сонгох" />
            <div className="mt-5 grid gap-4">
              {destinations.map((item) => {
                const active = selected.slug === item.slug;
                return (
                  <article key={item.slug} className={`group grid overflow-hidden rounded-[8px] border text-left transition sm:grid-cols-[170px_1fr] ${active ? "border-[#276457] bg-[#eef8f3] shadow-lg shadow-[#276457]/10" : "border-[#ead9c4] bg-white hover:border-[#d7a34f] hover:shadow-md"}`}>
                    <button type="button" onClick={() => chooseTour(item.slug)} className="min-h-36 bg-cover bg-center transition duration-700 group-hover:scale-[1.03]" style={{ backgroundImage: `url(${item.image})` }} aria-label={`${item.title} сонгох`} />
                    <div className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#ffe5f1] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#b0184c]">{item.badge}</span>
                        <span className="rounded-full bg-[#f7f1e8] px-3 py-1 text-xs font-semibold text-[#276457]">{item.seatsLeft} суудал</span>
                        <span className="rounded-full bg-[#eef8f3] px-3 py-1 text-xs font-semibold text-[#276457]">{item.slug === "disney" ? "Best for family" : item.slug === "shopping" ? "Anime lovers" : "Fuji photo"}</span>
                      </div>
                      <h4 className="mt-3 text-xl font-semibold">{item.title}</h4>
                      <p className="mt-2 flex items-center gap-2 text-sm text-[#6b716b]"><MapPin className="h-4 w-4 text-[#d7a34f]" />{item.route}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.includes.map((include) => <span key={include} className="rounded-full border border-[#ead9c4] bg-white px-3 py-1 text-xs text-[#43504a]">{include}</span>)}
                      </div>
                      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                        <p className="text-2xl font-semibold text-[#18211f]">{item.priceFrom}</p>
                        <button type="button" onClick={() => chooseTour(item.slug)} className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${active ? "bg-[#276457] text-white" : "border border-[#d7a34f] text-[#8b641d] hover:bg-[#fff3d3]"}`}>
                          {active ? <Check className="h-4 w-4" /> : null}
                          {active ? "Сонгосон" : "Сонгох"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <SectionTitle icon={CalendarDays} title="Огноо + суудал + хүн тоо" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Counter label="Том хүн" unitPrice={adultUnitPrice} value={adults} min={1} onChange={(value) => setAdults(Math.max(1, value))} />
              <Counter label="Хүүхэд" unitPrice={childUnitPrice} value={children} min={0} onChange={(value) => setChildren(Math.max(0, value))} />
            </div>

            <div className="mt-5 rounded-[8px] border border-[#ead9c4] bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a8361]">Availability calendar</p>
                  <p className="mt-1 text-sm text-[#5d655f]">Өдөр бүрийн үлдсэн суудлыг харж сонгоно.</p>
                </div>
                <input type="date" value={preferredDate} onChange={(event) => setPreferredDate(event.target.value)} className="h-11 rounded-[8px] border border-[#d8cebd] bg-[#fffaf0] px-3 text-sm outline-none transition focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/15" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                {availability.map((day) => {
                  const active = preferredDate === day.date;
                  return (
                    <button key={day.date} type="button" onClick={() => setPreferredDate(day.date)} className={`availability-day min-h-20 rounded-[8px] border p-2 text-left transition ${active ? "border-[#276457] bg-[#276457] text-white shadow-lg shadow-[#276457]/20" : "border-[#ead9c4] bg-[#fffaf0] hover:border-[#d7a34f] hover:bg-white"}`}>
                      <span className="block text-xs font-semibold">{day.label}</span>
                      <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-bold ${active ? "bg-white/16 text-white" : day.demand === "high" ? "bg-[#ffe5f1] text-[#b0184c]" : "bg-[#eef8f3] text-[#276457]"}`}>{day.seatsLeft} суудал</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <SmartBuilder
              groupType={groupType}
              setGroupType={setGroupType}
              interests={interests}
              toggleInterest={toggleInterest}
              budget={budget}
              setBudget={setBudget}
              generatedPlan={generatedPlan}
              recommendation={recommendation}
              onApplyRecommendation={applyRecommendation}
            />
            <PriceSummary adults={adults} childCount={children} adultUnitPrice={adultUnitPrice} childUnitPrice={childUnitPrice} adultTotal={adultTotal} childTotal={childTotal} subtotal={subtotal} discount={discount} grandTotal={grandTotal} />
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <SectionTitle icon={CreditCard} title="Холбоо барих + төлбөр" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input value={name} onChange={(e) => setName(e.target.value)} className="h-13 rounded-[8px] border border-[#d8cebd] bg-white px-4 outline-none focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/15" placeholder="Нэр" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-13 rounded-[8px] border border-[#d8cebd] bg-white px-4 outline-none focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/15" placeholder="+976 утас" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="h-13 rounded-[8px] border border-[#d8cebd] bg-white px-4 outline-none focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/15" placeholder="Имэйл" />
              <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="h-13 rounded-[8px] border border-[#d8cebd] bg-white px-4 uppercase outline-none focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/15" placeholder="Promo code: SAKURA10" />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {[["bank", "Дансаар"], ["deposit", "Урьдчилгаа"], ["full", "Бүтэн төлбөр"]].map(([value, label]) => (
                <button key={value} type="button" onClick={() => setPaymentMethod(value)} className={`min-h-12 rounded-[8px] border px-3 text-sm font-semibold transition ${paymentMethod === value ? "border-[#276457] bg-[#276457] text-white" : "border-[#d8cebd] bg-white text-[#43504a] hover:border-[#d7a34f]"}`}>{label}</button>
              ))}
            </div>
            <div className="mt-4 grid gap-4 rounded-[8px] border border-[#ead9c4] bg-white p-4 shadow-sm sm:grid-cols-[180px_1fr]">
              <div className="payment-qr-card rounded-[8px] border border-[#d8cebd] bg-white p-3">
                <Image src="/images/payment-qr.svg" alt="Sakura Travel payment QR" width={320} height={320} className="h-auto w-full rounded-[6px]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b0184c]">QPay / банкны шилжүүлэг</p>
                <h3 className="mt-2 text-xl font-semibold text-[#17211d]">QR уншуулаад proof screenshot оруулна.</h3>
                <div className="mt-3 grid gap-2 text-sm text-[#5d655f]">
                  <p>Хүлээн авагч: Sakura Travel</p>
                  <p>Гүйлгээний утга: нэр + утас + аяллын багц</p>
                  <p>Менежер proof шалгаад payment status-г баталгаажуулна.</p>
                </div>
              </div>
            </div>
            <label className="proof-upload-card mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-[#d7a34f] bg-[#fffaf0] px-4 py-5 text-center transition hover:bg-white">
              <UploadCloud className="h-7 w-7 text-[#b9872f]" />
              <span className="mt-2 font-semibold text-[#34443e]">{paymentProofName || "QPay / шилжүүлгийн screenshot upload"}</span>
              <span className="mt-1 text-xs text-[#8a8173]">Admin proof шалгаад payment status-г paid болгоно.</span>
              <input type="file" accept="image/*" onChange={handleProof} className="sr-only" />
            </label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-4 w-full rounded-[8px] border border-[#d8cebd] bg-white px-4 py-3 outline-none focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/15" rows={3} placeholder="Нэмэлт хүсэлт..." />
            <PriceSummary adults={adults} childCount={children} adultUnitPrice={adultUnitPrice} childUnitPrice={childUnitPrice} adultTotal={adultTotal} childTotal={childTotal} subtotal={subtotal} discount={discount} grandTotal={grandTotal} compact />
          </div>
        ) : null}

        {step === 4 ? <BoardingPass passenger={name || "Sakura Guest"} route={selected.shortTitle} date={preferredDate || "Сонгосон өдөр"} bookingId={bookingId || "SAK-CONFIRM"} status={result ? "Confirmed" : "Pending Payment"} /> : null}
        {error ? <p className="mt-5 rounded-[8px] bg-[#fff1df] px-4 py-3 text-sm text-[#7b481c]">{error}</p> : null}
      </div>

      {step < 4 ? (
        <div className="flex flex-col gap-3 border-t border-[#ead9c4] bg-[#fffaf0] p-5 sm:flex-row sm:justify-between">
          <button type="button" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1} className="h-12 rounded-full border border-[#d8cebd] px-5 font-semibold text-[#34443e] transition hover:bg-[#f7f1e8] disabled:opacity-40">Буцах</button>
          <button disabled={submitting || !canContinue} className="h-12 rounded-full bg-[#d7a34f] px-6 font-semibold text-[#1c1710] transition hover:bg-[#f4c76b] disabled:opacity-50">{step < 3 ? "Дараагийн алхам" : submitting ? "Илгээж байна..." : "Захиалга баталгаажуулах"}</button>
        </div>
      ) : null}
    </form>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return <div className="flex items-center gap-2 text-[#276457]"><Icon className="h-5 w-5" /><h3 className="font-semibold">{title}</h3></div>;
}

function SmartBuilder({ groupType, setGroupType, interests, toggleInterest, budget, setBudget, generatedPlan, recommendation, onApplyRecommendation }: { groupType: string; setGroupType: (value: string) => void; interests: string[]; toggleInterest: (interest: string) => void; budget: string; setBudget: (value: string) => void; generatedPlan: string[]; recommendation: ReturnType<typeof recommendPackage>; onApplyRecommendation: () => void }) {
  return (
    <div className="mt-5 rounded-[8px] border border-[#ead9c4] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[#276457]"><Sparkles className="h-4 w-4" /><p className="font-semibold">Smart itinerary builder</p></div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a8361]">Аяллын төрөл</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {groupTypes.map((type) => <button key={type} type="button" onClick={() => setGroupType(type)} className={`h-10 rounded-[8px] border px-3 text-sm font-semibold transition ${groupType === type ? "border-[#276457] bg-[#276457] text-white" : "border-[#d8cebd] bg-[#fffaf0] text-[#43504a] hover:border-[#d7a34f]"}`}>{type}</button>)}
          </div>
          <input value={budget} onChange={(event) => setBudget(event.target.value)} className="mt-3 h-11 w-full rounded-[8px] border border-[#d8cebd] bg-[#fffaf0] px-3 text-sm outline-none focus:border-[#276457]" placeholder="Төсөв: 5 сая ₮" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a8361]">Сонирхол</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {interestOptions.map((interest) => {
              const active = interests.includes(interest);
              return <button key={interest} type="button" onClick={() => toggleInterest(interest)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${active ? "border-[#b0184c] bg-[#ffe5f1] text-[#b0184c]" : "border-[#d8cebd] bg-[#fffaf0] text-[#43504a] hover:border-[#d7a34f]"}`}>{interest}</button>;
            })}
          </div>
          <div className="mt-3 rounded-[8px] bg-[#eef8f3] p-3 text-sm text-[#276457]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold">{recommendation.destination.shortTitle} санал болгож байна</span>
              <span className="rounded-full bg-white px-2 py-1 text-xs font-bold">{recommendation.confidence}% match</span>
            </div>
            <p className="mt-2 leading-6 text-[#405148]">{recommendation.reason}</p>
            {recommendation.changed ? <button type="button" onClick={onApplyRecommendation} className="mt-3 rounded-full bg-[#276457] px-4 py-2 text-xs font-semibold text-white">Энэ багцыг сонгох</button> : null}
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-[8px] bg-[#10201d] p-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e8b95e]">AI itinerary preview</p>
        <div className="mt-3 space-y-2">
          {generatedPlan.map((line) => <p key={line} className="flex gap-2 text-sm leading-6 text-white/78"><Check className="mt-1 h-4 w-4 shrink-0 text-[#e8b95e]" />{line}</p>)}
        </div>
      </div>
    </div>
  );
}

function BoardingPass({ passenger, route, date, bookingId, status }: { passenger: string; route: string; date: string; bookingId: string; status: string }) {
  return (
    <div className="py-2">
      <div className="boarding-pass confirmed-stamp overflow-hidden rounded-[8px] border border-[#d7a34f]/45 shadow-2xl shadow-[#382510]/12">
        <div className="grid lg:grid-cols-[1fr_220px]">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d8cebd] pb-5">
              <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b0184c]">Sakura Travel</p><h3 className="mt-2 text-3xl font-semibold text-[#15211d]">Booking Confirmed</h3></div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#276457] px-4 py-2 text-sm font-semibold text-white"><Check className="h-4 w-4" />{status}</span>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <PassField label="Customer" value={passenger} /><PassField label="Route" value={route} /><PassField label="Service" value="Sakura Class" /><PassField label="Departure" value={date} /><PassField label="Booking ID" value={bookingId} /><PassField label="Status" value={status} />
            </div>
          </div>
          <div className="border-t border-dashed border-[#d7a34f]/60 bg-[#10201d] p-6 text-white lg:border-l lg:border-t-0">
            <Plane className="h-8 w-8 text-[#e8b95e]" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#e8b95e]">Tokyo-Fuji</p>
            <p className="mt-5 text-sm leading-6 text-white/72">Манай баг тантай холбогдож төлбөр, суудал, аяллын дэлгэрэнгүйг баталгаажуулна.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PassField({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a8361]">{label}</p><p className="mt-1 text-lg font-semibold text-[#15211d]">{value}</p></div>;
}

function Counter({ label, unitPrice, value, min, onChange }: { label: string; unitPrice: number; value: number; min: number; onChange: (value: number) => void }) {
  return (
    <div className="rounded-[8px] border border-[#d8cebd] bg-white p-4">
      <div className="flex items-start justify-between gap-3"><p className="text-sm font-semibold text-[#34443e]">{label}</p><p className="text-right text-xs font-semibold text-[#276457]">{formatMoney(unitPrice)}<span className="block font-normal text-[#8a8173]">нэг хүн</span></p></div>
      <div className="mt-3 flex items-center justify-between"><button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f1e8] text-[#276457] transition hover:bg-[#ead9c4]"><Minus className="h-4 w-4" /></button><span className="text-3xl font-semibold">{value}</span><button type="button" onClick={() => onChange(value + 1)} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#276457] text-white transition hover:bg-[#1f5146]"><Plus className="h-4 w-4" /></button></div>
    </div>
  );
}

function PriceSummary({ adults, childCount, adultUnitPrice, childUnitPrice, adultTotal, childTotal, subtotal, discount, grandTotal, compact = false }: { adults: number; childCount: number; adultUnitPrice: number; childUnitPrice: number; adultTotal: number; childTotal: number; subtotal: number; discount: ReturnType<typeof calculateDiscount>; grandTotal: number; compact?: boolean }) {
  return (
    <div className={`mt-5 rounded-[8px] border border-[#ead9c4] bg-white ${compact ? "p-4" : "p-5"}`}>
      <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#b0184c]">Үнийн тооцоо</p><p className="mt-1 text-xs text-[#8a8173]">Хүүхдийн үнэ том хүний үнийн 80%-аар урьдчилан бодогдоно.</p></div><p className="text-right text-2xl font-semibold text-[#18211f]">{formatMoney(grandTotal)}</p></div>
      <div className="mt-4 grid gap-2 text-sm">
        <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#f7f1e8] px-4 py-3"><span className="text-[#5d655f]">Том хүн · {adults} x {formatMoney(adultUnitPrice)}</span><span className="font-semibold">{formatMoney(adultTotal)}</span></div>
        <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#f7f1e8] px-4 py-3"><span className="text-[#5d655f]">Хүүхэд · {childCount} x {formatMoney(childUnitPrice)}</span><span className="font-semibold">{formatMoney(childTotal)}</span></div>
        {discount ? <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#eef8f3] px-4 py-3 text-[#276457]"><span className="font-semibold">{discount.label}</span><span className="font-semibold">-{formatMoney(discount.amount)}</span></div> : null}
        <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#10201d] px-4 py-3 text-white"><span className="inline-flex items-center gap-2"><ReceiptText className="h-4 w-4 text-[#e8b95e]" />Нийт</span><span className="font-semibold">{formatMoney(discount ? grandTotal : subtotal)}</span></div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-[#6b716b]"><ShieldCheck className="h-4 w-4 text-[#276457]" />Эцсийн үнэ менежерийн баталгаажуулалтаар эцэслэгдэнэ.</div>
    </div>
  );
}
