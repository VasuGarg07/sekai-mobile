import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { RefreshControl, View } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

import type { ShelfVariant } from "@/components/anime/anime-shelf";
import { UpdateBanner } from "@/components/update-banner";
import type { RankedListKind } from "@/constants";
import { useRefresh } from "@/hooks/use-refresh";
import { useTabBarSpace } from "@/hooks/use-tab-bar-space";
import { useTheme } from "@/providers/theme-provider";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

import { HomeHeader } from "./components/home-header";
import { RankedShelf } from "./components/ranked-shelf";
import { SPOTLIGHT_HEIGHT, SpotlightCarousel } from "./components/spotlight-carousel";

const SHELVES: { kind: RankedListKind; variant: ShelfVariant }[] = [
  { kind: "top-airing", variant: "ranked" },
  { kind: "recents", variant: "wide" },
  { kind: "popular", variant: "poster" },
  { kind: "favourite", variant: "poster" },
  { kind: "completed", variant: "poster" },
];

export function HomeScreen() {
  const { colors } = useTheme();
  const styles = useStyles();
  const queryClient = useQueryClient();
  const bottomSpace = useTabBarSpace();
  const scrollY = useSharedValue(0);

  const refetchAnime = useCallback(
    () => queryClient.refetchQueries({ queryKey: ["anime"], type: "active" }),
    [queryClient],
  );
  const { refreshing, onRefresh } = useRefresh(refetchAnime);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={styles.screen}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ ...styles.content, paddingBottom: bottomSpace }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.accent]}
            progressBackgroundColor={colors.surfaceRaised}
            progressViewOffset={spacing.xxxl}
          />
        }
      >
        <SpotlightCarousel />
        <View style={styles.banner}>
          <UpdateBanner />
        </View>
        {SHELVES.map(({ kind, variant }) => (
          <RankedShelf key={kind} kind={kind} variant={variant} />
        ))}
      </Animated.ScrollView>
      <HomeHeader scrollY={scrollY} solidAt={SPOTLIGHT_HEIGHT - spacing.xxxl * 2} />
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.xl,
  },
  banner: {
    paddingHorizontal: spacing.lg,
  },
}));
