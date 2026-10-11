import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, type ComponentProps } from "react";

import { useSessionPrefetch } from "@/hooks/use-session-prefetch";
import { AuthProvider, useAuth } from "@/providers/auth-provider";
import { ExploreFiltersProvider } from "@/providers/explore-filters-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider, useTheme } from "@/providers/theme-provider";
import { radius } from "@/theme";

SplashScreen.preventAutoHideAsync();

const FILTER_SHEET_DETENT = 0.88;

type StackOptions = ComponentProps<typeof Stack>["screenOptions"];

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <ExploreFiltersProvider>
            <AppNavigator />
          </ExploreFiltersProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

function AppNavigator() {
  const theme = useTheme();
  const { initialized } = useAuth();
  useSessionPrefetch();
  // Until Firebase restores the saved session, screens would render as signed out.
  useEffect(() => {
    if (initialized) SplashScreen.hideAsync();
  }, [initialized]);

  const screenOptions = useMemo<StackOptions>(
    () => ({
      headerShown: false,
      animation: "slide_from_right",
      contentStyle: { backgroundColor: theme.colors.background },
    }),
    [theme],
  );

  const sheetOptions = useMemo<ComponentProps<typeof Stack.Screen>["options"]>(
    () => ({
      presentation: "formSheet",
      sheetAllowedDetents: "fitToContents",
      sheetCornerRadius: radius.xl,
      animation: "slide_from_bottom",
      contentStyle: { backgroundColor: theme.colors.surface },
    }),
    [theme],
  );

  return (
    <>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="anime/[id]" />
        <Stack.Screen name="list/[kind]" />
        <Stack.Screen name="genre/[name]" />
        <Stack.Screen name="login" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
        <Stack.Screen name="watch-status" options={sheetOptions} />
        <Stack.Screen name="settings/[sheet]" options={sheetOptions} />
        <Stack.Screen name="explore-filters" options={{ ...sheetOptions, sheetAllowedDetents: [FILTER_SHEET_DETENT] }} />
      </Stack>
    </>
  );
}
