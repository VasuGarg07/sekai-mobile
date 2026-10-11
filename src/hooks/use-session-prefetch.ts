import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { preferencesQueryOptions } from "@/hooks/use-preferences";
import { watchlistIdsQueryOptions } from "@/hooks/use-watchlist";
import { useAuth } from "@/providers/auth-provider";

/** Starts the signed-in user's small Firestore reads at once, so screens find them already loaded. */
export function useSessionPrefetch() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const uid = user?.uid;

  useEffect(() => {
    if (!uid) return;
    void queryClient.prefetchQuery(preferencesQueryOptions(uid));
    void queryClient.prefetchQuery(watchlistIdsQueryOptions(uid));
  }, [uid, queryClient]);
}
