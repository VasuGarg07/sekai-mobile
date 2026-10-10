import type { IconName } from "@/components/ui/icon";
import type { AnimeListItem } from "@/types/anime";
import type { WatchStatus } from "@/types/watchlist";

export const WATCH_STATUS_LABELS: Record<WatchStatus, string> = {
  watching: "Watching",
  completed: "Completed",
  "on-hold": "On Hold",
  "plan-to-watch": "Plan to Watch",
  dropped: "Dropped",
  rewatch: "Rewatch",
};

export const WATCH_STATUS_ICONS: Record<WatchStatus, IconName> = {
  watching: "play_circle",
  completed: "check_circle",
  "on-hold": "pause_circle",
  "plan-to-watch": "bookmark",
  dropped: "cancel",
  rewatch: "replay",
};

export function getTitle(anime: Pick<AnimeListItem, "titleEnglish" | "titleRomaji">): string {
  return anime.titleEnglish ?? anime.titleRomaji ?? "Untitled";
}

/** AniList scores are 0–100; the app shows them out of 10 with one decimal (84 → "8.4"). */
export function formatScore(averageScore: number): string {
  return (averageScore / 10).toFixed(1);
}

/** "TV • 12 eps • 2023", skipping whatever is unknown. */
export function getShortMeta(anime: AnimeListItem): string {
  const parts = [
    anime.format,
    anime.episodes ? `${anime.episodes} Ep` : null,
    anime.seasonYear ? String(anime.seasonYear) : null,
  ];
  return parts.filter(Boolean).join(" • ");
}

export function formatEnum(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatAiringTime(date: Date): string {
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
