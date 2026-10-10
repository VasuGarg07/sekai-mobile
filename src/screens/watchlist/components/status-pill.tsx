import { View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Icon } from "@/components/ui/icon";
import { useTheme } from "@/providers/theme-provider";
import { radius, spacing, withAlpha } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { WatchStatus } from "@/types/watchlist";
import { WATCH_STATUS_ICONS, WATCH_STATUS_LABELS } from "@/utils/anime";

interface StatusPillProps {
  status: WatchStatus;
}

export function StatusPill({ status }: StatusPillProps) {
  const { statusColors } = useTheme();
  const styles = useStyles();
  const color = statusColors[status];

  return (
    <View style={[styles.pill, { backgroundColor: withAlpha(color, 0.16) }]}>
      <Icon name={WATCH_STATUS_ICONS[status]} size={14} color={color} />
      <AppText variant="caption" style={[styles.label, { color }]}>
        {WATCH_STATUS_LABELS[status]}
      </AppText>
    </View>
  );
}

const useStyles = createStyles(() => ({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },
  label: {
    fontWeight: "700",
  },
}));
