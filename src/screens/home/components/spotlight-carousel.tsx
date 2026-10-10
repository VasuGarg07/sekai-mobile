import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

import { useSpotlight } from "@/hooks/use-anime";
import { colors, fontSize, fonts, radius, spacing } from "@/theme";
import type { AnimeSpotlight } from "@/types/anime";
import { getShortMeta, getTitle } from "@/utils/anime";

const HEIGHT = 440;

export function SpotlightCarousel() {
  const { width } = useWindowDimensions();
  const { data, isPending, isError } = useSpotlight();
  const [index, setIndex] = useState(0);

  if (isPending || isError) {
    return (
      <View style={[styles.placeholder, { width }]}>
        {isPending && <ActivityIndicator color={colors.textMuted} />}
      </View>
    );
  }

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  return (
    <View>
      <FlatList
        horizontal
        pagingEnabled
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <Slide anime={item} width={width} />}
        onMomentumScrollEnd={handleScrollEnd}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.dots}>
        {data.map((anime, dotIndex) => (
          <View key={anime.id} style={[styles.dot, dotIndex === index && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
}

interface SlideProps {
  anime: AnimeSpotlight;
  width: number;
}

function Slide({ anime, width }: SlideProps) {
  const title = getTitle(anime);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={() => router.push(`/anime/${anime.id}`)}
      style={[styles.slide, { width }]}
    >
      <Image
        source={anime.bannerImage ?? anime.coverImage}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
      />
      <LinearGradient
        colors={[colors.scrimTransparent, colors.scrim, colors.background]}
        locations={[0.25, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.caption}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.meta}>{getShortMeta(anime)}</Text>
        {anime.synopsis && (
          <Text style={styles.synopsis} numberOfLines={3}>
            {anime.synopsis}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    height: HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  slide: {
    height: HEIGHT,
    justifyContent: "flex-end",
  },
  caption: {
    gap: spacing.xs,
    padding: spacing.lg,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: fontSize.xxl,
  },
  meta: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  synopsis: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  activeDot: {
    width: 18,
    backgroundColor: colors.accent,
  },
});
