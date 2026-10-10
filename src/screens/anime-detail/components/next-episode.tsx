import { View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { useReminder } from "@/hooks/use-reminder";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import { formatAiringTime } from "@/utils/anime";
import { confirmTap, showMessage } from "@/utils/feedback";

interface NextEpisodeProps {
  animeId: number;
  episode: number;
  airingAt: Date;
}

export function NextEpisode({ animeId, episode, airingAt }: NextEpisodeProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const { enabled, toggle } = useReminder(animeId);

  const handleToggle = async () => {
    const result = await toggle.mutateAsync();
    if (result.success) {
      confirmTap();
      showMessage(enabled ? "Reminder turned off" : "We'll remind you when new episodes air");
    } else if (result.message) {
      showMessage(result.message);
    }
  };

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
      <IconButton
        icon={enabled ? "notifications_active" : "notifications"}
        variant="tonal"
        active={enabled}
        accessibilityLabel={enabled ? "Turn off episode reminders" : "Remind me when new episodes air"}
        accessibilityState={{ checked: enabled, busy: toggle.isPending }}
        disabled={toggle.isPending}
        onPress={handleToggle}
      />
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
