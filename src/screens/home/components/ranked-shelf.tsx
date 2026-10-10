import { router } from "expo-router";

import { AnimeShelf } from "@/components/anime/anime-shelf";
import { RANKED_LISTS, type RankedListKind } from "@/constants";
import { useAnimeList } from "@/hooks/use-anime";

const SHELF_SIZE = 12;

interface RankedShelfProps {
  kind: RankedListKind;
}

export function RankedShelf({ kind }: RankedShelfProps) {
  const { title, sort, status } = RANKED_LISTS[kind];
  const { data, isPending, isError, refetch } = useAnimeList(sort, status, SHELF_SIZE);

  return (
    <AnimeShelf
      title={title}
      items={data?.pages[0]?.items ?? []}
      loading={isPending}
      error={isError}
      onRetry={() => refetch()}
      onSeeAll={() => router.push(`/list/${kind}`)}
    />
  );
}
