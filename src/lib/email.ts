import nodemailer from "nodemailer";

export type InquiryEmail = {
  bookingCode: string | null;
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
  budget: string | null;
  message: string | null;
};

const labels: Record<string, string> = {
  bank: "Дансаар",
  deposit: "Урьдчилгаа",
  full: "Бүтэн төлбөр",
  pending: "Хүлээгдэж байна",
  success: "Төлөгдсөн",
  failed: "Амжилтгүй",
  refunded: "Буцаагдсан",
};

function label(value: string) {
  return labels[value] ?? value;
}

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(date: Date | null) {
  return date
    ? new Intl.DateTimeFormat("mn-MN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date)
    : "Товлоогүй";
}

function bookingRows(inquiry: InquiryEmail) {
  const dateText = formatDate(inquiry.preferredDate);

  return [
    ["Захиалгын дугаар", inquiry.bookingCode ?? "Үүсээгүй"],
    ["Нэр", inquiry.name],
    ["Утас", inquiry.phone],
    ["Имэйл", inquiry.email ?? "Байхгүй"],
    ["Аялал", inquiry.destination],
    ["Аялагчид", `${inquiry.travelers} хүн (том хүн ${inquiry.adults}, хүүхэд ${inquiry.children})`],
    ["Явах өдөр", dateText],
    ["Төлбөр", `${label(inquiry.paymentMethod)} / ${label(inquiry.paymentStatus)}`],
    ["Төсөв", inquiry.budget ?? "Байхгүй"],
    ["Нэмэлт хүсэлт", inquiry.message ?? "Байхгүй"],
  ];
}

function createTransporter() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.warn("Email notification skipped: SMTP_USER or SMTP_PASS is missing.");
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

function buildEmailShell({
  title,
  subtitle,
  content,
  button,
}: {
  title: string;
  subtitle: string;
  content: string;
  button?: { label: string; href: string };
}) {
  return `
    <div style="margin:0;background:#07120f;padding:32px 16px;font-family:Arial,Helvetica,sans-serif">
      <div style="max-width:680px;margin:0 auto;overflow:hidden;border-radius:22px;background:#fff8e7;box-shadow:0 28px 80px rgba(0,0,0,.30)">
        <div style="background:linear-gradient(135deg,#10201d,#276457);padding:32px;color:#fff8e7">
          <div style="font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#e8c77a;font-weight:800">Sakura Travel</div>
          <h1 style="margin:18px 0 0;font-size:34px;line-height:1.08;color:#fff8e7">${escapeHtml(title)}</h1>
          <p style="margin:14px 0 0;color:rgba(255,255,255,.78);line-height:1.7">${escapeHtml(subtitle)}</p>
        </div>
        <div style="padding:30px">
          ${content}
          ${button ? `
            <a href="${escapeHtml(button.href)}" style="display:inline-block;margin-top:24px;border-radius:999px;background:#e8b95e;color:#17211d;padding:14px 22px;font-weight:800;text-decoration:none">
              ${escapeHtml(button.label)}
            </a>
          ` : ""}
        </div>
      </div>
    </div>
  `;
}

function buildBookingDetails(inquiry: InquiryEmail) {
  const rows = bookingRows(inquiry)
    .map(([key, value]) => `
      <tr>
        <td style="padding:12px 0;color:#7d705b;font-size:12px;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #eadfca">${escapeHtml(key)}</td>
        <td style="padding:12px 0;color:#17211d;font-weight:700;text-align:right;border-bottom:1px solid #eadfca">${escapeHtml(value)}</td>
      </tr>
    `)
    .join("");

  return `
    <div style="display:inline-block;border:1px solid #e8c77a;border-radius:999px;padding:9px 14px;color:#9e6f1c;background:#fffaf0;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase">
      ${escapeHtml(inquiry.bookingCode ?? "Pending code")}
    </div>
    <table style="width:100%;border-collapse:collapse;margin-top:18px">${rows}</table>
    <div style="margin-top:24px;border-radius:16px;background:#10201d;padding:18px;color:#fff8e7">
      <div style="font-size:13px;color:#e8c77a;font-weight:800;text-transform:uppercase;letter-spacing:.12em">Next step</div>
      <p style="margin:8px 0 0;line-height:1.7;color:rgba(255,255,255,.78)">
        Sakura Travel менежер тантай холбогдож суудал, төлбөр, аяллын маршрутыг баталгаажуулна.
      </p>
    </div>
  `;
}

function buildEmailHtml(inquiry: InquiryEmail, variant: "admin" | "customer") {
  return buildEmailShell({
    title: variant === "admin" ? "Шинэ аяллын захиалга" : "Таны аяллын захиалга бүртгэгдлээ",
    subtitle: variant === "admin"
      ? "Sakura Travel website-аас шинэ booking request ирлээ."
      : "Бид таны захиалгыг хүлээн авлаа. Доорх мэдээлэл бүртгэгдсэн байна.",
    content: buildBookingDetails(inquiry),
    button: variant === "customer"
      ? { label: "Захиалга харах", href: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/my-bookings` }
      : undefined,
  });
}

function buildEmailText(inquiry: InquiryEmail) {
  return bookingRows(inquiry).map(([key, value]) => `${key}: ${value}`).join("\n");
}

export async function sendInquiryNotification(inquiry: InquiryEmail) {
  const transporter = createTransporter();
  const smtpUser = process.env.SMTP_USER;
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (!transporter || !smtpUser) {
    return;
  }

  if (notifyEmail) {
    await transporter.sendMail({
      from: `"Sakura Travel Website" <${smtpUser}>`,
      to: notifyEmail,
      subject: `Шинэ аяллын захиалга: ${inquiry.destination}`,
      text: buildEmailText(inquiry),
      html: buildEmailHtml(inquiry, "admin"),
    });
  }

  if (inquiry.email) {
    await transporter.sendMail({
      from: `"Sakura Travel" <${smtpUser}>`,
      to: inquiry.email,
      subject: `Sakura Travel захиалга бүртгэгдлээ: ${inquiry.bookingCode ?? inquiry.destination}`,
      text: buildEmailText(inquiry),
      html: buildEmailHtml(inquiry, "customer"),
    });
  }
}

export async function sendTravelReminder(inquiry: InquiryEmail) {
  const transporter = createTransporter();
  const smtpUser = process.env.SMTP_USER;

  if (!transporter || !smtpUser || !inquiry.email) {
    return false;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  await transporter.sendMail({
    from: `"Sakura Travel" <${smtpUser}>`,
    to: inquiry.email,
    subject: "Таны аялал эхлэхэд 1 хоног үлдлээ",
    text: `Таны аялал эхлэхэд 1 хоног үлдсэн байна.\n\nЗахиалгын дугаар: ${inquiry.bookingCode ?? ""}\nАялал: ${inquiry.destination}\nЗахиалга: ${appUrl}/my-bookings`,
    html: buildEmailShell({
      title: "Таны аялал эхлэхэд 1 хоног үлдлээ",
      subtitle: "Маргааш аялал эхэлнэ. Захиалгын мэдээллээ дахин шалгаарай.",
      content: buildBookingDetails(inquiry),
      button: { label: "Захиалга", href: `${appUrl}/my-bookings` },
    }),
  });

  return true;
}
