import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendInquiryNotification } from "@/lib/email";
import { services, type GatewayBookingPayload } from "@/lib/service-config";

function createBookingCode() {
  const date = new Date();
  const compactDate = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SKR-${compactDate}-${random}`;
}

async function forwardToGateway(
  request: Request,
  payload: Partial<GatewayBookingPayload>,
) {
  const response = await fetch(`${services.apiGateway}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: request.headers.get("authorization") ?? "",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

async function createLocalFallback(payload: Partial<GatewayBookingPayload>) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      bookingCode: createBookingCode(),
      message: "Захиалга demo горимоор бүртгэгдлээ. Менежер төлбөр болон суудлыг баталгаажуулна.",
      source: "demo-fallback",
    });
  }

  const adults = Math.max(1, Number(payload.adults ?? 1));
  const children = Math.max(0, Number(payload.children ?? 0));

  let inquiry;

  try {
    inquiry = await getDb().inquiry.create({
      data: {
        name: payload.name!,
        phone: payload.phone!,
        email: payload.email || null,
        destination: payload.destination!,
        adults,
        children,
        travelers: adults + children,
        preferredDate: payload.preferredDate
          ? new Date(payload.preferredDate)
          : null,
        paymentMethod: payload.paymentMethod ?? "bank",
        paymentProofUrl: payload.paymentProofUrl || null,
        paymentStatus: "pending",
        budget: payload.budget || null,
        message: payload.message || null,
        bookingCode: createBookingCode(),
      },
    });
  } catch (error) {
    console.warn("Local booking database fallback", error);
    return NextResponse.json({
      bookingCode: createBookingCode(),
      message: "Захиалга demo горимоор бүртгэгдлээ. Менежер төлбөр болон суудлыг баталгаажуулна.",
      source: "demo-fallback",
    });
  }

  try {
    await sendInquiryNotification({
      bookingCode: inquiry.bookingCode,
      name: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email,
      destination: inquiry.destination,
      travelers: inquiry.travelers,
      adults: inquiry.adults,
      children: inquiry.children,
      preferredDate: inquiry.preferredDate,
      paymentMethod: inquiry.paymentMethod,
      paymentStatus: inquiry.paymentStatus,
      budget: inquiry.budget,
      message: inquiry.message,
    });
  } catch (error) {
    console.error("Email notification failed", error);
  }

  return NextResponse.json({
    bookingCode: inquiry.bookingCode,
    message: `Захиалга бүртгэгдлээ. Таны дугаар: ${inquiry.bookingCode}. Менежер төлбөр болон суудлыг баталгаажуулна.`,
  });
}

export async function GET() {
  try {
    const response = await fetch(`${services.apiGateway}/bookings`, {
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ bookings: [] });
    }

    const bookings = await getDb().inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  }
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<GatewayBookingPayload>;

  if (!payload.name || !payload.phone || !payload.destination) {
    return NextResponse.json(
      { error: "Name, phone and tour package are required." },
      { status: 400 },
    );
  }

  try {
    return await forwardToGateway(request, payload);
  } catch (error) {
    console.warn("API Gateway unavailable, using local booking fallback", error);
    return createLocalFallback(payload);
  }
}
