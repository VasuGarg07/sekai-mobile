import { View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Icon } from "@/components/ui/icon";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

interface FormErrorProps {
  message: string | null;
}

export function FormError({ message }: FormErrorProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  if (!message) return null;

  return (
    <View accessibilityRole="alert" style={styles.container}>
      <Icon name="error" size={iconSize.md} color={colors.danger} />
      <AppText variant="label" tone="danger" style={styles.text}>
        {message}
      </AppText>
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
  },
  text: {
    flex: 1,
  },
}));
