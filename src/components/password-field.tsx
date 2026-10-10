import { useState } from "react";
import { StyleSheet, Text, View, type TextInputProps } from "react-native";

import { TextField } from "@/components/ui/text-field";
import { TextLink } from "@/components/ui/text-link";
import { colors, fontSize, spacing } from "@/theme";
import { PASSWORD_RULES } from "@/utils/password-rules";

interface PasswordFieldProps extends Omit<TextInputProps, "secureTextEntry"> {
  value: string;
  label?: string;
  /** Lists the password requirements and ticks them off while typing. */
  showRules?: boolean;
}

export function PasswordField({
  value,
  label = "Password",
  showRules = false,
  ...inputProps
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  const handleToggleVisible = () => setVisible((current) => !current);

  return (
    <View style={styles.container}>
      <TextField
        label={label}
        value={value}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        accessory={
          <TextLink
            title={visible ? "Hide" : "Show"}
            accessibilityLabel={visible ? "Hide password" : "Show password"}
            onPress={handleToggleVisible}
            style={styles.toggle}
          />
        }
        {...inputProps}
      />
      {showRules && <PasswordRules password={value} />}
    </View>
  );
}

interface PasswordRulesProps {
  password: string;
}

function PasswordRules({ password }: PasswordRulesProps) {
  return (
    <View style={styles.rules}>
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <Text key={rule.label} style={[styles.rule, met && styles.ruleMet]}>
            {met ? "✓" : "•"} {rule.label}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  toggle: {
    paddingHorizontal: spacing.md,
  },
  rules: {
    gap: spacing.xxs,
  },
  rule: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  ruleMet: {
    color: colors.success,
  },
});
