import { InfiniteAnimeGrid } from "@/components/anime/infinite-anime-grid";
import { useAnimeSearch } from "@/hooks/use-anime";
import { useTabBarSpace } from "@/hooks/use-tab-bar-space";

import type { ExploreFilters } from "../filter-options";

interface SearchResultsProps {
  search: string;
  filters: ExploreFilters;
}

export function SearchResults({ search, filters }: SearchResultsProps) {
  const bottomSpace = useTabBarSpace();
  // AniList's relevance sort only means something when there is search text.
  const defaultSort = search ? "SEARCH_MATCH" : "POPULARITY_DESC";
  const query = useAnimeSearch({
    ...filters,
    search: search || undefined,
    sort: filters.sort ?? [defaultSort],
  });

  return (
    <InfiniteAnimeGrid
      query={query}
      emptyMessage="Nothing matches. Try a different search or fewer filters."
      bottomInset={bottomSpace}
    />
  );
}
