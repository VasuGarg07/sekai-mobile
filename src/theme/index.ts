// Placeholder palette until the design pass (Phase 6).
export const colors = {
  background: "#18181b",
  surface: "#27272a",
  border: "#3f3f46",
  text: "#f4f4f5",
  textMuted: "#a1a1aa",
  accent: "#f43f5e",
  onAccent: "#ffffff",
  light: "#ffffff",
  onLight: "#1f2937",
  success: "#4ade80",
  warningBorder: "#a16207",
  warningSurface: "rgba(113, 63, 18, 0.25)",
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
} as const;

export const fontSize = {
  xs: 12,
  sm: 13,
  md: 14,
  base: 16,
  lg: 17,
  xl: 28,
  xxl: 32,
} as const;

export const lineHeight = {
  sm: 20,
  md: 22,
} as const;

export const fontWeight = {
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;
