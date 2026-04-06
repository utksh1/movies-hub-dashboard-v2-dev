const API_BASE = (typeof window !== "undefined" && window.location.hostname !== "localhost")
  ? "/api/proxy"  // Vercel deployment
  : "http://localhost:8080"; // Local testing with python proxy

const CACHE = new Map();

async function request(path, options = {}) {
  const cacheKey = `${path}-${JSON.stringify(options)}`;
  if (CACHE.has(cacheKey)) return CACHE.get(cacheKey);

  // If using Vercel proxy, pass path via query parameter
  const targetPath = (API_BASE === "/api/proxy") ? `?path=${encodeURIComponent(path)}` : `/${path}`;
  const fetchUrl = `${API_BASE}${targetPath}`;

  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    CACHE.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Request failed for ${path}:`, error);
    return null;
  }
}

function normalizeList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.Trending) return data.Trending;
  if (data.RecentMovies) return data.RecentMovies;
  if (data.RecentSeries) return data.RecentSeries;
  return [];
}

export async function fetchTrending() { return normalizeList(await request("getTrending")); }
export async function fetchRecentMovies() { return normalizeList(await request("getRecentMovies")); }
export async function fetchRecentSeries() { return normalizeList(await request("getRecentSeries")); }
export async function fetchSeriesSeasons(seriesId) { return normalizeList(await request(`getSeason/${seriesId}`)); }
export async function fetchSeasonEpisodes(seasonId) { return normalizeList(await request(`getEpisodes/${seasonId}/0`)); }
export async function fetchMovieLinks(movieId) { return normalizeList(await request(`getMovieDownloadLinks/${movieId}`)); }
export async function searchContent(query) { return normalizeList(await request(`getSearch/${encodeURIComponent(query)}`)); }
export async function fetchSliderData(type = "Movies") { return normalizeList(await request(`get${type}ImageSlider`)); }
export async function fetchGenreContent(genreName) { return normalizeList(await request(`getContentsReletedToGenre/${encodeURIComponent(genreName)}`)); }
