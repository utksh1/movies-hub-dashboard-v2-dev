# Project: Movies Hub Web Conversion

## Vision
A premium, web-based version of the Movies Hub Android application, leveraging the existing backend API while bypassing all client-side restrictions and ads.

## Core Objectives
1.  **Backend "Breaking":** Extract and automate the retrieval of dynamic API keys from Firebase Remote Config.
2.  **API Mapping:** Reverse engineer all content and streaming endpoints used by the modded APK runtime.
3.  **Cross-Platform Port:** Build a high-end, responsive web application that mirrors the modded app UX.
4.  **Security Bypass:** Maintain the "Modded" features (Premium unlocked, Ad-free) in the web environment.

## Tech Stack
*   **Backend Interface:** Python (for mapping) + Cloudflare Workers (CORS Proxy/Edge Logic).
*   **Frontend:** HTML5, CSS3 (Vanilla + Modern Design Patterns), JavaScript (ES6+).
*   **Video Engine:** Video.js or Plyr (HLS/m3u8 support).
*   **Design Style:** Glassmorphism, Dark Mode, Premium Interactions.

## Project Metadata
*   **Source APK (UI/Behavior):** `old/modded_apk`
*   **Reference APK (Diff only):** `old/original_apk`
*   **Base URL:** `https://m4.techmirrorhublinks.one/`
*   **Effective API Base:** `https://m4.techmirrorhublinks.one/android/`
*   **API Key Mechanism:** Dynamic via Firebase Remote Config.
