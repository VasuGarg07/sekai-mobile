import { DarkTheme, DefaultTheme, NavigationContainer, type Theme } from "@react-navigation/native";
import { useEffect, useMemo } from "react";
import { StatusBar } from "react-native";
import RNBootSplash from "react-native-bootsplash";

import { useSessionPrefetch } from "@/hooks/use-session-prefetch";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";

import { linking } from "./linking";
import { RootNavigator } from "./root-navigator";
import { navigationRef } from "./router";

export function AppNavigator() {
  const theme = useTheme();
  const { initialized } = useAuth();
  useSessionPrefetch();

  // Until Firebase restores the saved session, screens would render as signed out.
  useEffect(() => {
    if (initialized) RNBootSplash.hide({ fade: true });
  }, [initialized]);

  const navigationTheme = useMemo<Theme>(() => {
    const base = theme.dark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: theme.colors.accent,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
      },
    };
  }, [theme]);

  return (
    <>
      <StatusBar
        barStyle={theme.dark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <NavigationContainer ref={navigationRef} linking={linking} theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}
