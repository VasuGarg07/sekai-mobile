import { useSafeAreaInsets } from "react-native-safe-area-context";

import { spacing, TAB_BAR_HEIGHT } from "@/theme";

/** Bottom padding that keeps the last item of a tab screen clear of the floating tab bar. */
export function useTabBarSpace(): number {
  const { bottom } = useSafeAreaInsets();
  return bottom + TAB_BAR_HEIGHT + spacing.xl;
}
