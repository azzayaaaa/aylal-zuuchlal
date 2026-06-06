const nodemailer = require("nodemailer");
const { loadEnv } = require("../_shared/env");
const { createService, notFound, readJson, sendJson } = require("../_shared/http");

loadEnv();

const PORT = Number(process.env.NOTIFICATION_SERVICE_PORT || 5007);

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

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
    subject: `New Sakura Travel booking ${payload.bookingCode || ""}`.trim(),
    text: [
      `Booking: ${payload.bookingCode || "-"}`,
      `Name: ${payload.name || "-"}`,
      `Phone: ${payload.phone || "-"}`,
      `Email: ${payload.email || "-"}`,
      `Tour: ${payload.destination || "-"}`,
      `Travelers: ${payload.travelers || "-"}`,
      `Date: ${payload.preferredDate || "-"}`,
      `Payment: ${payload.paymentMethod || "-"} / ${payload.paymentStatus || "-"}`,
      `Message: ${payload.message || "-"}`,
    ].join("\n"),
  });

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
