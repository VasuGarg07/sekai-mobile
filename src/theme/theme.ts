import type { WatchStatus } from "@/types/watchlist";

import { ACCENTS, luminance, mix, NEUTRALS, withAlpha, type AccentKey } from "./palette";

export type ColorScheme = "light" | "dark";

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceRaised: string;
  surfacePressed: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  accent: string;
  /** Accent readable as text or an icon on the background. */
  accentText: string;
  accentSoft: string;
  onAccent: string;
  /** Text and icons drawn over artwork, in either scheme. */
  onImage: string;
  onImageMuted: string;
  scrim: string;
  scrimTransparent: string;
  danger: string;
  dangerSoft: string;
  success: string;
  warning: string;
  warningSoft: string;
  score: string;
  skeleton: string;
  shadow: string;
}

export interface GlassStyle {
  tint: ColorScheme;
  intensity: number;
  fill: string;
  /** For glass over busy artwork, where a light fill alone isn't legible. */
  fillStrong: string;
  border: string;
}

export interface Theme {
  scheme: ColorScheme;
  dark: boolean;
  accentKey: AccentKey;
  colors: ThemeColors;
  glass: GlassStyle;
  statusColors: Record<WatchStatus, string>;
}

const STATUS_COLORS: Record<WatchStatus, string> = {
  watching: "#3B82F6",
  completed: "#22C55E",
  "on-hold": "#EAB308",
  "plan-to-watch": "#A855F7",
  dropped: "#EF4444",
  rewatch: "#0EA5E9",
};

export function createTheme(scheme: ColorScheme, accentKey: AccentKey): Theme {
  const dark = scheme === "dark";
  const neutral = NEUTRALS[scheme];
  const accent = ACCENTS[accentKey].hex;
  const accentIsLight = luminance(accent) > 0.45;

  return {
    scheme,
    dark,
    accentKey,
    colors: {
      ...neutral,
      accent,
      // Light accents (lime, amber) are too faint as text on a light background.
      accentText: !dark && accentIsLight ? mix(accent, "#000000", 0.3) : accent,
      accentSoft: withAlpha(accent, dark ? 0.18 : 0.14),
      onAccent: accentIsLight ? "#111114" : "#FFFFFF",
      onImage: "#FFFFFF",
      onImageMuted: "rgba(255, 255, 255, 0.78)",
      scrim: neutral.background,
      scrimTransparent: withAlpha(neutral.background, 0),
      danger: "#EF4444",
      dangerSoft: withAlpha("#EF4444", dark ? 0.18 : 0.12),
      success: "#22C55E",
      warning: "#EAB308",
      warningSoft: withAlpha("#EAB308", dark ? 0.16 : 0.14),
      score: "#FACC15",
      skeleton: dark ? neutral.surfaceRaised : neutral.surfacePressed,
      shadow: "#000000",
    },
    glass: {
      tint: scheme,
      intensity: dark ? 60 : 70,
      fill: dark ? "rgba(22, 22, 28, 0.55)" : "rgba(255, 255, 255, 0.62)",
      fillStrong: dark ? "rgba(14, 14, 18, 0.78)" : "rgba(255, 255, 255, 0.82)",
      border: dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    },
    statusColors: STATUS_COLORS,
  };
}
