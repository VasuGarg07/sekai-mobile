import { router } from "expo-router";

import { AnimeShelf, type ShelfVariant } from "@/components/anime/anime-shelf";
import { RANKED_LISTS, type RankedListKind } from "@/constants";
import { useAnimeList } from "@/hooks/use-anime";

const SHELF_SIZES: Record<ShelfVariant, number> = {
  ranked: 10,
  wide: 8,
  poster: 12,
};

interface RankedShelfProps {
  kind: RankedListKind;
  variant?: ShelfVariant;
}

export function RankedShelf({ kind, variant = "poster" }: RankedShelfProps) {
  const { title, icon, sort, status } = RANKED_LISTS[kind];
  const { data, isPending, isError, refetch } = useAnimeList(
    sort,
    status,
    SHELF_SIZES[variant],
    { withBanner: variant === "wide" },
  );

  return (
    <AnimeShelf
      title={title}
      icon={icon}
      variant={variant}
      items={data?.pages[0]?.items ?? []}
      loading={isPending}
      error={isError}
      onRetry={() => refetch()}
      onSeeAll={() => router.push(`/list/${kind}`)}
    />
  );
}
