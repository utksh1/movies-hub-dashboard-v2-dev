# Modded UI Contract (Web Conversion)

## Source Lock
- UI source of truth: `old/modded_apk` only.
- Primary mapped layouts:
  - `res/layout/activity_home.xml`
  - `res/layout/fragment_home.xml`
  - `res/menu/menu.xml`
  - `res/color/bnv_tab_item_foreground.xml`
  - `res/values/colors.xml`
  - `res/values/strings.xml`

## Core Visual Tokens (from modded APK)
- `Screen_Background` / `Home_Background`: `#090911`
- `Black_Smooth` (bottom nav): `#0f0f19`
- `Red_Smooth` (section accent): `#d81f26`
- `Gray_Smooth` (inactive nav): `#9b9a9f`
- `greyish` (separator/subtle): `#aaa8a8`
- `white`: `#ffffff`

## Home Structure (Web Mapping)
- App bar:
  - Left app logo + uppercase app title (`app_name` => `MOVIES HUB`)
  - Right circular profile/menu action
- Hero slider section:
  - Full-width banner area at top of content stream
- Floating pill switch:
  - `Movies | Web Series | Live TV`
  - Styled as centered rounded menu near bottom
- Content rows (horizontal scrollers):
  - Live TV
  - Trending
  - Recently Added Movies
  - Recently Added Web Series
  - Movies
  - Web Series
- Bottom navigation:
  - Home, Search, Movies, Series, Account
  - Active state white, inactive state `Gray_Smooth`

## Behavior Contract
- Home rows are horizontally scrollable and image-first.
- Section headers use a thin red vertical accent bar (`Red_Smooth`).
- Mobile-first layout with fixed bottom nav.
- Desktop keeps same hierarchy with wider card columns.
- Data source for this phase:
  - `getRecentContentList/Movies`
  - `getRecentContentList/WebSeries`
  - `getAllLiveTV`

## Current Implementation
- `webui/index.html`
- `webui/styles.css`
- `webui/app.js`

This implementation is intentionally scoped to the modded home screen shell and does not include full details/player flows yet.
