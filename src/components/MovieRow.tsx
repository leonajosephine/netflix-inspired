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
        <div className="flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none]">
            <style>{`
                div::-webkit-scrollbar { display: none; }
                `}</style>
          {movies.map((m) => {
            const name = m.title ?? m.name ?? "Untitled";
            const img = tmdbImage(m.poster_path, "w300");

            return (
                <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelect?.(m)}
                    className="
                        group relative shrink-0
                        w-[170px] md:w-[200px]
                        rounded-2xl
                        bg-white/5
                        border border-white/10
                        overflow-hidden
                        transition
                        hover:-translate-y-1 hover:scale-[1.06]
                        hover:border-white/20
                        hover:bg-white/10
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80
                    "
                    aria-label={`Open details for ${name}`}
                    >
                    {/* image */}
                    <div className="relative aspect-[2/3] w-full">
                        {img ? (
                        <img
                            src={img}
                            alt={name}
                            className="h-full w-full object-cover opacity-95 transition duration-300 group-hover:opacity-100 group-hover:scale-[1.03]"
                            loading="lazy"
                        />
                        ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-white/50">
                            No image
                        </div>
                        )}

                        {/* glass hover overlay */}
                        <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute -left-20 top-0 h-full w-20 rotate-12 bg-white/20 blur-xl" />
                        </div>

                        {/* quick action */}
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 opacity-0 transition duration-300 group-hover:opacity-100">
                        <span className="rounded-full bg-black/40 px-2 py-1 text-xs text-white/80 backdrop-blur">
                            ⭐ {m.vote_average.toFixed(1)}
                        </span>
                        <span className="rounded-full bg-white/15 px-2 py-1 text-xs text-white/90 backdrop-blur">
                            More
                        </span>
                        </div>
                    </div>

                    {/* text */}
                    <div className="p-3">
                        <div className="line-clamp-1 text-sm font-medium text-white/95">{name}</div>
                        <div className="mt-1 text-xs text-white/55">
                        {m.release_date ?? m.first_air_date ?? ""}
                        </div>
                    </div>
                    </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
