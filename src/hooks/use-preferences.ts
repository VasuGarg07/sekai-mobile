import { queryOptions, skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { useAuth } from "@/providers/auth-provider";
import { DEFAULT_PREFERENCES, fetchPreferences, updatePreferences } from "@/services/preferences";
import type { ActionResult } from "@/types/result";
import type { Preferences } from "@/types/watchlist";

export function preferencesQueryOptions(uid: string | undefined) {
  return queryOptions({
    queryKey: queryKeys.preferences(uid),
    queryFn: uid ? () => fetchPreferences(uid) : skipToken,
    staleTime: Infinity,
  });
}

/** Signed-out users get the defaults. */
export function usePreferences(): Preferences {
  const { user } = useAuth();
  const { data } = useQuery(preferencesQueryOptions(user?.uid));
  return data ?? DEFAULT_PREFERENCES;
}

/** 18+ Mode only applies to signed-in users, matching the web app. */
export function useAdultMode(): boolean {
  return useAnimeScope().adultMode;
}

/**
 * What AniList queries depend on. `ready` is false while a signed-in user's preferences are still
 * loading: querying earlier would fetch the wrong content and then refetch once 18+ Mode is known.
 */
export function useAnimeScope(): { adultMode: boolean; ready: boolean } {
  const { user } = useAuth();
  const { data, isPending } = useQuery(preferencesQueryOptions(user?.uid));
  return {
    adultMode: user !== null && (data?.adultMode ?? DEFAULT_PREFERENCES.adultMode),
    ready: user === null || !isPending,
  };
}

/** Applies the change immediately and rolls it back if saving fails. */
export function useUpdatePreferences() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = queryKeys.preferences(user?.uid);

  return useMutation({
    mutationFn: async (updates: Partial<Preferences>): Promise<ActionResult> => {
      if (!user) return { success: false, message: "Sign in to change your settings." };
      return updatePreferences(user.uid, updates);
    },
    // Synchronous so a controlled Switch never renders the old value between tap and update.
    onMutate: (updates) => {
      const previous = queryClient.getQueryData<Preferences>(queryKey);
      queryClient.setQueryData<Preferences>(queryKey, (current) => ({
        ...(current ?? DEFAULT_PREFERENCES),
        ...updates,
      }));
      return { previous };
    },
    onSuccess: (result, _updates, context) => {
      if (result.success) return;
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      else queryClient.invalidateQueries({ queryKey });
    },
  });
}
