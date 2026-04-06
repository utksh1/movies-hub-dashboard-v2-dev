import json
from pathlib import Path
from typing import Any

import requests


API_REPORT = Path("api_map_output.json")
OUTPUT = Path("stream_verification.json")


def head_follow(url: str) -> dict[str, Any]:
    response = requests.head(url, allow_redirects=True, timeout=20)
    return {
        "initial_url": url,
        "final_url": response.url,
        "status": response.status_code,
        "content_type": response.headers.get("content-type", ""),
        "content_length": response.headers.get("content-length", ""),
        "access_control_allow_origin": response.headers.get("access-control-allow-origin", ""),
        "x_frame_options": response.headers.get("x-frame-options", ""),
        "content_security_policy": response.headers.get("content-security-policy", ""),
        "history": [
            {
                "status": hop.status_code,
                "url": hop.url,
                "location": hop.headers.get("location", ""),
            }
            for hop in response.history
        ],
    }


def get_text_sample(url: str, limit: int = 400) -> dict[str, Any]:
    response = requests.get(url, timeout=20)
    return {
        "status": response.status_code,
        "sample": response.text[:limit],
    }


def get_bytes_sample(url: str, size: int = 64) -> dict[str, Any]:
    headers = {"Range": f"bytes=0-{size - 1}"}
    response = requests.get(url, headers=headers, timeout=30)
    return {
        "status": response.status_code,
        "content_type": response.headers.get("content-type", ""),
        "content_range": response.headers.get("content-range", ""),
        "access_control_allow_origin": response.headers.get("access-control-allow-origin", ""),
        "hex": response.content[:size].hex(),
    }


def main() -> None:
    report = json.loads(API_REPORT.read_text(encoding="utf-8"))

    movie_links = report["endpoints"]["movie_play_links"]["data"]
    live_tv = report["endpoints"]["live_tv_all"]["data"]
    episodes = report["endpoints"]["webseries_episodes"]["data"]

    movie_embed = next(item for item in movie_links if item.get("type") == "Embed" and item.get("url"))
    live_m3u8 = next(item for item in live_tv if item.get("stream_type") == "M3u8" and item.get("url"))
    live_embed = next(item for item in live_tv if item.get("stream_type") == "Embed" and item.get("url"))
    episode = next(item for item in episodes if item.get("source") == "Mp4" and item.get("url"))

    output = {
        "summary": {
            "movie_sources": {
                "Embed": sum(1 for item in movie_links if item.get("type") == "Embed"),
                "Mp4": sum(1 for item in movie_links if item.get("type") == "Mp4"),
            },
            "live_tv_sources": {
                "Embed": sum(1 for item in live_tv if item.get("stream_type") == "Embed"),
                "M3u8": sum(1 for item in live_tv if item.get("stream_type") == "M3u8"),
            },
            "webseries_episode_sources": {
                "Mp4": sum(1 for item in episodes if item.get("source") == "Mp4"),
            },
            "drm_present": {
                "movie": any(bool(item.get("drm_uuid")) for item in movie_links),
                "live_tv": any(bool(item.get("drm_uuid")) for item in live_tv),
                "webseries_episode": any(bool(item.get("drm_uuid")) for item in episodes),
            },
        },
        "samples": {
            "movie_embed": {
                "name": movie_embed["name"],
                "url": movie_embed["url"],
                "head": head_follow(movie_embed["url"]),
                "html": get_text_sample(movie_embed["url"]),
            },
            "live_m3u8": {
                "name": live_m3u8["name"],
                "url": live_m3u8["url"],
                "head": head_follow(live_m3u8["url"]),
                "playlist": get_text_sample(live_m3u8["url"], limit=1000),
            },
            "live_embed": {
                "name": live_embed["name"],
                "url": live_embed["url"],
                "head": head_follow(live_embed["url"]),
            },
            "webseries_episode": {
                "name": episode["Episoade_Name"],
                "url": episode["url"],
                "head": head_follow(episode["url"]),
                "bytes": get_bytes_sample(episode["url"]),
            },
        },
    }

    OUTPUT.write_text(json.dumps(output, indent=2, ensure_ascii=True), encoding="utf-8")
    print("Saved report: stream_verification.json")


if __name__ == "__main__":
    main()
