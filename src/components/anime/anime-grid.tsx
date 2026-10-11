import { FlashList, type FlashListRef } from "@shopify/flash-list";
import { useRef, type ReactElement } from "react";
import { ActivityIndicator, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PosterCard } from "@/components/anime/poster-card";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useScrollToTopVisibility } from "@/hooks/use-scroll-to-top-visibility";
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
  const { bottom } = useSafeAreaInsets();
  const listRef = useRef<FlashListRef<AnimeListItem>>(null);
  const { visible, scrollProps } = useScrollToTopVisibility();

  return (
    <View style={styles.fill}>
      <FlashList
        ref={listRef}
        {...scrollProps}
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
      <ScrollToTopButton
        visible={visible}
        bottomOffset={Math.max(bottomInset, bottom + spacing.lg)}
        onPress={() => listRef.current?.scrollToTop({ animated: true })}
      />
    </View>
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
  fill: {
    flex: 1,
  },
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
