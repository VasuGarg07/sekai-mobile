import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useMemo, type ReactElement } from "react";

import { AnimeGrid, AnimeGridPlaceholder } from "@/components/anime/anime-grid";
import { ErrorState, MessageState } from "@/components/ui/screen-state";
import { useRefresh } from "@/hooks/use-refresh";
import type { AnimeListItem, AnimePage } from "@/types/anime";

/** AniList pages can overlap while rankings shift between requests; duplicate keys corrupt a recycled list. */
function uniqueItems(pages: AnimePage[] | undefined): AnimeListItem[] {
  const seen = new Set<number>();
  return (pages ?? [])
    .flatMap((page) => page.items)
    .filter((item) => !seen.has(item.id) && seen.add(item.id));
}

interface InfiniteAnimeGridProps {
  query: UseInfiniteQueryResult<InfiniteData<AnimePage>>;
  emptyMessage: string;
  header?: ReactElement;
  bottomInset?: number;
}

export function InfiniteAnimeGrid({ query, emptyMessage, header, bottomInset }: InfiniteAnimeGridProps) {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isPlaceholderData,
  } = query;
  const { refreshing, onRefresh } = useRefresh(refetch);
  const items = useMemo(() => uniqueItems(data?.pages), [data]);

  if (isPending) return <AnimeGridPlaceholder />;
  if (isError) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage && !isPlaceholderData) fetchNextPage();
  };

  return (
    <AnimeGrid
      items={items}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={handleEndReached}
      loadingMore={isFetchingNextPage}
      header={header}
      bottomInset={bottomInset}
      empty={<MessageState icon="search_off" title="Nothing here" message={emptyMessage} />}
    />
  );
}
