import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

import { UpdateBanner } from "@/components/update-banner";
import type { RankedListKind } from "@/constants";
import { useRefresh } from "@/hooks/use-refresh";
import { colors, spacing } from "@/theme";

import { RankedShelf } from "./components/ranked-shelf";
import { SpotlightCarousel } from "./components/spotlight-carousel";

const SHELVES: RankedListKind[] = ["top-airing", "popular", "recents", "favourite", "completed"];

export function HomeScreen() {
  const queryClient = useQueryClient();
  const refetchAnime = useCallback(
    () => queryClient.refetchQueries({ queryKey: ["anime"], type: "active" }),
    [queryClient],
  );
  const { refreshing, onRefresh } = useRefresh(refetchAnime);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.accent]}
          progressBackgroundColor={colors.surfaceRaised}
        />
      }
    >
      <SpotlightCarousel />
      <View style={styles.banner}>
        <UpdateBanner />
      </View>
      {SHELVES.map((kind) => (
        <RankedShelf key={kind} kind={kind} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  banner: {
    paddingHorizontal: spacing.lg,
  },
});
