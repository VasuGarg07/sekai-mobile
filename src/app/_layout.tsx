import { DMSerifDisplay_400Regular, useFonts } from "@expo-google-fonts/dm-serif-display";
import { QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, type ComponentProps } from "react";

import { queryClient } from "@/lib/query-client";
import { AuthProvider } from "@/providers/auth-provider";
import { syncReminders } from "@/services/reminders";
import { colors, radius } from "@/theme";

SplashScreen.preventAutoHideAsync();

const screenOptions: ComponentProps<typeof Stack>["screenOptions"] = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background },
};

const sheetOptions: ComponentProps<typeof Stack.Screen>["options"] = {
  presentation: "formSheet",
  sheetAllowedDetents: "fitToContents",
  sheetCornerRadius: radius.lg,
  contentStyle: { backgroundColor: colors.surface },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ DMSerifDisplay_400Regular });
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  useEffect(() => {
    syncReminders().catch((error) => console.warn("Couldn't refresh episode reminders:", error));
  }, []);

  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="light" />
        <Stack screenOptions={screenOptions}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="anime/[id]" />
          <Stack.Screen name="list/[kind]" />
          <Stack.Screen name="genre/[name]" />
          <Stack.Screen name="login" options={{ presentation: "modal" }} />
          <Stack.Screen name="watch-status" options={sheetOptions} />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
