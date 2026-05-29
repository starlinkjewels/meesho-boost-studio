import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, ".vercel", "output");
const funcDir = path.join(out, "functions", "index.func");

// ── helpers ───────────────────────────────────────────────────────────────────

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── 1. Regular Vite/Nitro build ───────────────────────────────────────────────

run("bun run build");

// ── 2. Bundle server + all npm deps into one Node.js ESM file ─────────────────
//
// The Nitro/Cloudflare preset externalises packages (react, h3-v2, etc.).
// Vercel serverless functions need everything bundled. We re-bundle with esbuild
// --platform=node so node:* built-ins stay external (they are provided by the
// Node.js runtime) while every npm package is inlined.

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(funcDir, { recursive: true });

const esbuild = path.join(root, "node_modules", ".bin", "esbuild");
const serverEntry = path.join(root, "dist", "server", "server.js");
const bundledOut = path.join(funcDir, "server-bundle.js");

run(
  [
    esbuild,
    serverEntry,
    "--bundle",
    "--format=esm",
    "--platform=node",       // keeps node:* built-ins external, bundles npm pkgs
    `--outfile=${bundledOut}`,
    '--define:process.env.NODE_ENV=\'"production"\'',
    "--minify-whitespace",
  ].join(" "),
);
console.log("✓ Bundled server → server-bundle.js");

// ── 3. Write Node.js http adapter ─────────────────────────────────────────────
//
// The Nitro server exports { fetch(Request, env, ctx) } (Cloudflare Workers
// style). Vercel Node.js functions expect (req, res). This adapter bridges them.

const adapter = /* js */ `
import handler from "./server-bundle.js";

export default async function vercelHandler(req, res) {
  const host = req.headers["host"] || "localhost";
  const proto = req.headers["x-forwarded-proto"] || "https";
  const url = new URL(req.url, proto + "://" + host);

  const headers = new Headers();
  for (const [key, val] of Object.entries(req.headers)) {
    if (val !== undefined) {
      if (Array.isArray(val)) val.forEach((v) => headers.append(key, v));
      else headers.set(key, String(val));
    }
  }

  let body = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buf = Buffer.concat(chunks);
    if (buf.length) body = buf;
  }

  const request = new Request(url.toString(), { method: req.method, headers, body });
  const response = await handler.fetch(request, {}, {});

  res.statusCode = response.status;
  for (const [key, val] of response.headers.entries()) res.setHeader(key, val);
  res.end(Buffer.from(await response.arrayBuffer()));
}
`.trimStart();

fs.writeFileSync(path.join(funcDir, "index.js"), adapter);
console.log("✓ Wrote Node.js http adapter → index.js");

// ── 4. Vercel function config (Node.js runtime) ───────────────────────────────

writeJson(path.join(funcDir, ".vc-config.json"), {
  runtime: "nodejs22.x",
  handler: "index.js",
  launcherType: "Nodejs",
});
console.log("✓ Wrote .vc-config.json (runtime: nodejs22.x)");

// ── 5. Static client assets ───────────────────────────────────────────────────

const clientDir = path.join(root, "dist", "client");
const staticDir = path.join(out, "static");
if (fs.existsSync(clientDir)) {
  copyDir(clientDir, staticDir);
  console.log("✓ Copied client assets → .vercel/output/static/");
}

// ── 6. Vercel Build Output config ─────────────────────────────────────────────

writeJson(path.join(out, "config.json"), {
  version: 3,
  routes: [
    { handle: "filesystem" },          // serve static assets first
    { src: "/(.*)", dest: "/index" },  // everything else → SSR function
  ],
});
console.log("✓ Wrote .vercel/output/config.json");

console.log("\n✅ Vercel output ready at .vercel/output/");
