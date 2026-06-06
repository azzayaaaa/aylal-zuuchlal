const { loadEnv } = require("../_shared/env");
const { createService, notFound, readJson, sendJson } = require("../_shared/http");

loadEnv();

const PORT = Number(process.env.USER_SERVICE_PORT || 5002);
const profiles = new Map();

createService({
  name: "user-service",
  port: PORT,
  async handler({ request, response, url }) {
    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, { service: "user-service", ok: true, port: PORT });
      return;
    }

    if (request.method === "GET" && url.pathname.startsWith("/profiles/")) {
      const phone = decodeURIComponent(url.pathname.replace("/profiles/", ""));
      sendJson(response, 200, {
        profile: profiles.get(phone) || { phone },
      });
      return;
    }

    if (request.method === "POST" && url.pathname === "/profiles") {
      const payload = await readJson(request);
      if (!payload.phone) {
        sendJson(response, 400, { error: "phone is required" });
        return;
      }

      const profile = {
        phone: payload.phone,
        name: payload.name || "",
        email: payload.email || "",
      };
      profiles.set(payload.phone, profile);
      sendJson(response, 200, { profile });
      return;
    }

    notFound(response, "user-service");
  },
});
