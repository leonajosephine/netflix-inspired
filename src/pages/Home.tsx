import { useEffect, useMemo, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import MovieModal from "../components/MovieModal";
import MovieRow from "../components/MovieRow";
import { getPopularTV, getTopRatedMovies, getTrending } from "../services/tmdb";
import { useTmdbList } from "../hooks/useTmdbList";
import type { TmdbMovie } from "../types/tmdb";
import { useSearch } from "../hooks/useSearch";
import { useMyList } from "../hooks/useMyList";

type Selected = { movie: TmdbMovie; mediaType: "movie" | "tv" } | null;

export default function Home() {
  const [selected, setSelected] = useState<Selected>(null);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");

  const trendingFetcher = useMemo(() => getTrending, []);
  const topRatedFetcher = useMemo(() => getTopRatedMovies, []);
  const popularTVFetcher = useMemo(() => getPopularTV, []);

  const trending = useTmdbList(trendingFetcher);
  const topRated = useTmdbList(topRatedFetcher);
  const popularTV = useTmdbList(popularTVFetcher);

  const featured = trending.data[0] ?? null;

  const { results: searchResults, loading: searchLoading } = useSearch(query);
  const myList = useMyList();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showSearch = query.trim().length >= 2;

  return (
    <div className="min-h-screen bg-black text-white">
      <header
        className={[
          "sticky top-0 z-20 transition",
          "border-b border-white/10",
          "bg-black/40 backdrop-blur-xl",
          scrolled ? "shadow-lg shadow-black/30" : "",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="text-lg font-semibold tracking-wide">
            <span className="text-white">NET</span>
            <span className="text-red-500">FLIX</span>
          </div>

          <div className="flex w-full max-w-md items-center justify-end">
            <label className="w-full">
              <span className="sr-only">Search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies & series…"
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/50 backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              />
            </label>
          </div>
        </div>
      </header>

      <main className="pb-12">
        {!showSearch && (
          <>
            <HeroBanner
              movie={featured}
              onMoreInfo={() => featured && setSelected({ movie: featured, mediaType: featured.first_air_date ? "tv" : "movie" })}
            />

            {myList.items.length > 0 && (
              <MovieRow
                title="My List"
                movies={myList.items}
                mediaType="movie"
                onSelect={(m, mt) => setSelected({ movie: m, mediaType: (m as any)._mediaType ?? mt })}
              />
            )}

            <MovieRow
              title="Trending Now"
              movies={trending.data}
              loading={trending.loading}
              error={trending.error}
              mediaType="movie"
              onSelect={(m, mt) => setSelected({ movie: m, mediaType: m.first_air_date ? "tv" : mt })}
            />
            <MovieRow
              title="Top Rated Movies"
              movies={topRated.data}
              loading={topRated.loading}
              error={topRated.error}
              mediaType="movie"
              onSelect={(m, mt) => setSelected({ movie: m, mediaType: mt })}
            />
            <MovieRow
              title="Popular TV"
              movies={popularTV.data}
              loading={popularTV.loading}
              error={popularTV.error}
              mediaType="tv"
              onSelect={(m, mt) => setSelected({ movie: m, mediaType: mt })}
            />
          </>
        )}

        {showSearch && (
          <section className="px-6 py-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Results for <span className="text-white/70">“{query.trim()}”</span>
              </h2>
              {searchLoading && <span className="text-sm text-white/60">Searching…</span>}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
              {searchResults.map((r) => {
                const mt = (r.media_type ?? (r.first_air_date ? "tv" : "movie")) as "movie" | "tv";
                const title = r.title ?? r.name ?? "Untitled";
                const img = (r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : "");

                return (
                  <button
                    key={`${mt}-${r.id}`}
                    type="button"
                    onClick={() => setSelected({ movie: r, mediaType: mt })}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition hover:-translate-y-1 hover:scale-[1.03] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                  >
                    <div className="aspect-[2/3] w-full bg-white/5">
                      {img ? (
                        <img src={img} alt={title} className="h-full w-full object-cover" loading="lazy" />
                      ) : null}
                    </div>
                    <div className="p-3">
                      <div className="line-clamp-1 text-sm font-medium">{title}</div>
                      <div className="mt-1 text-xs text-white/55">{mt === "tv" ? "Series" : "Movie"}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <MovieModal
        selected={selected}
        onClose={() => setSelected(null)}
        onToggleMyList={(item) => myList.toggle(item)}
        isInMyList={(id) => myList.contains(id)}
      />
    </div>
  );
}
