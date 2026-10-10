import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { useAuth } from "@/providers/auth-provider";
import { DEFAULT_PREFERENCES, fetchPreferences, updatePreferences } from "@/services/preferences";
import type { ActionResult } from "@/types/result";
import type { Preferences } from "@/types/watchlist";

/** Signed-out users get the defaults. */
export function usePreferences(): Preferences {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: queryKeys.preferences(user?.uid),
    queryFn: user ? () => fetchPreferences(user.uid) : skipToken,
    staleTime: Infinity,
  });
  return data ?? DEFAULT_PREFERENCES;
}

/** 18+ Mode only applies to signed-in users, matching the web app. */
export function useAdultMode(): boolean {
  const { user } = useAuth();
  const { adultMode } = usePreferences();
  return user !== null && adultMode;
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
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Preferences>(queryKey);
      queryClient.setQueryData<Preferences>(queryKey, (current) => ({
        ...(current ?? DEFAULT_PREFERENCES),
        ...updates,
      }));
      return { previous };
    },
    onSuccess: (result, _updates, context) => {
      if (!result.success) queryClient.setQueryData(queryKey, context?.previous);
    },
  });
}
