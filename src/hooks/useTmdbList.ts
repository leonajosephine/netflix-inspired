import { useEffect, useState } from "react";
import type { TmdbMovie } from "../types/tmdb";

type Fetcher = () => Promise<{ results: TmdbMovie[] }>;

export function useTmdbList(fetcher: Fetcher) {
  const [data, setData] = useState<TmdbMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetcher();
        if (!alive) return;
        setData(res.results);
        setError(null);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [fetcher]);

  return { data, loading, error };
}
