import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { GatewayBookingPayload } from "@/lib/service-config";

const FALLBACK_BOOKINGS_COOKIE = "sakura_fallback_bookings";
const MAX_FALLBACK_BOOKINGS = 8;
const MAX_COOKIE_FIELD_LENGTH = 320;

export type FallbackBooking = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  destination: string;
  travelers: number;
  adults: number;
  children: number;
  preferredDate: Date | null;
  paymentMethod: string;
  paymentStatus: string;
  paymentProofUrl: string | null;
  visaStatus: string | null;
  passportStatus: string | null;
  budget: string | null;
  bookingCode: string;
  adminNote: string | null;
  followUpAt: Date | null;
  reminderSentAt: Date | null;
  message: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  source: "fallback";
};

type SerializedFallbackBooking = Omit<
  FallbackBooking,
  "preferredDate" | "followUpAt" | "reminderSentAt" | "createdAt" | "updatedAt"
> & {
  preferredDate: string | null;
  followUpAt: string | null;
  reminderSentAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function encodeBookings(bookings: SerializedFallbackBooking[]) {
  return Buffer.from(JSON.stringify(bookings), "utf8").toString("base64url");
}

function decodeBookings(value?: string) {
  if (!value) return [];

  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as SerializedFallbackBooking[];
  } catch {
    return [];
  }
}

function hydrateBooking(item: SerializedFallbackBooking): FallbackBooking {
  return {
    ...item,
    preferredDate: item.preferredDate ? new Date(item.preferredDate) : null,
    followUpAt: item.followUpAt ? new Date(item.followUpAt) : null,
    reminderSentAt: item.reminderSentAt ? new Date(item.reminderSentAt) : null,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  };
}

function serializeBooking(item: FallbackBooking): SerializedFallbackBooking {
  return {
    ...item,
    preferredDate: item.preferredDate?.toISOString() ?? null,
    followUpAt: item.followUpAt?.toISOString() ?? null,
    reminderSentAt: item.reminderSentAt?.toISOString() ?? null,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

function cleanText(value: unknown, fallback = "", maxLength = MAX_COOKIE_FIELD_LENGTH) {
  return String(value ?? fallback).trim().slice(0, maxLength);
}

function cleanOptionalText(value: unknown, maxLength = MAX_COOKIE_FIELD_LENGTH) {
  const text = cleanText(value, "", maxLength);
  return text || null;
}

export async function getFallbackBookingsFromCookies() {
  const cookieStore = await cookies();
  return decodeBookings(cookieStore.get(FALLBACK_BOOKINGS_COOKIE)?.value).map(hydrateBooking);
}

export function createFallbackBooking(payload: Partial<GatewayBookingPayload>, bookingCode: string): FallbackBooking {
  const adults = Math.max(1, Number(payload.adults ?? 1));
  const children = Math.max(0, Number(payload.children ?? 0));
  const now = new Date();

  return {
    id: now.getTime(),
    name: cleanText(payload.name, "Sakura guest", 120),
    phone: cleanText(payload.phone, "", 40),
    email: cleanOptionalText(payload.email, 140),
    destination: cleanText(payload.destination, "Tokyo-Fuji", 120),
    travelers: adults + children,
    adults,
    children,
    preferredDate: payload.preferredDate ? new Date(payload.preferredDate) : null,
    paymentMethod: cleanText(payload.paymentMethod, "bank", 40),
    paymentStatus: "pending",
    paymentProofUrl: cleanOptionalText(payload.paymentProofUrl, 180),
    visaStatus: null,
    passportStatus: null,
    budget: cleanOptionalText(payload.budget, 80),
    bookingCode,
    adminNote: "DB holbolt idevkhgui ued fallback booking-r khadgalsan.",
    followUpAt: null,
    reminderSentAt: null,
    message: cleanOptionalText(payload.message, 520),
    status: "new",
    createdAt: now,
    updatedAt: now,
    source: "fallback",
  };
}

export function attachFallbackBookingCookie(
  response: NextResponse,
  request: Request,
  booking: FallbackBooking,
) {
  const existingCookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${FALLBACK_BOOKINGS_COOKIE}=`))
    ?.split("=")[1];
  const existing = decodeBookings(existingCookie).map(hydrateBooking);
  const nextBookings = [booking, ...existing.filter((item) => item.bookingCode !== booking.bookingCode)]
    .slice(0, MAX_FALLBACK_BOOKINGS)
    .map(serializeBooking);

  response.cookies.set(FALLBACK_BOOKINGS_COOKIE, encodeBookings(nextBookings), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return response;
}
