/**
 * Movies Hub Vercel Serverless Proxy
 * Handles dynamic API key retrieval and CORS-friendly upstream proxying.
 */

const DEFAULT_FIREBASE_API_KEY = "AIzaSyCyn-aSaYxz9LrMR5iwq4oVhFypdLhy0CI";
const DEFAULT_FIREBASE_APP_ID = "1:1005397943435:android:aa251a97505ea861e2e08e";
const DEFAULT_FIREBASE_PROJECT_ID = "dooo-movieshub1-0-1";
const DEFAULT_SERVER_URL = "https://m4.techmirrorhublinks.one/";
const DEFAULT_API_KEY = "UyRs7DBd2glz3Kuw";

let lastFetch = 0;
let cachedConfig = {
  serverUrl: DEFAULT_SERVER_URL,
  apiKey: DEFAULT_API_KEY,
};

async function getDynamicConfig() {
  const now = Date.now();
  if (now - lastFetch < 3600000) return cachedConfig; // 1 hour cache

  const remoteConfigUrl = `https://firebaseremoteconfig.googleapis.com/v1/projects/${DEFAULT_FIREBASE_PROJECT_ID}/namespaces/firebase:fetch?key=${DEFAULT_FIREBASE_API_KEY}`;
  
  try {
    const res = await fetch(remoteConfigUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Android-Package": "com.movieshubinpire.android" },
      body: JSON.stringify({ appId: DEFAULT_FIREBASE_APP_ID, appInstanceId: "vercel_instance", namespace: "firebase" })
    });
    
    if (res.ok) {
      const data = await res.json();
      const entries = data.entries || {};
      cachedConfig = {
        serverUrl: entries.SERVER_URL || DEFAULT_SERVER_URL,
        apiKey: entries.API_KEY || DEFAULT_API_KEY,
      };
      lastFetch = now;
    }
  } catch (e) {
    console.error("Config fetch failed, using defaults", e);
  }
  return cachedConfig;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { serverUrl, apiKey } = await getDynamicConfig();
  
  // Extract target path from query or URL
  // Expected call: /api/proxy?path=getTrending
  const { path } = req.query;
  if (!path) return res.status(400).json({ error: "Missing path parameter" });

  const targetUrl = `${serverUrl.replace(/\/$/, "")}/android/${path}`;
  
  try {
    const upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "x-api-key": apiKey,
        "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 11; Pixel 5 Build/RD1A.200810.020)",
        "Content-Type": "application/json"
      },
      body: req.method === "POST" ? JSON.stringify(req.body) : null
    });

    const data = await upstreamRes.json();
    return res.status(upstreamRes.status).json(data);
  } catch (error) {
    return res.status(502).json({ error: "Proxy Failed", message: error.message });
  }
}
