import type { TmdbMovie } from "../types/tmdb";
import { tmdbImage } from "../services/tmdb";

type Props = {
    title: string;
    movies: TmdbMovie[];
    loading?: boolean;
    error?: string | null;
    onSelect?: (movie: TmdbMovie) => void;
  };
  

export default function MovieRow({ title, movies, loading, error, onSelect }: Props) {
  return (
    <section className="px-6 py-4">
      <h2 className="mb-3 text-lg font-semibold tracking-wide">{title}</h2>

      {loading && <div className="text-white/60">Loading…</div>}
      {error && <div className="text-red-300">Failed: {error}</div>}

      {!loading && !error && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {movies.map((m) => {
            const name = m.title ?? m.name ?? "Untitled";
            const img = tmdbImage(m.poster_path, "w300");

            return (
                <button
                key={m.id}
                type="button"
                onClick={() => onSelect?.(m)}
                className="group relative w-[140px] shrink-0 rounded-lg bg-white/5 text-left transition hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                aria-label={`Open details for ${name}`}
                >
                <div className="aspect-[2/3] w-full overflow-hidden rounded-lg">
                  {img ? (
                    <img
                      src={img}
                      alt={name}
                      className="h-full w-full object-cover opacity-95 transition group-hover:opacity-100"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-white/50">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-2">
                  <div className="line-clamp-1 text-sm text-white/90">{name}</div>
                  <div className="text-xs text-white/50">⭐ {m.vote_average.toFixed(1)}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
