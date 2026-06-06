"use client";

import { FormEvent, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { CalendarDays, Check, CreditCard, Hotel, MapPin, Minus, Plane, Plus, Ticket, Users } from "lucide-react";
import { destinations } from "@/lib/travel-data";

const steps = [
  { label: "Аялал", caption: "Багц сонгох" },
  { label: "Огноо", caption: "Өдөр + хүн тоо" },
  { label: "Холбоо", caption: "Мэдээлэл + төлбөр" },
  { label: "Баталгааж", caption: "Confirmation" },
];

const CHILD_PRICE_RATE = 0.8;

function formatMoney(value: number) {
  return `${new Intl.NumberFormat("mn-MN").format(value)}₮`;
}

type BookingFormProps = {
  initialTourSlug?: string;
  selectedTourSlug?: string;
  onTourSelect?: (slug: string) => void;
  initialEmail?: string;
  initialPhone?: string;
};

export function BookingForm({
  initialTourSlug,
  selectedTourSlug,
  onTourSelect,
  initialEmail = "",
  initialPhone = "",
}: BookingFormProps) {
  const initialSlug = destinations.find((item) => item.slug === initialTourSlug)?.slug ?? destinations[0].slug;
  const [step, setStep] = useState(1);
  const [internalSelectedSlug, setInternalSelectedSlug] = useState(initialSlug);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [preferredDate, setPreferredDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("deposit");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState("");

  const selectedSlug = selectedTourSlug ?? internalSelectedSlug;
  const selected = useMemo(() => destinations.find((item) => item.slug === selectedSlug) ?? destinations[0], [selectedSlug]);
  const adultUnitPrice = selected.price;
  const childUnitPrice = Math.round((selected.price * CHILD_PRICE_RATE) / 10000) * 10000;
  const adultTotal = adults * adultUnitPrice;
  const childTotal = children * childUnitPrice;
  const grandTotal = adultTotal + childTotal;
  const canContinue = step === 1 || (step === 2 && adults >= 1 && preferredDate) || (step === 3 && name.trim() && phone.trim());

  function chooseTour(slug: string) {
    setInternalSelectedSlug(slug);
    onTourSelect?.(slug);
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
        budget,
        message,
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
    <form onSubmit={submitBooking} className="flex max-h-none min-h-[70vh] flex-col overflow-hidden rounded-[8px] border border-[#e8c77a]/18 bg-[#fff8e7]/96 text-[#17211d] shadow-2xl shadow-black/35 backdrop-blur-xl lg:max-h-[calc(100vh-6.5rem)]">
      <div className="border-b border-[#e7d8bb] bg-[#fffaf0] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b0184c]">Sakura Travel</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Аяллын захиалга</h2>
          </div>
          <div className="rounded-[8px] border border-[#e8c77a]/24 bg-white/70 px-4 py-3 text-sm text-[#56645f] shadow-sm">
            {selected.seatsLeft} суудал үлдсэн · {formatMoney(grandTotal)}
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

      <div className="flex-1 overflow-y-auto p-5 sm:p-6">
        {step === 1 ? (
          <div>
            <SectionTitle icon={Ticket} title="Аялал сонгох" />
            <div className="mt-5 grid gap-4">
              {destinations.map((item) => {
                const active = selected.slug === item.slug;
                return (
                  <article
                    key={item.slug}
                    className={`group grid overflow-hidden rounded-[8px] border text-left transition sm:grid-cols-[170px_1fr] ${
                      active ? "border-[#276457] bg-[#eef8f3] shadow-lg shadow-[#276457]/10" : "border-[#ead9c4] bg-white hover:border-[#d7a34f] hover:shadow-md"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => chooseTour(item.slug)}
                      className="min-h-36 bg-cover bg-center transition duration-700 group-hover:scale-[1.03]"
                      style={{ backgroundImage: `url(${item.image})` }}
                      aria-label={`${item.title} сонгох`}
                    />
                    <div className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#ffe5f1] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#b0184c]">{item.badge}</span>
                        <span className="rounded-full bg-[#f7f1e8] px-3 py-1 text-xs font-semibold text-[#276457]">{item.seatsLeft} суудал</span>
                      </div>
                      <h4 className="mt-3 text-xl font-semibold">{item.title}</h4>
                      <p className="mt-2 flex items-center gap-2 text-sm text-[#6b716b]">
                        <MapPin className="h-4 w-4 text-[#d7a34f]" />
                        {item.route}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.includes.map((include) => (
                          <span key={include} className="rounded-full border border-[#ead9c4] bg-white px-3 py-1 text-xs text-[#43504a]">{include}</span>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                        <p className="text-2xl font-semibold text-[#18211f]">{item.priceFrom}</p>
                        <button
                          type="button"
                          onClick={() => chooseTour(item.slug)}
                          className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
                            active ? "bg-[#276457] text-white" : "border border-[#d7a34f] text-[#8b641d] hover:bg-[#fff3d3]"
                          }`}
                        >
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
            <SectionTitle icon={CalendarDays} title="Огноо + хүн тоо" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Counter label="Том хүн" unitPrice={adultUnitPrice} value={adults} min={1} onChange={(value) => setAdults(Math.max(1, value))} />
              <Counter label="Хүүхэд" unitPrice={childUnitPrice} value={children} min={0} onChange={(value) => setChildren(Math.max(0, value))} />
              <label className="text-sm font-semibold text-[#34443e] sm:col-span-2">
                Явах өдөр
                <input type="date" value={preferredDate} onChange={(event) => setPreferredDate(event.target.value)} className="mt-2 h-13 w-full rounded-[8px] border border-[#d8cebd] bg-white px-4 outline-none transition focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/15" />
              </label>
            </div>
            <div className="mt-5 grid gap-3 rounded-[8px] bg-[#f7f1e8] p-4 text-sm text-[#5d655f] sm:grid-cols-3">
              <span className="flex items-center gap-2"><Hotel className="h-4 w-4 text-[#276457]" />{selected.duration}</span>
              <span className="flex items-center gap-2"><Users className="h-4 w-4 text-[#276457]" />{adults + children} аялагч</span>
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#276457]" />{selected.groupSize}</span>
            </div>
            <PriceSummary adults={adults} childCount={children} adultUnitPrice={adultUnitPrice} childUnitPrice={childUnitPrice} adultTotal={adultTotal} childTotal={childTotal} grandTotal={grandTotal} />
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <SectionTitle icon={CreditCard} title="Холбоо барих + төлбөр" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input value={name} onChange={(e) => setName(e.target.value)} className="h-13 rounded-[8px] border border-[#d8cebd] bg-white px-4 outline-none focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/15" placeholder="Нэр" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-13 rounded-[8px] border border-[#d8cebd] bg-white px-4 outline-none focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/15" placeholder="+976 утас" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="h-13 rounded-[8px] border border-[#d8cebd] bg-white px-4 outline-none focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/15" placeholder="Имэйл" />
              <input value={budget} onChange={(e) => setBudget(e.target.value)} className="h-13 rounded-[8px] border border-[#d8cebd] bg-white px-4 outline-none focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/15" placeholder="Төсөв" />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {[["bank", "Дансаар"], ["deposit", "Урьдчилгаа"], ["full", "Бүтэн төлбөр"]].map(([value, label]) => (
                <button key={value} type="button" onClick={() => setPaymentMethod(value)} className={`min-h-12 rounded-[8px] border px-3 text-sm font-semibold transition ${paymentMethod === value ? "border-[#276457] bg-[#276457] text-white" : "border-[#d8cebd] bg-white text-[#43504a] hover:border-[#d7a34f]"}`}>{label}</button>
              ))}
            </div>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-4 w-full rounded-[8px] border border-[#d8cebd] bg-white px-4 py-3 outline-none focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/15" rows={3} placeholder="Нэмэлт хүсэлт..." />
            <PriceSummary adults={adults} childCount={children} adultUnitPrice={adultUnitPrice} childUnitPrice={childUnitPrice} adultTotal={adultTotal} childTotal={childTotal} grandTotal={grandTotal} compact />
          </div>
        ) : null}

        {step === 4 ? <BoardingPass passenger={name || "Sakura Guest"} route={selected.shortTitle} date={preferredDate || "Selected date"} bookingId={bookingId || "SAK-CONFIRM"} status={result ? "Confirmed" : "Pending Payment"} /> : null}
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

function BoardingPass({ passenger, route, date, bookingId, status }: { passenger: string; route: string; date: string; bookingId: string; status: string }) {
  return (
    <div className="py-2">
      <div className="boarding-pass overflow-hidden rounded-[8px] border border-[#d7a34f]/45 shadow-2xl shadow-[#382510]/12">
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
            <p className="mt-5 text-sm leading-6 text-white/72">Манай баг тантай холбогдож төлбөр болон аяллын дэлгэрэнгүйг баталгаажуулна.</p>
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

function PriceSummary({ adults, childCount, adultUnitPrice, childUnitPrice, adultTotal, childTotal, grandTotal, compact = false }: { adults: number; childCount: number; adultUnitPrice: number; childUnitPrice: number; adultTotal: number; childTotal: number; grandTotal: number; compact?: boolean }) {
  return (
    <div className={`mt-5 rounded-[8px] border border-[#ead9c4] bg-white ${compact ? "p-4" : "p-5"}`}>
      <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#b0184c]">Үнийн тооцоо</p><p className="mt-1 text-xs text-[#8a8173]">Хүүхдийн үнэ том хүний үнийн 80%-аар урьдчилан бодогдоно.</p></div><p className="text-right text-2xl font-semibold text-[#18211f]">{formatMoney(grandTotal)}</p></div>
      <div className="mt-4 grid gap-2 text-sm"><div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#f7f1e8] px-4 py-3"><span className="text-[#5d655f]">Том хүн · {adults} x {formatMoney(adultUnitPrice)}</span><span className="font-semibold">{formatMoney(adultTotal)}</span></div><div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#f7f1e8] px-4 py-3"><span className="text-[#5d655f]">Хүүхэд · {childCount} x {formatMoney(childUnitPrice)}</span><span className="font-semibold">{formatMoney(childTotal)}</span></div></div>
    </div>
  );
}
