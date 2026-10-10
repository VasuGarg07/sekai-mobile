export const WEB_APP_URL = "https://sekai-arcadia.web.app";

export const GITHUB_REPO = "VasuGarg07/sekai-mobile";

// Must match maxWatchlistSize() in sekai-web/firestore.rules.
export const MAX_WATCHLIST_SIZE = 2000;

export type RankedListKind = "top-airing" | "popular" | "favourite" | "completed" | "recents";

interface RankedList {
  title: string;
  sort: string[];
  status?: string;
}

export const RANKED_LISTS: Record<RankedListKind, RankedList> = {
  "top-airing": { title: "Top Airing", sort: ["TRENDING_DESC"], status: "RELEASING" },
  popular: { title: "Most Popular", sort: ["POPULARITY_DESC"] },
  favourite: { title: "Most Favourite", sort: ["FAVOURITES_DESC"] },
  completed: { title: "Latest Completed", sort: ["END_DATE_DESC"], status: "FINISHED" },
  recents: { title: "Recently Released", sort: ["UPDATED_AT_DESC"], status: "RELEASING" },
};

export function isRankedListKind(value: string): value is RankedListKind {
  return value in RANKED_LISTS;
}
