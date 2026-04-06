# API Contract

## Scope
- Source of truth for route discovery: `old/modded_src/sources/com/movieshubinpire/android`
- Runtime base: `https://m4.techmirrorhublinks.one/android/`
- Required header: `x-api-key`
- Verification date: `2026-04-06`

## Phase 2 Result
- Live-verified endpoints: `41`
- Source-extracted routes from modded app code: `58`
- Output artifact: `api_map_output.json`
- Mapping script: `map_api.py`

## Verified Read Endpoints
- `GET getRecentContentList/Movies`
- `GET getRecentContentList/WebSeries`
- `GET searchContent/{text}/{onlyPremium}`
- `POST searchLiveTV`
- `GET getAllLiveTV`
- `GET getLiveTVDetails/{id}`
- `GET getLiveTvGenreList`
- `GET getMovieDetails/{id}`
- `GET getMoviePlayLinks/{id}/{streamLinkUserId}`
- `GET getWebSeriesDetails/{id}`
- `GET getSeasons/{webSeriesId}`
- `POST getSeasonDetails`
- `GET getEpisodes/{seasonId}/{streamLinkUserId}`
- `GET getEpisodeDownloadLinks/{episodeId}`
- `POST getRelatedMovies/{id}/10`
- `POST getRelatedWebseries/{id}/10`
- `GET getComments/{contentId}/{contentType}`
- `GET getContentsReletedToGenre/{genreName}`
- `GET getMostWatched/Movies/10`
- `GET getMostWatched/WebSeries/10`
- `GET getMostSearched`
- `GET getTrending`
- `GET beacauseYouWatched/Movies/{contentId}/10`
- `GET beacauseYouWatched/WebSeries/{contentId}/10`
- `GET getMovieImageSlider`
- `GET getWebSeriesImageSlider`
- `GET getCustomImageSlider`
- `GET getFeaturedLiveTV`
- `GET getFeaturedGenre`
- `GET getGenreList`
- `GET getNetworks`
- `GET getRandMovies`
- `GET getRandWebSeries`
- `GET getAllMovies/{page}`
- `GET getAllWebSeries/{page}`
- `GET getAllUpcomingContents/{page}`
- `GET getSubscriptionPlans`
- `GET getSubscriptionDetails/{id}`
- `GET get_config`
- `GET splash`

## Verified Param Shapes
- `searchContent/{text}/{onlyPremium}`
  - path params: `text`, `onlyPremium`
- `POST searchLiveTV`
  - form: `search`, `onlypremium`
- `GET getMoviePlayLinks/{id}/{streamLinkUserId}`
  - path params: `id`, `streamLinkUserId`
- `POST getRelatedMovies/{id}/10`
  - form: `genres`
- `POST getRelatedWebseries/{id}/10`
  - form: `genres`
- `POST getSeasonDetails`
  - form: `WebSeriesID`, `seasonName`
- `GET getEpisodes/{seasonId}/{streamLinkUserId}`
  - path params: `seasonId`, `streamLinkUserId`
- `GET getComments/{contentId}/{contentType}`
  - `contentType=1` for movies
  - `contentType=2` for web series

## Verified Empty-Upstream Endpoints
- These returned HTTP `200` with literal body `No Data Avaliable` during verification:
- `getLiveTvGenreList`
- `getNetworks`
- `getRandMovies`
- `getRandWebSeries`
- `getAllUpcomingContents/1`
- `beacauseYouWatched/Movies/{sampleId}/10`
- `beacauseYouWatched/WebSeries/{sampleId}/10`
- `getComments/{movieId}/1`
- `getComments/{webSeriesId}/2`
- `getSubscriptionDetails/1`
- `POST searchLiveTV`
- `getEpisodeDownloadLinks/{episodeId}`

## Non-JSON Endpoints
- `GET splash`
  - returns HTML page, not JSON
- Some read endpoints return plain text sentinel values instead of JSON:
  - `No Data Avaliable`

## Source-Only Routes
- These were extracted from modded source code but not live-executed because they mutate state or operate on user/account/payment flows:
- `registerDevice`
- `authentication`
- `favourite/SET/`
- `favourite/REMOVE/`
- `favourite/SEARCH/`
- `addComments`
- `addviewlog`
- `addwatchlog`
- `updateAccount`
- `createReport`
- `addRequest`
- `redeemCoupon`
- `custom_payment_request`
- `custom_payment_type`
- `getFavouriteList/`
- `getSubscriptionLog/`
- `dXBncmFkZQ`
- `dmVyaWZ5`
- `otpVerifyMail`
- `passwordResetCheckCode`
- `passwordResetMail`
- `passwordResetPassword`

## Notes
- The backend mixes JSON APIs, HTML pages, and plain text sentinel responses under the same `/android/` base.
- Several routes that look content-oriented are currently empty upstream, so consumers must handle `No Data Avaliable` explicitly.
- The route spelling `beacauseYouWatched` is misspelled in the live API and must be used exactly as-is.
