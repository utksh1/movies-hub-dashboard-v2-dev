# Concerns

## Security
*   **API Key Exposure:** The `x-api-key` is dynamically fetched via Firebase but transmitted over HTTP, making it trivial to intercept.
*   **Root Detection Bypass:** The check is client-side only and easily avoided by modifying a single boolean in `Splash.java`.
*   **Premium Controls:** "Premium" status is determined by client-side flags (`playPremium`), which are hardcoded to `true` in the modded version, indicating the backend doesn't strictly enforce per-request validation.

## Performance
*   **Volley Queue Overload:** All requests are added to a single `VolleySingleton`, which can bottleneck on slow networks or high-frequency requests (like searches).
*   **Thumbnail Processing:** Downloading large images for lists can lead to OOM errors if the cache is mismanaged.

## Maintenance
*   **Domain Rot:** The project relies on Firebase Remote Config to keep the `SERVER_URL` updated. If the Firebase project is taken down, the app will break permanently.
*   **Modder Resilience:** The original app has very few anti-tamper measures, making it highly susceptible to modification.
