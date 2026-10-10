import type { AnimeSearchFilters } from "@/types/anime";

export interface FilterOption {
  key: string;
  label: string;
}

export const SORT_OPTIONS: FilterOption[] = [
  { key: "SEARCH_MATCH", label: "Relevance" },
  { key: "POPULARITY_DESC", label: "Popularity" },
  { key: "TRENDING_DESC", label: "Trending" },
  { key: "SCORE_DESC", label: "Score" },
  { key: "UPDATED_AT_DESC", label: "Recently updated" },
  { key: "START_DATE_DESC", label: "Start date" },
  { key: "TITLE_ROMAJI", label: "Title (A–Z)" },
];

export const FORMAT_OPTIONS: FilterOption[] = [
  { key: "TV", label: "TV" },
  { key: "MOVIE", label: "Movie" },
  { key: "OVA", label: "OVA" },
  { key: "ONA", label: "ONA" },
  { key: "SPECIAL", label: "Special" },
  { key: "MUSIC", label: "Music" },
];

export const STATUS_OPTIONS: FilterOption[] = [
  { key: "RELEASING", label: "Airing" },
  { key: "FINISHED", label: "Finished" },
  { key: "NOT_YET_RELEASED", label: "Upcoming" },
  { key: "HIATUS", label: "Hiatus" },
  { key: "CANCELLED", label: "Cancelled" },
];

export const SEASON_OPTIONS: FilterOption[] = [
  { key: "WINTER", label: "Winter" },
  { key: "SPRING", label: "Spring" },
  { key: "SUMMER", label: "Summer" },
  { key: "FALL", label: "Fall" },
];

export const COUNTRY_OPTIONS: FilterOption[] = [
  { key: "JP", label: "Japan" },
  { key: "CN", label: "China" },
  { key: "KR", label: "Korea" },
  { key: "TW", label: "Taiwan" },
];

export type ExploreFilters = Omit<AnimeSearchFilters, "search">;

export function countActiveFilters(filters: ExploreFilters): number {
  return (
    (filters.formatIn?.length ?? 0) +
    (filters.statusIn?.length ?? 0) +
    (filters.genreIn?.length ?? 0) +
    (filters.genreNotIn?.length ?? 0) +
    [filters.season, filters.year, filters.country, filters.sort?.[0]].filter(Boolean).length
  );
}
