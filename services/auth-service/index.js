const crypto = require("node:crypto");
const { loadEnv } = require("../_shared/env");
const { createService, notFound, readJson, sendJson } = require("../_shared/http");

loadEnv();

const PORT = Number(process.env.AUTH_SERVICE_PORT || 5001);
const JWT_SECRET = process.env.JWT_SECRET || "sakura-dev-secret";
const users = new Map();

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function signToken(payload) {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(
    JSON.stringify({
      ...payload,
      iss: "sakura-auth-service",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14,
    }),
  );
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) return null;

  const expected = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  if (signature.length !== expected.length) return null;

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

createService({
  name: "auth-service",
  port: PORT,
  async handler({ request, response, url }) {
    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, { service: "auth-service", ok: true, port: PORT });
      return;
    }

    if (request.method === "POST" && url.pathname === "/register") {
      const payload = await readJson(request);
      if (!payload.phone || !payload.name) {
        sendJson(response, 400, { error: "name and phone are required" });
        return;
      }

      users.set(payload.phone, {
        name: payload.name,
        phone: payload.phone,
        email: payload.email || null,
      });

      const token = signToken({ sub: payload.phone, role: "user" });
      sendJson(response, 201, { token, user: users.get(payload.phone) });
      return;
    }

    if (request.method === "POST" && url.pathname === "/login") {
      const payload = await readJson(request);
      if (!payload.phone) {
        sendJson(response, 400, { error: "phone is required" });
        return;
      }

      if (!users.has(payload.phone)) {
        users.set(payload.phone, {
          name: payload.name || "Sakura Traveler",
          phone: payload.phone,
          email: payload.email || null,
        });
      }

      const token = signToken({ sub: payload.phone, role: "user" });
      sendJson(response, 200, { token, user: users.get(payload.phone) });
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/login") {
      const payload = await readJson(request);
      if (!process.env.ADMIN_PASSWORD || payload.password !== process.env.ADMIN_PASSWORD) {
        sendJson(response, 401, { error: "invalid admin password" });
        return;
      }

      sendJson(response, 200, {
        token: signToken({ sub: "admin", role: "admin" }),
        role: "admin",
      });
      return;
    }

    if (request.method === "POST" && url.pathname === "/verify") {
      const payload = await readJson(request);
      const token = String(payload.token || "").replace(/^Bearer\s+/i, "");
      const decoded = token ? verifyToken(token) : null;
      sendJson(response, decoded ? 200 : 401, decoded ? { valid: true, user: decoded } : { valid: false });
      return;
    }

    notFound(response, "auth-service");
  },
});
