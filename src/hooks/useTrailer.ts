import { useEffect, useState } from "react";
import type { TmdbVideo } from "../types/tmdb";
import { getVideos } from "../services/tmdb";

export function useTrailer(
  id: number | null,
  mediaType: "movie" | "tv" | null
) {
  const [trailer, setTrailer] = useState<TmdbVideo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!id || !mediaType) {
      setTrailer(null);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const res = await getVideos(id, mediaType);
        if (!alive) return;

        const yt = res.results.filter((v) => v.site === "YouTube");
        const pick =
          yt.find((v) => v.type === "Trailer" && v.official) ??
          yt.find((v) => v.type === "Trailer") ??
          yt.find((v) => v.type === "Teaser") ??
          yt[0] ??
          null;

        setTrailer(pick);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id, mediaType]);

  return { trailer, loading };
}
