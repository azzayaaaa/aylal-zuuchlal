import Image from "next/image";
import Link from "next/link";
import { LogOut, Plane, Settings, TicketCheck, UserRound } from "lucide-react";
import { logoutUser } from "@/app/login/actions";
import { getUserSession } from "@/lib/auth";
import { MobileNav } from "@/components/mobile-nav";

const navItems = [
  { href: "/#top", label: "Нүүр" },
  { href: "/#tours", label: "Аяллууд" },
  { href: "/#journey", label: "Маршрут" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Холбоо барих" },
];

export async function SiteHeader() {
  const user = await getUserSession();
  const userLabel = user?.email || user?.phone || user?.identifier;

  return (
    <header className="fixed left-0 right-0 top-0 z-[70] border-b border-white/12 bg-[#0e211c]/88 backdrop-blur-2xl">
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-3 text-white sm:px-5 lg:px-8">
        <Link href="/#top" className="flex min-w-0 items-center gap-2 font-semibold">
          <Image
            src="/sakura-travel-logo.svg"
            alt="Sakura Travel logo"
            width={44}
            height={44}
            loading="eager"
            className="h-11 w-11 rounded-full bg-white object-contain p-1 drop-shadow-lg"
          />
          <span className="hidden sm:inline">Sakura Travel</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-white/78 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link
                href="/my-bookings"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 text-sm font-semibold text-white/86 transition hover:bg-white/14"
              >
                <TicketCheck className="h-4 w-4 text-[#e8b95e]" />
                Миний захиалгууд
              </Link>
              <Link
                href="/settings"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white/86 transition hover:bg-white/14"
                aria-label="Settings"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/88">
                <UserRound className="h-4 w-4 text-[#e8b95e]" />
                <span className="max-w-32 truncate">{userLabel}</span>
                <form action={logoutUser}>
                  <button
                    className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/12"
                    aria-label="Гарах"
                    title="Гарах"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <Link href="/login?redirect=/booking" className="text-sm text-white/82 transition hover:text-white">
              Нэвтрэх
            </Link>
          )}
          <Link
            href="/booking"
            className="magnetic-cta inline-flex h-10 items-center gap-2 rounded-full bg-[#e8b95e] px-4 text-sm font-semibold text-[#1c1710] shadow-lg shadow-[#e8b95e]/20 transition hover:bg-[#f6cf7a]"
          >
            <Plane className="h-4 w-4" />
            Захиалах
          </Link>
        </div>

        <MobileNav items={navItems} userLabel={userLabel ?? null} logoutAction={logoutUser} />
      </nav>
    </header>
  );
}
