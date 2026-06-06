const http = require("node:http");

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    request.on("error", reject);
  });
}

function sendJson(response, status, data, headers = {}) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    ...headers,
  });
  response.end(JSON.stringify(data));
}

function notFound(response, service) {
  sendJson(response, 404, { error: `${service} route not found` });
}

function createService({ name, port, handler }) {
  const server = http.createServer(async (request, response) => {
    if (request.method === "OPTIONS") {
      sendJson(response, 204, {});
      return;
    }

    try {
      const url = new URL(request.url, `http://${request.headers.host}`);
      await handler({ request, response, url });
    } catch (error) {
      console.error(`[${name}]`, error);
      sendJson(response, 500, {
        error: `${name} failed`,
        detail: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  server.listen(port, () => {
    console.log(`${name} listening on http://localhost:${port}`);
  });

  return server;
}

async function forwardJson(url, options = {}) {
  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: options.token } : {}),
      ...(options.headers ?? {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  return { status: response.status, data };
}

module.exports = {
  createService,
  forwardJson,
  notFound,
  readJson,
  sendJson,
};
