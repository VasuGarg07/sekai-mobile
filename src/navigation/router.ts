import { createNavigationContainerRef, StackActions } from "@react-navigation/native";

import type { RankedListKind } from "@/constants";

import type { RootStackParamList, SettingsSheetName, TabName } from "./types";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

function push(name: keyof RootStackParamList, params?: object) {
  if (navigationRef.isReady()) navigationRef.dispatch(StackActions.push(name, params));
}

export const router = {
  back() {
    if (navigationRef.isReady() && navigationRef.canGoBack()) navigationRef.goBack();
  },
  openAnime(id: number) {
    push("AnimeDetail", { id });
  },
  openGenre(name: string) {
    push("Genre", { name });
  },
  openRankedList(kind: RankedListKind) {
    push("RankedList", { kind });
  },
  openLogin() {
    push("Login");
  },
  openWatchStatus(animeId: number, title: string) {
    push("WatchStatus", { animeId, title });
  },
  openSettingsSheet(sheet: SettingsSheetName) {
    push("SettingsSheet", { sheet });
  },
  openExploreFilters() {
    push("ExploreFilters");
  },
  /** Closes any screens above the tabs and shows the given tab. */
  showTab(tab: TabName) {
    if (!navigationRef.isReady()) return;
    // popTo returns to the existing tabs screen (or adds it); navigate then selects the tab inside it.
    navigationRef.dispatch(StackActions.popTo("Tabs"));
    navigationRef.navigate("Tabs", { screen: tab });
  },
  goHome() {
    router.showTab("Home");
  },
};
