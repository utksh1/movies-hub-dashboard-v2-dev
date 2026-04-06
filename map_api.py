import json
import re
from pathlib import Path
from typing import Any

import requests

FIREBASE_API_KEY = "AIzaSyCyn-aSaYxz9LrMR5iwq4oVhFypdLhy0CI"
FIREBASE_APP_ID = "1:1005397943435:android:aa251a97505ea861e2e08e"
FIREBASE_PROJECT_ID = "dooo-movieshub1-0-1"
APP_ROOT = Path("old/modded_src/sources/com/movieshubinpire/android")
SOURCE_ROUTE_RE = re.compile(r'StringRequest\((\d),\s*AppConfig\.url \+ "([^"]+)')


def fetch_remote_entries() -> dict[str, str]:
    url = (
        "https://firebaseremoteconfig.googleapis.com/v1/projects/"
        f"{FIREBASE_PROJECT_ID}/namespaces/firebase:fetch?key={FIREBASE_API_KEY}"
    )
    payload = {
        "appId": FIREBASE_APP_ID,
        "appInstanceId": "gsd_map_api_instance",
        "namespace": "firebase",
    }
    headers = {
        "Content-Type": "application/json",
        "X-Android-Package": "com.movieshubinpire.android",
    }
    response = requests.post(url, headers=headers, json=payload, timeout=30)
    response.raise_for_status()
    data = response.json()
    return data.get("entries", {})


def effective_base(server_url: str) -> str:
    return server_url.rstrip("/") + "/android/"


def shape(value: Any) -> Any:
    if isinstance(value, dict):
        return {k: shape(v) for k, v in list(value.items())[:20]}
    if isinstance(value, list):
        if not value:
            return []
        return [shape(value[0])]
    return type(value).__name__


def parse_response_body(response: requests.Response) -> dict[str, Any]:
    info: dict[str, Any] = {
        "status": response.status_code,
        "content_type": response.headers.get("content-type", ""),
    }
    text = response.text
    if response.status_code != 200:
        info["error_sample"] = text[:400]
        return info
    if text == "No Data Avaliable":
        info["ok"] = True
        info["empty"] = True
        info["sample_value"] = text
        return info
    try:
        data = response.json()
    except ValueError:
        info["ok"] = True
        info["sample_value"] = text[:400]
        return info
    info["ok"] = True
    info["type"] = type(data).__name__
    if isinstance(data, list):
        info["count"] = len(data)
        info["sample_shape"] = shape(data[0]) if data else []
    elif isinstance(data, dict):
        info["keys"] = list(data.keys())[:40]
        info["sample_shape"] = shape(data)
    else:
        info["sample_value"] = str(data)[:200]
    info["data"] = data
    return info


def call_endpoint(
    base_url: str,
    api_key: str,
    path: str,
    *,
    method: str = "GET",
    data: dict[str, str] | None = None,
) -> dict[str, Any]:
    method = method.upper()
    url = base_url + path
    headers = {
        "x-api-key": api_key,
        "User-Agent": "Movies Hub Android Client",
        "Accept": "application/json",
    }
    if method == "GET":
        response = requests.get(url, headers=headers, timeout=30)
    elif method == "POST":
        response = requests.post(url, headers=headers, data=data or {}, timeout=30)
    else:
        raise ValueError(f"Unsupported method: {method}")
    info = {"method": method, "url": url}
    info.update(parse_response_body(response))
    if data:
        info["form"] = data
    return info


def extract_source_routes() -> dict[str, Any]:
    inventory: dict[str, dict[str, Any]] = {}
    for path in APP_ROOT.rglob("*.java"):
        try:
            lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
        except OSError:
            continue
        for lineno, line in enumerate(lines, start=1):
            match = SOURCE_ROUTE_RE.search(line)
            if not match:
                continue
            method_num, route = match.groups()
            method = "GET" if method_num == "0" else "POST"
            entry = inventory.setdefault(route, {"methods": set(), "refs": []})
            entry["methods"].add(method)
            entry["refs"].append(f"{path}:{lineno}")
    for route, entry in inventory.items():
        entry["methods"] = sorted(entry["methods"])
        entry["refs"] = sorted(entry["refs"])[:10]
    return dict(sorted(inventory.items()))


