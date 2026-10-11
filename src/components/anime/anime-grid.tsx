import { FlashList } from "@shopify/flash-list";
import type { ReactElement } from "react";
import { ActivityIndicator, RefreshControl, View } from "react-native";

import { PosterCard } from "@/components/anime/poster-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/providers/theme-provider";
import { POSTER_ASPECT_RATIO, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { AnimeListItem } from "@/types/anime";

const COLUMNS = 3;
// Renders about a screen and a half beyond the viewport, so fast flings don't outrun the rows.
const DRAW_DISTANCE = 800;
// Starts the next page two screens before the end, so the list never reaches blank space.
const END_REACHED_THRESHOLD = 2;
const PLACEHOLDERS = Array.from({ length: 12 }, (_, id) => id);

const keyExtractor = (item: AnimeListItem) => String(item.id);

interface AnimeGridProps {
  items: AnimeListItem[];
  refreshing: boolean;
  onRefresh: () => void;
  onEndReached?: () => void;
  loadingMore?: boolean;
  header?: ReactElement;
  empty?: ReactElement;
  bottomInset?: number;
}

export function AnimeGrid({
  items,
  refreshing,
  onRefresh,
  onEndReached,
  loadingMore = false,
  header,
  empty,
  bottomInset = spacing.xl,
}: AnimeGridProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <FlashList
      data={items}
      numColumns={COLUMNS}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => (
        <View style={styles.cell}>
          <PosterCard anime={item} />
        </View>
      )}
      drawDistance={DRAW_DISTANCE}
      onEndReached={onEndReached}
      onEndReachedThreshold={END_REACHED_THRESHOLD}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.accent]}
          progressBackgroundColor={colors.surfaceRaised}
        />
      }
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.accent} style={styles.footer} /> : null}
      contentContainerStyle={{ ...styles.content, paddingBottom: bottomInset }}
      keyboardShouldPersistTaps="handled"
    />
  );
}

export function AnimeGridPlaceholder() {
  const styles = useStyles();
  return (
    <View style={styles.placeholder}>
      {PLACEHOLDERS.map((id) => (
        <View key={id} style={styles.placeholderCell}>
          <Skeleton aspectRatio={POSTER_ASPECT_RATIO} />
          <Skeleton height={12} width="80%" />
        </View>
      ))}
    </View>
  );
}

const useStyles = createStyles(() => ({
  content: {
    paddingHorizontal: spacing.md,
  },
  cell: {
    flex: 1,
    padding: spacing.xs,
    paddingBottom: spacing.md,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
  placeholder: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.md,
  },
  placeholderCell: {
    width: `${100 / COLUMNS}%`,
    gap: spacing.sm,
    padding: spacing.xs,
    paddingBottom: spacing.md,
  },
}));
