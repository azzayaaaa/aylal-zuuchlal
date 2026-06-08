import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { redirect } from "next/navigation";
import { CalendarDays, CheckCircle2, CreditCard, Download, Inbox, Mail, Phone, Search, TrendingUp, Users } from "lucide-react";
import { updateInquiryStatus } from "@/app/actions";
import { logoutAdmin } from "@/app/login/actions";
import { getFallbackBookingsFromCookies } from "@/lib/fallback-bookings";
import { isAdminLoggedIn } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatMoney, progressIndex } from "@/lib/travel-logic";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: Promise<{ status?: string; q?: string }>;
};

const statusLabels: Record<string, string> = {
  all: "Бүгд",
  new: "Шинэ",
  contacted: "Холбогдсон",
  confirmed: "Баталгаажсан",
  documents: "Виз / паспорт",
  ready: "Аялал бэлэн",
  cancelled: "Цуцлагдсан",
  paid: "Төлсөн",
};

const paymentLabels: Record<string, string> = {
  pending: "Төлбөр хүлээгдэж байна",
  success: "Төлбөр амжилттай",
  failed: "Төлбөр амжилтгүй",
  refunded: "Буцаалт",
};

const paymentMethods: Record<string, string> = {
  bank: "Дансаар",
  deposit: "Урьдчилгаа",
  full: "Бүтэн төлбөр",
};

const packagePrices = [
  { keyword: "disney", price: 4590000 },
  { keyword: "shopping", price: 3290000 },
  { keyword: "akihabara", price: 3290000 },
  { keyword: "fuji", price: 3990000 },
  { keyword: "фүжи", price: 3990000 },
  { keyword: "tokyo", price: 3990000 },
  { keyword: "токио", price: 3990000 },
];

function formatDate(date: Date | null) {
  if (!date) return "Товлоогүй";
  return new Intl.DateTimeFormat("mn-MN", { year: "numeric", month: "short", day: "2-digit" }).format(date);
}

function formatDateTime(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("mn-MN", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date);
}

function readable(value: string | null | undefined, map: Record<string, string>) {
  if (!value) return "Тодорхойгүй";
  return map[value] ?? value;
}

