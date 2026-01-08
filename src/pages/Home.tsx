import MovieRow from "../components/MovieRow";
import { getPopularTV, getTopRatedMovies, getTrending } from "../services/tmdb";
import { useTmdbList } from "../hooks/useTmdbList";

export default function Home() {
  const trending = useTmdbList(getTrending);
  const topRated = useTmdbList(getTopRatedMovies);
  const popularTV = useTmdbList(getPopularTV);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-xl font-bold tracking-tight">NETFLIX</div>
          <div className="text-sm text-white/60">inspired</div>
        </div>
      </header>

      <main className="pb-10">
        <MovieRow title="Trending Now" movies={trending.data} loading={trending.loading} error={trending.error} />
        <MovieRow title="Top Rated Movies" movies={topRated.data} loading={topRated.loading} error={topRated.error} />
        <MovieRow title="Popular TV" movies={popularTV.data} loading={popularTV.loading} error={popularTV.error} />
      </main>
    </div>
  );
}
