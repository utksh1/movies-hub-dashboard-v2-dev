# State

## Metadata
*   **Status:** Exploration Closed; Web Foundation Ready
*   **Milestone:** 3
*   **Phase:** 6
*   **Version:** 0.4.0

## Status Summary
Successfully decompiled the APKs and identified the dynamic configuration system.
Confirmed that API endpoints require the `/android/` prefix.
Closed Phase 5 by implementing a **CORS Proxy Bridge** (Cloudflare Worker `worker.js` and local `local_proxy.py`).
The web UI is now configured to fetch live data via `http://localhost:8080/` (local) or the deployed worker.
Starting Phase 6 to bind the verified API contract to the UI components.

## Knowledge Captured
*   **Firebase API Key:** `AIzaSyCyn-aSaYxz9LrMR5iwq4oVhFypdLhy0CI` (Static)
*   **Current Dynamic x-api-key:** `UyRs7DBd2glz3Kuw`
*   **Current Server URL:** `https://m4.techmirrorhublinks.one/`
*   **API Contract:** `.planning/codebase/API_CONTRACT.md`
*   **CORS Proxy (Cloudflare):** `worker.js`
*   **CORS Proxy (Local):** `local_proxy.py`
*   **Web UI Shell:** `webui/index.html`, `webui/styles.css`, `webui/app.js`

## Blockers
*   None (CORS resolved via Proxy).
