const { loadEnv } = require("../_shared/env");
const { createService, notFound, readJson, sendJson } = require("../_shared/http");

loadEnv();

const PORT = Number(process.env.PAYMENT_SERVICE_PORT || 5005);
const payments = new Map();

createService({
  name: "payment-service",
  port: PORT,
  async handler({ request, response, url }) {
    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, { service: "payment-service", ok: true, port: PORT });
      return;
    }

    if (request.method === "POST" && url.pathname === "/payments") {
      const payload = await readJson(request);
      const id = payload.bookingCode || `PAY-${Date.now()}`;
      const payment = {
        id,
        bookingCode: payload.bookingCode || null,
        method: payload.method || "bank",
        status: payload.status || "pending",
        amount: payload.amount || null,
      };
      payments.set(id, payment);
      sendJson(response, 201, { payment });
      return;
    }

    if (request.method === "GET" && url.pathname.startsWith("/payments/")) {
      const id = url.pathname.replace("/payments/", "");
      const payment = payments.get(id);
      sendJson(response, payment ? 200 : 404, payment ? { payment } : { error: "payment not found" });
      return;
    }

    notFound(response, "payment-service");
  },
});
