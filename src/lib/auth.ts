import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "sakura_admin";
const USER_COOKIE_NAME = "sakura_user";

function getAdminSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function signAdminSession(timestamp: string) {
  const secret = getAdminSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(timestamp).digest("base64url");
}

function isValidAdminSession(value?: string) {
  if (!value?.startsWith("admin:")) return false;

  const [, timestamp = "", signature = ""] = value.split(":");
  const createdAt = Number(timestamp);
  if (!Number.isFinite(createdAt)) return false;
  if (Date.now() - createdAt > 1000 * 60 * 60 * 8) return false;

  const expected = signAdminSession(timestamp);
  if (!expected || !signature) return false;

  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  return expectedBuffer.length === signatureBuffer.length && timingSafeEqual(expectedBuffer, signatureBuffer);
}

export async function isAdminLoggedIn() {
  const cookieStore = await cookies();
  return isValidAdminSession(cookieStore.get(COOKIE_NAME)?.value);
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
  const timestamp = String(Date.now());
  cookieStore.set(COOKIE_NAME, `admin:${timestamp}:${signAdminSession(timestamp)}`, {
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
