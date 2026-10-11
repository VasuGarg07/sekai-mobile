import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { IconButton } from "@/components/ui/icon-button";
import { prefetchAnimeDetail } from "@/hooks/use-anime";
import { POSTER_ASPECT_RATIO, getTextHeight, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { WatchlistItem } from "@/types/watchlist";
import { getShortMeta, getTitle, WATCH_STATUS_LABELS } from "@/utils/anime";
import { confirmTap } from "@/utils/feedback";

import { StatusPill } from "./status-pill";

const COVER_WIDTH = 64;

interface WatchlistItemProps {
  item: WatchlistItem;
}

function openStatusSheet(item: WatchlistItem) {
  confirmTap();
  router.push({ pathname: "/watch-status", params: { animeId: item.id, title: getTitle(item) } });
}

export function WatchlistRow({ item }: WatchlistItemProps) {
  const styles = useStyles();
  const title = getTitle(item);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${WATCH_STATUS_LABELS[item.watchStatus]}`}
      accessibilityHint="Long press to change the status"
      onPressIn={() => prefetchAnimeDetail(item.id)}
      onPress={() => router.push(`/anime/${item.id}`)}
      onLongPress={() => openStatusSheet(item)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Image
        source={item.coverImage}
        recyclingKey={String(item.id)}
        style={styles.cover}
        contentFit="cover"
        transition={150}
      />
      <View style={styles.body}>
        <AppText variant="bodyStrong" numberOfLines={2} style={styles.rowTitle}>
          {title}
        </AppText>
        <AppText variant="caption" tone="subtle" numberOfLines={1}>
          {getShortMeta(item)}
        </AppText>
        <StatusPill status={item.watchStatus} />
      </View>
      <IconButton
        icon="more_vert"
        accessibilityLabel={`Change status of ${title}`}
        onPress={() => openStatusSheet(item)}
      />
    </Pressable>
  );
}

export function WatchlistGridCard({ item }: WatchlistItemProps) {
  const styles = useStyles();
  const title = getTitle(item);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${WATCH_STATUS_LABELS[item.watchStatus]}`}
      accessibilityHint="Long press to change the status"
      onPressIn={() => prefetchAnimeDetail(item.id)}
      onPress={() => router.push(`/anime/${item.id}`)}
      onLongPress={() => openStatusSheet(item)}
      style={({ pressed }) => [styles.gridCard, pressed && styles.pressed]}
    >
      <Image
        source={item.coverImage}
        recyclingKey={String(item.id)}
        style={styles.gridCover}
        contentFit="cover"
        transition={150}
      />
      <AppText variant="label" numberOfLines={2} style={styles.gridTitle}>
        {title}
      </AppText>
      <StatusPill status={item.watchStatus} />
    </Pressable>
  );
}

const useStyles = createStyles(({ colors }) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.75,
  },
  cover: {
    width: COVER_WIDTH,
    aspectRatio: POSTER_ASPECT_RATIO,
    borderRadius: radius.sm,
    backgroundColor: colors.skeleton,
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  rowTitle: {
    minHeight: getTextHeight("bodyStrong", 2),
  },
  gridTitle: {
    minHeight: getTextHeight("label", 2),
  },
  gridCard: {
    flex: 1,
    gap: spacing.xs,
    padding: spacing.xs,
    paddingBottom: spacing.md,
  },
  gridCover: {
    width: "100%",
    aspectRatio: POSTER_ASPECT_RATIO,
    borderRadius: radius.md,
    backgroundColor: colors.skeleton,
  },
}));
