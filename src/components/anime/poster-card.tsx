import { Pressable, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Badge } from "@/components/ui/badge";
import { RemoteImage } from "@/components/ui/remote-image";
import { prefetchAnimeDetail } from "@/hooks/use-anime";
import { router } from "@/navigation/router";
import { useTheme } from "@/providers/theme-provider";
import { POSTER_ASPECT_RATIO, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { AnimeListItem } from "@/types/anime";
import { formatScore, getShortMeta, getTitle } from "@/utils/anime";

interface PosterCardProps {
  anime: AnimeListItem;
  width?: number;
}

export function PosterCard({ anime, width }: PosterCardProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const title = getTitle(anime);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPressIn={() => prefetchAnimeDetail(anime.id)}
      onPress={() => router.openAnime(anime.id)}
      style={({ pressed }) => [styles.card, width !== undefined && { width }, pressed && styles.pressed]}
    >
      <View>
        <RemoteImage
          uri={anime.coverImage}
          style={styles.poster}
          fadeMs={150}
        />
        {anime.averageScore !== null && (
          <View style={styles.badge}>
            <Badge
              variant="glass"
              icon="star"
              iconColor={colors.score}
              label={formatScore(anime.averageScore)}
            />
          </View>
        )}
      </View>
      <AppText variant="label" numberOfLines={1}>
        {title}
      </AppText>
      <AppText variant="caption" tone="subtle" numberOfLines={1}>
        {getShortMeta(anime)}
      </AppText>
    </Pressable>
  );
}

const useStyles = createStyles(({ colors }) => ({
  card: {
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  poster: {
    width: "100%",
    aspectRatio: POSTER_ASPECT_RATIO,
    borderRadius: radius.md,
    backgroundColor: colors.skeleton,
  },
  badge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
  },
}));
