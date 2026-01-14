import { useEffect } from "react";
import type { TmdbMovie } from "../types/tmdb";
import { tmdbImage } from "../services/tmdb";
import { useTrailer } from "../hooks/useTrailer";
import type { MyListItem } from "../services/myList";

type Selected = { movie: TmdbMovie; mediaType: "movie" | "tv" } | null;

type Props = {
  selected: Selected;
  onClose: () => void;
  onToggleMyList: (item: MyListItem) => boolean; // returns isNowInList
  isInMyList: (id: number) => boolean;
};

export default function MovieModal({ selected, onClose, onToggleMyList, isInMyList }: Props) {
  const movie = selected?.movie ?? null;
  const mediaType = selected?.mediaType ?? null;

  const { trailer } = useTrailer(movie?.id ?? null, mediaType);

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
  const inList = isInMyList(movie.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${title}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
        {/* Header: Trailer if available, else image */}
        <div className="relative w-full">
          <div className="relative h-[240px] md:h-[360px]">
            {trailer?.site === "YouTube" ? (
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
                title={`${title} trailer`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : backdrop ? (
              <img src={backdrop} alt="" className="h-full w-full object-cover opacity-95" />
            ) : (
              <div className="h-full w-full bg-white/5" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent pointer-events-none" />

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-2 text-sm text-white/90 hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-label="Close dialog"
            >
              ✕
            </button>

            <div className="absolute bottom-4 left-5 right-5">
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h3>
              <div className="mt-1 flex items-center gap-3 text-sm text-white/70">
                <span>⭐ {movie.vote_average.toFixed(1)}</span>
                {date ? <span>{date}</span> : null}
                {mediaType ? <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs backdrop-blur">{mediaType === "tv" ? "Series" : "Movie"}</span> : null}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-6 p-5 md:grid-cols-[180px_1fr]">
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
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-white/10 hover:bg-white/90 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                ▶ Play
              </button>

              <button
                type="button"
                onClick={() => onToggleMyList({ ...movie, _mediaType: (mediaType ?? "movie") as "movie" | "tv" })}
                className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/15 hover:border-white/30 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                {inList ? "✓ In My List" : "+ My List"}
              </button>
            </div>

            {!trailer && (
              <div className="mt-4 text-xs text-white/50">
                No trailer found for this title.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
