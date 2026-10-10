import { Pressable, type PressableProps } from "react-native";

import { GlassView } from "@/components/ui/glass";
import { Icon, type IconName } from "@/components/ui/icon";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, radius } from "@/theme";
import { createStyles } from "@/theme/create-styles";

type IconButtonVariant = "glass" | "tonal" | "plain";

interface IconButtonProps extends Omit<PressableProps, "children" | "style"> {
  icon: IconName;
  /** Required: there is no visible text to describe the action. */
  accessibilityLabel: string;
  variant?: IconButtonVariant;
  active?: boolean;
  size?: number;
}

const BUTTON_SIZE = 44;

export function IconButton({
  icon,
  variant = "plain",
  active = false,
  size = iconSize.md,
  ...pressableProps
}: IconButtonProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const iconColor = active ? colors.accentText : colors.text;
  const glyph = <Icon name={icon} size={size} color={iconColor} />;

  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={4}
      style={({ pressed }) => [
        styles.button,
        variant === "tonal" && (active ? styles.tonalActive : styles.tonal),
        pressed && styles.pressed,
      ]}
      {...pressableProps}
    >
      {variant === "glass" ? <GlassView style={styles.glass}>{glyph}</GlassView> : glyph}
    </Pressable>
  );
}

const useStyles = createStyles(({ colors }) => ({
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  glass: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  tonal: {
    backgroundColor: colors.surfaceRaised,
  },
  tonalActive: {
    backgroundColor: colors.accentSoft,
  },
  pressed: {
    opacity: 0.6,
  },
}));
