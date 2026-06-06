import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, MapPin, Plane, ShieldCheck, TicketCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getUserSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { bookingProgressSteps, progressIndex } from "@/lib/travel-logic";

function formatDate(date: Date | null) {
  if (!date) return "Огноо товлоогүй";
  return new Intl.DateTimeFormat("mn-MN", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

function timeRemaining(date: Date | null) {
  if (!date) return "Аяллын өдөр баталгаажаагүй байна";
  const diff = date.getTime() - Date.now();
  if (diff <= -24 * 60 * 60 * 1000) return "Аяллын хугацаа өнгөрсөн байна";
  if (diff <= 0) return "Аялал өнөөдөр эхэлнэ";
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  if (days === 0) return `Аялал эхлэхэд ${hours} цаг үлдлээ`;
  return `Аялал эхлэхэд ${days} хоног ${hours} цаг үлдлээ`;
}

export default async function MyBookingsPage() {
  const user = await getUserSession();
  if (!user) redirect("/login?redirect=/my-bookings");

  const filters = [
    user.email ? { email: user.email } : null,
    user.phone ? { phone: user.phone } : null,
    user.identifier ? { email: user.identifier } : null,
    user.identifier ? { phone: user.identifier } : null,
  ].filter(Boolean) as Array<{ email: string } | { phone: string }>;
  const bookings = filters.length
    ? await getDb().inquiry.findMany({ where: { OR: filters }, orderBy: { createdAt: "desc" } }).catch((error) => {
        console.warn("My bookings unavailable", error);
        return [];
      })
    : [];

  return (
    <main className="min-h-screen bg-[#07120f] text-white">
      <SiteHeader />
      <section className="relative isolate overflow-hidden px-4 pb-16 pt-28 sm:px-5 lg:px-8">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_10%,rgba(232,185,94,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(244,183,201,0.14),transparent_28%),linear-gradient(135deg,#07120f,#10261f_50%,#07120f)]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-[linear-gradient(180deg,rgba(255,248,231,0.08),transparent)]" />

        <div className="mx-auto max-w-6xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Нүүр рүү буцах
          </Link>

          <div className="mt-8 flex flex-col justify-between gap-5 border-b border-white/12 pb-8 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#e8b95e]">Sakura Travel</p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#fff8e7] sm:text-6xl">Миний захиалгууд</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">Захиалгын төлөв, төлбөр, аяллын өдөр, үлдсэн хугацаагаа нэг дор хянаарай.</p>
            </div>
            <Link href="/booking" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#e8b95e] px-6 font-semibold text-[#17211d] shadow-xl shadow-[#e8b95e]/20">
              <Plane className="h-4 w-4" />
              Шинэ захиалга
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="mt-10 rounded-[8px] border border-white/12 bg-white/[0.06] p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8b95e] text-[#17211d]"><TicketCheck className="h-7 w-7" /></div>
              <h2 className="mt-6 text-2xl font-semibold text-[#fff8e7]">Танд одоогоор захиалга алга байна.</h2>
              <p className="mt-3 max-w-xl leading-7 text-white/68">Tokyo-Fuji аяллын багцаа сонгоод захиалга үүсгэвэл энд таны аяллын timeline, boarding pass, төлбөрийн төлөв харагдана.</p>
            </div>
          ) : (
            <div className="mt-10 grid gap-5">
              {bookings.map((booking) => {
                const activeProgress = progressIndex(booking.status, booking.paymentStatus);
                return (
                  <article key={booking.id} className="my-booking-card overflow-hidden rounded-[8px] border border-white/12 bg-[#fff8e7] text-[#17211d] shadow-2xl shadow-black/20">
                    <div className="grid gap-0 lg:grid-cols-[1fr_0.72fr]">
                      <div className="p-6 sm:p-8">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full bg-[#10261f] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#e8b95e]">{booking.bookingCode ?? "Pending"}</span>
                          <span className="rounded-full bg-[#f4b7c9]/22 px-4 py-2 text-sm font-semibold text-[#9a2049]">{booking.status === "new" ? "Менежер баталгаажуулна" : booking.status}</span>
                          {booking.paymentProofUrl ? <span className="rounded-full bg-[#eef8f3] px-4 py-2 text-sm font-semibold text-[#276457]">Proof илгээгдсэн</span> : null}
                        </div>
                        <h2 className="mt-5 text-3xl font-semibold">{booking.destination}</h2>
                        <div className="mt-5 grid gap-3 text-sm font-semibold text-[#405148] sm:grid-cols-2">
                          <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#b9872f]" />{formatDate(booking.preferredDate)}</span>
                          <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-[#b9872f]" />{timeRemaining(booking.preferredDate)}</span>
                          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#b9872f]" />{booking.travelers} хүн · {booking.paymentStatus === "pending" ? "Төлбөр хүлээгдэж байна" : booking.paymentStatus}</span>
                        </div>

                        <div className="mt-7 grid gap-3">
                          {bookingProgressSteps.map((item, index) => {
                            const done = index <= activeProgress;
                            return (
                              <div key={item.key} className={`progress-step grid grid-cols-[34px_1fr] gap-3 rounded-[8px] p-3 ${done ? "bg-[#eef8f3]" : "bg-[#f7f1e8]"}`}>
                                <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${done ? "bg-[#276457] text-white" : "bg-white text-[#9a8361]"}`}>{index + 1}</span>
                                <div><p className="font-semibold">{item.label}</p><p className="mt-1 text-sm text-[#6b716b]">{item.detail}</p></div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="boarding-pass bg-[#10261f] p-6 text-[#fff8e7] sm:p-8">
                        <Plane className="h-8 w-8 text-[#e8b95e]" />
                        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#e8b95e]">Boarding pass</p>
                        <div className="mt-6 space-y-3 text-sm text-white/72">
                          <p><span className="font-semibold text-white">Нэр:</span> {booking.name}</p>
                          <p><span className="font-semibold text-white">Утас:</span> {booking.phone}</p>
                          <p><span className="font-semibold text-white">Имэйл:</span> {booking.email ?? "Байхгүй"}</p>
                          <p><span className="font-semibold text-white">Төлөв:</span> {booking.paymentStatus}</p>
                        </div>
                        <div className="mt-7 rounded-[8px] border border-[#e8b95e]/30 bg-white/8 p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-[#e8b95e]"><ShieldCheck className="h-4 w-4" />Менежерийн шалгалт</div>
                          <p className="mt-2 text-sm leading-6 text-white/68">Төлбөр, суудал, аяллын дэлгэрэнгүйг баталгаажуулсны дараа timeline автоматаар урагшилна.</p>
                        </div>
                        <Link href="/booking" className="mt-7 inline-flex h-11 items-center justify-center rounded-full border border-[#e8b95e]/60 px-5 text-sm font-semibold text-[#e8b95e] transition hover:bg-[#e8b95e] hover:text-[#17211d]">Дахин захиалах</Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
