import { cookies } from "next/headers";

const COOKIE_NAME = "sakura_admin";
const USER_COOKIE_NAME = "sakura_user";

export async function isAdminLoggedIn() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === "active";
}

export async function isUserLoggedIn() {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get(USER_COOKIE_NAME)?.value);
}

export async function getUserSession() {
  const cookieStore = await cookies();
  const value = cookieStore.get(USER_COOKIE_NAME)?.value;

  if (!value) {
    return null;
  }

  const decoded = decodeURIComponent(value);

  return {
    phone: decoded.includes("@") ? "" : decoded,
    email: decoded.includes("@") ? decoded : "",
    identifier: decoded,
  };
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "active", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function setUserSession(phone: string) {
  const cookieStore = await cookies();
  cookieStore.set(USER_COOKIE_NAME, encodeURIComponent(phone), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_COOKIE_NAME);
}
