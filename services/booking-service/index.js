const { PrismaClient } = require("@prisma/client");
const { loadEnv } = require("../_shared/env");
const { forwardJson, createService, notFound, readJson, sendJson } = require("../_shared/http");
const { serviceUrls } = require("../_shared/service-urls");

loadEnv();

const PORT = Number(process.env.BOOKING_SERVICE_PORT || 5004);
const prisma = new PrismaClient();

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

function serializeInquiry(inquiry) {
  return {
    ...inquiry,
    preferredDate: inquiry.preferredDate?.toISOString() || null,
    createdAt: inquiry.createdAt.toISOString(),
    updatedAt: inquiry.updatedAt.toISOString(),
  };
}

createService({
  name: "booking-service",
  port: PORT,
  async handler({ request, response, url }) {
    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, { service: "booking-service", ok: true, port: PORT });
      return;
    }

    if (request.method === "GET" && url.pathname === "/bookings") {
      const inquiries = await prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
      });
      sendJson(response, 200, { bookings: inquiries.map(serializeInquiry) });
      return;
    }

    if (request.method === "POST" && url.pathname === "/bookings") {
      const payload = await readJson(request);

      if (!payload.name || !payload.phone || !payload.destination) {
        sendJson(response, 400, {
          error: "name, phone and destination are required",
        });
        return;
      }

      const adults = Math.max(1, Number(payload.adults || 1));
      const children = Math.max(0, Number(payload.children || 0));
      const inquiry = await prisma.inquiry.create({
        data: {
          name: payload.name,
          phone: payload.phone,
          email: payload.email || null,
          destination: payload.destination,
          adults,
          children,
          travelers: adults + children,
          preferredDate: payload.preferredDate ? new Date(payload.preferredDate) : null,
          paymentMethod: payload.paymentMethod || "bank",
          paymentProofUrl: payload.paymentProofUrl || null,
          paymentStatus: "pending",
          budget: payload.budget || null,
          message: payload.message || null,
          bookingCode: createBookingCode(),
        },
      });

      const serialized = serializeInquiry(inquiry);

      try {
        await forwardJson(`${serviceUrls.notification}/notifications/email`, {
          method: "POST",
          body: serialized,
        });
      } catch (error) {
        console.error("[booking-service] notification failed", error);
      }

      sendJson(response, 201, {
        booking: serialized,
        bookingCode: inquiry.bookingCode,
        message: `Захиалга бүртгэгдлээ. Таны дугаар: ${inquiry.bookingCode}.`,
      });
      return;
    }

    if (request.method === "PATCH" && url.pathname.startsWith("/bookings/")) {
      const id = Number(url.pathname.replace("/bookings/", ""));
      const payload = await readJson(request);
      const inquiry = await prisma.inquiry.update({
        where: { id },
        data: {
          status: payload.status,
          paymentStatus: payload.paymentStatus,
        },
      });
      sendJson(response, 200, { booking: serializeInquiry(inquiry) });
      return;
    }

    notFound(response, "booking-service");
  },
});
