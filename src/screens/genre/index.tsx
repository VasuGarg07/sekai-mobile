import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { InfiniteAnimeGrid } from "@/components/anime/infinite-anime-grid";
import { Chip } from "@/components/ui/chip";
import { MessageState } from "@/components/ui/screen-state";
import { ScreenHeader } from "@/components/ui/screen-header";
import { useAnimeSearch } from "@/hooks/use-anime";
import { useAdultMode } from "@/hooks/use-preferences";
import { isAdultGenre } from "@/services/anilist/anime";
import { colors, spacing } from "@/theme";

const SORTS = [
  { key: "POPULARITY_DESC", label: "Popular" },
  { key: "SCORE_DESC", label: "Top rated" },
  { key: "TRENDING_DESC", label: "Trending" },
  { key: "START_DATE_DESC", label: "Newest" },
];

interface GenreScreenProps {
  genre: string;
}

export function GenreScreen({ genre }: GenreScreenProps) {
  const adultMode = useAdultMode();

  return (
    <View style={styles.screen}>
      <ScreenHeader title={genre} />
      {isAdultGenre(genre) && !adultMode ? (
        <MessageState
          title="This genre is 18+"
          message="Sign in and turn on 18+ Mode in your profile to browse it."
        />
      ) : (
        <GenreResults genre={genre} />
      )}
    </View>
  );
}

function GenreResults({ genre }: GenreScreenProps) {
  const [sort, setSort] = useState(SORTS[0].key);
  const query = useAnimeSearch({ genreIn: [genre], sort: [sort] });

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sorts}
        style={styles.sortBar}
      >
        {SORTS.map((option) => (
          <Chip
            key={option.key}
            label={option.label}
            selected={option.key === sort}
            onPress={() => setSort(option.key)}
          />
        ))}
      </ScrollView>
      <InfiniteAnimeGrid query={query} emptyMessage={`No ${genre} anime found.`} />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sortBar: {
    flexGrow: 0,
  },
  sorts: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
});
