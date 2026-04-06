# Movies Hub Web UI (Modded Base)

## Scope
This folder contains the first conversion slice of the modded APK home UI:
- app bar
- hero banner
- floating `Movies | Web Series | Live TV` switch
- horizontal content rows
- fixed bottom navigation

## Run
From repository root:

```bash
python3 -m http.server 8080
```

Then open:
- `http://localhost:8080/webui/`

## Notes
- API calls use:
  - `https://m4.techmirrorhublinks.one/android/getRecentContentList/Movies`
  - `https://m4.techmirrorhublinks.one/android/getRecentContentList/WebSeries`
  - `https://m4.techmirrorhublinks.one/android/getAllLiveTV`
- Header required: `x-api-key`
- If browser CORS blocks requests, use a proxy layer (planned in Phase 5).
