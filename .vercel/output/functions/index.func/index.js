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
