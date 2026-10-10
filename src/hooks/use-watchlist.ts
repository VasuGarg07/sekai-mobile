import {
  skipToken,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";

import { usePreferences } from "@/hooks/use-preferences";
import { queryKeys } from "@/lib/query-keys";
import { useAuth } from "@/providers/auth-provider";
import {
  addToWatchlist,
  fetchWatchlistIds,
  fetchWatchlistPage,
  removeFromWatchlist,
  updateWatchStatus,
  type WatchlistCursor,
} from "@/services/watchlist";
import type { AnimeListItem } from "@/types/anime";
import type { ActionResult } from "@/types/result";
import type { WatchStatus } from "@/types/watchlist";

const EMPTY_IDS = new Set<number>();
const SIGNED_OUT: ActionResult = {
  success: false,
  message: "Sign in to manage your watchlist.",
};

export function useWatchlist() {
  const { user } = useAuth();
  const query = useInfiniteQuery({
    queryKey: queryKeys.watchlistItems(user?.uid),
    queryFn: user
      ? ({ pageParam }) => fetchWatchlistPage(user.uid, pageParam)
      : skipToken,
    initialPageParam: undefined as WatchlistCursor | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });

  const pages = query.data?.pages;
  const items = useMemo(() => pages?.flatMap((page) => page.items) ?? [], [pages]);
  const refreshFailed = pages?.some((page) => page.refreshFailed) ?? false;

  return { ...query, items, refreshFailed };
}

/** Every saved anime ID, including ones not loaded in the list. Empty when signed out. */
export function useWatchlistIds(): Set<number> {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: queryKeys.watchlistIds(user?.uid),
    queryFn: user ? () => fetchWatchlistIds(user.uid) : skipToken,
    staleTime: 10 * 60 * 1000,
  });
  return data ?? EMPTY_IDS;
}

function useWatchlistMutation<TVariables>(
  mutate: (uid: string, variables: TVariables) => Promise<ActionResult>,
) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables) => (user ? mutate(user.uid, variables) : SIGNED_OUT),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.watchlist(user?.uid) });
      }
    },
  });
}

/** Saves with the user's default watch status. */
export function useAddToWatchlist() {
  const { defaultWatchStatus } = usePreferences();
  return useWatchlistMutation((uid, anime: AnimeListItem) =>
    addToWatchlist(uid, anime, defaultWatchStatus),
  );
}

export function useRemoveFromWatchlist() {
  return useWatchlistMutation((uid, animeId: number) => removeFromWatchlist(uid, animeId));
}

export function useUpdateWatchStatus() {
  return useWatchlistMutation(
    (uid, { animeId, watchStatus }: { animeId: number; watchStatus: WatchStatus }) =>
      updateWatchStatus(uid, animeId, watchStatus),
  );
}
