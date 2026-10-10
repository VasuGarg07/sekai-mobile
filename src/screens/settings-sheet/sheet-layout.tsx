import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

interface SheetLayoutProps {
  children: ReactNode;
}

export function SheetLayout({ children }: SheetLayoutProps) {
  const styles = useStyles();
  const { bottom } = useSafeAreaInsets();
  return <View style={[styles.sheet, { paddingBottom: bottom + spacing.lg }]}>{children}</View>;
}

const useStyles = createStyles(() => ({
  sheet: {
    gap: spacing.lg,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
}));
