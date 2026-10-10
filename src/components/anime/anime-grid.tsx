import { FlashList } from "@shopify/flash-list";
import type { ReactElement } from "react";
import { ActivityIndicator, RefreshControl, StyleSheet, View } from "react-native";

import { PosterCard } from "@/components/anime/poster-card";
import { colors, spacing } from "@/theme";
import type { AnimeListItem } from "@/types/anime";

const COLUMNS = 3;

interface AnimeGridProps {
  items: AnimeListItem[];
  refreshing: boolean;
  onRefresh: () => void;
  onEndReached?: () => void;
  loadingMore?: boolean;
  header?: ReactElement;
  empty?: ReactElement;
}

export function AnimeGrid({
  items,
  refreshing,
  onRefresh,
  onEndReached,
  loadingMore = false,
  header,
  empty,
}: AnimeGridProps) {
  return (
    <FlashList
      data={items}
      numColumns={COLUMNS}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.cell}>
          <PosterCard anime={item} />
        </View>
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
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
      ListFooterComponent={loadingMore ? <LoadingMore /> : null}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    />
  );
}

function LoadingMore() {
  return (
    <View style={styles.footer}>
      <ActivityIndicator color={colors.textMuted} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  cell: {
    flex: 1,
    padding: spacing.xs,
    paddingBottom: spacing.md,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
