import { Text, type TextProps } from "react-native";

import { useTheme } from "@/providers/theme-provider";
import { typography, type TextVariant, type ThemeColors } from "@/theme";

type TextTone =
  | "default"
  | "muted"
  | "subtle"
  | "accent"
  | "onAccent"
  | "onImage"
  | "onImageMuted"
  | "danger";

const TONE_COLORS: Record<TextTone, keyof ThemeColors> = {
  default: "text",
  muted: "textMuted",
  subtle: "textSubtle",
  accent: "accentText",
  onAccent: "onAccent",
  onImage: "onImage",
  onImageMuted: "onImageMuted",
  danger: "danger",
};

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  tone?: TextTone;
  align?: "left" | "center" | "right";
}

export function AppText({
  variant = "body",
  tone = "default",
  align,
  style,
  ...textProps
}: AppTextProps) {
  const { colors } = useTheme();
  return (
    <Text
      style={[typography[variant], { color: colors[TONE_COLORS[tone]], textAlign: align }, style]}
      {...textProps}
    />
  );
}
