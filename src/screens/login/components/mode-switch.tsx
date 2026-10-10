import { StyleSheet, Text, View } from "react-native";

import { TextLink } from "@/components/ui/text-link";
import { colors, fontSize, spacing } from "@/theme";

export type LoginMode = "signin" | "signup" | "reset";

interface ModeSwitchProps {
  mode: LoginMode;
  onChange: (mode: LoginMode) => void;
}

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  if (mode === "reset") {
    return (
      <View style={styles.row}>
        <TextLink title="Back to sign in" onPress={() => onChange("signin")} />
      </View>
    );
  }

  const isSignIn = mode === "signin";

  return (
    <View style={styles.row}>
      <Text style={styles.prompt}>{isSignIn ? "New here?" : "Already have an account?"}</Text>
      <TextLink
        title={isSignIn ? "Create an account" : "Sign in"}
        onPress={() => onChange(isSignIn ? "signup" : "signin")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.xs,
  },
  prompt: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
});
