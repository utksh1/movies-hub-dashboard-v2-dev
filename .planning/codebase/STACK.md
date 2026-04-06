# Stack

## Overview
Movies Hub is an Android entertainment application for movies and series.

**Platform:** Android (Java)
**Base Framework:** Dooo Movie/Series PHP Script wrapper.

## Core Technologies
*   **Languages:** Java (Main app logic), PHP (Backend API)
*   **Networking:** [Volley](https://github.com/google/volley) (`com.android.volley`)
*   **Media Player:** [ExoPlayer](https://github.com/google/ExoPlayer) (`com.google.android.exoplayer2`)
*   **Image Loading:** [Glide](https://github.com/bumptech/glide) (`com.github.bumptech.glide`)
*   **Local Storage:** `TinyDB` (Shared Preferences wrapper)
*   **Dependency Injection:** Manual / Android Framework

## Configurations
*   **AppConfig.java:** Central configuration point for API keys and global settings.
*   **Firebase:** Uses Firebase Remote Config to fetch `SERVER_URL` and `API_KEY`.
*   **Ad Networks:** AdMob, AppLovin, IronSource, UnityAds.

## Build System
*   **Decompiled Build:** `apktool` 2.9 (or newer) for Smali/Resource disassembly.
*   **Source Reconstruction:** `jadx` for Java source code restoration.
