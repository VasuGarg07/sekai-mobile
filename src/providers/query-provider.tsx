import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

import { queryClient } from "@/lib/query-client";
import { restoreQueryCache, startQueryCachePersistence } from "@/lib/query-persist";

// Started on import so reading the cache overlaps with the theme and auth restore.
const restored = restoreQueryCache(queryClient);

interface QueryProviderProps {
  children: ReactNode;
}

/** Renders nothing until last session's data is back, so queries never start from an empty cache. */
export function QueryProvider({ children }: QueryProviderProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    restored.then(() => setReady(true));
    return startQueryCachePersistence(queryClient);
  }, []);

  if (!ready) return null;
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
