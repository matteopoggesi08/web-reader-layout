/**
 * Mail Reader API — Cloudflare Worker
 * Endpoints:
 *   GET /search?q=calcio
 *   GET /read?url=https%3A%2F%2Fexample.com
 *
 * Configure optional secret JINA_API_KEY in Worker settings if required by
 * your Jina account/plan. Never put API keys in the public GitHub Pages code.
 */
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400"
};

function response(body, status=200, contentType="text/plain; charset=utf-8") {
  return new Response(body, { status, headers: { ...cors, "Content-Type": contentType, "Cache-Control": "no-store" } });
}
function validHttpUrl(raw) {
  try { const u = new URL(raw); return ["http:", "https:"].includes(u.protocol) ? u : null; }
  catch { return null; }
}
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "GET") return response("Method not allowed", 405);
    const reqUrl = new URL(request.url);
    let target;
    if (reqUrl.pathname === "/health") return response("Mail Reader API is running.");
    if (reqUrl.pathname === "/search") {
      const q = (reqUrl.searchParams.get("q") || "").trim();
      if (!q) return response("Missing q parameter", 400);
      target = "https://s.jina.ai/?q=" + encodeURIComponent(q);
    } else if (reqUrl.pathname === "/read") {
      const raw = reqUrl.searchParams.get("url");
      const u = raw && validHttpUrl(raw);
      if (!u) return response("Missing or invalid url parameter", 400);
      target = "https://r.jina.ai/" + u.href;
    } else {
      return response("Use /health, /search?q=... or /read?url=...", 404);
    }
    const headers = { "Accept": "text/plain", "X-Respond-With": "markdown" };
    if (env.JINA_API_KEY) headers["Authorization"] = "Bearer " + env.JINA_API_KEY;
    try {
      const upstream = await fetch(target, { headers, redirect: "follow" });
      const body = await upstream.text();
      return response(body, upstream.status, "text/plain; charset=utf-8");
    } catch (e) {
      return response("Upstream fetch failed: " + String(e), 502);
    }
  }
};
