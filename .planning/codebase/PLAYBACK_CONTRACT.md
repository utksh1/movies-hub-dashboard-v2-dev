# Playback Contract

## Scope
- Verification date: `2026-04-06`
- Source APK/runtime reference: `old/modded_apk` and `old/modded_src`
- Data artifacts:
  - `api_map_output.json`
  - `stream_verification.json`

## Phase 3 Result
- Representative playback sources were tested for:
  - movie embeds
  - live TV `M3u8`
  - live TV embeds
  - web series direct episode media
- Player logic was traced from `Player.java` and adapter launch paths.

## Modded Player Support
- Native in `Player.java`:
  - `m3u8`
  - `dash`
  - `mp4`
  - `mkv`
- Special-case / resolver-driven:
  - `Youtube`
  - `Streamhide`
  - resolver-backed hosts such as `MixDrop`, `StreamTape`, `OKru`, `Vimeo`, `GoogleDrive`, `DoodStream`, `VK`, `Yandex`
- Separate embed flow:
  - `Embed` opens `EmbedPlayer`, not the native ExoPlayer path

## Verified Runtime Source Mix
- Movies:
  - `13` embed links
  - `1` `Mp4`-typed premium slot with empty URL in sampled payload
- Live TV:
  - `13` embed links
  - `6` `M3u8` links
- Web series episodes:
  - sampled season returned `16` direct `Mp4`-typed episode items
  - sampled URLs were actually Matroska payloads (`.mkv`) behind worker redirects
- DRM:
  - no DRM UUID/license values in the sampled movie, live TV, or web series payloads

## Verified Web Behavior
- Live TV `M3u8`:
  - returns `200`
  - content type `application/vnd.apple.mpegurl`
  - `Access-Control-Allow-Origin: *`
  - contains a valid variant playlist with subtitle tracks
  - suitable for direct web playback with HLS-capable player
- Movie embed page:
  - sampled host showed unstable browser behavior during verification
  - `HEAD` reported `X-Frame-Options: SAMEORIGIN`
  - `GET` returned `403` HTML in the verification environment
  - should be treated as third-party embed content, not reliable native media
- Web series direct episode URL:
  - worker URL redirects to backing file host
  - final response returns `200`
  - `Accept-Ranges` supported
  - `Access-Control-Allow-Origin: *`
  - byte sample starts with Matroska signature `1A45DFA3`
  - response headers were inaccurate in sample (`application/javascript` on `HEAD`, `text/html` on ranged fetch), so playback logic must not trust MIME alone

## Web Port Implications
- Safe native-player targets for web:
  - live TV `M3u8`
  - direct episode media URLs
- Conditionally usable embed targets for web:
  - live TV `Embed` links
  - movie `Embed` links only with fallback strategy, because host behavior is inconsistent
- Required player behavior in web app:
  - branch by source class, not just by file extension
  - support HLS explicitly
  - treat worker-backed direct files as playable even if headers report bad MIME
  - keep fallback embed player path for movie/live-TV portal links

## Risks
- Some direct media endpoints misreport `Content-Type`
- Movie payloads in the sampled content are embed-heavy; direct native movie playback may depend on resolver extraction or alternate content
- Upstream hosts may rotate or rate-limit independently of the API backend
- Some embed hosts may block framing or direct browser access entirely

## Practical Conclusion
- Phase 3 is sufficient to proceed with web playback implementation.
- The first web video engine should support:
  - native HLS playback
  - direct file playback for worker-backed episode URLs
  - iframe/embed fallback for live TV providers
  - alternative handling for movie embeds because some hosts are not safely embeddable
