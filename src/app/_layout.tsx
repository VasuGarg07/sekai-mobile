import { DMSerifDisplay_400Regular, useFonts } from "@expo-google-fonts/dm-serif-display";
import { QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, type ComponentProps } from "react";

import { queryClient } from "@/lib/query-client";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider, useTheme } from "@/providers/theme-provider";
import { radius } from "@/theme";

SplashScreen.preventAutoHideAsync();

type StackOptions = ComponentProps<typeof Stack>["screenOptions"];

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function AppNavigator() {
  const theme = useTheme();
  const [fontsLoaded, fontError] = useFonts({ DMSerifDisplay_400Regular });
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

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

  if (!ready) return null;

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
      </Stack>
    </>
  );
}
