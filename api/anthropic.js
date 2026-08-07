// Vercel serverless function  ->  repo path:  api/anthropic.js
// Proxies Helm's AI calls to Anthropic, keeping the API key server-side.
// CommonJS (module.exports) so Vercel builds it without a package.json.
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body,
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: "Proxy error", detail: String(e && e.message || e) });
  }
};
