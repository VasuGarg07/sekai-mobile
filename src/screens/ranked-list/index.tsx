import { StyleSheet, View } from "react-native";

import { InfiniteAnimeGrid } from "@/components/anime/infinite-anime-grid";
import { ScreenHeader } from "@/components/ui/screen-header";
import { RANKED_LISTS, type RankedListKind } from "@/constants";
import { useAnimeList } from "@/hooks/use-anime";
import { colors } from "@/theme";

interface RankedListScreenProps {
  kind: RankedListKind;
}

export function RankedListScreen({ kind }: RankedListScreenProps) {
  const { title, sort, status } = RANKED_LISTS[kind];
  const query = useAnimeList(sort, status);

  return (
    <View style={styles.screen}>
      <ScreenHeader title={title} />
      <InfiniteAnimeGrid query={query} emptyMessage="No anime in this list right now." />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
