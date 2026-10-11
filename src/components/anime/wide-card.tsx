import { Pressable, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { AppText } from "@/components/ui/app-text";
import { RemoteImage } from "@/components/ui/remote-image";
import { prefetchAnimeDetail } from "@/hooks/use-anime";
import { router } from "@/navigation/router";
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
      onPress={() => router.openAnime(anime.id)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <RemoteImage
        uri={anime.bannerImage ?? anime.coverImage}
        style={StyleSheet.absoluteFill}
        fadeMs={150}
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
