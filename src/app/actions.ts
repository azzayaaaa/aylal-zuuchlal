"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { updateFallbackBookingInCookies } from "@/lib/fallback-bookings";

export async function updateInquiryStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "new");
  const paymentStatus = String(formData.get("paymentStatus") ?? "pending");
  const adminNote = String(formData.get("adminNote") ?? "").trim();
  const followUpAtValue = String(formData.get("followUpAt") ?? "").trim();
  const markPaid = String(formData.get("markPaid") ?? "") === "1";

  if (!Number.isFinite(id) || id <= 0) return;

  const nextStatus = markPaid ? "paid" : status;
  const nextPaymentStatus = markPaid ? "success" : paymentStatus;
  const nextFollowUpAt = followUpAtValue ? new Date(followUpAtValue) : null;

  try {
    await getDb().inquiry.update({
      where: { id },
      data: {
        status: nextStatus,
        paymentStatus: nextPaymentStatus,
        adminNote: adminNote || null,
        followUpAt: nextFollowUpAt,
      },
    });
  } catch (error) {
    console.warn("Admin booking update fallback", error);
    await updateFallbackBookingInCookies(id, {
      status: nextStatus,
      paymentStatus: nextPaymentStatus,
      adminNote: adminNote || null,
      followUpAt: nextFollowUpAt,
    });
  }

  revalidatePath("/admin");
  redirect("/admin");
}
