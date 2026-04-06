# Integrations

## External Services
1.  **Firebase:**
    *   **Remote Config:** Dynamic domain and API key updates.
    *   **Messaging (FCM):** Push notifications.
    *   **Analytics:** User tracking.
2.  **TMDB (TheMovieDB):**
    *   Fetches movie metadata (titles, descriptions, ratings, posters).
3.  **YouTube:**
    *   Fetched through `yts.java` helper, likely using a bridge to a YT-to-MP4 converter (like `yt1s.com` / `ytricks`).

## Streaming Backends
*   **Embedded Players:** Integrated bridges to `vidsrc.me`, `2embed.me`, and shared embed servers.
*   **Direct Sources:** M3U8/MP4 links returned by the `m4.techmirrorhublinks.one` API.

## Ad Integrations
*   **AdMob:** Google Banner and Interstitial.
*   **AppLovin / IronSource / Unity:** Fallback ad providers for monetization.

## API Authentication
*   **x-api-key:** Required in all requests to the backend server.
*   **User-Agent:** Often validated to be the native Android client.
