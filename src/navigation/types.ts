import type { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type TabName = "Home" | "Explore" | "Watchlist" | "Profile";

export type SettingsSheetName =
  | "default-status"
  | "export"
  | "set-password"
  | "sign-out"
  | "verify-email";

// React Navigation needs `type` aliases here: an interface has no index signature and fails its ParamListBase check.
export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Watchlist: undefined;
  Profile: undefined;
};

// `kind`, `name` and `sheet` are plain strings because a deep link can put anything there; the route components validate them.
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  AnimeDetail: { id: number };
  RankedList: { kind: string };
  Genre: { name: string };
  Login: undefined;
  WatchStatus: { animeId: number; title: string };
  SettingsSheet: { sheet: string };
  ExploreFilters: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export function isTabName(value: string): value is TabName {
  return value === "Home" || value === "Explore" || value === "Watchlist" || value === "Profile";
}
