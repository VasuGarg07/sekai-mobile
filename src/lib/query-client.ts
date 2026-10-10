import { focusManager, QueryClient } from "@tanstack/react-query";
import { AppState } from "react-native";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

// React Query has no browser "focus" event on native; returning to the app plays that role,
// so edits made on the web show up when the user switches back.
AppState.addEventListener("change", (status) => {
  focusManager.setFocused(status === "active");
});
