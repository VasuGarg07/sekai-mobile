import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize, spacing } from "@/theme";

export function OrDivider() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>or</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  text: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textTransform: "uppercase",
  },
});
