import { View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

interface SheetHeaderProps {
  title: string;
  subtitle?: string;
}

export function SheetHeader({ title, subtitle }: SheetHeaderProps) {
  const styles = useStyles();

  return (
    <View style={styles.header}>
      <View style={styles.grabber} />
      <AppText variant="headline" numberOfLines={2}>
        {title}
      </AppText>
      {subtitle && (
        <AppText variant="label" tone="muted">
          {subtitle}
        </AppText>
      )}
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  header: {
    gap: spacing.xs,
  },
  grabber: {
    alignSelf: "center",
    width: 36,
    height: 4,
    marginBottom: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.borderStrong,
  },
}));
