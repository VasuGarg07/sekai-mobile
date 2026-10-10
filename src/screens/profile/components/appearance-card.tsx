import { Pressable, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Icon } from "@/components/ui/icon";
import { SegmentedControl, type Segment } from "@/components/ui/segmented-control";
import { useAppearance, useTheme, type ThemeMode } from "@/providers/theme-provider";
import { ACCENT_KEYS, ACCENTS, contrastText, iconSize, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import { confirmTap } from "@/utils/feedback";

const MODES: Segment<ThemeMode>[] = [
  { value: "system", label: "System", icon: "brightness_auto" },
  { value: "light", label: "Light", icon: "light_mode" },
  { value: "dark", label: "Dark", icon: "dark_mode" },
];

const SWATCH_SIZE = 36;

export function AppearanceCard() {
  const { colors } = useTheme();
  const styles = useStyles();
  const { mode, accent, setMode, setAccent } = useAppearance();

  return (
    <View style={styles.group}>
      <AppText variant="overline" tone="subtle" style={styles.groupTitle}>
        Appearance
      </AppText>
      <View style={styles.card}>
        <View style={styles.block}>
          <AppText variant="bodyStrong">Theme</AppText>
          <SegmentedControl segments={MODES} value={mode} onChange={setMode} />
        </View>
        <View style={styles.divider} />
        <View style={styles.block}>
          <View style={styles.accentHeader}>
            <AppText variant="bodyStrong">Accent colour</AppText>
            <AppText variant="label" tone="accent">
              {ACCENTS[accent].label}
            </AppText>
          </View>
          <View accessibilityRole="radiogroup" style={styles.swatches}>
            {ACCENT_KEYS.map((key) => {
              const { hex, label } = ACCENTS[key];
              const selected = key === accent;
              return (
                <Pressable
                  key={key}
                  accessibilityRole="radio"
                  accessibilityLabel={label}
                  accessibilityState={{ checked: selected }}
                  onPress={() => {
                    confirmTap();
                    setAccent(key);
                  }}
                  style={[styles.swatchRing, selected && { borderColor: colors.text }]}
                >
                  <View style={[styles.swatch, { backgroundColor: hex }]}>
                    {selected && (
                      <Icon name="check" size={iconSize.md} color={contrastText(hex)} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  group: {
    gap: spacing.sm,
  },
  groupTitle: {
    paddingHorizontal: spacing.lg,
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  block: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  divider: {
    height: 1,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.border,
  },
  accentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  swatches: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  swatchRing: {
    padding: 3,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: "transparent",
  },
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
}));
