import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from "react-native";

import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";

type ButtonVariant = "primary" | "secondary" | "light";
type ButtonSize = "md" | "sm";

interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  ...pressableProps
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        (pressed || isDisabled) && styles.dimmed,
      ]}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator color={labelStyles[variant].color} />
      ) : (
        <Text style={[styles.label, labelSizeStyles[size], labelStyles[variant]]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
  label: {
    fontWeight: fontWeight.semibold,
  },
  dimmed: {
    opacity: 0.6,
  },
});

const sizeStyles = StyleSheet.create({
  md: { minHeight: 48, paddingHorizontal: spacing.xl },
  sm: { minHeight: 36, paddingHorizontal: spacing.md },
});

const labelSizeStyles = StyleSheet.create({
  md: { fontSize: fontSize.base },
  sm: { fontSize: fontSize.md },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.accent },
  secondary: { borderWidth: 1, borderColor: colors.border },
  light: { backgroundColor: colors.light },
});

const labelStyles = StyleSheet.create({
  primary: { color: colors.onAccent },
  secondary: { color: colors.text },
  light: { color: colors.onLight },
});
