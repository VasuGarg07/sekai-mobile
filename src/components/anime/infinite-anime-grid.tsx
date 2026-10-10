import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import type { ReactElement } from "react";

import { AnimeGrid } from "@/components/anime/anime-grid";
import { ErrorState, LoadingState, MessageState } from "@/components/ui/screen-state";
import { useRefresh } from "@/hooks/use-refresh";
import type { AnimePage } from "@/types/anime";

interface InfiniteAnimeGridProps {
  query: UseInfiniteQueryResult<InfiniteData<AnimePage>>;
  emptyMessage: string;
  header?: ReactElement;
}

export function InfiniteAnimeGrid({ query, emptyMessage, header }: InfiniteAnimeGridProps) {
  const { data, isPending, isError, error, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    query;
  const { refreshing, onRefresh } = useRefresh(refetch);

  if (isPending) return <LoadingState />;
  if (isError) return <ErrorState message={error.message} onAction={() => refetch()} />;

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
      empty={<MessageState title="Nothing here" message={emptyMessage} />}
    />
  );
}
