import type { LinkingOptions } from "@react-navigation/native";

import type { RootStackParamList } from "./types";

// Same URLs the previous file-based routes exposed, so existing links keep working.
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["sekai://"],
  config: {
    // Screens opened from a link get the tabs underneath, so Back has somewhere to go.
    initialRouteName: "Tabs",
    screens: {
      Tabs: {
        screens: {
          Home: "",
          Explore: "explore",
          Watchlist: "watchlist",
          Profile: "profile",
        },
      },
      AnimeDetail: { path: "anime/:id", parse: { id: Number } },
      RankedList: "list/:kind",
      Genre: "genre/:name",
      Login: "login",
      WatchStatus: { path: "watch-status", parse: { animeId: Number } },
      SettingsSheet: "settings/:sheet",
      ExploreFilters: "explore-filters",
    },
  },
};
