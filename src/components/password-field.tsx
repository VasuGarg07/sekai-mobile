import { useState } from "react";
import { View, type TextInputProps } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { TextField } from "@/components/ui/text-field";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import { PASSWORD_RULES } from "@/utils/password-rules";

interface PasswordFieldProps extends Omit<TextInputProps, "secureTextEntry"> {
  value: string;
  label?: string;
  showRules?: boolean;
}

export function PasswordField({
  value,
  label = "Password",
  showRules = false,
  ...inputProps
}: PasswordFieldProps) {
  const styles = useStyles();
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TextField
        label={label}
        icon="lock"
        value={value}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        accessory={
          <IconButton
            icon={visible ? "visibility_off" : "visibility"}
            accessibilityLabel={visible ? "Hide password" : "Show password"}
            onPress={() => setVisible((current) => !current)}
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
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.rules}>
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <View key={rule.label} style={styles.rule}>
            <Icon
              name={met ? "check_circle" : "radio_button_unchecked"}
              size={iconSize.sm}
              color={met ? colors.success : colors.textSubtle}
            />
            <AppText variant="caption" tone={met ? "default" : "muted"}>
              {rule.label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const useStyles = createStyles(() => ({
  container: {
    gap: spacing.sm,
  },
  rules: {
    gap: spacing.xs,
  },
  rule: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
}));
