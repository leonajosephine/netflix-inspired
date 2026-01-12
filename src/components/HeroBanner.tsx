import type { TmdbMovie } from "../types/tmdb";
import { tmdbImage } from "../services/tmdb";

type Props = {
  movie: TmdbMovie | null;
  onMoreInfo: () => void;
};

export default function HeroBanner({ movie, onMoreInfo }: Props) {
  if (!movie) {
    return (
      <div className="px-6 pt-8">
        <div className="h-[380px] rounded-2xl bg-white/5" />
      </div>
    );
  }

  const title = movie.title ?? movie.name ?? "Untitled";
  const backdrop = tmdbImage(movie.backdrop_path, "original") || tmdbImage(movie.poster_path, "w780");

  return (
    <section className="px-6 pt-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
        <div className="relative h-[420px] w-full">
          {backdrop ? (
            <img src={backdrop} alt="" className="h-full w-full object-cover opacity-95" />
          ) : (
            <div className="h-full w-full bg-white/5" />
          )}

          {/* overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="max-w-xl">
              <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/75 md:text-base">
                {movie.overview || "No description available."}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-white/10 hover:bg-white/90 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  ▶ Play
                </button>
                <button
                  type="button"
                  onClick={onMoreInfo}
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/15 hover:border-white/30 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                  >
                  More Info
                </button>
              </div>

              <div className="mt-4 text-xs text-white/60">
                ⭐ {movie.vote_average.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
