const { spawn } = require("node:child_process");
const path = require("node:path");

const services = [
  ["api-gateway", "services/api-gateway/index.js"],
  ["auth-service", "services/auth-service/index.js"],
  ["user-service", "services/user-service/index.js"],
  ["tour-service", "services/tour-service/index.js"],
  ["booking-service", "services/booking-service/index.js"],
  ["payment-service", "services/payment-service/index.js"],
  ["notification-service", "services/notification-service/index.js"],
];

const children = services.map(([name, file]) => {
  const child = spawn(process.execPath, [path.join(process.cwd(), file)], {
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[${name}] ${chunk}`);
  });
  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[${name}] ${chunk}`);
  });
  child.on("exit", (code) => {
    console.log(`[${name}] exited with code ${code}`);
  });

  return child;
});

function shutdown() {
  for (const child of children) {
    child.kill("SIGTERM");
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
