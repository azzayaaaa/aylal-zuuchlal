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
        month: "long",
        day: "numeric",
      }).format(date)
    : "Товлоогүй";
}

function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

function bookingRows(inquiry: InquiryEmail) {
  return [
    ["Захиалгын дугаар", inquiry.bookingCode ?? "Үүсээгүй"],
    ["Нэр", inquiry.name],
    ["Утас", inquiry.phone],
    ["Имэйл", inquiry.email ?? "Байхгүй"],
    ["Аялал", inquiry.destination],
    [
      "Аялагчид",
      `${inquiry.travelers} хүн (том хүн ${inquiry.adults}, хүүхэд ${inquiry.children})`,
    ],
    ["Явах өдөр", formatDate(inquiry.preferredDate)],
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
  preheader,
  title,
  subtitle,
  badge,
  content,
  button,
}: {
  preheader: string;
  title: string;
  subtitle: string;
  badge: string;
  content: string;
  button?: { label: string; href: string };
}) {
  return `
    <!doctype html>
    <html lang="mn">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin:0;background:#07120f;padding:0;font-family:Arial,Helvetica,sans-serif;color:#17211d">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#07120f">
          <tr>
            <td style="padding:34px 14px">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;margin:0 auto;border-collapse:collapse;overflow:hidden;border-radius:24px;background:#fffaf0;box-shadow:0 26px 80px rgba(0,0,0,.34)">
                <tr>
                  <td style="padding:0;background:#10201d">
                    <div style="background:linear-gradient(135deg,#10201d 0%,#276457 58%,#b0184c 140%);padding:34px 32px 30px;color:#fff8e7">
                      <div style="display:inline-block;border:1px solid rgba(232,199,122,.45);border-radius:999px;padding:8px 12px;color:#e8c77a;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase">${escapeHtml(badge)}</div>
                      <h1 style="margin:18px 0 0;font-size:34px;line-height:1.12;font-weight:800;color:#fff8e7">${escapeHtml(title)}</h1>
                      <p style="margin:14px 0 0;max-width:560px;color:rgba(255,255,255,.82);font-size:15px;line-height:1.7">${escapeHtml(subtitle)}</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px 32px 34px">
                    ${content}
                    ${
                      button
                        ? `
                          <a href="${escapeHtml(button.href)}" style="display:inline-block;margin-top:26px;border-radius:999px;background:#d7a34f;color:#1c1710;padding:14px 22px;font-size:14px;font-weight:800;text-decoration:none">
                            ${escapeHtml(button.label)}
                          </a>
                        `
                        : ""
                    }
                    <p style="margin:28px 0 0;color:#7a715f;font-size:12px;line-height:1.7">
                      Энэ имэйл Sakura Travel вэбсайтаар үүссэн захиалгын мэдээлэл юм. Хэрэв мэдээлэл буруу байвал бидэнтэй шууд холбогдоорой.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function buildBookingDetails(inquiry: InquiryEmail, variant: "admin" | "customer") {
  const rows = bookingRows(inquiry)
    .map(
      ([key, value]) => `
        <tr>
          <td style="padding:14px 0;color:#7d705b;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #eadfca;vertical-align:top">${escapeHtml(key)}</td>
          <td style="padding:14px 0;color:#17211d;font-size:15px;font-weight:700;text-align:right;border-bottom:1px solid #eadfca;vertical-align:top">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
      <tr>
        <td style="padding:18px;border:1px solid #eadfca;border-radius:18px;background:#fffdf7">
          <div style="color:#b0184c;font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase">Booking code</div>
          <div style="margin-top:6px;color:#17211d;font-size:28px;font-weight:900;letter-spacing:.03em">${escapeHtml(inquiry.bookingCode ?? "Pending")}</div>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin-top:18px">${rows}</table>
    <div style="margin-top:24px;border-radius:18px;background:#10201d;padding:20px;color:#fff8e7">
      <div style="font-size:12px;color:#e8c77a;font-weight:900;text-transform:uppercase;letter-spacing:.14em">
        ${variant === "admin" ? "Дараагийн алхам" : "Бид удахгүй холбогдоно"}
      </div>
      <p style="margin:9px 0 0;line-height:1.7;color:rgba(255,255,255,.80);font-size:14px">
        ${
          variant === "admin"
            ? "Хэрэглэгчтэй холбогдож суудал, төлбөр болон аяллын маршрутыг баталгаажуулаарай."
            : "Sakura Travel менежер тантай холбогдож суудал, төлбөр болон аяллын маршрутыг баталгаажуулна."
        }
      </p>
    </div>
  `;
}

function buildEmailHtml(inquiry: InquiryEmail, variant: "admin" | "customer") {
  const customer = variant === "customer";

  return buildEmailShell({
    preheader: customer
      ? `Таны ${inquiry.destination} аяллын захиалга бүртгэгдлээ.`
      : `${inquiry.name} хэрэглэгчээс шинэ аяллын захиалга ирлээ.`,
    title: customer ? "Таны аяллын захиалга бүртгэгдлээ" : "Шинэ аяллын захиалга",
    subtitle: customer
      ? "Доорх мэдээллээр таны хүсэлтийг бүртгэлээ. Бид тантай богино хугацаанд холбогдож баталгаажуулна."
      : "Sakura Travel вэбсайтаас шинэ booking request ирлээ. Дэлгэрэнгүй мэдээллийг доороос шалгана уу.",
    badge: "Sakura Travel",
    content: buildBookingDetails(inquiry, variant),
    button: customer
      ? { label: "Захиалгаа харах", href: `${appUrl()}/my-bookings` }
      : { label: "Админ руу орох", href: `${appUrl()}/admin` },
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

  const bookingUrl = `${appUrl()}/my-bookings`;

  await transporter.sendMail({
    from: `"Sakura Travel" <${smtpUser}>`,
    to: inquiry.email,
    subject: "Таны аялал эхлэхэд 1 хоног үлдлээ",
    text: [
      "Таны аялал эхлэхэд 1 хоног үлдсэн байна.",
      "",
      `Захиалгын дугаар: ${inquiry.bookingCode ?? ""}`,
      `Аялал: ${inquiry.destination}`,
      `Захиалга: ${bookingUrl}`,
    ].join("\n"),
    html: buildEmailShell({
      preheader: `${inquiry.destination} аялал эхлэхэд 1 хоног үлдлээ.`,
      title: "Таны аялал эхлэхэд 1 хоног үлдлээ",
      subtitle: "Маргааш аялал эхэлнэ. Захиалгын мэдээллээ дахин шалгаарай.",
      badge: "Travel reminder",
      content: buildBookingDetails(inquiry, "customer"),
      button: { label: "Захиалгаа харах", href: bookingUrl },
    }),
  });

  return true;
}
