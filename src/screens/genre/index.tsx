import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { InfiniteAnimeGrid } from "@/components/anime/infinite-anime-grid";
import { Chip } from "@/components/ui/chip";
import type { IconName } from "@/components/ui/icon";
import { StackHeader } from "@/components/ui/page-header";
import { MessageState } from "@/components/ui/screen-state";
import { useAnimeSearch } from "@/hooks/use-anime";
import { useAdultMode } from "@/hooks/use-preferences";
import { router } from "@/navigation/router";
import { useAuth } from "@/providers/auth-provider";
import { isAdultGenre } from "@/services/anilist/anime";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

const SORTS: { key: string; label: string; icon: IconName }[] = [
  { key: "POPULARITY_DESC", label: "Popular", icon: "trending_up" },
  { key: "SCORE_DESC", label: "Top rated", icon: "star" },
  { key: "TRENDING_DESC", label: "Trending", icon: "local_fire_department" },
  { key: "START_DATE_DESC", label: "Newest", icon: "new_releases" },
];

interface GenreScreenProps {
  genre: string;
}

export function GenreScreen({ genre }: GenreScreenProps) {
  const styles = useStyles();
  const { user } = useAuth();
  const adultMode = useAdultMode();
  const locked = isAdultGenre(genre) && !adultMode;

  return (
    <View style={styles.screen}>
      <StackHeader title={genre} />
      {locked ? (
        <MessageState
          icon="lock"
          title="This genre is 18+"
          message={
            user
              ? "Turn on 18+ Mode in your profile to browse it."
              : "Sign in and turn on 18+ Mode to browse it."
          }
          actionTitle={user ? "Open profile" : "Sign in"}
          actionIcon={user ? "settings" : "login"}
          onAction={() => (user ? router.showTab("Profile") : router.openLogin())}
        />
      ) : (
        <GenreResults genre={genre} />
      )}
    </View>
  );
}

function GenreResults({ genre }: GenreScreenProps) {
  const styles = useStyles();
  const { bottom } = useSafeAreaInsets();
  const [sort, setSort] = useState(SORTS[0].key);
  const query = useAnimeSearch({ genreIn: [genre], sort: [sort] });

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sortBar}
        contentContainerStyle={styles.sorts}
      >
        {SORTS.map((option) => (
          <Chip
            key={option.key}
            label={option.label}
            icon={option.icon}
            selected={option.key === sort}
            onPress={() => setSort(option.key)}
          />
        ))}
      </ScrollView>
      <InfiniteAnimeGrid
        query={query}
        emptyMessage={`No ${genre} anime found.`}
        bottomInset={bottom + spacing.xl}
      />
    </>
  );
}

const useStyles = createStyles(({ colors }) => ({
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
}));
