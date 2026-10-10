import type { AnimeListItem } from "@/types/anime";

export const WATCH_STATUSES = [
  "watching",
  "completed",
  "on-hold",
  "plan-to-watch",
  "dropped",
  "rewatch",
] as const;

export type WatchStatus = (typeof WATCH_STATUSES)[number];

export interface WatchlistItem extends AnimeListItem {
  watchStatus: WatchStatus;
  /** Milliseconds since epoch. */
  addedAt: number;
  /** AniList couldn't be reached, so the item shows the details saved in Firestore. */
  isStale: boolean;
}

export interface Preferences {
  defaultWatchStatus: WatchStatus;
  adultMode: boolean;
}
