import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { ComponentProps } from "react";

import { queryClient } from "@/lib/query-client";
import { AuthProvider } from "@/providers/auth-provider";
import { colors } from "@/theme";

const screenOptions: ComponentProps<typeof Stack>["screenOptions"] = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background },
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="light" />
        <Stack screenOptions={screenOptions}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" options={{ presentation: "modal" }} />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
