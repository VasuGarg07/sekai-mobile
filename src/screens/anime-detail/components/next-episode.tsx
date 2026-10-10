import { View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Icon } from "@/components/ui/icon";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import { formatAiringTime } from "@/utils/anime";

interface NextEpisodeProps {
  episode: number;
  airingAt: Date;
}

export function NextEpisode({ episode, airingAt }: NextEpisodeProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.card}>
      <View style={styles.iconTile}>
        <Icon name="schedule" size={iconSize.lg} color={colors.accentText} />
      </View>
      <View style={styles.text}>
        <AppText variant="bodyStrong">Episode {episode}</AppText>
        <AppText variant="caption" tone="muted">
          Airs {formatAiringTime(airingAt)}
        </AppText>
      </View>
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentSoft,
  },
  text: {
    flex: 1,
    gap: spacing.xxs,
  },
}));
