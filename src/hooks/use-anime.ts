import { skipToken, useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { useAdultMode } from "@/hooks/use-preferences";
import { queryKeys } from "@/lib/query-keys";
import {
  fetchAnimeDetail,
  fetchAnimeList,
  fetchGenres,
  fetchSpotlight,
  isAdultGenre,
  quickSearchAnime,
  searchAnime,
} from "@/services/anilist/anime";
import type { AnimePage, AnimeSearchFilters } from "@/types/anime";
import { getCurrentSeason } from "@/utils/date";

const DEFAULT_PAGE_SIZE = 30;
const QUICK_SEARCH_MIN_LENGTH = 3;

const getNextPage = (page: AnimePage) => (page.hasNextPage ? page.currentPage + 1 : undefined);

export function useAnimeList(sort: string[], status?: string, perPage = DEFAULT_PAGE_SIZE) {
  const adultMode = useAdultMode();
  return useInfiniteQuery({
    queryKey: queryKeys.animeList(sort, status, perPage, adultMode),
    queryFn: ({ pageParam }) =>
      fetchAnimeList({ sort, status, page: pageParam, perPage, adultMode }),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
    staleTime: 60 * 60 * 1000,
  });
}

export function useAnimeSearch(filters: AnimeSearchFilters, perPage = DEFAULT_PAGE_SIZE) {
  const adultMode = useAdultMode();
  return useInfiniteQuery({
    queryKey: queryKeys.animeSearch(filters, adultMode),
    queryFn: ({ pageParam }) => searchAnime({ filters, page: pageParam, perPage, adultMode }),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
  });
}

/** Runs once the search has at least three characters. */
export function useQuickSearch(search: string) {
  const adultMode = useAdultMode();
  const term = search.trim();
  return useQuery({
    queryKey: queryKeys.quickSearch(term, adultMode),
    queryFn:
      term.length >= QUICK_SEARCH_MIN_LENGTH ? () => quickSearchAnime(term, adultMode) : skipToken,
  });
}

/** The current season's most popular titles. */
export function useSpotlight() {
  const adultMode = useAdultMode();
  const { season, year } = getCurrentSeason();
  return useQuery({
    queryKey: queryKeys.spotlight(season, year, adultMode),
    queryFn: () => fetchSpotlight(season, year, adultMode),
    staleTime: 60 * 60 * 1000,
  });
}

export function useAnimeDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.animeDetail(id),
    queryFn: Number.isInteger(id) ? () => fetchAnimeDetail(id) : skipToken,
    staleTime: 30 * 60 * 1000,
  });
}

/** Adult-only genres are hidden unless 18+ Mode is on. */
export function useGenres() {
  const adultMode = useAdultMode();
  return useQuery({
    queryKey: queryKeys.genres(),
    queryFn: fetchGenres,
    select: (genres) => (adultMode ? genres : genres.filter((genre) => !isAdultGenre(genre))),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
