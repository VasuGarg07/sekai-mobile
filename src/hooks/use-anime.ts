import {
  queryOptions,
  skipToken,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";

import { useAnimeScope } from "@/hooks/use-preferences";
import { queryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import {
  fetchAnimeDetail,
  fetchAnimeList,
  fetchGenres,
  fetchSpotlight,
  isAdultGenre,
  searchAnime,
} from "@/services/anilist/anime";
import type { AnimePage, AnimeSearchFilters } from "@/types/anime";
import { getCurrentSeason } from "@/utils/date";

const DEFAULT_PAGE_SIZE = 30;
const DETAIL_STALE_TIME = 30 * 60 * 1000;

const getNextPage = (page: AnimePage) => (page.hasNextPage ? page.currentPage + 1 : undefined);

interface ListOptions {
  /** Show the home shelf's items while the full list loads, so "See all" opens with content. */
  seedFromShelf?: boolean;
  /** For wide cards, which also draw the banner and genres. */
  withBanner?: boolean;
}

export function useAnimeList(
  sort: string[],
  status?: string,
  perPage = DEFAULT_PAGE_SIZE,
  { seedFromShelf = false, withBanner = false }: ListOptions = {},
) {
  const { adultMode, ready } = useAnimeScope();
  const client = useQueryClient();
  return useInfiniteQuery({
    queryKey: queryKeys.animeList(sort, status, perPage, adultMode, withBanner),
    queryFn: ({ pageParam }) =>
      fetchAnimeList({ sort, status, page: pageParam, perPage, adultMode, withBanner }),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
    enabled: ready,
    staleTime: 60 * 60 * 1000,
    placeholderData: seedFromShelf
      ? () => seedPages(client, sort, status, perPage, adultMode)
      : undefined,
  });
}

/** The first page of another size of the same list, which a home shelf has usually loaded. */
function seedPages(
  client: QueryClient,
  sort: string[],
  status: string | undefined,
  perPage: number,
  adultMode: boolean,
): InfiniteData<AnimePage, number> | undefined {
  const wanted = JSON.stringify([sort, status, adultMode]);
  const entries = client.getQueriesData<InfiniteData<AnimePage, number>>({
    queryKey: ["anime", "list"],
  });
  for (const [key, data] of entries) {
    const params = key[2] as { sort: string[]; status?: string; perPage: number; adultMode: boolean };
    if (params.perPage === perPage || !data) continue;
    if (JSON.stringify([params.sort, params.status, params.adultMode]) !== wanted) continue;
    return { pages: data.pages.slice(0, 1), pageParams: [1] };
  }
  return undefined;
}

export function useAnimeSearch(filters: AnimeSearchFilters, perPage = DEFAULT_PAGE_SIZE) {
  const { adultMode, ready } = useAnimeScope();
  return useInfiniteQuery({
    queryKey: queryKeys.animeSearch(filters, adultMode),
    queryFn: ({ pageParam }) => searchAnime({ filters, page: pageParam, perPage, adultMode }),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
    enabled: ready,
  });
}

/** The current season's most popular titles. */
export function useSpotlight() {
  const { adultMode, ready } = useAnimeScope();
  const { season, year } = getCurrentSeason();
  return useQuery({
    queryKey: queryKeys.spotlight(season, year, adultMode),
    queryFn: ready ? () => fetchSpotlight(season, year, adultMode) : skipToken,
    staleTime: 60 * 60 * 1000,
  });
}

function detailQueryOptions(id: number) {
  return queryOptions({
    queryKey: queryKeys.animeDetail(id),
    queryFn: () => fetchAnimeDetail(id),
    enabled: Number.isInteger(id),
    staleTime: DETAIL_STALE_TIME,
  });
}

/** Starts loading a detail page on touch-down, which is ~100ms before the tap completes. */
export function prefetchAnimeDetail(id: number) {
  queryClient.prefetchQuery(detailQueryOptions(id));
}

export function useAnimeDetail(id: number) {
  return useQuery(detailQueryOptions(id));
}

/** Adult-only genres are hidden unless 18+ Mode is on. */
export function useGenres() {
  const { adultMode } = useAnimeScope();
  return useQuery({
    queryKey: queryKeys.genres(),
    queryFn: fetchGenres,
    select: (genres) => (adultMode ? genres : genres.filter((genre) => !isAdultGenre(genre))),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
