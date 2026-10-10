import { View } from "react-native";

import { Badge } from "@/components/ui/badge";
import type { IconName } from "@/components/ui/icon";
import { useTheme } from "@/providers/theme-provider";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { AnimeDetail } from "@/types/anime";
import { formatEnum, formatScore } from "@/utils/anime";

interface Fact {
  icon: IconName;
  label: string;
}

function getFacts(anime: AnimeDetail): Fact[] {
  const facts: (Fact | null)[] = [
    anime.format ? { icon: "tv", label: formatEnum(anime.format) } : null,
    anime.episodes ? { icon: "movie", label: `${anime.episodes} episodes` } : null,
    anime.seasonYear
      ? {
          icon: "calendar_month",
          label: anime.season ? `${formatEnum(anime.season)} ${anime.seasonYear}` : String(anime.seasonYear),
        }
      : null,
    anime.status ? { icon: "radio_button_checked", label: formatEnum(anime.status) } : null,
  ];
  return facts.filter((fact): fact is Fact => fact !== null);
}

interface FactRowProps {
  anime: AnimeDetail;
}

export function FactRow({ anime }: FactRowProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.row}>
      {anime.averageScore !== null && (
        <Badge variant="accent" icon="star" iconColor={colors.score} label={formatScore(anime.averageScore)} />
      )}
      {getFacts(anime).map((fact) => (
        <Badge key={fact.label} icon={fact.icon} label={fact.label} />
      ))}
    </View>
  );
}

const useStyles = createStyles(() => ({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
}));
