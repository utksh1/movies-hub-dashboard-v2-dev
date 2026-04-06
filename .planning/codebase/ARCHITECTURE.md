# Architecture

## System Pattern
The application follows a traditional **Android MVP-lite** or **Activity-Centric** architecture common in wrapper scripts.

*   **View Layer:** Android Activities and Fragments handles all UI and lifecycle.
*   **Data Layer:** Volley handles network persistence, and TinyDB/SharedPreferences handles session data.
*   **Backend:** RESTful API returning JSON data.

## Key Components

### 1. Initialization (`Splash.java`)
Responsible for:
*   Root/VPN detection (`HelperUtils.cr`).
*   Config fetching from Firebase Remote Config.
*   Domain discovery (`SERVER_URL`).
*   API key retrieval.

### 2. Networking (`com.movieshubinpire.android.utils.VolleySingleton`)
A centralized Volley request queue used throughout the app for API calls.

### 3. Media Playback (`ExoPlayerActivity.java`)
Custom wrapper around ExoPlayer to handle HLS (m3u8), MP4, and DASH streams.

## Data Flow
1.  **Splash:** Fetch config from Firebase.
2.  **Home:** Get content categories (`get_content_list`).
3.  **Details:** Fetch movie/series metadata (`get_movie_details`).
4.  **Source Discovery:** Resolve streaming URL via server or third-party embed.
5.  **Playback:** Pass stream URL to ExoPlayer.
