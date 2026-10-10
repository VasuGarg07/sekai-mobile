import { Pressable, StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { useReminder } from "@/hooks/use-reminder";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { formatAiringTime } from "@/utils/anime";
import { confirmTap, showMessage } from "@/utils/feedback";

interface NextEpisodeProps {
  animeId: number;
  episode: number;
  airingAt: Date;
}

export function NextEpisode({ animeId, episode, airingAt }: NextEpisodeProps) {
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
    <View style={styles.row}>
      <Icon name="schedule" size={18} color={colors.accent} />
      <Text style={styles.text}>
        Episode {episode} airs {formatAiringTime(airingAt)}
      </Text>
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: enabled, busy: toggle.isPending }}
        accessibilityLabel="Remind me when new episodes air"
        disabled={toggle.isPending}
        onPress={handleToggle}
        hitSlop={8}
        style={[styles.toggle, enabled && styles.toggleOn]}
      >
        <Icon
          name={enabled ? "notifications_active" : "notifications"}
          size={18}
          color={enabled ? colors.accent : colors.textMuted}
        />
        <Text style={[styles.toggleLabel, enabled && styles.toggleLabelOn]}>
          {enabled ? "On" : "Remind me"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  text: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleOn: {
    borderColor: colors.accent,
    backgroundColor: colors.accentMuted,
  },
  toggleLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  toggleLabelOn: {
    color: colors.text,
  },
});
