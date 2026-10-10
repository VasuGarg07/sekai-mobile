import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { SectionHeader } from "@/components/ui/section-header";
import { POSTER_ASPECT_RATIO, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { AnimeRelation } from "@/types/anime";
import { formatEnum, getTitle } from "@/utils/anime";

const CARD_WIDTH = 112;

interface RelationShelfProps {
  relations: AnimeRelation[];
}

export function RelationShelf({ relations }: RelationShelfProps) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <SectionHeader title="Related" icon="account_tree" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {relations.map((relation) => (
          <Pressable
            key={`${relation.relationType}-${relation.id}`}
            accessibilityRole="button"
            accessibilityLabel={`${formatEnum(relation.relationType)}: ${getTitle(relation)}`}
            onPress={() => router.push(`/anime/${relation.id}`)}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          >
            <Image source={relation.coverImage} style={styles.cover} contentFit="cover" transition={200} />
            <AppText variant="overline" tone="accent" numberOfLines={1}>
              {formatEnum(relation.relationType)}
            </AppText>
            <AppText variant="label" numberOfLines={2}>
              {getTitle(relation)}
            </AppText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  container: {
    gap: spacing.md,
  },
  list: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: CARD_WIDTH,
    gap: spacing.xxs,
  },
  pressed: {
    opacity: 0.75,
  },
  cover: {
    width: "100%",
    aspectRatio: POSTER_ASPECT_RATIO,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.skeleton,
  },
}));
