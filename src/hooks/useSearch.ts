import { useEffect, useState } from "react";
import type { TmdbSearchResult } from "../types/tmdb";
import { searchMulti } from "../services/tmdb";

export function useSearch(query: string) {
  const [results, setResults] = useState<TmdbSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await searchMulti(q);
        if (!alive) return;

        // keep only movies/tv (ignore persons)
        const filtered = (res.results as TmdbSearchResult[]).filter(
          (r) => r.media_type === "movie" || r.media_type === "tv"
        );
        setResults(filtered);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }, 300); // debounce

    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [query]);

  return { results, loading };
}
