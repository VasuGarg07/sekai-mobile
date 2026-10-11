import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { InfiniteAnimeGrid } from "@/components/anime/infinite-anime-grid";
import { StackHeader } from "@/components/ui/page-header";
import { RANKED_LISTS, type RankedListKind } from "@/constants";
import { useAnimeList } from "@/hooks/use-anime";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

interface RankedListScreenProps {
  kind: RankedListKind;
}

export function RankedListScreen({ kind }: RankedListScreenProps) {
  const styles = useStyles();
  const { bottom } = useSafeAreaInsets();
  const { title, sort, status } = RANKED_LISTS[kind];
  const query = useAnimeList(sort, status, undefined, { seedFromShelf: true });

  return (
    <View style={styles.screen}>
      <StackHeader title={title} />
      <InfiniteAnimeGrid
        query={query}
        emptyMessage="No anime in this list right now."
        bottomInset={bottom + spacing.xl}
      />
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
}));
