import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import type { AnimeDetail } from "@/types/anime";
import { formatEnum, formatScore } from "@/utils/anime";

interface Fact {
  label: string;
  value: string;
}

function getFacts(anime: AnimeDetail): Fact[] {
  const facts: (Fact | null)[] = [
    anime.format ? { label: "Format", value: formatEnum(anime.format) } : null,
    anime.episodes ? { label: "Episodes", value: String(anime.episodes) } : null,
    anime.episodeDuration ? { label: "Duration", value: `${anime.episodeDuration} min` } : null,
    anime.seasonYear
      ? {
          label: "Season",
          value: anime.season ? `${formatEnum(anime.season)} ${anime.seasonYear}` : String(anime.seasonYear),
        }
      : null,
    anime.status ? { label: "Status", value: formatEnum(anime.status) } : null,
    anime.popularity ? { label: "Popularity", value: anime.popularity.toLocaleString() } : null,
  ];
  return facts.filter((fact): fact is Fact => fact !== null);
}

interface FactRowProps {
  anime: AnimeDetail;
}

export function FactRow({ anime }: FactRowProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {anime.averageScore !== null && (
        <View style={styles.fact}>
          <View style={styles.scoreValue}>
            <Icon name="star" size={16} color={colors.score} />
            <Text style={styles.value}>{formatScore(anime.averageScore)}</Text>
          </View>
          <Text style={styles.label}>Score</Text>
        </View>
      )}
      {getFacts(anime).map((fact) => (
        <View key={fact.label} style={styles.fact}>
          <Text style={styles.value}>{fact.value}</Text>
          <Text style={styles.label}>{fact.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  fact: {
    minWidth: 80,
    gap: spacing.xxs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  scoreValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  value: {
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  label: {
    color: colors.textSubtle,
    fontSize: fontSize.xs,
  },
});
