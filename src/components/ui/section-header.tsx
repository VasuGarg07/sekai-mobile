import { Pressable, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Icon, type IconName } from "@/components/ui/icon";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

interface SectionHeaderProps {
  title: string;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
  /** Horizontal padding; off when the parent already pads its content. */
  inset?: boolean;
}

export function SectionHeader({
  title,
  icon,
  actionLabel = "View all",
  onAction,
  inset = true,
}: SectionHeaderProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={[styles.row, inset && styles.inset]}>
      {icon && <Icon name={icon} size={iconSize.md} color={colors.accentText} />}
      <AppText variant="headline" style={styles.title} numberOfLines={1}>
        {title}
      </AppText>
      {onAction && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel}: ${title}`}
          onPress={onAction}
          hitSlop={8}
          style={styles.action}
        >
          <AppText variant="label" tone="accent">
            {actionLabel}
          </AppText>
          <Icon name="chevron_right" size={iconSize.sm} color={colors.accentText} />
        </Pressable>
      )}
    </View>
  );
}

const useStyles = createStyles(() => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  inset: {
    paddingHorizontal: spacing.lg,
  },
  title: {
    flex: 1,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
  },
}));
