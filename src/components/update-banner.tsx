import { Linking, Pressable, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Icon } from "@/components/ui/icon";
import { useAppUpdate } from "@/hooks/use-app-update";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

export function UpdateBanner() {
  const { colors } = useTheme();
  const styles = useStyles();
  const update = useAppUpdate();
  if (!update) return null;

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Version ${update.version} is available. Open the download page`}
      onPress={() => Linking.openURL(update.url)}
      style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
    >
      <View style={styles.iconTile}>
        <Icon name="system_update" size={iconSize.md} color={colors.onAccent} />
      </View>
      <View style={styles.text}>
        <AppText variant="bodyStrong">Version {update.version} is available</AppText>
        <AppText variant="caption" tone="muted">
          Tap to download the new APK from GitHub
        </AppText>
      </View>
      <Icon name="open_in_new" size={iconSize.md} color={colors.accentText} />
    </Pressable>
  );
}

const useStyles = createStyles(({ colors }) => ({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  pressed: {
    opacity: 0.75,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },
  text: {
    flex: 1,
    gap: spacing.xxs,
  },
}));
