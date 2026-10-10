import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";

import { ACCENTS, createTheme, type AccentKey, type Theme } from "@/theme";

export type ThemeMode = "system" | "light" | "dark";

interface Appearance {
  mode: ThemeMode;
  accent: AccentKey;
}

interface AppearanceContextValue extends Appearance {
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentKey) => void;
}

const STORAGE_KEY = "appearance";
const DEFAULT_APPEARANCE: Appearance = { mode: "system", accent: "vermilion" };

const ThemeContext = createContext<Theme | null>(null);
const AppearanceContext = createContext<AppearanceContextValue | null>(null);

function parseAppearance(stored: string | null): Appearance {
  if (!stored) return DEFAULT_APPEARANCE;
  try {
    const value: Partial<Appearance> = JSON.parse(stored);
    return {
      mode: value.mode === "light" || value.mode === "dark" ? value.mode : "system",
      accent: value.accent && value.accent in ACCENTS ? value.accent : DEFAULT_APPEARANCE.accent,
    };
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

interface ThemeProviderProps {
  children: ReactNode;
}

/** Renders nothing until the saved appearance is read, so the app never flashes the wrong theme. */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [appearance, setAppearance] = useState<Appearance | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => setAppearance(parseAppearance(stored)))
      .catch(() => setAppearance(DEFAULT_APPEARANCE));
  }, []);

  const update = useCallback((changes: Partial<Appearance>) => {
    setAppearance((current) => {
      const next = { ...(current ?? DEFAULT_APPEARANCE), ...changes };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const mode = appearance?.mode ?? DEFAULT_APPEARANCE.mode;
  const accent = appearance?.accent ?? DEFAULT_APPEARANCE.accent;
  const scheme = mode === "system" ? (systemScheme === "light" ? "light" : "dark") : mode;

  const nextTheme = useMemo(() => createTheme(scheme, accent), [scheme, accent]);
  // Restyling the whole app is a big render. Deferring it lets the tap land at once (the segment
  // highlight updates from `appearanceValue`) and lets a second tap interrupt the render instead
  // of queueing behind it.
  const theme = useDeferredValue(nextTheme);
  const appearanceValue = useMemo<AppearanceContextValue>(
    () => ({
      mode,
      accent,
      setMode: (next) => update({ mode: next }),
      setAccent: (next) => update({ accent: next }),
    }),
    [mode, accent, update],
  );

  if (!appearance) return null;

  return (
    <AppearanceContext.Provider value={appearanceValue}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </AppearanceContext.Provider>
  );
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("useTheme must be used inside <ThemeProvider>");
  return theme;
}

export function useAppearance(): AppearanceContextValue {
  const appearance = useContext(AppearanceContext);
  if (!appearance) throw new Error("useAppearance must be used inside <ThemeProvider>");
  return appearance;
}
