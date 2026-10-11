import { Pressable, ScrollView, View } from "react-native";

import { GenreIcon } from "@/components/icons/genre-icon";
import { AppText } from "@/components/ui/app-text";
import { ErrorState } from "@/components/ui/screen-state";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useGenres } from "@/hooks/use-anime";
import { useTabBarSpace } from "@/hooks/use-tab-bar-space";
import { router } from "@/navigation/router";
import { useTheme } from "@/providers/theme-provider";
import { contrastText, iconSize, radius, spacing, withAlpha } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import { getGenreTint } from "@/utils/genres";

const TILE_HEIGHT = 72;
const PLACEHOLDERS = Array.from({ length: 12 }, (_, id) => id);

export function GenreList() {
  const styles = useStyles();
  const bottomSpace = useTabBarSpace();
  const { data, isPending, isError, error, refetch } = useGenres();

  if (isError) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <ScrollView
      contentContainerStyle={{ ...styles.content, paddingBottom: bottomSpace }}
      keyboardShouldPersistTaps="handled"
    >
      <SectionHeader title="Browse genres" icon="category" inset={false} />
      <View style={styles.grid}>
        {isPending
          ? PLACEHOLDERS.map((id) => (
              <View key={id} style={styles.cell}>
                <Skeleton height={TILE_HEIGHT} rounded={radius.lg} />
              </View>
            ))
          : data.map((genre, index) => <GenreTile key={genre} genre={genre} index={index} />)}
      </View>
    </ScrollView>
  );
}

interface GenreTileProps {
  genre: string;
  index: number;
}

function GenreTile({ genre, index }: GenreTileProps) {
  const { tints } = useTheme();
  const styles = useStyles();
  const color = tints[getGenreTint(index)];

  return (
    <View style={styles.cell}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Browse ${genre}`}
        onPress={() => router.openGenre(genre)}
        style={({ pressed }) => [
          styles.tile,
          { backgroundColor: withAlpha(color, 0.16), borderColor: withAlpha(color, 0.35) },
          pressed && styles.pressed,
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: color }]}>
          <GenreIcon genre={genre} size={iconSize.md} color={contrastText(color)} />
        </View>
        <AppText variant="bodyStrong" numberOfLines={1} style={styles.label}>
          {genre}
        </AppText>
      </Pressable>
    </View>
  );
}

const useStyles = createStyles(() => ({
  content: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -spacing.xs,
  },
  cell: {
    width: "50%",
    padding: spacing.xs,
  },
  tile: {
    height: TILE_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
  },
}));
