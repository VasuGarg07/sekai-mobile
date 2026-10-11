import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  dehydrate,
  hydrate,
  type DehydratedState,
  type Query,
  type QueryClient,
} from "@tanstack/react-query";
import { AppState } from "react-native";

const STORAGE_KEY = "query-cache";
// Bump when a persisted query's data shape changes, so old caches are dropped instead of misread.
const CACHE_VERSION = 2;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const SAVE_DELAY_MS = 2_000;
const MAX_PERSISTED_PAGES = 2;

interface PersistedCache {
  version: number;
  savedAt: number;
  state: DehydratedState;
}

interface PagedData {
  pages: unknown[];
  pageParams: unknown[];
}

function isPagedData(data: unknown): data is PagedData {
  return (
    typeof data === "object" &&
    data !== null &&
    "pages" in data &&
    Array.isArray(data.pages) &&
    "pageParams" in data &&
    Array.isArray(data.pageParams)
  );
}

// Only data that is cheap to store and safe to show while it refreshes. Detail pages hold Dates
// (lost in JSON) and searches are too varied to be worth the space.
function shouldPersist(query: Query): boolean {
  if (query.state.status !== "success") return false;
  const [root, , kind] = query.queryKey;
  if (root === "anime") return kind === "list" || kind === "spotlight" || kind === "genres";
  return root === "preferences" || root === "watchlist";
}

function trimPages(data: unknown): unknown {
  if (!isPagedData(data)) return data;
  return {
    pages: data.pages.slice(0, MAX_PERSISTED_PAGES),
    pageParams: data.pageParams.slice(0, MAX_PERSISTED_PAGES),
  };
}

async function save(client: QueryClient): Promise<void> {
  const state = dehydrate(client, {
    shouldDehydrateQuery: shouldPersist,
    shouldDehydrateMutation: () => false,
    serializeData: trimPages,
  });
  const cache: PersistedCache = { version: CACHE_VERSION, savedAt: Date.now(), state };
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn("Couldn't save the query cache:", error);
  }
}

/** Fills the client with last session's data so screens open with content instead of skeletons. */
export async function restoreQueryCache(client: QueryClient): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    const cache: PersistedCache = JSON.parse(stored);
    if (cache.version !== CACHE_VERSION || Date.now() - cache.savedAt > MAX_AGE_MS) {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return;
    }
    hydrate(client, cache.state);
  } catch (error) {
    console.warn("Couldn't restore the query cache:", error);
  }
}

/** Saves shortly after the cache settles, and immediately when the app is backgrounded. */
export function startQueryCachePersistence(client: QueryClient): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const unsubscribeCache = client.getQueryCache().subscribe((event) => {
    if (event.type !== "updated" || event.action.type !== "success") return;
    clearTimeout(timer);
    timer = setTimeout(() => save(client), SAVE_DELAY_MS);
  });

  const appState = AppState.addEventListener("change", (status) => {
    if (status === "active") return;
    clearTimeout(timer);
    save(client);
  });

  return () => {
    clearTimeout(timer);
    unsubscribeCache();
    appState.remove();
  };
}
