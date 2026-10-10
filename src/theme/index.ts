import type { WatchStatus } from "@/types/watchlist";

export const colors = {
  background: "#0E0E11",
  surface: "#18181D",
  surfaceRaised: "#232329",
  border: "#2E2E36",
  text: "#F4F4F5",
  textMuted: "#A1A1AA",
  textSubtle: "#71717A",
  accent: "#F25C3C",
  accentMuted: "rgba(242, 92, 60, 0.16)",
  onAccent: "#FFFFFF",
  light: "#FFFFFF",
  onLight: "#1F2937",
  scrim: "rgba(14, 14, 17, 0.92)",
  scrimTransparent: "rgba(14, 14, 17, 0)",
  score: "#FACC15",
  success: "#4ADE80",
  warningBorder: "#A16207",
  warningSurface: "rgba(113, 63, 18, 0.25)",
} as const;

export const watchStatusColors: Record<WatchStatus, string> = {
  watching: "#60A5FA",
  completed: "#4ADE80",
  "on-hold": "#FACC15",
  "plan-to-watch": "#C084FC",
  dropped: "#F87171",
  rewatch: "#38BDF8",
};

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
  sm: 6,
  md: 10,
  lg: 14,
  full: 999,
} as const;

export const fonts = {
  display: "DMSerifDisplay_400Regular",
} as const;

export const fontSize = {
  xs: 12,
  sm: 13,
  md: 14,
  base: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
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

/** Poster images are 2:3; width / height. */
export const POSTER_ASPECT_RATIO = 2 / 3;
