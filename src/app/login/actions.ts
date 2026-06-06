"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import {
  clearAdminSession,
  clearUserSession,
  setAdminSession,
  setUserSession,
} from "@/lib/auth";
import { getDb } from "@/lib/db";

export type LoginState = {
  error: string;
};

export async function loginUser(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const next = String(formData.get("next") ?? "/booking");

  if (!identifier || !password) {
    return { error: "Утас эсвэл имэйл болон нууц үгээ оруулна уу." };
  }

  if (!process.env.DATABASE_URL) {
    return { error: "Database тохируулаагүй байна." };
  }

  const db = getDb();
  const existingUser = await db.user.findUnique({ where: { identifier } });

  if (existingUser) {
    const isValid = await bcrypt.compare(password, existingUser.passwordHash);

    if (!isValid) {
      return { error: "Нууц үг буруу байна." };
    }
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    await db.user.create({
      data: {
        identifier,
        passwordHash,
      },
    });
  }

  await setUserSession(identifier);
  redirect(next || "/booking");
}

export async function loginGoogle(formData: FormData) {
  const next = String(formData.get("next") ?? "/booking");
  await setUserSession("google-user");
  redirect(next || "/booking");
}

export async function loginAdmin(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD ?? "";

  if (!expected || password !== expected) {
    return { error: "Нууц үг буруу байна." };
  }

  await setAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function logoutUser() {
  await clearUserSession();
  redirect("/");
}