def add_probe(
    report: dict[str, Any],
    key: str,
    base_url: str,
    api_key: str,
    path: str,
    *,
    method: str = "GET",
    data: dict[str, str] | None = None,
    notes: str | None = None,
) -> dict[str, Any]:
    result = call_endpoint(base_url, api_key, path, method=method, data=data)
    if notes:
        result["notes"] = notes
    report["endpoints"][key] = result
    print(f"{key}: {result.get('status')}")
    return result


def main() -> None:
    entries = fetch_remote_entries()
    server_url = entries.get("SERVER_URL", "")
    api_key = entries.get("API_KEY", "")
    if not server_url or not api_key:
        raise RuntimeError("Missing SERVER_URL/API_KEY in Firebase Remote Config.")

    base_url = effective_base(server_url)
    print(f"Using base URL: {base_url}")

    report: dict[str, Any] = {
        "config": {
            "server_url": server_url,
            "effective_base": base_url,
            "api_key": api_key,
        },
        "probe_scope": {
            "verified_only": "read-only and low-risk endpoints were probed live",
            "source_only": "mutating or account-sensitive routes were extracted from source without live execution",
        },
        "context_samples": {},
        "endpoints": {},
        "source_inventory": extract_source_routes(),
        "source_only_routes": [
            "registerDevice",
            "authentication",
            "favourite/SET/",
            "favourite/REMOVE/",
            "addComments",
            "addviewlog",
            "addwatchlog",
            "updateAccount",
            "createReport",
            "addRequest",
            "redeemCoupon",
            "custom_payment_request",
            "dXBncmFkZQ",
            "dmVyaWZ5",
            "otpVerifyMail",
            "passwordResetCheckCode",
            "passwordResetMail",
            "passwordResetPassword",
        ],
    }

    # Foundation probes.
    add_probe(report, "recent_movies", base_url, api_key, "getRecentContentList/Movies")
    add_probe(report, "recent_webseries", base_url, api_key, "getRecentContentList/WebSeries")
    add_probe(report, "search_avatar", base_url, api_key, "searchContent/avatar/0")
    add_probe(report, "live_tv_all", base_url, api_key, "getAllLiveTV")
    add_probe(report, "live_tv_genres", base_url, api_key, "getLiveTvGenreList")

    recent_movies = report["endpoints"]["recent_movies"].get("data", [])
    recent_webseries = report["endpoints"]["recent_webseries"].get("data", [])
    live_tv_all = report["endpoints"]["live_tv_all"].get("data", [])

    movie = recent_movies[0] if recent_movies else {"id": "1", "genres": ""}
    webseries = recent_webseries[0] if recent_webseries else {"id": "1", "genres": ""}
    live_tv = live_tv_all[0] if live_tv_all else {"id": "1"}

    report["context_samples"].update(
        {
            "movie_id": str(movie["id"]),
            "movie_genres": movie.get("genres", ""),
            "webseries_id": str(webseries["id"]),
            "webseries_genres": webseries.get("genres", ""),
            "live_tv_id": str(live_tv["id"]),
            "genre_name": "Asian-Dramas",
        }
    )

    # Details and playback.
    add_probe(report, "movie_details", base_url, api_key, f"getMovieDetails/{movie['id']}")
    add_probe(report, "movie_play_links", base_url, api_key, f"getMoviePlayLinks/{movie['id']}/0")
    add_probe(report, "webseries_details", base_url, api_key, f"getWebSeriesDetails/{webseries['id']}")
    add_probe(report, "live_tv_details", base_url, api_key, f"getLiveTVDetails/{live_tv['id']}")

    # Home and catalog feeds.
    add_probe(report, "custom_image_slider", base_url, api_key, "getCustomImageSlider")
    add_probe(report, "movie_image_slider", base_url, api_key, "getMovieImageSlider")
    add_probe(report, "webseries_image_slider", base_url, api_key, "getWebSeriesImageSlider")
    add_probe(report, "featured_live_tv", base_url, api_key, "getFeaturedLiveTV")
    add_probe(report, "featured_genre", base_url, api_key, "getFeaturedGenre")
    add_probe(report, "most_searched", base_url, api_key, "getMostSearched")
    add_probe(report, "trending", base_url, api_key, "getTrending")
    add_probe(report, "genre_list", base_url, api_key, "getGenreList")
    add_probe(report, "networks", base_url, api_key, "getNetworks")
    add_probe(report, "random_movies", base_url, api_key, "getRandMovies")
    add_probe(report, "random_webseries", base_url, api_key, "getRandWebSeries")
    add_probe(report, "all_movies_page_1", base_url, api_key, "getAllMovies/1")
    add_probe(report, "all_webseries_page_1", base_url, api_key, "getAllWebSeries/1")
    add_probe(report, "upcoming_page_1", base_url, api_key, "getAllUpcomingContents/1")
    add_probe(report, "subscription_plans", base_url, api_key, "getSubscriptionPlans")
    add_probe(report, "app_config", base_url, api_key, "get_config")
    add_probe(report, "splash_page", base_url, api_key, "splash", notes="HTML page, not JSON API")

    # Recommendation and genre-specific flows.
    add_probe(
        report,
        "genre_contents_asian_dramas",
        base_url,
        api_key,
        "getContentsReletedToGenre/Asian-Dramas",
    )
    add_probe(report, "most_watched_movies", base_url, api_key, "getMostWatched/Movies/10")
    add_probe(report, "most_watched_webseries", base_url, api_key, "getMostWatched/WebSeries/10")
    add_probe(
        report,
        "because_you_watched_movies",
        base_url,
        api_key,
        f"beacauseYouWatched/Movies/{movie['id']}/10",
    )
    add_probe(
        report,
        "because_you_watched_webseries",
        base_url,
        api_key,
        f"beacauseYouWatched/WebSeries/{webseries['id']}/10",
    )

    # Comments and subscriptions.
    add_probe(report, "movie_comments", base_url, api_key, f"getComments/{movie['id']}/1")
    add_probe(report, "webseries_comments", base_url, api_key, f"getComments/{webseries['id']}/2")
    add_probe(report, "subscription_details_1", base_url, api_key, "getSubscriptionDetails/1")

    # Related content POST flows.
    add_probe(
        report,
        "related_movies",
        base_url,
        api_key,
        f"getRelatedMovies/{movie['id']}/10",
        method="POST",
        data={"genres": movie.get("genres", "")},
    )
    add_probe(
        report,
        "related_webseries",
        base_url,
        api_key,
        f"getRelatedWebseries/{webseries['id']}/10",
        method="POST",
        data={"genres": webseries.get("genres", "")},
    )
    add_probe(
        report,
        "search_live_tv_sports",
        base_url,
        api_key,
        "searchLiveTV",
        method="POST",
        data={"search": "sports", "onlypremium": "0"},
    )

    # Web series season / episode chain.
    seasons = add_probe(report, "webseries_seasons", base_url, api_key, f"getSeasons/{webseries['id']}")
    season_data = seasons.get("data", [])
    if season_data:
        season_name = season_data[0].get("Session_Name", "")
        season_detail = add_probe(
            report,
            "webseries_season_detail",
            base_url,
            api_key,
            "getSeasonDetails",
            method="POST",
            data={"WebSeriesID": str(webseries["id"]), "seasonName": season_name},
        )
        report["context_samples"]["season_name"] = season_name
        season_detail_data = season_detail.get("data", {})
        season_id = str(season_detail_data.get("id", ""))
        if season_id:
            report["context_samples"]["season_id"] = season_id
            episodes = add_probe(report, "webseries_episodes", base_url, api_key, f"getEpisodes/{season_id}/0")
            episode_data = episodes.get("data", [])
            if episode_data:
                episode_id = str(episode_data[0].get("id", ""))
                report["context_samples"]["episode_id"] = episode_id
                add_probe(
                    report,
                    "episode_download_links",
                    base_url,
                    api_key,
                    f"getEpisodeDownloadLinks/{episode_id}",
                )

    with open("api_map_output.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=True)
    print("Saved report: api_map_output.json")


if __name__ == "__main__":
    main()
