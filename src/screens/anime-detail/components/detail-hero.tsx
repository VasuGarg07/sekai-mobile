import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/ui/icon";
import { colors, fontSize, fonts, POSTER_ASPECT_RATIO, radius, spacing } from "@/theme";
import type { AnimeDetail } from "@/types/anime";
import { getTitle } from "@/utils/anime";

const BANNER_HEIGHT = 240;
const COVER_WIDTH = 110;

interface DetailHeroProps {
  anime: AnimeDetail;
}

export function DetailHero({ anime }: DetailHeroProps) {
  const { top } = useSafeAreaInsets();
  const title = getTitle(anime);
  const showRomaji = anime.titleRomaji !== null && anime.titleRomaji !== title;

  return (
    <View>
      <Image
        source={anime.bannerImage ?? anime.coverImageExtraLarge}
        style={styles.banner}
        contentFit="cover"
        transition={200}
      />
      <LinearGradient
        colors={[colors.scrimTransparent, colors.background]}
        style={styles.bannerFade}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => router.back()}
        hitSlop={8}
        style={[styles.back, { top: top + spacing.sm }]}
      >
        <Icon name="arrow_back" />
      </Pressable>

      <View style={styles.identity}>
        <Image
          source={anime.coverImageExtraLarge ?? anime.coverImage}
          style={styles.cover}
          contentFit="cover"
        />
        <View style={styles.titles}>
          <Text style={styles.title}>{title}</Text>
          {showRomaji && <Text style={styles.romaji}>{anime.titleRomaji}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: BANNER_HEIGHT,
    backgroundColor: colors.surfaceRaised,
  },
  bannerFade: {
    position: "absolute",
    left: 0,
    right: 0,
    top: BANNER_HEIGHT / 2,
    height: BANNER_HEIGHT / 2,
  },
  back: {
    position: "absolute",
    left: spacing.lg,
    padding: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.scrim,
  },
  identity: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.lg,
    marginTop: -spacing.xxl * 2,
    paddingHorizontal: spacing.lg,
  },
  cover: {
    width: COVER_WIDTH,
    aspectRatio: POSTER_ASPECT_RATIO,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
  },
  titles: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: fontSize.xxl,
  },
  romaji: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontStyle: "italic",
  },
});
