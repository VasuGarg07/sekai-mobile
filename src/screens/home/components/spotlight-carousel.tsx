import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View, useWindowDimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

import { QuickWatchlistButton } from "@/components/anime/quick-watchlist-button";
import { AppText } from "@/components/ui/app-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RemoteImage } from "@/components/ui/remote-image";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpotlight } from "@/hooks/use-anime";
import { router } from "@/navigation/router";
import { useIsFocused } from "@/navigation/use-is-focused";
import { useTheme } from "@/providers/theme-provider";
import { radius, spacing, withAlpha } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { AnimeSpotlight } from "@/types/anime";
import { formatEnum, formatScore, getTitle } from "@/utils/anime";

export const SPOTLIGHT_HEIGHT = 480;
const BANNER_HEIGHT = 330;
const AUTO_ADVANCE_MS = 6_000;
const PARALLAX = 0.35;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<AnimeSpotlight>);

export function SpotlightCarousel() {
  const { width } = useWindowDimensions();
  const styles = useStyles();
  const { data, isPending, isError } = useSpotlight();
  const listRef = useRef<FlatList<AnimeSpotlight>>(null);
  const scrollX = useSharedValue(0);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const focused = useIsFocused();
  const count = data?.length ?? 0;

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const goTo = useCallback(
    (next: number) => {
      listRef.current?.scrollToOffset({ offset: next * width, animated: true });
      setIndex(next);
    },
    [width],
  );

  useEffect(() => {
    if (paused || !focused || count < 2) return;
    const timer = setTimeout(() => goTo((index + 1) % count), AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [index, count, paused, focused, goTo]);

  if (isPending || isError || count === 0) {
    return (
      <View style={[styles.placeholder, { width }]}>
        {isPending && <Skeleton height={SPOTLIGHT_HEIGHT} rounded={0} />}
      </View>
    );
  }

  return (
    <View>
      <AnimatedFlatList
        ref={listRef}
        horizontal
        pagingEnabled
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index: slideIndex }) => (
          <Slide anime={item} rank={slideIndex + 1} index={slideIndex} width={width} scrollX={scrollX} />
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => setPaused(true)}
        onMomentumScrollEnd={(event) => {
          setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
          setPaused(false);
        }}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.dots}>
        {data.map((anime, dotIndex) => (
          <Dot key={anime.id} index={dotIndex} width={width} scrollX={scrollX} />
        ))}
      </View>
    </View>
  );
}

interface SlideProps {
  anime: AnimeSpotlight;
  rank: number;
  index: number;
  width: number;
  scrollX: SharedValue<number>;
}

function Slide({ anime, rank, index, width, scrollX }: SlideProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const title = getTitle(anime);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (scrollX.value - index * width) * PARALLAX }],
  }));

  return (
    <View style={[styles.slide, { width }]}>
      <View style={styles.banner}>
        <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
          <RemoteImage
            uri={anime.bannerImage ?? anime.coverImage}
            style={StyleSheet.absoluteFill}
            fadeMs={300}
          />
        </Animated.View>
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.55)", "rgba(0, 0, 0, 0)"]}
          style={styles.topShade}
        />
        <LinearGradient
          colors={[colors.scrimTransparent, withAlpha(colors.background, 0.85), colors.background]}
          locations={[0.45, 0.8, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={styles.caption}>
        <View style={styles.badges}>
          <Badge variant="accent" icon="auto_awesome" iconColor={colors.accentText} label={`#${rank} Now`} />
          {anime.averageScore !== null && (
            <Badge icon="star" iconColor={colors.score} label={formatScore(anime.averageScore)} />
          )}
          {anime.format && <Badge icon="tv" label={formatEnum(anime.format)} />}
          {anime.episodes !== null && <Badge icon="movie" label={`${anime.episodes} eps`} />}
        </View>
        <AppText variant="display" numberOfLines={2}>
          {title}
        </AppText>
        {anime.genres.length > 0 && (
          <AppText variant="label" tone="muted" numberOfLines={1}>
            {anime.genres.slice(0, 4).join("  •  ")}
          </AppText>
        )}
        <View style={styles.actions}>
          <Button icon="info" title="Details" onPress={() => router.openAnime(anime.id)} />
          <QuickWatchlistButton anime={anime} />
        </View>
      </View>
    </View>
  );
}

const DOT_SIZE = 6;
const ACTIVE_DOT_WIDTH = 22;

interface DotProps {
  index: number;
  width: number;
  scrollX: SharedValue<number>;
}

function Dot({ index, width, scrollX }: DotProps) {
  const styles = useStyles();

  const dotStyle = useAnimatedStyle(() => {
    const distance = Math.abs(scrollX.value / width - index);
    const closeness = Math.max(0, 1 - distance);
    return {
      width: interpolate(closeness, [0, 1], [DOT_SIZE, ACTIVE_DOT_WIDTH]),
      opacity: interpolate(closeness, [0, 1], [0.35, 1]),
    };
  });

  return <Animated.View style={[styles.dot, dotStyle]} />;
}

const useStyles = createStyles(({ colors }) => ({
  placeholder: {
    height: SPOTLIGHT_HEIGHT,
  },
  slide: {
    height: SPOTLIGHT_HEIGHT,
    justifyContent: "flex-end",
    overflow: "hidden",
    backgroundColor: colors.background,
  },
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: BANNER_HEIGHT,
    overflow: "hidden",
  },
  topShade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  caption: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  dot: {
    height: DOT_SIZE,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
}));
