import { SymbolView, type AndroidSymbol } from "expo-symbols";
import type { ColorValue } from "react-native";

import { useTheme } from "@/providers/theme-provider";
import { iconSize } from "@/theme";

export type IconName = AndroidSymbol;

interface IconProps {
  name: IconName;
  size?: number;
  color?: ColorValue;
}

export function Icon({ name, size = iconSize.lg, color }: IconProps) {
  const { colors } = useTheme();
  return <SymbolView name={{ android: name }} size={size} tintColor={color ?? colors.text} />;
}
