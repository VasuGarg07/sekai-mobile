import { focusManager, QueryClient } from "@tanstack/react-query";
import { AppState } from "react-native";

import { AniListError } from "@/services/anilist/client";

const MAX_RATE_LIMIT_RETRIES = 3;
const MAX_TRANSIENT_RETRIES = 2;
const MAX_RETRY_DELAY_MS = 8_000;

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (!(error instanceof AniListError)) return false;
  if (error.isRateLimited) return failureCount < MAX_RATE_LIMIT_RETRIES;
  return error.isTransient && failureCount < MAX_TRANSIENT_RETRIES;
}

function retryDelay(attemptIndex: number, error: unknown): number {
  const baseMs = error instanceof AniListError && error.isRateLimited ? 2_000 : 1_000;
  return Math.min(baseMs * 2 ** attemptIndex, MAX_RETRY_DELAY_MS);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: shouldRetry,
      retryDelay,
    },
  },
});

AppState.addEventListener("change", (status) => {
  focusManager.setFocused(status === "active");
});
