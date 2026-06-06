"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AtSign, LockKeyhole, LogIn } from "lucide-react";
import {
  loginAdmin,
  loginUser,
  type LoginState,
} from "@/app/login/actions";

const initialState: LoginState = {
  error: "",
};

type LoginFormProps = {
  next?: string;
  adminMode?: boolean;
  adminOnly?: boolean;
  userOnly?: boolean;
};

export function LoginForm({
  next = "/booking",
  adminMode = false,
  adminOnly = false,
  userOnly = false,
}: LoginFormProps) {
  const [mode, setMode] = useState<"user" | "admin">(adminMode ? "admin" : "user");
  const [userState, userAction, isUserPending] = useActionState(loginUser, initialState);
  const [adminState, adminAction, isAdminPending] = useActionState(loginAdmin, initialState);
  const googleHref = `/api/auth/google?redirect=${encodeURIComponent(next)}`;

  return (
    <div className="mt-6">
      {!adminOnly && !userOnly ? (
        <div className="grid grid-cols-2 rounded-[8px] bg-[#f7f1e8] p-1 ring-1 ring-[#e1d8c8]">
          <button
            type="button"
            onClick={() => setMode("user")}
            className={`h-11 rounded-[7px] text-sm font-semibold transition ${
              mode === "user" ? "bg-white text-[#18211f] shadow-sm" : "text-[#5d655f]"
            }`}
          >
            Хэрэглэгч
          </button>
          <button
            type="button"
            onClick={() => setMode("admin")}
            className={`h-11 rounded-[7px] text-sm font-semibold transition ${
              mode === "admin" ? "bg-white text-[#18211f] shadow-sm" : "text-[#5d655f]"
            }`}
          >
            Админ
          </button>
        </div>
      ) : null}

      {mode === "user" || userOnly ? (
        <form action={userAction} className="mt-5 space-y-4">
          <input type="hidden" name="next" value={next} />
          <Link
            href={googleHref}
            className="group inline-flex h-13 w-full items-center justify-center gap-3 rounded-full border border-[#d8cebd] bg-white px-5 font-semibold text-[#18211f] shadow-sm transition hover:border-[#e8c77a] hover:shadow-lg hover:shadow-[#e8c77a]/10"
          >
            <GoogleIcon />
            Google-ээр шууд нэвтрэх
          </Link>

          <div className="flex items-center gap-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#9a8361]">
            <span className="h-px flex-1 bg-[#e3d5bd]" />
            эсвэл
            <span className="h-px flex-1 bg-[#e3d5bd]" />
          </div>

          <p className="rounded-[8px] border border-[#d9efe5] bg-[#eef8f3] px-4 py-3 text-sm leading-6 text-[#1f5146]">
            Утасны дугаар эсвэл имэйлээр нэвтэрвэл booking wizard шууд нээгдэнэ.
          </p>

          <label className="block text-sm font-semibold text-[#34443e]">
            Утас эсвэл имэйл
            <div className="relative mt-2">
              <AtSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b716b]" />
              <input
                name="identifier"
                required
                inputMode="email"
                autoComplete="email"
                className="h-13 w-full rounded-[8px] border border-[#d8cebd] bg-white pl-11 pr-4 outline-none transition focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/20"
                placeholder="+976 99119911 эсвэл email@example.com"
              />
            </div>
          </label>

          <label className="block text-sm font-semibold text-[#34443e]">
            Нууц үг
            <div className="relative mt-2">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b716b]" />
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="h-13 w-full rounded-[8px] border border-[#d8cebd] bg-white pl-11 pr-4 outline-none transition focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/20"
                placeholder="Нууц үгээ оруулна уу"
              />
            </div>
          </label>

          <button
            disabled={isUserPending}
            className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#276457] px-5 font-semibold text-white shadow-xl shadow-[#276457]/18 transition hover:bg-[#1f5146] disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {isUserPending ? "Нэвтэрч байна..." : "Нэвтрээд захиалах"}
          </button>
          {userState.error ? (
            <p className="rounded-[8px] bg-[#fff1df] px-4 py-3 text-sm text-[#7b481c]">
              {userState.error}
            </p>
          ) : null}
        </form>
      ) : (
        <form action={adminAction} className="mt-5">
          <label className="text-sm font-semibold text-[#34443e]">
            Нууц үг
            <div className="relative mt-2">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b716b]" />
              <input
                name="password"
                type="password"
                required
                className="h-13 w-full rounded-[8px] border border-[#d8cebd] bg-white pl-11 pr-4 outline-none transition focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/20"
                placeholder="Админ нууц үг"
              />
            </div>
          </label>
          <button
            disabled={isAdminPending}
            className="mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#276457] px-5 font-semibold text-white transition hover:bg-[#1f5146] disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {isAdminPending ? "Нэвтэрч байна..." : "Админ нэвтрэх"}
          </button>
          {adminState.error ? (
            <p className="mt-4 rounded-[8px] bg-[#fff1df] px-4 py-3 text-sm text-[#7b481c]">
              {adminState.error}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 4 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}
