import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from "react-native-reanimated";

import { AppText } from "@/components/ui/app-text";
import { useTheme } from "@/providers/theme-provider";
import { POSTER_ASPECT_RATIO, radius, spacing, withAlpha } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { AnimeDetail } from "@/types/anime";
import { getTitle } from "@/utils/anime";

export const BANNER_HEIGHT = 300;
const COVER_WIDTH = 116;

interface DetailHeroProps {
  anime: AnimeDetail;
  scrollY: SharedValue<number>;
}

export function DetailHero({ anime, scrollY }: DetailHeroProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const title = getTitle(anime);
  const showRomaji = anime.titleRomaji !== null && anime.titleRomaji !== title;

  // Drifts slower than the content while scrolling, and stretches when pulled down.
  const bannerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [-BANNER_HEIGHT, 0, BANNER_HEIGHT], [-BANNER_HEIGHT / 2, 0, BANNER_HEIGHT * 0.5]) },
      { scale: interpolate(scrollY.value, [-BANNER_HEIGHT, 0], [2, 1], "clamp") },
    ],
  }));

  return (
    <View>
      <Animated.View style={[styles.banner, bannerStyle]}>
        <Image
          source={anime.bannerImage ?? anime.coverImageExtraLarge}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
        />
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.5)", colors.scrimTransparent, withAlpha(colors.background, 0.7), colors.background]}
          locations={[0, 0.35, 0.8, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <View style={styles.identity}>
        <Image
          source={anime.coverImageExtraLarge ?? anime.coverImage}
          style={styles.cover}
          contentFit="cover"
          transition={250}
        />
        <View style={styles.titles}>
          <AppText variant="display" style={styles.title}>
            {title}
          </AppText>
          {showRomaji && (
            <AppText variant="label" tone="muted" style={styles.romaji}>
              {anime.titleRomaji}
            </AppText>
          )}
        </View>
      </View>
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  banner: {
    height: BANNER_HEIGHT,
    backgroundColor: colors.skeleton,
  },
  identity: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.lg,
    marginTop: -spacing.xxxl * 2,
    paddingHorizontal: spacing.lg,
  },
  cover: {
    width: COVER_WIDTH,
    aspectRatio: POSTER_ASPECT_RATIO,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.background,
    backgroundColor: colors.skeleton,
  },
  titles: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  romaji: {
    fontStyle: "italic",
  },
}));
