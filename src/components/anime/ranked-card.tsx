import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { POSTER_ASPECT_RATIO, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { AnimeListItem } from "@/types/anime";
import { getTitle } from "@/utils/anime";

const COVER_WIDTH = 112;
const RANK_SLOT_WIDTH = 56;
export const RANKED_CARD_WIDTH = RANK_SLOT_WIDTH + COVER_WIDTH;

interface RankedCardProps {
  anime: AnimeListItem;
  rank: number;
}

export function RankedCard({ anime, rank }: RankedCardProps) {
  const styles = useStyles();
  const title = getTitle(anime);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Number ${rank}: ${title}`}
      onPress={() => router.push(`/anime/${anime.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.artwork}>
        <Text style={styles.rank}>{rank}</Text>
        <Image source={anime.coverImage} style={styles.cover} contentFit="cover" transition={200} />
      </View>
      <AppText variant="label" numberOfLines={1} style={styles.title}>
        {title}
      </AppText>
    </Pressable>
  );
}

const useStyles = createStyles(({ colors }) => ({
  card: {
    width: RANKED_CARD_WIDTH,
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.75,
  },
  artwork: {
    marginLeft: RANK_SLOT_WIDTH,
  },
  // Absolutely placed so a wide rank like "10" overlaps the cover instead of widening the card.
  rank: {
    position: "absolute",
    left: -RANK_SLOT_WIDTH,
    bottom: 0,
    fontSize: 80,
    fontWeight: "800",
    lineHeight: 88,
    includeFontPadding: false,
    color: colors.surfaceRaised,
    textShadowColor: colors.accent,
    textShadowRadius: 6,
    zIndex: 1,
  },
  cover: {
    width: COVER_WIDTH,
    aspectRatio: POSTER_ASPECT_RATIO,
    borderRadius: radius.md,
    backgroundColor: colors.skeleton,
  },
  title: {
    marginLeft: RANK_SLOT_WIDTH,
  },
}));
