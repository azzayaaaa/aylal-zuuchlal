const nodemailer = require("nodemailer");
const { loadEnv } = require("../_shared/env");
const { createService, notFound, readJson, sendJson } = require("../_shared/http");

loadEnv();

const PORT = Number(process.env.NOTIFICATION_SERVICE_PORT || 5007);

const labels = {
  bank: "Дансаар",
  deposit: "Урьдчилгаа",
  full: "Бүтэн төлбөр",
  pending: "Хүлээгдэж байна",
  success: "Төлөгдсөн",
  failed: "Амжилтгүй",
  refunded: "Буцаагдсан",
};

function label(value) {
  return labels[value] || value || "-";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) return "Товлоогүй";
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

function bookingRows(payload) {
  return [
    ["Захиалгын дугаар", payload.bookingCode || "Үүсээгүй"],
    ["Нэр", payload.name || "-"],
    ["Утас", payload.phone || "-"],
    ["Имэйл", payload.email || "Байхгүй"],
    ["Аялал", payload.destination || "-"],
    [
      "Аялагчид",
      `${payload.travelers || 1} хүн (том хүн ${payload.adults || 1}, хүүхэд ${payload.children || 0})`,
    ],
    ["Явах өдөр", formatDate(payload.preferredDate)],
    ["Төлбөр", `${label(payload.paymentMethod)} / ${label(payload.paymentStatus)}`],
    ["Төсөв", payload.budget || "Байхгүй"],
    ["Нэмэлт хүсэлт", payload.message || "Байхгүй"],
  ];
}

function buildEmailText(payload) {
  return bookingRows(payload).map(([key, value]) => `${key}: ${value}`).join("\n");
}

function buildEmailHtml(payload, variant) {
  const customer = variant === "customer";
  const rows = bookingRows(payload)
    .map(
      ([key, value]) => `
        <tr>
          <td style="padding:14px 0;color:#7d705b;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #eadfca;vertical-align:top">${escapeHtml(key)}</td>
          <td style="padding:14px 0;color:#17211d;font-size:15px;font-weight:700;text-align:right;border-bottom:1px solid #eadfca;vertical-align:top">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join("");

  const title = customer ? "Таны аяллын захиалга бүртгэгдлээ" : "Шинэ аяллын захиалга";
  const subtitle = customer
    ? "Доорх мэдээллээр таны хүсэлтийг бүртгэлээ. Бид тантай богино хугацаанд холбогдож баталгаажуулна."
    : "Sakura Travel вэбсайтаас шинэ booking request ирлээ. Дэлгэрэнгүй мэдээллийг доороос шалгана уу.";
  const buttonLabel = customer ? "Захиалгаа харах" : "Админ руу орох";
  const buttonHref = `${appUrl()}${customer ? "/my-bookings" : "/admin"}`;

  return `
    <!doctype html>
    <html lang="mn">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin:0;background:#07120f;padding:0;font-family:Arial,Helvetica,sans-serif;color:#17211d">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#07120f">
          <tr>
            <td style="padding:34px 14px">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;margin:0 auto;border-collapse:collapse;overflow:hidden;border-radius:24px;background:#fffaf0;box-shadow:0 26px 80px rgba(0,0,0,.34)">
                <tr>
                  <td style="background:linear-gradient(135deg,#10201d 0%,#276457 58%,#b0184c 140%);padding:34px 32px 30px;color:#fff8e7">
                    <div style="display:inline-block;border:1px solid rgba(232,199,122,.45);border-radius:999px;padding:8px 12px;color:#e8c77a;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase">Sakura Travel</div>
                    <h1 style="margin:18px 0 0;font-size:34px;line-height:1.12;font-weight:800;color:#fff8e7">${escapeHtml(title)}</h1>
                    <p style="margin:14px 0 0;max-width:560px;color:rgba(255,255,255,.82);font-size:15px;line-height:1.7">${escapeHtml(subtitle)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px 32px 34px">
                    <div style="padding:18px;border:1px solid #eadfca;border-radius:18px;background:#fffdf7">
                      <div style="color:#b0184c;font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase">Booking code</div>
                      <div style="margin-top:6px;color:#17211d;font-size:28px;font-weight:900;letter-spacing:.03em">${escapeHtml(payload.bookingCode || "Pending")}</div>
                    </div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin-top:18px">${rows}</table>
                    <div style="margin-top:24px;border-radius:18px;background:#10201d;padding:20px;color:#fff8e7">
                      <div style="font-size:12px;color:#e8c77a;font-weight:900;text-transform:uppercase;letter-spacing:.14em">${customer ? "Бид удахгүй холбогдоно" : "Дараагийн алхам"}</div>
                      <p style="margin:9px 0 0;line-height:1.7;color:rgba(255,255,255,.80);font-size:14px">
                        ${customer ? "Sakura Travel менежер тантай холбогдож суудал, төлбөр болон аяллын маршрутыг баталгаажуулна." : "Хэрэглэгчтэй холбогдож суудал, төлбөр болон аяллын маршрутыг баталгаажуулаарай."}
                      </p>
                    </div>
                    <a href="${escapeHtml(buttonHref)}" style="display:inline-block;margin-top:26px;border-radius:999px;background:#d7a34f;color:#1c1710;padding:14px 22px;font-size:14px;font-weight:800;text-decoration:none">${escapeHtml(buttonLabel)}</a>
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

async function sendEmail(payload) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return { skipped: true, reason: "SMTP is not configured" };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const adminTo = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
  await transporter.sendMail({
    from: `"Sakura Travel Website" <${process.env.SMTP_USER}>`,
    to: adminTo,
    subject: `Шинэ аяллын захиалга: ${payload.destination || ""}`.trim(),
    text: buildEmailText(payload),
    html: buildEmailHtml(payload, "admin"),
  });

  if (payload.email) {
    await transporter.sendMail({
      from: `"Sakura Travel" <${process.env.SMTP_USER}>`,
      to: payload.email,
      subject: `Sakura Travel захиалга бүртгэгдлээ: ${payload.bookingCode || payload.destination || ""}`.trim(),
      text: buildEmailText(payload),
      html: buildEmailHtml(payload, "customer"),
    });
  }

  return { skipped: false };
}

createService({
  name: "notification-service",
  port: PORT,
  async handler({ request, response, url }) {
    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, { service: "notification-service", ok: true, port: PORT });
      return;
    }

    if (request.method === "POST" && url.pathname === "/notifications/email") {
      const payload = await readJson(request);
      const result = await sendEmail(payload);
      sendJson(response, 202, { accepted: true, ...result });
      return;
    }

    if (request.method === "POST" && url.pathname === "/notifications/sms") {
      const payload = await readJson(request);
      sendJson(response, 202, {
        accepted: true,
        channel: "sms",
        skipped: true,
        reason: "SMS provider is not configured",
        phone: payload.phone || null,
      });
      return;
    }

    notFound(response, "notification-service");
  },
});
