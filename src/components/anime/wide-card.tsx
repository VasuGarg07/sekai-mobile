import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { prefetchAnimeDetail } from "@/hooks/use-anime";
import { BANNER_ASPECT_RATIO, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { AnimeListItem } from "@/types/anime";
import { getTitle } from "@/utils/anime";

export const WIDE_CARD_WIDTH = 280;

interface WideCardProps {
  anime: AnimeListItem;
}

export function WideCard({ anime }: WideCardProps) {
  const styles = useStyles();
  const title = getTitle(anime);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPressIn={() => prefetchAnimeDetail(anime.id)}
      onPress={() => router.push(`/anime/${anime.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image
        source={anime.bannerImage ?? anime.coverImage}
        recyclingKey={String(anime.id)}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={150}
      />
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.85)"]}
        locations={[0.35, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.caption}>
        <AppText variant="subtitle" tone="onImage" numberOfLines={2}>
          {title}
        </AppText>
        {anime.genres.length > 0 && (
          <AppText variant="caption" tone="onImageMuted" numberOfLines={1}>
            {anime.genres.slice(0, 3).join(" • ")}
          </AppText>
        )}
      </View>
    </Pressable>
  );
}

const useStyles = createStyles(({ colors }) => ({
  card: {
    width: WIDE_CARD_WIDTH,
    aspectRatio: BANNER_ASPECT_RATIO,
    justifyContent: "flex-end",
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.skeleton,
  },
  pressed: {
    opacity: 0.8,
  },
  caption: {
    gap: spacing.xs,
    padding: spacing.md,
  },
}));
