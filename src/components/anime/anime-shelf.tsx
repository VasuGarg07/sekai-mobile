import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { PosterCard } from "@/components/anime/poster-card";
import { Icon } from "@/components/ui/icon";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import type { AnimeListItem } from "@/types/anime";

const CARD_WIDTH = 124;

interface AnimeShelfProps {
  title: string;
  items: AnimeListItem[];
  loading?: boolean;
  error?: boolean;
  onSeeAll?: () => void;
  onRetry?: () => void;
}

export function AnimeShelf({ title, items, loading = false, error = false, onSeeAll, onRetry }: AnimeShelfProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onSeeAll && (
          <Pressable accessibilityRole="button" onPress={onSeeAll} hitSlop={8} style={styles.seeAll}>
            <Text style={styles.seeAllText}>See all</Text>
            <Icon name="chevron_right" size={18} color={colors.accent} />
          </Pressable>
        )}
      </View>
      <ShelfBody items={items} loading={loading} error={error} onRetry={onRetry} />
    </View>
  );
}

type ShelfBodyProps = Pick<AnimeShelfProps, "items" | "loading" | "error" | "onRetry">;

function ShelfBody({ items, loading, error, onRetry }: ShelfBodyProps) {
  if (loading) {
    return (
      <View style={styles.placeholder}>
        <ActivityIndicator color={colors.textMuted} />
      </View>
    );
  }

  if (error) {
    return (
      <Pressable accessibilityRole="button" onPress={onRetry} style={styles.placeholder}>
        <Text style={styles.errorText}>Couldn&apos;t load. Tap to retry.</Text>
      </Pressable>
    );
  }

  return (
    <FlashList
      horizontal
      data={items}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <PosterCard anime={item} width={CARD_WIDTH} />}
      ItemSeparatorComponent={Separator}
      contentContainerStyle={styles.list}
      showsHorizontalScrollIndicator={false}
    />
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  seeAll: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    color: colors.accent,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  list: {
    paddingHorizontal: spacing.lg,
  },
  separator: {
    width: spacing.md,
  },
  placeholder: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
});
