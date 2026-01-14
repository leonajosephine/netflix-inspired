export type TmdbMovie = {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    backdrop_path: string | null;
    poster_path: string | null;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
  };
  
  export type TmdbListResponse<T> = {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
  };
  
  export type TmdbVideo = {
    id: string;
    key: string; // YouTube key
    site: "YouTube" | string;
    type: "Trailer" | "Teaser" | "Clip" | string;
    official?: boolean;
    name: string;
  };
  
  export type TmdbVideoResponse = {
    id: number;
    results: TmdbVideo[];
  };

  export type TmdbSearchResult = TmdbMovie & {
    media_type?: "movie" | "tv" | "person";
  };