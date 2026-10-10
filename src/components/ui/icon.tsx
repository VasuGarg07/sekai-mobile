import { SymbolView, type AndroidSymbol } from "expo-symbols";
import type { ColorValue } from "react-native";

import { colors } from "@/theme";

interface IconProps {
  name: AndroidSymbol;
  size?: number;
  color?: ColorValue;
}

export function Icon({ name, size = 24, color = colors.text }: IconProps) {
  return <SymbolView name={{ android: name }} size={size} tintColor={color} />;
}
