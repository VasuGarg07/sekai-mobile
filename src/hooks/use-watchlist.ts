import {
  queryOptions,
  skipToken,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";

import { usePreferences } from "@/hooks/use-preferences";
import { queryKeys } from "@/lib/query-keys";
import { useAuth } from "@/providers/auth-provider";
import {
  addToWatchlist,
  fetchWatchlistIds,
  fetchWatchlistPage,
  fetchWatchStatus,
  removeFromWatchlist,
  updateWatchStatus,
  type WatchlistCursor,
  type WatchlistPage,
} from "@/services/watchlist";
import type { AnimeListItem } from "@/types/anime";
import type { ActionResult } from "@/types/result";
import type { WatchlistItem, WatchStatus } from "@/types/watchlist";

const SIGNED_OUT: ActionResult = {
  success: false,
  message: "Sign in to manage your watchlist.",
};

type ItemsData = InfiniteData<WatchlistPage, WatchlistCursor | undefined>;

export function watchlistIdsQueryOptions(uid: string | undefined) {
  return queryOptions({
    queryKey: queryKeys.watchlistIds(uid),
    queryFn: uid ? () => fetchWatchlistIds(uid) : skipToken,
    staleTime: 10 * 60 * 1000,
  });
}

export function useWatchlist() {
  const { user } = useAuth();
  const query = useInfiniteQuery({
    queryKey: queryKeys.watchlistItems(user?.uid),
    queryFn: user ? ({ pageParam }) => fetchWatchlistPage(user.uid, pageParam) : skipToken,
    initialPageParam: undefined as WatchlistCursor | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });

  const pages = query.data?.pages;
  const items = useMemo(() => pages?.flatMap((page) => page.items) ?? [], [pages]);
  const refreshFailed = pages?.some((page) => page.refreshFailed) ?? false;

  return { ...query, items, refreshFailed };
}

/** What the loaded list or the saved IDs already say, so most lookups need no Firestore read. */
function statusFromCache(
  client: QueryClient,
  uid: string,
  animeId: number,
): { status: WatchStatus | null; updatedAt: number } | undefined {
  const itemsKey = queryKeys.watchlistItems(uid);
  const loaded = client
    .getQueryData<ItemsData>(itemsKey)
    ?.pages.flatMap((page) => page.items)
    .find((item) => item.id === animeId);
  if (loaded) {
    return {
      status: loaded.watchStatus,
      updatedAt: client.getQueryState(itemsKey)?.dataUpdatedAt ?? 0,
    };
  }

  const ids = client.getQueryState<number[]>(queryKeys.watchlistIds(uid));
  if (ids?.data && !ids.data.includes(animeId)) {
    return { status: null, updatedAt: ids.dataUpdatedAt };
  }
  return undefined;
}

/** null when the anime isn't saved; undefined while loading or signed out. */
export function useWatchStatus(animeId: number): WatchStatus | null | undefined {
  const { user } = useAuth();
  const client = useQueryClient();
  const uid = user?.uid;
  const { data } = useQuery({
    queryKey: queryKeys.watchStatus(uid, animeId),
    queryFn: uid ? () => fetchWatchStatus(uid, animeId) : skipToken,
    initialData: () => (uid ? statusFromCache(client, uid, animeId)?.status : undefined),
    initialDataUpdatedAt: () =>
      uid ? statusFromCache(client, uid, animeId)?.updatedAt : undefined,
  });
  return data;
}

function mapItems(
  data: ItemsData | undefined,
  change: (items: WatchlistItem[]) => WatchlistItem[],
): ItemsData | undefined {
  return (
    data && { ...data, pages: data.pages.map((page) => ({ ...page, items: change(page.items) })) }
  );
}

interface OptimisticWrite<TVariables> {
  write: (uid: string, variables: TVariables) => Promise<ActionResult>;
  /** Applies the expected result to the cache before the write finishes. */
  apply: (client: QueryClient, uid: string, variables: TVariables) => void;
}

// The cache is patched up front and rolled back if the write fails, so lists and buttons change
// on tap. Refetching instead would wait for Firestore and then re-fetch every item from AniList.
function useWatchlistMutation<TVariables>({ write, apply }: OptimisticWrite<TVariables>) {
  const { user } = useAuth();
  const client = useQueryClient();
  const uid = user?.uid;

  return useMutation({
    mutationFn: async (variables: TVariables) => (uid ? write(uid, variables) : SIGNED_OUT),
    onMutate: async (variables) => {
      if (!uid) return undefined;
      await client.cancelQueries({ queryKey: queryKeys.watchlist(uid) });
      const snapshot = client.getQueriesData({ queryKey: queryKeys.watchlist(uid) });
      apply(client, uid, variables);
      return { snapshot };
    },
    onSuccess: (result, _variables, context) => {
      if (result.success) return;
      for (const [key, data] of context?.snapshot ?? []) client.setQueryData(key, data);
      if (uid) void client.invalidateQueries({ queryKey: queryKeys.watchlist(uid) });
    },
    onError: (_error, _variables, context) => {
      for (const [key, data] of context?.snapshot ?? []) client.setQueryData(key, data);
    },
  });
}

/** Only the list fields; a detail page's tags and relations would bloat the cached list. */
function toListItem(anime: AnimeListItem): AnimeListItem {
  return {
    id: anime.id,
    titleEnglish: anime.titleEnglish,
    titleRomaji: anime.titleRomaji,
    coverImage: anime.coverImage,
    bannerImage: anime.bannerImage,
    format: anime.format,
    episodeDuration: anime.episodeDuration,
    averageScore: anime.averageScore,
    startDate: anime.startDate,
    synopsis: anime.synopsis,
    synonyms: anime.synonyms,
    status: anime.status,
    genres: anime.genres,
    episodes: anime.episodes,
    season: anime.season,
    seasonYear: anime.seasonYear,
    isAdult: anime.isAdult,
  };
}

/** Saves with the user's default watch status. */
export function useAddToWatchlist() {
  const { defaultWatchStatus } = usePreferences();
  return useWatchlistMutation<AnimeListItem>({
    write: (uid, anime) => addToWatchlist(uid, anime, defaultWatchStatus),
    apply: (client, uid, anime) => {
      const added: WatchlistItem = {
        ...toListItem(anime),
        watchStatus: defaultWatchStatus,
        addedAt: Date.now(),
        isStale: false,
      };
      client.setQueryData<ItemsData>(
        queryKeys.watchlistItems(uid),
        (data) =>
          data && {
            ...data,
            pages: data.pages.map((page, index) =>
              index === 0 ? { ...page, items: [added, ...page.items] } : page,
            ),
          },
      );
      client.setQueryData<number[]>(queryKeys.watchlistIds(uid), (ids) =>
        ids && [...ids, anime.id],
      );
      client.setQueryData(queryKeys.watchStatus(uid, anime.id), defaultWatchStatus);
    },
  });
}

export function useRemoveFromWatchlist() {
  return useWatchlistMutation<number>({
    write: removeFromWatchlist,
    apply: (client, uid, animeId) => {
      client.setQueryData<ItemsData>(queryKeys.watchlistItems(uid), (data) =>
        mapItems(data, (items) => items.filter((item) => item.id !== animeId)),
      );
      client.setQueryData<number[]>(queryKeys.watchlistIds(uid), (ids) =>
        ids?.filter((id) => id !== animeId),
      );
      client.setQueryData(queryKeys.watchStatus(uid, animeId), null);
    },
  });
}

export function useUpdateWatchStatus() {
  return useWatchlistMutation<{ animeId: number; watchStatus: WatchStatus }>({
    write: (uid, { animeId, watchStatus }) => updateWatchStatus(uid, animeId, watchStatus),
    apply: (client, uid, { animeId, watchStatus }) => {
      client.setQueryData<ItemsData>(queryKeys.watchlistItems(uid), (data) =>
        mapItems(data, (items) =>
          items.map((item) => (item.id === animeId ? { ...item, watchStatus } : item)),
        ),
      );
      client.setQueryData(queryKeys.watchStatus(uid, animeId), watchStatus);
    },
  });
}
