import { StyleSheet, Switch, Text, View } from "react-native";

import { Chip } from "@/components/ui/chip";
import { usePreferences, useUpdatePreferences } from "@/hooks/use-preferences";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import { WATCH_STATUSES, type Preferences } from "@/types/watchlist";
import { WATCH_STATUS_LABELS } from "@/utils/anime";
import { showMessage } from "@/utils/feedback";

export function PreferenceSection() {
  const preferences = usePreferences();
  const updatePreferences = useUpdatePreferences();

  const handleUpdate = async (updates: Partial<Preferences>) => {
    const result = await updatePreferences.mutateAsync(updates);
    if (!result.success && result.message) showMessage(result.message);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Default watch status</Text>
      <Text style={styles.description}>Used when you add something to your watchlist.</Text>
      <View style={styles.chips}>
        {WATCH_STATUSES.map((watchStatus) => (
          <Chip
            key={watchStatus}
            label={WATCH_STATUS_LABELS[watchStatus]}
            selected={preferences.defaultWatchStatus === watchStatus}
            onPress={() => handleUpdate({ defaultWatchStatus: watchStatus })}
          />
        ))}
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchText}>
          <Text style={styles.heading}>18+ Mode</Text>
          <Text style={styles.description}>Show adult titles and genres. You must be 18 or older.</Text>
        </View>
        <Switch
          accessibilityLabel="18+ Mode"
          value={preferences.adultMode}
          onValueChange={(adultMode) => handleUpdate({ adultMode })}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor={colors.light}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  heading: {
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  description: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  switchText: {
    flex: 1,
    gap: spacing.xxs,
  },
});
