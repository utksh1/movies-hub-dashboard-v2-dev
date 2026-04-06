# Phase 5: Data Fetching Layer (CORS Proxy)

## Objective
Enable the web application to fetch dynamic content from the backend by bypassing CORS restrictions using a proxy server (Cloudflare Worker).

## Context
- **Target Base:** `https://m4.techmirrorhublinks.one/android/`
- **Required Header:** `x-api-key: UyRs7DBd2glz3Kuw`
- **Conflict:** The backend does not provide `Access-Control-Allow-Origin` headers, preventing direct browser fetches.

## Implementation Steps

### 1. Proxy Component (worker.js)
- Build a lightweight Cloudflare Worker script.
- **Rules:** 
  - Allow all origins (`*`) for `GET` and `POST`.
  - Inject the required `x-api-key` header before forwarding.
  - Forward all paths and query parameters.
  - Return the response body and headers (stripping problematic ones if needed).

### 2. Frontend Integration (app.js)
- Update `CONFIG.base` to point to the new proxy URL.
- Modify `getJson` to handle potential proxy errors.
- Ensure the API key doesn't need to be sent from the browser if the proxy handles it (improves security).

### 3. Verification
- Test fetching `getRecentContentList/Movies` via the proxy.
- Ensure images (posters/banners) load correctly (they usually don't have CORS issues, but the proxy can help if they do).

## Success Criteria
- [ ] `worker.js` is implemented and handles header injection.
- [ ] `app.js` is updated to point to the proxy.
- [ ] Home screen displays live content instead of the "CORS Blocked" message.
