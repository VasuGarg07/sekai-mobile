import type { AnimeSearchFilters } from "@/types/anime";
import type { Season } from "@/utils/date";

export const queryKeys = {
  animeList: (
    sort: string[],
    status: string | undefined,
    perPage: number,
    adultMode: boolean,
    withBanner: boolean,
  ) => ["anime", "list", { sort, status, perPage, adultMode, withBanner }] as const,
  animeSearch: (filters: AnimeSearchFilters, adultMode: boolean) =>
    ["anime", "search", { filters, adultMode }] as const,
  spotlight: (season: Season, year: number, adultMode: boolean) =>
    ["anime", "spotlight", { season, year, adultMode }] as const,
  animeDetail: (id: number) => ["anime", "detail", id] as const,
  genres: () => ["anime", "genres"] as const,
  preferences: (uid: string | undefined) => ["preferences", uid] as const,
  watchlist: (uid: string | undefined) => ["watchlist", uid] as const,
  watchlistItems: (uid: string | undefined) => ["watchlist", uid, "items"] as const,
  watchlistIds: (uid: string | undefined) => ["watchlist", uid, "ids"] as const,
  appUpdate: () => ["app-update"] as const,
  watchStatus: (uid: string | undefined, animeId: number) =>
    ["watchlist", uid, "status", animeId] as const,
};
