import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fontSize, fontWeight, POSTER_ASPECT_RATIO, radius, spacing, watchStatusColors } from "@/theme";
import type { WatchlistItem } from "@/types/watchlist";
import { getShortMeta, getTitle, WATCH_STATUS_LABELS } from "@/utils/anime";
import { confirmTap } from "@/utils/feedback";

const COVER_WIDTH = 56;

interface WatchlistRowProps {
  item: WatchlistItem;
}

export function WatchlistRow({ item }: WatchlistRowProps) {
  const title = getTitle(item);

  const handleOpen = () => router.push(`/anime/${item.id}`);
  const handleChangeStatus = () => {
    confirmTap();
    router.push({ pathname: "/watch-status", params: { animeId: item.id, title } });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${WATCH_STATUS_LABELS[item.watchStatus]}`}
      accessibilityHint="Long press to change the watch status"
      onPress={handleOpen}
      onLongPress={handleChangeStatus}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Image source={item.coverImage} style={styles.cover} contentFit="cover" />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {getShortMeta(item)}
        </Text>
        <View style={styles.status}>
          <View style={[styles.dot, { backgroundColor: watchStatusColors[item.watchStatus] }]} />
          <Text style={styles.statusLabel}>{WATCH_STATUS_LABELS[item.watchStatus]}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  pressed: {
    backgroundColor: colors.surface,
  },
  cover: {
    width: COVER_WIDTH,
    aspectRatio: POSTER_ASPECT_RATIO,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  meta: {
    color: colors.textSubtle,
    fontSize: fontSize.sm,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  statusLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
