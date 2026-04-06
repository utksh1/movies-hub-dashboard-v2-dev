# Requirements

## v1: MVP (The "Break" & Basic Web Fetch)
*   [x] **R1.1:** Automated script to fetch `x-api-key` and `SERVER_URL` from Firebase.
*   [x] **R1.2:** Mapping of `getRecentContentList`, `getMovieDetails`, and `searchContent` endpoints.
*   [x] **R1.3:** Extraction of content labels, IDs, genres, seasons, episodes, and streaming URLs into `api_map_output.json`.
*   [x] **R1.4:** Proof-of-concept JS fetch script with required headers.

## v2: Premium Web Application
*   [x] **R2.1:** High-fidelity base UI shell (Dark Mode + modded layout hierarchy) implemented from `old/modded_apk` for the home screen.
*   [ ] **R2.2:** Real-time content grid with posters and titles.
*   [ ] **R2.3:** Search functionality integrated with the backend.
*   [ ] **R2.4:** Integrated HLS-capable video player.
*   [ ] **R2.5:** Category-based filtering (Movies vs. Series).

## UI Source Constraint
*   [x] **R-UI.1:** Use `old/modded_apk` as the only UI source of truth for layout, style, and interaction behavior.
*   [x] **R-UI.2:** Do not port UI behavior from `old/original_apk` except for non-visual technical diff checks.

## v3: Polish & Advanced Features
*   [ ] **R3.1:** Auto-update of API keys via serverless function.
*   [ ] **R3.2:** Episodes/Seasons support for Web Series.
*   [ ] **R3.3:** Bookmark/Watchlist support (Local storage).
