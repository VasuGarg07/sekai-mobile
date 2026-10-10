import { View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

export function OrDivider() {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <AppText variant="overline" tone="subtle">
        or
      </AppText>
      <View style={styles.line} />
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
}));
