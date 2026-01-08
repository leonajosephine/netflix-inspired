import { useEffect } from "react";
import type { TmdbMovie } from "../types/tmdb";
import { tmdbImage } from "../services/tmdb";

type Props = {
  movie: TmdbMovie | null;
  onClose: () => void;
};

export default function MovieModal({ movie, onClose }: Props) {
  useEffect(() => {
    if (!movie) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [movie, onClose]);

  if (!movie) return null;

  const title = movie.title ?? movie.name ?? "Untitled";
  const backdrop = tmdbImage(movie.backdrop_path, "w780") || tmdbImage(movie.poster_path, "w500");
  const poster = tmdbImage(movie.poster_path, "w500");
  const date = movie.release_date ?? movie.first_air_date ?? "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${title}`}
      onMouseDown={(e) => {
        // click outside closes
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
        {/* Header image */}
        <div className="relative h-[220px] w-full">
          {backdrop ? (
            <img src={backdrop} alt="" className="h-full w-full object-cover opacity-95" />
          ) : (
            <div className="h-full w-full bg-white/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-2 text-sm text-white/90 hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            aria-label="Close dialog"
          >
            ✕
          </button>

          <div className="absolute bottom-4 left-5 right-5">
            <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
            <div className="mt-1 flex items-center gap-3 text-sm text-white/70">
              <span>⭐ {movie.vote_average.toFixed(1)}</span>
              {date ? <span>{date}</span> : null}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-5 p-5 md:grid-cols-[160px_1fr]">
          <div className="hidden md:block">
            {poster ? (
              <img
                src={poster}
                alt={title}
                className="w-full rounded-xl border border-white/10 object-cover"
              />
            ) : (
              <div className="aspect-[2/3] w-full rounded-xl bg-white/5" />
            )}
          </div>

          <div>
            <p className="text-sm leading-relaxed text-white/80">
              {movie.overview || "No description available."}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                ▶ Play
              </button>
              <button
                type="button"
                className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                + My List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
