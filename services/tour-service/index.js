const { loadEnv } = require("../_shared/env");
const { tours } = require("../_shared/tours");
const { createService, notFound, sendJson } = require("../_shared/http");

loadEnv();

const PORT = Number(process.env.TOUR_SERVICE_PORT || 5003);

createService({
  name: "tour-service",
  port: PORT,
  async handler({ request, response, url }) {
    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, { service: "tour-service", ok: true, port: PORT });
      return;
    }

    if (request.method === "GET" && url.pathname === "/tours") {
      const category = url.searchParams.get("category");
      const filtered = category
        ? tours.filter((tour) => tour.category.toLowerCase() === category.toLowerCase())
        : tours;
      sendJson(response, 200, { tours: filtered });
      return;
    }

    if (request.method === "GET" && url.pathname.startsWith("/tours/")) {
      const id = url.pathname.replace("/tours/", "");
      const tour = tours.find((item) => item.id === id);
      sendJson(response, tour ? 200 : 404, tour ? { tour } : { error: "tour not found" });
      return;
    }

    notFound(response, "tour-service");
  },
});
