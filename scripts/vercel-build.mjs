import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, ".vercel", "output");

// ── helpers ──────────────────────────────────────────────────────────────────

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── 1. Build ──────────────────────────────────────────────────────────────────

run("bun run build");

// ── 2. Assemble .vercel/output ────────────────────────────────────────────────

// Clean any previous output
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

// 2a. Static client assets → .vercel/output/static/
const clientDir = path.join(root, "dist", "client");
const staticDir = path.join(out, "static");
if (fs.existsSync(clientDir)) {
  copyDir(clientDir, staticDir);
  console.log("✓ Copied client assets → .vercel/output/static/");
}

// 2b. Server → .vercel/output/functions/index.func/
const serverDir = path.join(root, "dist", "server");
const funcDir = path.join(out, "functions", "index.func");
fs.mkdirSync(funcDir, { recursive: true });

// Copy server.js and assets/
if (fs.existsSync(path.join(serverDir, "server.js"))) {
  fs.copyFileSync(
    path.join(serverDir, "server.js"),
    path.join(funcDir, "server.js"),
  );
}
const serverAssetsDir = path.join(serverDir, "assets");
if (fs.existsSync(serverAssetsDir)) {
  copyDir(serverAssetsDir, path.join(funcDir, "assets"));
}
console.log("✓ Copied server → .vercel/output/functions/index.func/");

// 2c. Edge function config
writeJson(path.join(funcDir, ".vc-config.json"), {
  runtime: "edge",
  entrypoint: "server.js",
});
console.log("✓ Wrote .vc-config.json (runtime: edge)");

// 2d. Vercel Build Output config
writeJson(path.join(out, "config.json"), {
  version: 3,
  routes: [
    // Serve static assets directly
    { handle: "filesystem" },
    // All other requests → the edge function (SSR)
    { src: "/(.*)", dest: "/index" },
  ],
});
console.log("✓ Wrote .vercel/output/config.json");

console.log("\n✅ Vercel output ready at .vercel/output/");
