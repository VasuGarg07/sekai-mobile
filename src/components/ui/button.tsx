import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View, type PressableProps } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { GlassView } from "@/components/ui/glass";
import { Icon, type IconName } from "@/components/ui/icon";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, radius, spacing, type ThemeColors } from "@/theme";
import { createStyles } from "@/theme/create-styles";

type ButtonVariant = "filled" | "tonal" | "outline" | "ghost" | "glass" | "danger";
type ButtonSize = "md" | "sm";

interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  title: string;
  icon?: IconName;
  /** Custom leading element (e.g. a brand logo); takes precedence over `icon`. */
  leading?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const CONTENT_COLORS: Record<ButtonVariant, keyof ThemeColors> = {
  filled: "onAccent",
  tonal: "accentText",
  outline: "text",
  ghost: "accentText",
  glass: "text",
  danger: "danger",
};

export function Button({
  title,
  icon,
  leading,
  variant = "filled",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  ...pressableProps
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const isDisabled = disabled || loading;
  const contentColor = colors[CONTENT_COLORS[variant]];

  const content = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        <>
          {leading}
          {!leading && icon && <Icon name={icon} size={size === "sm" ? iconSize.sm : iconSize.md} color={contentColor} />}
          <AppText variant={size === "sm" ? "label" : "bodyStrong"} style={{ color: contentColor }}>
            {title}
          </AppText>
        </>
      )}
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === "sm" ? styles.small : styles.medium,
        fullWidth && styles.fullWidth,
        variant !== "glass" && styles[variant],
        (pressed || isDisabled) && styles.dimmed,
      ]}
      {...pressableProps}
    >
      {variant === "glass" ? <GlassView style={styles.glass}>{content}</GlassView> : content}
    </Pressable>
  );
}

const useStyles = createStyles(({ colors }) => ({
  base: {
    borderRadius: radius.full,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  medium: {
    minHeight: 48,
  },
  small: {
    minHeight: 36,
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  content: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  glass: {
    flexGrow: 1,
    flexDirection: "row",
    borderRadius: radius.full,
  },
  filled: {
    backgroundColor: colors.accent,
  },
  tonal: {
    backgroundColor: colors.accentSoft,
  },
  outline: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.borderStrong,
  },
  ghost: {},
  danger: {
    backgroundColor: colors.dangerSoft,
  },
  dimmed: {
    opacity: 0.6,
  },
}));
