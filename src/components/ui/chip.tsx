import { Pressable, View, type PressableProps } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Icon, type IconName } from "@/components/ui/icon";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

interface ChipProps extends Omit<PressableProps, "children" | "style"> {
  label: string;
  icon?: IconName;
  /** Small colored dot before the label, e.g. a watch status color. */
  dotColor?: string;
  selected?: boolean;
}

export function Chip({ label, icon, dotColor, selected = false, ...pressableProps }: ChipProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
      {...pressableProps}
    >
      {dotColor && <View style={[styles.dot, { backgroundColor: dotColor }]} />}
      {icon && (
        <Icon name={icon} size={iconSize.sm} color={selected ? colors.accentText : colors.textMuted} />
      )}
      <AppText variant="label" tone={selected ? "accent" : "muted"}>
        {label}
      </AppText>
    </Pressable>
  );
}

const useStyles = createStyles(({ colors }) => ({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  pressed: {
    opacity: 0.7,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
}));
