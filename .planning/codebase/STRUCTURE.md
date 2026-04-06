# Structure

## Key Directories
*   `sources/com/movieshubinpire/android/`: Main application source code.
*   `sources/com/movieshubinpire/android/utils/`: Unified helper utilities (HelperUtils, XML parser).
*   `res/layout/`: UI XML definitions.
*   `res/values/`: Strings, Colors, and Firebase configuration references.
*   `webui/`: Web conversion shell using modded layout structure and live endpoint wiring.
*   `old/modded_apk/`: Primary decompiled artifact for UI/UX conversion.
*   `old/original_apk/`: Secondary artifact for technical diff only (not UI source).
*   `.planning/codebase/API_CONTRACT.md`: Verified Phase 2 API contract and source-only route inventory.
*   `.planning/codebase/PLAYBACK_CONTRACT.md`: Verified Phase 3 playback source behavior and web-player implications.

## Core Source Files
*   `AppConfig.java`: Static configuration constants.
*   `Splash.java`: App entry and configuration loader.
*   `MainActivity.java`: Host for the home screen fragments.
*   `MovieDetails.java`: Complex activity managing movie info and play triggers.
*   `WebSeriesDetails.java`: Handles episodes and series logic.
*   `SearchActivity.java`: Content discovery logic.
*   `ExoPlayerActivity.java`: Core video engine.

## Resource Map
*   `strings.xml`: Contains app names, AdMob IDs, and Firebase tokens.
*   `remote_config_defaults.xml`: (May be empty/absent) contains fallback Firebase parameters.
*   `google_services.json`: (Compiled into strings) contains Firebase client ID and bucket.
