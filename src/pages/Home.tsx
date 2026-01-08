import { useMemo, useState, useEffect } from "react";
import HeroBanner from "../components/HeroBanner";
import MovieModal from "../components/MovieModal";
import MovieRow from "../components/MovieRow";
import { getPopularTV, getTopRatedMovies, getTrending } from "../services/tmdb";
import { useTmdbList } from "../hooks/useTmdbList";
import type { TmdbMovie } from "../types/tmdb";

export default function Home() {
  const [selected, setSelected] = useState<TmdbMovie | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const trendingFetcher = useMemo(() => getTrending, []);
  const topRatedFetcher = useMemo(() => getTopRatedMovies, []);
  const popularTVFetcher = useMemo(() => getPopularTV, []);

  const trending = useTmdbList(trendingFetcher);
  const topRated = useTmdbList(topRatedFetcher);
  const popularTV = useTmdbList(popularTVFetcher);

  const featured = trending.data[0] ?? null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <header
        className={[
          "sticky top-0 z-20 border-b border-white/10 backdrop-blur transition",
          scrolled ? "bg-black/85" : "bg-black/55",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-xl font-bold tracking-tight">
            <span className="text-white">NET</span>
            <span className="text-red-500">FLIX</span>
          </div>
          <div className="text-sm text-white/60">inspired</div>
        </div>
      </header>

      <main className="pb-12">
        <HeroBanner movie={featured} onMoreInfo={() => featured && setSelected(featured)} />

        <MovieRow
          title="Trending Now"
          movies={trending.data}
          loading={trending.loading}
          error={trending.error}
          onSelect={setSelected}
        />
        <MovieRow
          title="Top Rated Movies"
          movies={topRated.data}
          loading={topRated.loading}
          error={topRated.error}
          onSelect={setSelected}
        />
        <MovieRow
          title="Popular TV"
          movies={popularTV.data}
          loading={popularTV.loading}
          error={popularTV.error}
          onSelect={setSelected}
        />
      </main>

      <MovieModal movie={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
