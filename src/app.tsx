import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppNavigator } from "@/navigation/app-navigator";
import { AuthProvider } from "@/providers/auth-provider";
import { ExploreFiltersProvider } from "@/providers/explore-filters-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export function App() {
  return (
    <GestureHandlerRootView style={styles.fill}>
      <SafeAreaProvider>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <ExploreFiltersProvider>
                <AppNavigator />
              </ExploreFiltersProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
