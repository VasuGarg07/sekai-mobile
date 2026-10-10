import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { POSTER_ASPECT_RATIO, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { AnimeListItem } from "@/types/anime";
import { getTitle } from "@/utils/anime";

export const RANKED_CARD_WIDTH = 168;
const COVER_WIDTH = 112;

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
    flexDirection: "row",
    alignItems: "flex-end",
  },
  rank: {
    fontSize: 96,
    fontWeight: "800",
    lineHeight: 96,
    marginRight: -spacing.lg,
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
    marginLeft: RANKED_CARD_WIDTH - COVER_WIDTH,
  },
}));
