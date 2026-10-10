import type { IconName } from "@/components/ui/icon";

export const WEB_APP_URL = "https://sekai-arcadia.web.app";

export const GITHUB_REPO = "VasuGarg07/sekai-mobile";

// Must match maxWatchlistSize() in sekai-web/firestore.rules.
export const MAX_WATCHLIST_SIZE = 2000;

export type RankedListKind = "top-airing" | "popular" | "favourite" | "completed" | "recents";

interface RankedList {
  title: string;
  icon: IconName;
  sort: string[];
  status?: string;
}

export const RANKED_LISTS: Record<RankedListKind, RankedList> = {
  "top-airing": {
    title: "Trending now",
    icon: "local_fire_department",
    sort: ["TRENDING_DESC"],
    status: "RELEASING",
  },
  popular: { title: "Most popular", icon: "trending_up", sort: ["POPULARITY_DESC"] },
  favourite: { title: "All-time favourites", icon: "favorite", sort: ["FAVOURITES_DESC"] },
  completed: {
    title: "Recently completed",
    icon: "check_circle",
    sort: ["END_DATE_DESC"],
    status: "FINISHED",
  },
  recents: {
    title: "Airing now",
    icon: "live_tv",
    sort: ["UPDATED_AT_DESC"],
    status: "RELEASING",
  },
};

export function isRankedListKind(value: string): value is RankedListKind {
  return value in RANKED_LISTS;
}
