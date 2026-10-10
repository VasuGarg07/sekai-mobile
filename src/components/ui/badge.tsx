import { View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { GlassView } from "@/components/ui/glass";
import { Icon, type IconName } from "@/components/ui/icon";
import { useTheme } from "@/providers/theme-provider";
import { radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

type BadgeVariant = "surface" | "accent" | "glass";

interface BadgeProps {
  label: string;
  icon?: IconName;
  iconColor?: string;
  variant?: BadgeVariant;
}

const ICON_SIZE = 13;

export function Badge({ label, icon, iconColor, variant = "surface" }: BadgeProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const tone = variant === "accent" ? "accent" : variant === "glass" ? "default" : "muted";

  const content = (
    <>
      {icon && <Icon name={icon} size={ICON_SIZE} color={iconColor ?? colors.textMuted} />}
      <AppText variant="caption" tone={tone} style={styles.label}>
        {label}
      </AppText>
    </>
  );

  if (variant === "glass") return <GlassView strong style={styles.badge}>{content}</GlassView>;
  return <View style={[styles.badge, styles[variant]]}>{content}</View>;
}

const useStyles = createStyles(({ colors }) => ({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },
  label: {
    fontWeight: "600",
  },
  surface: {
    backgroundColor: colors.surfaceRaised,
  },
  accent: {
    backgroundColor: colors.accentSoft,
  },
}));
