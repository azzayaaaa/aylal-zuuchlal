const { loadEnv } = require("../_shared/env");
const { createService, forwardJson, notFound, readJson, sendJson } = require("../_shared/http");
const { serviceUrls } = require("../_shared/service-urls");

loadEnv();

const PORT = Number(process.env.API_GATEWAY_PORT || 5000);

async function proxyJson({ request, response, target, method, body }) {
  const result = await forwardJson(target, {
    method: method || request.method,
    body,
    token: request.headers.authorization,
  });
  sendJson(response, result.status, result.data);
}

async function serviceHealth() {
  const entries = Object.entries({
    auth: serviceUrls.auth,
    user: serviceUrls.user,
    tour: serviceUrls.tour,
    booking: serviceUrls.booking,
    payment: serviceUrls.payment,
    notification: serviceUrls.notification,
  });

  const results = await Promise.all(
    entries.map(async ([name, baseUrl]) => {
      try {
        const response = await fetch(`${baseUrl}/health`);
        return [name, { ok: response.ok, status: response.status, url: baseUrl }];
      } catch (error) {
        return [name, { ok: false, url: baseUrl, error: error.message }];
      }
    }),
  );

  return Object.fromEntries(results);
}

createService({
  name: "api-gateway",
  port: PORT,
  async handler({ request, response, url }) {
    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, {
        service: "api-gateway",
        ok: true,
        port: PORT,
        services: await serviceHealth(),
      });
      return;
    }

    if (url.pathname.startsWith("/auth/")) {
      const body = request.method === "GET" ? undefined : await readJson(request);
      await proxyJson({
        request,
        response,
        target: `${serviceUrls.auth}${url.pathname.replace("/auth", "")}`,
        body,
      });
      return;
    }

    if (url.pathname.startsWith("/users")) {
      const body = request.method === "GET" ? undefined : await readJson(request);
      await proxyJson({
        request,
        response,
        target: `${serviceUrls.user}${url.pathname.replace("/users", "/profiles")}${url.search}`,
        body,
      });
      return;
    }

    if (url.pathname.startsWith("/tours")) {
      await proxyJson({
        request,
        response,
        target: `${serviceUrls.tour}${url.pathname}${url.search}`,
      });
      return;
    }

    if (url.pathname.startsWith("/bookings")) {
      const body = request.method === "GET" ? undefined : await readJson(request);
      await proxyJson({
        request,
        response,
        target: `${serviceUrls.booking}${url.pathname}${url.search}`,
        body,
      });
      return;
    }

    if (url.pathname.startsWith("/payments")) {
      const body = request.method === "GET" ? undefined : await readJson(request);
      await proxyJson({
        request,
        response,
        target: `${serviceUrls.payment}${url.pathname}${url.search}`,
        body,
      });
      return;
    }

    if (url.pathname.startsWith("/notifications")) {
      const body = request.method === "GET" ? undefined : await readJson(request);
      await proxyJson({
        request,
        response,
        target: `${serviceUrls.notification}${url.pathname}${url.search}`,
        body,
      });
      return;
    }

    notFound(response, "api-gateway");
  },
});
