import { View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { TextLink } from "@/components/ui/text-link";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

export type LoginMode = "signin" | "signup" | "reset";

interface ModeSwitchProps {
  mode: LoginMode;
  onChange: (mode: LoginMode) => void;
}

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  const styles = useStyles();

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
      <AppText variant="label" tone="muted">
        {isSignIn ? "New here?" : "Already have an account?"}
      </AppText>
      <TextLink
        title={isSignIn ? "Create an account" : "Sign in"}
        onPress={() => onChange(isSignIn ? "signup" : "signin")}
      />
    </View>
  );
}

const useStyles = createStyles(() => ({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.xs,
  },
}));
