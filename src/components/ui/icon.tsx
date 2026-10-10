import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { ColorValue } from "react-native";

import { useTheme } from "@/providers/theme-provider";
import { iconSize } from "@/theme";

type GlyphName = ComponentProps<typeof MaterialIcons>["name"];
type SnakeCase<S extends string> = S extends `${infer Head}-${infer Tail}` ? `${Head}_${SnakeCase<Tail>}` : S;

/** Material icon names in snake_case; MaterialIcons itself uses kebab-case. */
export type IconName = SnakeCase<GlyphName>;

interface IconProps {
  name: IconName;
  size?: number;
  color?: ColorValue;
}

export function Icon({ name, size = iconSize.lg, color }: IconProps) {
  const { colors } = useTheme();
  // The cast is safe: IconName is derived from the glyph names by swapping "-" for "_".
  const glyph = name.replaceAll("_", "-") as GlyphName;
  return <MaterialIcons name={glyph} size={size} color={color ?? colors.text} />;
}
