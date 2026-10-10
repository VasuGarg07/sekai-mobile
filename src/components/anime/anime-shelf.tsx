import { FlashList } from "@shopify/flash-list";
import { Pressable, View } from "react-native";

import { PosterCard } from "@/components/anime/poster-card";
import { RANKED_CARD_WIDTH, RankedCard } from "@/components/anime/ranked-card";
import { WIDE_CARD_WIDTH, WideCard } from "@/components/anime/wide-card";
import { AppText } from "@/components/ui/app-text";
import { Icon, type IconName } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/providers/theme-provider";
import { BANNER_ASPECT_RATIO, iconSize, POSTER_ASPECT_RATIO, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { AnimeListItem } from "@/types/anime";

export type ShelfVariant = "poster" | "ranked" | "wide";

const POSTER_WIDTH = 124;
const PLACEHOLDERS = [0, 1, 2, 3];

const CARD_WIDTHS: Record<ShelfVariant, number> = {
  poster: POSTER_WIDTH,
  ranked: RANKED_CARD_WIDTH,
  wide: WIDE_CARD_WIDTH,
};

interface AnimeShelfProps {
  title: string;
  icon?: IconName;
  items: AnimeListItem[];
  variant?: ShelfVariant;
  loading?: boolean;
  error?: boolean;
  onSeeAll?: () => void;
  onRetry?: () => void;
}

export function AnimeShelf({
  title,
  icon,
  items,
  variant = "poster",
  loading = false,
  error = false,
  onSeeAll,
  onRetry,
}: AnimeShelfProps) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <SectionHeader title={title} icon={icon} onAction={onSeeAll} />
      {loading && <ShelfPlaceholder variant={variant} />}
      {!loading && error && <ShelfError onRetry={onRetry} />}
      {!loading && !error && (
        <FlashList
          horizontal
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => {
            if (variant === "ranked") return <RankedCard anime={item} rank={index + 1} />;
            if (variant === "wide") return <WideCard anime={item} />;
            return <PosterCard anime={item} width={POSTER_WIDTH} />;
          }}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={styles.list}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
}

function ShelfPlaceholder({ variant }: { variant: ShelfVariant }) {
  const styles = useStyles();
  const aspectRatio = variant === "wide" ? BANNER_ASPECT_RATIO : POSTER_ASPECT_RATIO;
  return (
    <View style={styles.placeholderRow}>
      {PLACEHOLDERS.map((key) => (
        <Skeleton key={key} width={CARD_WIDTHS[variant]} aspectRatio={aspectRatio} />
      ))}
    </View>
  );
}

function ShelfError({ onRetry }: { onRetry?: () => void }) {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <Pressable accessibilityRole="button" onPress={onRetry} style={styles.error}>
      <Icon name="refresh" size={iconSize.md} color={colors.textMuted} />
      <AppText tone="muted">Couldn&apos;t load. Tap to retry.</AppText>
    </Pressable>
  );
}

function Separator() {
  const styles = useStyles();
  return <View style={styles.separator} />;
}

const useStyles = createStyles(({ colors }) => ({
  container: {
    gap: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
  },
  separator: {
    width: spacing.md,
  },
  placeholderRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    overflow: "hidden",
  },
  error: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
}));
