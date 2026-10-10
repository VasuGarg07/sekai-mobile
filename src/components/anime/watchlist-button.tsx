import { router } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useAddToWatchlist, useWatchStatus } from "@/hooks/use-watchlist";
import { useAuth } from "@/providers/auth-provider";
import { colors, fontSize, fontWeight, radius, spacing, watchStatusColors } from "@/theme";
import type { AnimeListItem } from "@/types/anime";
import { getTitle, WATCH_STATUS_LABELS } from "@/utils/anime";
import { confirmTap, showMessage } from "@/utils/feedback";

interface WatchlistButtonProps {
  anime: AnimeListItem;
}

export function WatchlistButton({ anime }: WatchlistButtonProps) {
  const { user } = useAuth();
  const watchStatus = useWatchStatus(anime.id);
  const addToWatchlist = useAddToWatchlist();

  if (!user) {
    return (
      <Button title="Sign in to save" variant="secondary" onPress={() => router.push("/login")} />
    );
  }

  if (watchStatus === undefined) {
    return <ActivityIndicator color={colors.textMuted} style={styles.loading} />;
  }

  if (watchStatus === null) {
    const handleAdd = async () => {
      const result = await addToWatchlist.mutateAsync(anime);
      if (result.success) {
        confirmTap();
        showMessage(`Added ${getTitle(anime)} to your watchlist`);
      } else if (result.message) {
        showMessage(result.message);
      }
    };

    return <Button title="Add to watchlist" loading={addToWatchlist.isPending} onPress={handleAdd} />;
  }

  const handleEdit = () =>
    router.push({
      pathname: "/watch-status",
      params: { animeId: anime.id, title: getTitle(anime) },
    });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`In your watchlist as ${WATCH_STATUS_LABELS[watchStatus]}. Change status`}
      onPress={handleEdit}
      style={({ pressed }) => [styles.saved, pressed && styles.pressed]}
    >
      <Icon name="bookmark_added" size={20} color={watchStatusColors[watchStatus]} />
      <Text style={styles.savedLabel}>{WATCH_STATUS_LABELS[watchStatus]}</Text>
      <Icon name="chevron_right" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loading: {
    minHeight: 48,
  },
  saved: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  savedLabel: {
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
});
