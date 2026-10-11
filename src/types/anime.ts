export interface AnimeListItem {
  id: number;
  titleEnglish: string | null;
  titleRomaji: string | null;
  coverImage: string | null;
  bannerImage: string | null;
  /** AniList media format: TV, MOVIE, OVA... */
  format: string | null;
  /** Minutes per episode. */
  episodeDuration: number | null;
  /** 0–100, as AniList reports it. */
  averageScore: number | null;
  startDate: string | null;
  synopsis: string | null;
  synonyms: string[];
  status: string | null;
  genres: string[];
  episodes: number | null;
  season: string | null;
  seasonYear: number | null;
  isAdult: boolean;
}

export type AnimeSpotlight = AnimeListItem;

export interface AnimeTag {
  name: string;
  rank: number | null;
  isGeneralSpoiler: boolean;
  isMediaSpoiler: boolean;
}

export interface AnimeRelation {
  id: number;
  relationType: string;
  titleEnglish: string | null;
  titleRomaji: string | null;
  coverImage: string | null;
  isAdult: boolean;
}

export interface AnimeTrailer {
  id: string;
  site: string;
}

export interface AnimeDetail extends AnimeListItem {
  coverImageExtraLarge: string | null;
  countryOfOrigin: string | null;
  tags: AnimeTag[];
  popularity: number | null;
  favourites: number | null;
  relations: AnimeRelation[];
  recommendations: AnimeListItem[];
  trailer: AnimeTrailer | null;
  nextEpisode: { episode: number; airingAt: Date } | null;
}

export interface AnimePage {
  items: AnimeListItem[];
  currentPage: number;
  hasNextPage: boolean;
  total: number;
}

export interface AnimeSearchFilters {
  search?: string;
  genreIn?: string[];
  genreNotIn?: string[];
  formatIn?: string[];
  statusIn?: string[];
  season?: string;
  year?: number;
  country?: string;
  sort?: string[];
}
