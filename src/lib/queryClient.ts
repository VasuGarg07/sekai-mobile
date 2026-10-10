import { focusManager, QueryClient } from "@tanstack/react-query";
import { AppState, Platform } from "react-native";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
        },
    },
});

if (Platform.OS !== "web") {
    AppState.addEventListener("change", (status) => {
        focusManager.setFocused(status === "active");
    });
}
