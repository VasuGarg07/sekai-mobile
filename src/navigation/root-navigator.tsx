import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { useMemo } from "react";

import { useTheme } from "@/providers/theme-provider";
import { radius } from "@/theme";

import { AnimeDetailRoute } from "./routes/anime-detail-route";
import { ExploreFiltersRoute } from "./routes/explore-filters-route";
import { GenreRoute } from "./routes/genre-route";
import { LoginRoute } from "./routes/login-route";
import { RankedListRoute } from "./routes/ranked-list-route";
import { SettingsSheetRoute } from "./routes/settings-sheet-route";
import { WatchStatusRoute } from "./routes/watch-status-route";
import { TabsNavigator } from "./tabs-navigator";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const FILTER_SHEET_DETENT = 0.88;

export function RootNavigator() {
  const theme = useTheme();

  const screenOptions = useMemo<NativeStackNavigationOptions>(
    () => ({
      headerShown: false,
      animation: "slide_from_right",
      contentStyle: { backgroundColor: theme.colors.background },
    }),
    [theme],
  );

  const sheetOptions = useMemo<NativeStackNavigationOptions>(
    () => ({
      presentation: "formSheet",
      sheetAllowedDetents: "fitToContents",
      sheetCornerRadius: radius.xl,
      animation: "slide_from_bottom",
      contentStyle: { backgroundColor: theme.colors.surface },
    }),
    [theme],
  );

  const filterSheetOptions = useMemo<NativeStackNavigationOptions>(
    () => ({ ...sheetOptions, sheetAllowedDetents: [FILTER_SHEET_DETENT] }),
    [sheetOptions],
  );

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen name="AnimeDetail" component={AnimeDetailRoute} />
      <Stack.Screen name="RankedList" component={RankedListRoute} />
      <Stack.Screen name="Genre" component={GenreRoute} />
      <Stack.Screen
        name="Login"
        component={LoginRoute}
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="WatchStatus" component={WatchStatusRoute} options={sheetOptions} />
      <Stack.Screen name="SettingsSheet" component={SettingsSheetRoute} options={sheetOptions} />
      <Stack.Screen
        name="ExploreFilters"
        component={ExploreFiltersRoute}
        options={filterSheetOptions}
      />
    </Stack.Navigator>
  );
}
