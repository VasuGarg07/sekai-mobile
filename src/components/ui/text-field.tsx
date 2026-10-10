import type { ReactNode } from "react";
import { TextInput, View, type TextInputProps } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Icon, type IconName } from "@/components/ui/icon";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, radius, spacing, typography } from "@/theme";
import { createStyles } from "@/theme/create-styles";

interface TextFieldProps extends TextInputProps {
  label: string;
  icon?: IconName;
  accessory?: ReactNode;
}

export function TextField({ label, icon, accessory, style, ...inputProps }: TextFieldProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <AppText variant="label" tone="muted">
        {label}
      </AppText>
      <View style={styles.field}>
        {icon && <Icon name={icon} size={iconSize.md} color={colors.textSubtle} />}
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.accent}
          style={[styles.input, style]}
          {...inputProps}
        />
        {accessory}
      </View>
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  container: {
    gap: spacing.xs,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.md,
  },
}));
