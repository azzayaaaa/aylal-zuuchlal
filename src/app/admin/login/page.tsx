import Image from "next/image";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function AdminLoginPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#07120f] px-4 py-10 text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_12%,rgba(232,185,94,0.2),transparent_30%),radial-gradient(circle_at_80%_24%,rgba(244,183,201,0.13),transparent_30%),linear-gradient(135deg,#07120f,#10261f_58%,#07120f)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-[linear-gradient(180deg,rgba(255,248,231,0.08),transparent)]" />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <div className="rounded-[8px] border border-white/12 bg-white/[0.08] p-2 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <div className="rounded-[8px] bg-[#fff8e7] p-6 text-[#18211f] shadow-xl">
            <div className="flex items-center gap-3">
              <Image
                src="/sakura-travel-logo.svg"
                alt="Sakura Travel logo"
                width={64}
                height={64}
                className="h-16 w-16 rounded-[8px] bg-white object-contain p-1 shadow-sm ring-1 ring-[#e1d8c8]"
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#276457]">
                  Sakura Travel
                </p>
                <h1 className="mt-1 text-2xl font-semibold">Админ нэвтрэх</h1>
              </div>
            </div>

            <div className="mt-6 grid gap-3 rounded-[8px] border border-[#d9efe5] bg-[#eef8f3] p-4 text-sm leading-6 text-[#1f5146]">
              <div className="flex items-center gap-2 font-semibold">
                <LockKeyhole className="h-5 w-5" />
                Хамгаалалт идэвхтэй
              </div>
              <p>
                Захиалга, төлбөр, follow-up самбар харахын тулд зөвхөн админ нууц үгээр нэвтэрнэ.
              </p>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#276457]">
                <ShieldCheck className="h-4 w-4" />
                Signed admin session
              </p>
            </div>

            <LoginForm adminMode adminOnly />
          </div>
        </div>
      </div>
    </main>
  );
}
