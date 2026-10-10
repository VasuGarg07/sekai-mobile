import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  useRemoveFromWatchlist,
  useUpdateWatchStatus,
  useWatchStatus,
} from "@/hooks/use-watchlist";
import { colors, fontSize, fontWeight, radius, spacing, watchStatusColors } from "@/theme";
import { WATCH_STATUSES, type WatchStatus } from "@/types/watchlist";
import { WATCH_STATUS_LABELS } from "@/utils/anime";
import { confirmTap, showMessage } from "@/utils/feedback";

interface WatchStatusSheetProps {
  animeId: number;
  title: string;
}

export function WatchStatusSheet({ animeId, title }: WatchStatusSheetProps) {
  const current = useWatchStatus(animeId);
  const updateStatus = useUpdateWatchStatus();
  const remove = useRemoveFromWatchlist();
  const busy = updateStatus.isPending || remove.isPending;

  const handleSelect = async (watchStatus: WatchStatus) => {
    if (watchStatus === current) {
      router.back();
      return;
    }
    const result = await updateStatus.mutateAsync({ animeId, watchStatus });
    if (result.success) {
      confirmTap();
      showMessage(`Moved to ${WATCH_STATUS_LABELS[watchStatus]}`);
      router.back();
    } else if (result.message) {
      showMessage(result.message);
    }
  };

  const handleRemove = async () => {
    const result = await remove.mutateAsync(animeId);
    if (result.success) {
      confirmTap();
      showMessage(`Removed ${title} from your watchlist`);
      router.back();
    } else if (result.message) {
      showMessage(result.message);
    }
  };

  return (
    <View style={styles.sheet}>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <View>
        {WATCH_STATUSES.map((watchStatus) => (
          <Pressable
            key={watchStatus}
            accessibilityRole="radio"
            accessibilityState={{ checked: watchStatus === current, disabled: busy }}
            disabled={busy}
            onPress={() => handleSelect(watchStatus)}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View style={[styles.dot, { backgroundColor: watchStatusColors[watchStatus] }]} />
            <Text style={styles.rowLabel}>{WATCH_STATUS_LABELS[watchStatus]}</Text>
            {watchStatus === current && <Icon name="check" size={20} color={colors.accent} />}
          </Pressable>
        ))}
      </View>
      <Button
        title="Remove from watchlist"
        variant="secondary"
        loading={remove.isPending}
        disabled={busy}
        onPress={handleRemove}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.surface,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  pressed: {
    opacity: 0.6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
  },
  rowLabel: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.base,
  },
});
