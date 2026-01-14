import type { TmdbMovie } from "../types/tmdb";

const KEY = "netflixInspired_myList_v1";

export type MyListItem = TmdbMovie & { _mediaType: "movie" | "tv" };

export function readMyList(): MyListItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MyListItem[]) : [];
  } catch {
    return [];
  }
}

export function writeMyList(items: MyListItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function isInMyList(id: number): boolean {
  return readMyList().some((m) => m.id === id);
}

export function toggleMyList(item: MyListItem): { items: MyListItem[]; isNowInList: boolean } {
  const current = readMyList();
  const exists = current.some((m) => m.id === item.id);
  const next = exists ? current.filter((m) => m.id !== item.id) : [item, ...current];
  writeMyList(next);
  return { items: next, isNowInList: !exists };
}
