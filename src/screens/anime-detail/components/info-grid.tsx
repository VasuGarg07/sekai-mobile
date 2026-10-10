import { View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Icon, type IconName } from "@/components/ui/icon";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { AnimeDetail } from "@/types/anime";

interface InfoItem {
  icon: IconName;
  label: string;
  value: string;
}

const COUNTRIES: Record<string, string> = { JP: "Japan", CN: "China", KR: "Korea", TW: "Taiwan" };

function getInfo(anime: AnimeDetail): InfoItem[] {
  const items: (InfoItem | null)[] = [
    anime.episodeDuration ? { icon: "timer", label: "Duration", value: `${anime.episodeDuration} min` } : null,
    anime.startDate ? { icon: "event", label: "Started", value: anime.startDate } : null,
    anime.countryOfOrigin
      ? { icon: "public", label: "Country", value: COUNTRIES[anime.countryOfOrigin] ?? anime.countryOfOrigin }
      : null,
    anime.popularity ? { icon: "group", label: "Members", value: anime.popularity.toLocaleString() } : null,
    anime.favourites ? { icon: "favorite", label: "Favourites", value: anime.favourites.toLocaleString() } : null,
  ];
  return items.filter((item): item is InfoItem => item !== null);
}

interface InfoGridProps {
  anime: AnimeDetail;
}

export function InfoGrid({ anime }: InfoGridProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const items = getInfo(anime);
  if (items.length === 0) return null;

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={styles.cell}>
          <Icon name={item.icon} size={iconSize.md} color={colors.accentText} />
          <AppText variant="caption" tone="subtle">
            {item.label}
          </AppText>
          <AppText variant="bodyStrong" numberOfLines={1}>
            {item.value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  cell: {
    width: "50%",
    gap: spacing.xxs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
}));
