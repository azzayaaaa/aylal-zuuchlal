import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  CreditCard,
  Inbox,
  Mail,
  Phone,
  Settings,
  Users,
} from "lucide-react";
import { updateInquiryStatus } from "@/app/actions";
import { logoutAdmin } from "@/app/login/actions";
import { isAdminLoggedIn } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  new: "Шинэ",
  contacted: "Холбогдсон",
  confirmed: "Баталгаажсан",
  cancelled: "Цуцлагдсан",
  paid: "Paid",
};

const paymentLabels: Record<string, string> = {
  pending: "Payment pending",
  success: "Payment success",
  failed: "Payment failed",
  refunded: "Refunded",
};

const readable: Record<string, string> = {
  bank: "Дансаар",
  deposit: "Урьдчилгаа",
  full: "Бүтэн төлбөр",
};

function formatDate(date: Date | null) {
  if (!date) return "Товлоогүй";
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function label(value: string | null | undefined) {
  if (!value) return "Тодорхойгүй";
  return readable[value] ?? value;
}

export default async function AdminPage() {
  if (!(await isAdminLoggedIn())) {
    redirect("/admin/login");
  }

  const inquiries = await getDb().inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const today = new Date().toDateString();
  const totalTravelers = inquiries.reduce(
    (sum, inquiry) => sum + inquiry.travelers,
    0,
  );
  const todayCount = inquiries.filter(
    (inquiry) => inquiry.createdAt.toDateString() === today,
  ).length;
  const paidCount = inquiries.filter(
    (inquiry) => inquiry.paymentStatus === "success" || inquiry.status === "paid",
  ).length;
  const unpaidCount = inquiries.length - paidCount;

  const stats = [
    { icon: Inbox, label: "Нийт захиалга", value: inquiries.length },
    { icon: CalendarDays, label: "Өнөөдрийн захиалга", value: todayCount },
    { icon: CreditCard, label: "Төлсөн / төлөөгүй", value: `${paidCount} / ${unpaidCount}` },
    { icon: Users, label: "Нийт аялагч", value: totalTravelers },
  ];

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#18211f]">
      <header className="border-b border-[#ded5c6] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-4">
            <Image
              src="/sakura-travel-logo.svg"
              alt="Sakura Travel logo"
              width={64}
              height={64}
              className="h-16 w-16 rounded-lg bg-white object-contain p-1 shadow-sm ring-1 ring-[#e1d8c8]"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#276457]">
                Sakura Travel админ
              </p>
              <h1 className="mt-2 text-3xl font-semibold">
                Захиалга болон төлбөрийн самбар
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-md bg-[#276457] px-5 font-semibold text-white"
            >
              Вебсайт руу буцах
            </Link>
            <form action={logoutAdmin}>
              <button className="inline-flex h-11 items-center justify-center rounded-md border border-[#d8cebd] bg-white px-5 font-semibold text-[#34443e]">
                Гарах
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 sm:px-5 lg:grid-cols-4 lg:px-8">
        {stats.map(({ icon: Icon, label: statLabel, value }) => (
          <div
            key={statLabel}
            className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-[#e1d8c8]"
          >
            <Icon className="h-6 w-6 text-[#276457]" />
            <p className="mt-4 text-sm text-[#6b716b]">{statLabel}</p>
            <p className="mt-1 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-6 sm:grid-cols-2 sm:px-5 lg:grid-cols-3 lg:px-8">
        {[
          ["Аялал удирдах", "Багц нэмэх, засах, featured/hot тэмдэглэх"],
          ["Customer", "Утас, имэйл, booking history харах"],
          ["Export", "Excel/PDF export хийх хэсэг бэлэн"],
        ].map(([title, text]) => (
          <div key={title} className="rounded-lg bg-white p-5 ring-1 ring-[#e1d8c8]">
            <Settings className="h-6 w-6 text-[#276457]" />
            <h2 className="mt-4 font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#6b716b]">{text}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-5 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-[#e1d8c8]">
          <div className="hidden grid-cols-[0.8fr_1fr_1.2fr_0.7fr_1fr_1.15fr] gap-4 border-b border-[#e1d8c8] bg-[#10201d] px-5 py-3 text-sm font-semibold text-white xl:grid">
            <span>Код / огноо</span>
            <span>Хэрэглэгч</span>
            <span>Аялал</span>
            <span>Хүн</span>
            <span>Төлбөр</span>
            <span>Статус</span>
          </div>

          {inquiries.length === 0 ? (
            <div className="p-8 text-center text-[#6b716b]">
              Одоогоор захиалгын хүсэлт ирээгүй байна.
            </div>
          ) : (
            <div className="divide-y divide-[#e1d8c8]">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="grid gap-4 p-5 xl:grid-cols-[0.8fr_1fr_1.2fr_0.7fr_1fr_1.15fr]"
                >
                  <div>
                    <p className="font-mono text-sm font-semibold text-[#276457]">
                      {inquiry.bookingCode ?? `#${inquiry.id}`}
                    </p>
                    <p className="mt-1 text-sm text-[#6b716b]">
                      {formatDate(inquiry.createdAt)}
                    </p>
                    <p className="mt-1 text-sm text-[#6b716b]">
                      Явах: {formatDate(inquiry.preferredDate)}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">{inquiry.name}</p>
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="mt-2 flex items-center gap-2 text-sm text-[#276457]"
                    >
                      <Phone className="h-4 w-4" />
                      {inquiry.phone}
                    </a>
                    {inquiry.email ? (
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="mt-1 flex items-center gap-2 text-sm text-[#276457]"
                      >
                        <Mail className="h-4 w-4" />
                        {inquiry.email}
                      </a>
                    ) : null}
                  </div>
                  <div>
                    <p className="font-semibold">{inquiry.destination}</p>
                    {inquiry.budget ? (
                      <p className="mt-1 text-sm text-[#6b716b]">
                        Төсөв: {inquiry.budget}
                      </p>
                    ) : null}
                    {inquiry.message ? (
                      <p className="mt-2 text-sm leading-6 text-[#6b716b]">
                        {inquiry.message}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <p className="text-sm">{inquiry.travelers} хүн</p>
                    <p className="mt-1 text-sm text-[#6b716b]">
                      Том {inquiry.adults}, хүүхэд {inquiry.children}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm">{label(inquiry.paymentMethod)}</p>
                    <p className="mt-1 text-sm text-[#6b716b]">
                      {paymentLabels[inquiry.paymentStatus] ?? inquiry.paymentStatus}
                    </p>
                  </div>
                  <form action={updateInquiryStatus} className="grid gap-2">
                    <input type="hidden" name="id" value={inquiry.id} />
                    <select
                      name="status"
                      defaultValue={inquiry.status}
                      className="h-10 min-w-0 rounded-md border border-[#d8cebd] bg-white px-3 text-sm"
                    >
                      {Object.entries(statusLabels).map(([value, text]) => (
                        <option key={value} value={value}>
                          {text}
                        </option>
                      ))}
                    </select>
                    <select
                      name="paymentStatus"
                      defaultValue={inquiry.paymentStatus}
                      className="h-10 min-w-0 rounded-md border border-[#d8cebd] bg-white px-3 text-sm"
                    >
                      {Object.entries(paymentLabels).map(([value, text]) => (
                        <option key={value} value={value}>
                          {text}
                        </option>
                      ))}
                    </select>
                    <button className="h-10 rounded-md bg-[#276457] px-3 text-sm font-semibold text-white">
                      Хадгалах
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
