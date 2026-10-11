import { Pressable, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddToWatchlist, useWatchStatus } from "@/hooks/use-watchlist";
import { router } from "@/navigation/router";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { AnimeListItem } from "@/types/anime";
import { getTitle, WATCH_STATUS_LABELS } from "@/utils/anime";
import { confirmTap, showMessage } from "@/utils/feedback";

interface WatchlistButtonProps {
  anime: AnimeListItem;
}

export function WatchlistButton({ anime }: WatchlistButtonProps) {
  const { user } = useAuth();
  const { colors, statusColors } = useTheme();
  const styles = useStyles();
  const watchStatus = useWatchStatus(anime.id);
  const addToWatchlist = useAddToWatchlist();

  if (!user) {
    return (
      <Button fullWidth icon="login" title="Sign in to save" variant="tonal" onPress={() => router.openLogin()} />
    );
  }

  if (watchStatus === undefined) return <Skeleton height={48} rounded={radius.full} />;

  if (watchStatus === null) {
    const handleAdd = async () => {
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
        fullWidth
        icon="bookmark_add"
        title="Add to My List"
        loading={addToWatchlist.isPending}
        onPress={handleAdd}
      />
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`In your list as ${WATCH_STATUS_LABELS[watchStatus]}. Change status`}
      onPress={() =>
        router.openWatchStatus(anime.id, getTitle(anime))
      }
      style={({ pressed }) => [styles.saved, pressed && styles.pressed]}
    >
      <View style={[styles.statusDot, { backgroundColor: statusColors[watchStatus] }]} />
      <AppText variant="bodyStrong" style={styles.label}>
        {WATCH_STATUS_LABELS[watchStatus]}
      </AppText>
      <Icon name="edit" size={iconSize.md} color={colors.textMuted} />
    </Pressable>
  );
}

const useStyles = createStyles(({ colors }) => ({
  saved: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceRaised,
  },
  pressed: {
    opacity: 0.7,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
  },
  label: {
    flex: 1,
  },
}));
