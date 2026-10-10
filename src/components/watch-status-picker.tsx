import { Pressable, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Icon } from "@/components/ui/icon";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import { WATCH_STATUSES, type WatchStatus } from "@/types/watchlist";
import { WATCH_STATUS_ICONS, WATCH_STATUS_LABELS } from "@/utils/anime";

interface WatchStatusPickerProps {
  value: WatchStatus | null | undefined;
  onSelect: (status: WatchStatus) => void;
  disabled?: boolean;
}

export function WatchStatusPicker({ value, onSelect, disabled = false }: WatchStatusPickerProps) {
  const { colors, statusColors } = useTheme();
  const styles = useStyles();

  return (
    <View accessibilityRole="radiogroup" style={styles.list}>
      {WATCH_STATUSES.map((status) => {
        const selected = status === value;
        return (
          <Pressable
            key={status}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected, disabled }}
            disabled={disabled}
            onPress={() => onSelect(status)}
            style={({ pressed }) => [styles.row, selected && styles.selected, pressed && styles.pressed]}
          >
            <View style={[styles.iconTile, { backgroundColor: statusColors[status] }]}>
              <Icon name={WATCH_STATUS_ICONS[status]} size={iconSize.md} color={colors.onImage} />
            </View>
            <AppText variant="bodyStrong" style={styles.label}>
              {WATCH_STATUS_LABELS[status]}
            </AppText>
            {selected && <Icon name="check" size={iconSize.md} color={colors.accentText} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  list: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  selected: {
    backgroundColor: colors.accentSoft,
  },
  pressed: {
    backgroundColor: colors.surfacePressed,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
  },
}));
