import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import type { ReactElement } from "react";

import { AnimeGrid, AnimeGridPlaceholder } from "@/components/anime/anime-grid";
import { ErrorState, MessageState } from "@/components/ui/screen-state";
import { useRefresh } from "@/hooks/use-refresh";
import type { AnimePage } from "@/types/anime";

interface InfiniteAnimeGridProps {
  query: UseInfiniteQueryResult<InfiniteData<AnimePage>>;
  emptyMessage: string;
  header?: ReactElement;
  bottomInset?: number;
}

export function InfiniteAnimeGrid({ query, emptyMessage, header, bottomInset }: InfiniteAnimeGridProps) {
  const { data, isPending, isError, error, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    query;
  const { refreshing, onRefresh } = useRefresh(refetch);

  if (isPending) return <AnimeGridPlaceholder />;
  if (isError) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  return (
    <AnimeGrid
      items={data.pages.flatMap((page) => page.items)}
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
