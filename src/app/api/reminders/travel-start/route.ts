import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendTravelReminder } from "@/lib/email";

function tomorrowRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() + 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  return { start, end };
}

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ sent: 0, message: "Database connection is not configured." });
  }

  const db = getDb();
  const { start, end } = tomorrowRange();

  const bookings = await db.inquiry.findMany({
    where: {
      preferredDate: {
        gte: start,
        lt: end,
      },
      reminderSentAt: null,
      email: {
        not: null,
      },
    },
  });

  let sent = 0;

  for (const booking of bookings) {
    const didSend = await sendTravelReminder({
      bookingCode: booking.bookingCode,
      name: booking.name,
      phone: booking.phone,
      email: booking.email,
      destination: booking.destination,
      travelers: booking.travelers,
      adults: booking.adults,
      children: booking.children,
      preferredDate: booking.preferredDate,
      paymentMethod: booking.paymentMethod,
      paymentStatus: booking.paymentStatus,
      budget: booking.budget,
      message: booking.message,
    });

    if (didSend) {
      sent += 1;
      await db.inquiry.update({
        where: { id: booking.id },
        data: { reminderSentAt: new Date() },
      });
    }
  }

  return NextResponse.json({
    sent,
    checked: bookings.length,
    range: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
  });
}
