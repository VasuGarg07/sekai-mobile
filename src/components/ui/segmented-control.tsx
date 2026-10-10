import { Pressable, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Icon, type IconName } from "@/components/ui/icon";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

export interface Segment<T extends string> {
  value: T;
  label: string;
  icon?: IconName;
}

interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View accessibilityRole="radiogroup" style={styles.track}>
      {segments.map((segment) => {
        const selected = segment.value === value;
        return (
          <Pressable
            key={segment.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(segment.value)}
            style={[styles.segment, selected && styles.selected]}
          >
            {segment.icon && (
              <Icon
                name={segment.icon}
                size={iconSize.sm}
                color={selected ? colors.onAccent : colors.textMuted}
              />
            )}
            <AppText variant="label" tone={selected ? "onAccent" : "muted"}>
              {segment.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  track: {
    flexDirection: "row",
    padding: spacing.xs,
    gap: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceRaised,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  selected: {
    backgroundColor: colors.accent,
  },
}));