function estimateInquiryRevenue(destination: string, travelers: number) {
  const normalized = destination.toLowerCase();
  const match = packagePrices.find((item) => normalized.includes(item.keyword));
  return (match?.price ?? 3990000) * Math.max(1, travelers);
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");

  const params = await searchParams;
  const activeStatus = params.status ?? "all";
  const query = (params.q ?? "").trim().toLowerCase();
  const fallbackBookings = await getFallbackBookingsFromCookies();
  const inquiries = await getDb().inquiry.findMany({ orderBy: { createdAt: "desc" } }).catch((error) => {
    console.warn("Admin bookings unavailable", error);
    return fallbackBookings;
  });
  const visibleInquiries = inquiries.filter((inquiry) => {
    const statusMatch = activeStatus === "all" || inquiry.status === activeStatus;
    const haystack = [inquiry.bookingCode, inquiry.name, inquiry.phone, inquiry.email, inquiry.destination, inquiry.budget, inquiry.message, inquiry.adminNote].filter(Boolean).join(" ").toLowerCase();
    return statusMatch && (!query || haystack.includes(query));
  });
  const today = new Date().toDateString();
  const todayCount = inquiries.filter((inquiry) => inquiry.createdAt.toDateString() === today).length;
  const totalTravelers = inquiries.reduce((sum, inquiry) => sum + inquiry.travelers, 0);
  const confirmedCount = inquiries.filter((inquiry) => ["confirmed", "paid", "ready"].includes(inquiry.status)).length;
  const paidCount = inquiries.filter((inquiry) => inquiry.paymentStatus === "success" || inquiry.status === "paid").length;
  const estimatedRevenue = inquiries.reduce((sum, inquiry) => sum + estimateInquiryRevenue(inquiry.destination, inquiry.travelers), 0);
  const pipeline = ["new", "contacted", "confirmed", "documents", "ready"].map((status) => ({
    status,
    label: statusLabels[status],
    count: inquiries.filter((inquiry) => inquiry.status === status || (status === "confirmed" && inquiry.paymentStatus === "success")).length,
  }));
  const stats = [
    { icon: Inbox, label: "Нийт захиалга", value: inquiries.length, hint: `${todayCount} өнөөдөр` },
    { icon: Users, label: "Нийт аялагч", value: totalTravelers, hint: "том хүн + хүүхэд" },
    { icon: CheckCircle2, label: "Баталгаажсан", value: confirmedCount, hint: `${paidCount} төлбөртэй` },
    { icon: TrendingUp, label: "Revenue estimate", value: formatMoney(estimatedRevenue), hint: "урьдчилсан тооцоо" },
  ];

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#18211f]">
      <header className="sticky top-0 z-30 border-b border-[#ded5c6] bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-4">
            <Image src="/sakura-travel-logo.svg" alt="Sakura Travel logo" width={58} height={58} className="h-14 w-14 rounded-[8px] bg-white object-contain p-1 shadow-sm ring-1 ring-[#e1d8c8]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#276457]">Sakura operations</p>
              <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Захиалга, төлбөр, follow-up самбар</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#276457] px-5 font-semibold text-white">Вэбсайт</Link>
            <form action={logoutAdmin}><button className="inline-flex h-11 items-center justify-center rounded-[8px] border border-[#d8cebd] bg-white px-5 font-semibold text-[#34443e]">Гарах</button></form>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 sm:px-5 lg:grid-cols-4 lg:px-8">
        {stats.map(({ icon: Icon, label, value, hint }) => (
          <div key={label} className="admin-stat-card group relative overflow-hidden rounded-[8px] bg-white p-5 shadow-sm ring-1 ring-[#e1d8c8] transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7b481c]/10">
            <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#b0184c] transition duration-500 group-hover:scale-x-100" />
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm text-[#6b716b]">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p><p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#9a8361]">{hint}</p></div>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#eef8f3] text-[#276457]"><Icon className="h-5 w-5" /></span>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-5 lg:px-8">
        <div className="grid gap-3 rounded-[8px] border border-[#e1d8c8] bg-white p-4 shadow-sm lg:grid-cols-5">
          {pipeline.map((item) => (
            <Link key={item.status} href={`/admin?status=${item.status}`} className="kanban-pill rounded-[8px] border border-[#ead9c4] bg-[#fffaf0] p-4 transition hover:border-[#d7a34f] hover:bg-white">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a8361]">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.count}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-5 lg:px-8">
        <div className="grid gap-4 rounded-[8px] border border-[#e1d8c8] bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
          <form className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8173]" />
              <input name="q" defaultValue={params.q ?? ""} placeholder="Нэр, утас, имэйл, код, аяллаар хайх" className="h-11 w-full rounded-[8px] border border-[#d8cebd] bg-[#fffaf0] pl-10 pr-4 outline-none focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/15" />
            </label>
            <select name="status" defaultValue={activeStatus} className="h-11 rounded-[8px] border border-[#d8cebd] bg-[#fffaf0] px-3 outline-none focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/15">
              {Object.entries(statusLabels).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
            </select>
            <button className="h-11 rounded-[8px] bg-[#10201d] px-5 font-semibold text-white">Шүүх</button>
          </form>
          <Link href="/api/admin/bookings/export" className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#d8cebd] px-4 font-semibold text-[#34443e]">
            <Download className="h-4 w-4" />
            CSV татах
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-5 lg:px-8">
        <div className="overflow-hidden rounded-[8px] bg-white shadow-sm ring-1 ring-[#e1d8c8]">
          <div className="flex flex-col gap-2 border-b border-[#e1d8c8] bg-[#10201d] px-5 py-4 text-white sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e8b95e]">Booking pipeline</p><h2 className="mt-1 text-xl font-semibold">Ирсэн захиалгууд</h2></div>
            <p className="text-sm text-white/72">{visibleInquiries.length} / {inquiries.length} харагдаж байна</p>
          </div>

          {visibleInquiries.length === 0 ? (
            <div className="p-10 text-center"><Inbox className="mx-auto h-10 w-10 text-[#9a8361]" /><p className="mt-4 font-semibold">Ийм нөхцөлтэй захиалга алга.</p><p className="mt-2 text-sm text-[#6b716b]">Filter эсвэл хайлтаа өөрчлөөд дахин шалгаарай.</p></div>
          ) : (
            <div className="divide-y divide-[#e1d8c8]">
              {visibleInquiries.map((inquiry) => {
                const revenue = estimateInquiryRevenue(inquiry.destination, inquiry.travelers);
                const progress = progressIndex(inquiry.status, inquiry.paymentStatus);
                return (
                  <details key={inquiry.id} className="admin-row group">
                    <summary className="grid cursor-pointer list-none gap-4 p-5 transition hover:bg-[#fffaf0] lg:grid-cols-[0.9fr_1fr_1.15fr_0.72fr_0.95fr]">
                      <div><p className="font-mono text-sm font-semibold text-[#276457]">{inquiry.bookingCode ?? `#${inquiry.id}`}</p><p className="mt-1 text-sm text-[#6b716b]">{formatDate(inquiry.createdAt)}</p></div>
                      <div><p className="font-semibold">{inquiry.name}</p><p className="mt-1 text-sm text-[#6b716b]">{inquiry.phone}</p></div>
                      <div><p className="font-semibold">{inquiry.destination}</p><p className="mt-1 text-sm text-[#6b716b]">Явах: {formatDate(inquiry.preferredDate)}</p></div>
                      <div><p className="text-sm">{inquiry.travelers} хүн</p><p className="mt-1 text-sm text-[#6b716b]">Алхам {progress + 1}/5</p></div>
                      <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                        <span className="rounded-full bg-[#eef8f3] px-3 py-1 text-xs font-semibold text-[#276457]">{statusLabels[inquiry.status] ?? inquiry.status}</span>
                        <span className="rounded-full bg-[#ffe5f1] px-3 py-1 text-xs font-semibold text-[#b0184c]">{paymentLabels[inquiry.paymentStatus] ?? inquiry.paymentStatus}</span>
                      </div>
                    </summary>

                    <div className="grid gap-5 border-t border-[#ead9c4] bg-[#fffaf0] p-5 lg:grid-cols-[1fr_360px]">
                      <div className="grid gap-4 md:grid-cols-2">
                        <InfoCard title="Холбоо барих"><a href={`tel:${inquiry.phone}`} className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#276457]"><Phone className="h-4 w-4" />{inquiry.phone}</a>{inquiry.email ? <a href={`mailto:${inquiry.email}`} className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#276457]"><Mail className="h-4 w-4" />{inquiry.email}</a> : null}</InfoCard>
                        <InfoCard title="Төлбөр ба үнэ"><p className="mt-3 text-sm text-[#5d655f]">Арга: {readable(inquiry.paymentMethod, paymentMethods)}</p><p className="mt-2 text-sm text-[#5d655f]">Төсөв: {inquiry.budget || "бичээгүй"}</p><p className="mt-2 text-xl font-semibold text-[#17211d]">{formatMoney(revenue)}</p></InfoCard>
                        <InfoCard title="Аяллын мэдээлэл"><p className="mt-3 flex items-center gap-2 text-sm text-[#5d655f]"><CalendarDays className="h-4 w-4 text-[#276457]" />{formatDate(inquiry.preferredDate)}</p><p className="mt-2 text-sm text-[#5d655f]">Follow-up: {formatDateTime(inquiry.followUpAt) || "товлоогүй"}</p><p className="mt-2 text-sm text-[#5d655f]">Proof: {inquiry.paymentProofUrl ? "илгээгдсэн" : "алга"}</p></InfoCard>
                        <InfoCard title="Хэрэглэгчийн хүсэлт"><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#5d655f]">{inquiry.message || "Нэмэлт хүсэлт үлдээгээгүй."}</p></InfoCard>
                        {inquiry.paymentProofUrl ? (
                          <InfoCard title="Payment proof">
                            {inquiry.paymentProofUrl.startsWith("data:image") ? (
                              <Image src={inquiry.paymentProofUrl} alt="Payment proof screenshot" width={420} height={260} unoptimized className="mt-3 max-h-56 w-full rounded-[8px] border border-[#ead9c4] object-contain" />
                            ) : inquiry.paymentProofUrl.startsWith("http") || inquiry.paymentProofUrl.startsWith("data:") ? (
                              <a href={inquiry.paymentProofUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex h-10 items-center justify-center rounded-[8px] bg-[#10201d] px-4 text-sm font-semibold text-white">Proof харах</a>
                            ) : (
                              <p className="mt-3 rounded-[8px] bg-[#eef8f3] px-3 py-2 text-sm font-semibold text-[#276457]">{inquiry.paymentProofUrl}</p>
                            )}
                          </InfoCard>
                        ) : null}
                      </div>

                      <form action={updateInquiryStatus} className="rounded-[8px] border border-[#e1d8c8] bg-white p-4 shadow-sm">
                        <input type="hidden" name="id" value={inquiry.id} />
                        <p className="font-semibold">Status update</p>
                        <label className="mt-4 block text-sm font-semibold text-[#34443e]">Захиалгын төлөв<select name="status" defaultValue={inquiry.status} className="mt-2 h-11 w-full rounded-[8px] border border-[#d8cebd] bg-white px-3">{Object.entries(statusLabels).filter(([value]) => value !== "all").map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
                        <label className="mt-4 block text-sm font-semibold text-[#34443e]">Төлбөрийн төлөв<select name="paymentStatus" defaultValue={inquiry.paymentStatus} className="mt-2 h-11 w-full rounded-[8px] border border-[#d8cebd] bg-white px-3">{Object.entries(paymentLabels).map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
                        <label className="mt-4 block text-sm font-semibold text-[#34443e]">Follow-up цаг<input name="followUpAt" type="datetime-local" defaultValue={inquiry.followUpAt ? inquiry.followUpAt.toISOString().slice(0, 16) : ""} className="mt-2 h-11 w-full rounded-[8px] border border-[#d8cebd] bg-white px-3" /></label>
                        <label className="mt-4 block text-sm font-semibold text-[#34443e]">Admin note<textarea name="adminNote" defaultValue={inquiry.adminNote ?? ""} rows={4} className="mt-2 w-full rounded-[8px] border border-[#d8cebd] bg-white px-3 py-2" placeholder="Маргааш 15:00-д залгах, passport шалгах..." /></label>
                        {inquiry.paymentProofUrl ? (
                          <button name="markPaid" value="1" className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#e8b95e] font-semibold text-[#17211d] transition hover:bg-[#f4c76b]"><CheckCircle2 className="h-4 w-4" />Proof шалгасан, paid болгох</button>
                        ) : null}
                        <button className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#276457] font-semibold text-white"><CreditCard className="h-4 w-4" />Хадгалах</button>
                      </form>
                    </div>
                  </details>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-[8px] border border-[#e1d8c8] bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b0184c]">{title}</p>{children}</div>;
}
