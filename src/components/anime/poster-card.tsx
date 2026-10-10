import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { colors, fontSize, fontWeight, POSTER_ASPECT_RATIO, radius, spacing } from "@/theme";
import type { AnimeListItem } from "@/types/anime";
import { formatScore, getShortMeta, getTitle } from "@/utils/anime";

interface PosterCardProps {
  anime: AnimeListItem;
  /** Fixed width for horizontal shelves; grids let the card fill its column. */
  width?: number;
}

export function PosterCard({ anime, width }: PosterCardProps) {
  const title = getTitle(anime);
  const handlePress = () => router.push(`/anime/${anime.id}`);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={handlePress}
      style={({ pressed }) => [styles.card, width !== undefined && { width }, pressed && styles.pressed]}
    >
      <View>
        <Image source={anime.coverImage} style={styles.poster} contentFit="cover" transition={150} />
        {anime.averageScore !== null && (
          <View style={styles.score}>
            <Icon name="star" size={12} color={colors.score} />
            <Text style={styles.scoreText}>{formatScore(anime.averageScore)}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.meta} numberOfLines={1}>
        {getShortMeta(anime)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.7,
  },
  poster: {
    width: "100%",
    aspectRatio: POSTER_ASPECT_RATIO,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
  },
  score: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
    backgroundColor: colors.scrim,
  },
  scoreText: {
    color: colors.text,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  meta: {
    color: colors.textSubtle,
    fontSize: fontSize.xs,
  },
});
