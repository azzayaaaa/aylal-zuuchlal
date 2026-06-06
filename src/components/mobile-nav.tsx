"use client";

import Link from "next/link";
import { LogOut, Menu, Plane, Settings, TicketCheck, UserRound, X } from "lucide-react";
import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

type MobileNavProps = {
  items: NavItem[];
  userLabel: string | null;
  logoutAction: () => Promise<void>;
};

export function MobileNav({ items, userLabel, logoutAction }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Цэс хаах" : "Цэс нээх"}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/18"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div
          id="mobile-navigation"
          className="absolute inset-x-3 top-[72px] overflow-hidden rounded-3xl border border-white/15 bg-[#0e211c]/96 text-white shadow-2xl backdrop-blur-2xl"
        >
          <div className="border-b border-white/10 px-4 py-4">
            {userLabel ? (
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8b95e] text-[#17211e]">
                  <UserRound className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e8b95e]">
                    Нэвтэрсэн
                  </p>
                  <p className="truncate text-sm text-white/86">{userLabel}</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e8b95e]">
                  Sakura Travel
                </p>
                <p className="mt-1 text-sm text-white/72">
                  Захиалга хийхийн өмнө нэвтэрнэ.
                </p>
              </div>
            )}
          </div>

          <div className="grid px-2 py-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-2xl px-3 py-3 text-sm font-medium text-white/82 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            {userLabel ? (
              <>
                <Link href="/my-bookings" onClick={closeMenu} className="flex items-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold text-white/88 hover:bg-white/10">
                  <TicketCheck className="h-4 w-4 text-[#e8b95e]" />
                  Миний захиалгууд
                </Link>
                <Link href="/settings" onClick={closeMenu} className="flex items-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold text-white/88 hover:bg-white/10">
                  <Settings className="h-4 w-4 text-[#e8b95e]" />
                  Settings
                </Link>
              </>
            ) : null}
          </div>

          <div className="grid gap-2 border-t border-white/10 p-3">
            {userLabel ? (
              <form action={logoutAction}>
                <button className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 text-sm font-semibold text-white">
                  <LogOut className="h-4 w-4" />
                  Гарах
                </button>
              </form>
            ) : (
              <Link
                href="/login?redirect=/booking"
                onClick={closeMenu}
                className="flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-semibold text-white"
              >
                Нэвтрэх
              </Link>
            )}
            <Link
              href="/booking"
              onClick={closeMenu}
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#e8b95e] text-sm font-semibold text-[#1c1710]"
            >
              <Plane className="h-4 w-4" />
              Захиалах
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
