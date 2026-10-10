import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { useAppUpdate } from "@/hooks/use-app-update";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";

export function UpdateBanner() {
  const update = useAppUpdate();
  if (!update) return null;

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Version ${update.version} is available. Open the download page`}
      onPress={() => Linking.openURL(update.url)}
      style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
    >
      <Icon name="system_update" size={22} color={colors.accent} />
      <View style={styles.text}>
        <Text style={styles.title}>Version {update.version} is available</Text>
        <Text style={styles.subtitle}>Tap to download the new APK from GitHub</Text>
      </View>
      <Icon name="chevron_right" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.accentMuted,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    flex: 1,
    gap: spacing.xxs,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
