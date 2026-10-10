import { Pressable, StyleSheet, Text, type PressableProps } from "react-native";

import { colors, fontSize, fontWeight } from "@/theme";

interface TextLinkProps extends Omit<PressableProps, "children"> {
  title: string;
  tone?: "accent" | "muted";
}

export function TextLink({ title, tone = "accent", ...pressableProps }: TextLinkProps) {
  return (
    <Pressable accessibilityRole="button" hitSlop={8} {...pressableProps}>
      <Text style={[styles.text, tone === "muted" && styles.muted]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.accent,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  muted: {
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
  },
});
