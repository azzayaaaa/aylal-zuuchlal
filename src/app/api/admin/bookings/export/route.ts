import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { getDb } from "@/lib/db";

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inquiries = await getDb().inquiry.findMany({
    orderBy: { createdAt: "desc" },
  }).catch((error) => {
    console.warn("CSV export unavailable", error);
    return [];
  });
  const headers = [
    "bookingCode",
    "name",
    "phone",
    "email",
    "destination",
    "travelers",
    "preferredDate",
    "status",
    "paymentStatus",
    "paymentMethod",
    "budget",
    "adminNote",
    "followUpAt",
    "createdAt",
  ];
  const rows = inquiries.map((inquiry) => [
    inquiry.bookingCode,
    inquiry.name,
    inquiry.phone,
    inquiry.email,
    inquiry.destination,
    inquiry.travelers,
    inquiry.preferredDate?.toISOString().slice(0, 10),
    inquiry.status,
    inquiry.paymentStatus,
    inquiry.paymentMethod,
    inquiry.budget,
    inquiry.adminNote,
    inquiry.followUpAt?.toISOString(),
    inquiry.createdAt.toISOString(),
  ]);
  const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sakura-bookings-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
