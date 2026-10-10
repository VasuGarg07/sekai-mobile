import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, fontSize, fontWeight, POSTER_ASPECT_RATIO, radius, spacing } from "@/theme";
import type { AnimeRelation } from "@/types/anime";
import { formatEnum, getTitle } from "@/utils/anime";

const CARD_WIDTH = 110;

interface RelationShelfProps {
  relations: AnimeRelation[];
}

export function RelationShelf({ relations }: RelationShelfProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Related</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {relations.map((relation) => (
          <Pressable
            key={`${relation.relationType}-${relation.id}`}
            accessibilityRole="button"
            accessibilityLabel={`${formatEnum(relation.relationType)}: ${getTitle(relation)}`}
            onPress={() => router.push(`/anime/${relation.id}`)}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          >
            <Image source={relation.coverImage} style={styles.cover} contentFit="cover" />
            <Text style={styles.type}>{formatEnum(relation.relationType)}</Text>
            <Text style={styles.title} numberOfLines={2}>
              {getTitle(relation)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  heading: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    paddingHorizontal: spacing.lg,
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
    opacity: 0.7,
  },
  cover: {
    width: "100%",
    aspectRatio: POSTER_ASPECT_RATIO,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
  },
  type: {
    color: colors.accent,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.sm,
  },
});
