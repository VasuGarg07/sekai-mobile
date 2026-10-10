import { router } from "expo-router";

import { Button } from "@/components/ui/button";
import { useAddToWatchlist, useWatchStatus } from "@/hooks/use-watchlist";
import { useAuth } from "@/providers/auth-provider";
import type { AnimeListItem } from "@/types/anime";
import { getTitle, WATCH_STATUS_LABELS } from "@/utils/anime";
import { confirmTap, showMessage } from "@/utils/feedback";

interface QuickWatchlistButtonProps {
  anime: AnimeListItem;
}

/** Compact glass "My List" button for places like the spotlight. */
export function QuickWatchlistButton({ anime }: QuickWatchlistButtonProps) {
  const { user } = useAuth();
  const watchStatus = useWatchStatus(anime.id);
  const addToWatchlist = useAddToWatchlist();

  if (watchStatus) {
    return (
      <Button
        variant="glass"
        icon="bookmark_added"
        title={WATCH_STATUS_LABELS[watchStatus]}
        onPress={() =>
          router.push({ pathname: "/watch-status", params: { animeId: anime.id, title: getTitle(anime) } })
        }
      />
    );
  }

  const handleAdd = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    const result = await addToWatchlist.mutateAsync(anime);
    if (result.success) {
      confirmTap();
      showMessage(`Added ${getTitle(anime)} to your list`);
    } else if (result.message) {
      showMessage(result.message);
    }
  };

  return (
    <Button
      variant="glass"
      icon="bookmark_add"
      title="My List"
      loading={addToWatchlist.isPending}
      onPress={handleAdd}
    />
  );
}
