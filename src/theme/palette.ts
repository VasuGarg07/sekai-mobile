export type AccentKey =
  | "vermilion"
  | "sakura"
  | "amber"
  | "lime"
  | "emerald"
  | "sky"
  | "indigo"
  | "violet";

export const ACCENTS: Record<AccentKey, { label: string; hex: string }> = {
  vermilion: { label: "Vermilion", hex: "#F25C3C" },
  sakura: { label: "Sakura", hex: "#F0628F" },
  amber: { label: "Amber", hex: "#F5A524" },
  lime: { label: "Lime", hex: "#9BCB3C" },
  emerald: { label: "Emerald", hex: "#1FB980" },
  sky: { label: "Sky", hex: "#3BA3F0" },
  indigo: { label: "Indigo", hex: "#6E6AF5" },
  violet: { label: "Violet", hex: "#A55CF0" },
};

export const ACCENT_KEYS: AccentKey[] = [
  "vermilion",
  "sakura",
  "amber",
  "lime",
  "emerald",
  "sky",
  "indigo",
  "violet",
];

export const NEUTRALS = {
  dark: {
    background: "#0B0B0E",
    surface: "#16161B",
    surfaceRaised: "#202027",
    surfacePressed: "#2A2A33",
    border: "#2A2A33",
    borderStrong: "#3A3A45",
    text: "#F5F5F7",
    textMuted: "#A6A6B2",
    textSubtle: "#71717D",
  },
  light: {
    background: "#F5F5F8",
    surface: "#FFFFFF",
    surfaceRaised: "#EDEDF2",
    surfacePressed: "#E2E2E9",
    border: "#E3E3EA",
    borderStrong: "#CDCDD7",
    text: "#121216",
    textMuted: "#5A5A66",
    textSubtle: "#8B8B97",
  },
} as const;

function channels(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = channels(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function mix(hex: string, target: string, amount: number): string {
  const from = channels(hex);
  const to = channels(target);
  const mixed = from.map((value, i) => Math.round(value + (to[i] - value) * amount));
  return `#${mixed.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

/** Black or white, whichever reads better on the given color. */
export function contrastText(hex: string): string {
  return luminance(hex) > 0.45 ? "#111114" : "#FFFFFF";
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
export function luminance(hex: string): number {
  const [r, g, b] = channels(hex).map((value) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
