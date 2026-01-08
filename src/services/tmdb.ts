import type { TmdbListResponse, TmdbMovie } from "../types/tmdb";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
const BASE_URL = (import.meta.env.VITE_TMDB_BASE_URL as string) ?? "https://api.themoviedb.org/3";
const IMAGE_BASE = (import.meta.env.VITE_TMDB_IMAGE_BASE as string) ?? "https://image.tmdb.org/t/p";

if (!API_KEY) {
  // eslint-disable-next-line no-console
  console.warn("Missing VITE_TMDB_API_KEY. Add it to .env.local");
}

export const tmdbImage = (path: string | null, size: "w300" | "w500" | "w780" | "original" = "w780") =>
  path ? `${IMAGE_BASE}/${size}${path}` : "";

const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
};

// Endpoints (für MVP)
export const getTrending = async () => {
  const url = new URL(`${BASE_URL}/trending/all/week`);
  url.searchParams.set("api_key", API_KEY ?? "");
  url.searchParams.set("language", "en-US");
  return fetchJson<TmdbListResponse<TmdbMovie>>(url.toString());
};

export const getTopRatedMovies = async () => {
  const url = new URL(`${BASE_URL}/movie/top_rated`);
  url.searchParams.set("api_key", API_KEY ?? "");
  url.searchParams.set("language", "en-US");
  return fetchJson<TmdbListResponse<TmdbMovie>>(url.toString());
};

export const getPopularTV = async () => {
  const url = new URL(`${BASE_URL}/tv/popular`);
  url.searchParams.set("api_key", API_KEY ?? "");
  url.searchParams.set("language", "en-US");
  return fetchJson<TmdbListResponse<TmdbMovie>>(url.toString());
};
