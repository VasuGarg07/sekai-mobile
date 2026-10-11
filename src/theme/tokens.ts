import type { TextStyle } from "react-native";

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export type TextVariant =
  | "display"
  | "title"
  | "headline"
  | "subtitle"
  | "body"
  | "bodyStrong"
  | "label"
  | "caption"
  | "overline";

export const typography: Record<TextVariant, TextStyle> = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: "800" },
  title: { fontSize: 26, lineHeight: 32, fontWeight: "700" },
  headline: { fontSize: 20, lineHeight: 26, fontWeight: "700" },
  subtitle: { fontSize: 17, lineHeight: 22, fontWeight: "600" },
  body: { fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: "600" },
  label: { fontSize: 13, lineHeight: 18, fontWeight: "600" },
  caption: { fontSize: 12, lineHeight: 16 },
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
};

export function getTextHeight(variant: TextVariant, lines: number) {
  return (typography[variant].lineHeight ?? 0) * lines;
}

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

/** Poster images are 2:3 (width / height). */
export const POSTER_ASPECT_RATIO = 2 / 3;
export const BANNER_ASPECT_RATIO = 16 / 9;

export const TAB_BAR_HEIGHT = 64;
