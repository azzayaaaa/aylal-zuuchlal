import Image from "next/image";
import { LockKeyhole } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#10201d] px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <div className="rounded-[28px] bg-white p-6 text-[#18211f] shadow-2xl">
          <div className="flex items-center gap-3">
            <Image
              src="/sakura-travel-logo.svg"
              alt="Sakura Travel logo"
              width={64}
              height={64}
              className="h-16 w-16 rounded-2xl object-contain"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#276457]">
                Sakura Travel
              </p>
              <h1 className="mt-1 text-2xl font-semibold">Админ нэвтрэх</h1>
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-[#fbf7ef] p-4 text-sm leading-6 text-[#5d655f]">
            <LockKeyhole className="mb-3 h-5 w-5 text-[#276457]" />
            Захиалга болон төлбөрийн самбар харахын тулд админ нууц үгээ оруулна.
          </div>
          <LoginForm adminMode adminOnly />
        </div>
      </div>
    </main>
  );
}
