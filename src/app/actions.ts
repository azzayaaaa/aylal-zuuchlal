"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";

export async function updateInquiryStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "new");
  const paymentStatus = String(formData.get("paymentStatus") ?? "pending");
  const adminNote = String(formData.get("adminNote") ?? "").trim();
  const followUpAtValue = String(formData.get("followUpAt") ?? "").trim();

  if (!Number.isFinite(id) || id <= 0) return;

  await getDb().inquiry.update({
    where: { id },
    data: {
      status,
      paymentStatus,
      adminNote: adminNote || null,
      followUpAt: followUpAtValue ? new Date(followUpAtValue) : null,
    },
  });

  revalidatePath("/admin");
}
