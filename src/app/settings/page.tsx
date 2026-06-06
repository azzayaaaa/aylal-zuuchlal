import Link from "next/link";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { ArrowLeft, LockKeyhole, Settings, ShieldCheck, UserRound } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getUserSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

async function updatePassword(formData: FormData) {
  "use server";

  const user = await getUserSession();

  if (!user) {
    redirect("/login?redirect=/settings");
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const identifier = user.identifier;

  if (newPassword.length < 6) {
    redirect("/settings?status=short");
  }

  const db = getDb();
  const existingUser = await db.user.findUnique({ where: { identifier } });
  const passwordHash = await bcrypt.hash(newPassword, 12);

  if (existingUser) {
    const isValid = await bcrypt.compare(currentPassword, existingUser.passwordHash);

    if (!isValid) {
      redirect("/settings?status=wrong");
    }

    await db.user.update({
      where: { identifier },
      data: { passwordHash },
    });
  } else {
    await db.user.create({
      data: {
        identifier,
        passwordHash,
      },
    });
  }

  redirect("/settings?status=saved");
}

function statusText(status?: string) {
  if (status === "saved") {
    return "Нууц үг амжилттай шинэчлэгдлээ.";
  }

  if (status === "wrong") {
    return "Одоогийн нууц үг буруу байна.";
  }

  if (status === "short") {
    return "Шинэ нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.";
  }

  return null;
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getUserSession();

  if (!user) {
    redirect("/login?redirect=/settings");
  }

  const { status } = await searchParams;
  const message = statusText(status);
  const userLabel = user.email || user.phone || user.identifier;

  return (
    <main className="min-h-screen bg-[#07120f] text-white">
      <SiteHeader />
      <section className="relative isolate overflow-hidden px-4 pb-16 pt-28 sm:px-5 lg:px-8">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_15%,rgba(232,185,94,0.18),transparent_30%),linear-gradient(135deg,#07120f,#10261f_52%,#07120f)]" />
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Нүүр рүү буцах
          </Link>

          <div className="mt-8 rounded-[8px] border border-white/12 bg-[#fff8e7] p-6 text-[#17211d] shadow-2xl shadow-black/25 sm:p-8">
            <div className="flex flex-col justify-between gap-5 border-b border-[#eadfca] pb-6 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#b9872f]">Account settings</p>
                <h1 className="mt-3 text-4xl font-semibold">Settings</h1>
                <p className="mt-3 text-[#5d6c62]">Профайл болон нууц үгийн тохиргоо.</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#10261f] text-[#e8b95e]">
                <Settings className="h-7 w-7" />
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-[0.82fr_1.18fr]">
              <div className="rounded-[8px] border border-[#eadfca] bg-white p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#276457] text-white">
                  <UserRound className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-semibold">Профайл</h2>
                <div className="mt-4 space-y-3 text-sm text-[#52635a]">
                  <p><span className="font-semibold text-[#17211d]">Нэвтрэх нэр:</span> {userLabel}</p>
                  <p><span className="font-semibold text-[#17211d]">Имэйл:</span> {user.email || "Бүртгээгүй"}</p>
                  <p><span className="font-semibold text-[#17211d]">Утас:</span> {user.phone || "Бүртгээгүй"}</p>
                </div>
                <div className="mt-5 flex items-center gap-2 rounded-[8px] bg-[#eef8f3] px-4 py-3 text-sm font-semibold text-[#276457]">
                  <ShieldCheck className="h-4 w-4" />
                  Password bcrypt-р шифрлэгдэж хадгалагдана.
                </div>
              </div>

              <form action={updatePassword} className="rounded-[8px] border border-[#eadfca] bg-white p-5">
                <div className="flex items-center gap-3">
                  <LockKeyhole className="h-5 w-5 text-[#b9872f]" />
                  <h2 className="text-xl font-semibold">Нууц үг солих</h2>
                </div>
                {message ? (
                  <p className="mt-4 rounded-[8px] bg-[#fff1df] px-4 py-3 text-sm font-semibold text-[#7b481c]">
                    {message}
                  </p>
                ) : null}
                <label className="mt-5 block text-sm font-semibold text-[#34443e]">
                  Одоогийн нууц үг
                  <input
                    name="currentPassword"
                    type="password"
                    className="mt-2 h-12 w-full rounded-[8px] border border-[#d8cebd] px-4 outline-none transition focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/20"
                    placeholder="Одоогийн нууц үгээ оруулна уу"
                  />
                </label>
                <label className="mt-4 block text-sm font-semibold text-[#34443e]">
                  Шинэ нууц үг
                  <input
                    name="newPassword"
                    type="password"
                    required
                    minLength={6}
                    className="mt-2 h-12 w-full rounded-[8px] border border-[#d8cebd] px-4 outline-none transition focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/20"
                    placeholder="Шинэ нууц үг"
                  />
                </label>
                <button className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#276457] px-5 font-semibold text-white shadow-xl shadow-[#276457]/18 transition hover:bg-[#1f5146]">
                  Нууц үг хадгалах
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
