"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";

export async function updateInquiryStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "new");
  const paymentStatus = String(formData.get("paymentStatus") ?? "pending");

  if (!Number.isFinite(id) || id <= 0) return;

  await getDb().inquiry.update({
    where: { id },
    data: { status, paymentStatus },
  });

  revalidatePath("/admin");
}
