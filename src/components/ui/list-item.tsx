import { Children, Fragment, isValidElement, type ReactNode } from "react";
import { Pressable, Switch, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Icon, type IconName } from "@/components/ui/icon";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  /** Tile color behind the icon; defaults to the accent. */
  iconColor?: string;
  /** Shown on the right, before the chevron. */
  value?: string;
  onPress?: () => void;
  /** Turns the row into a switch. */
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  trailing?: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
}

export function ListItem({
  title,
  subtitle,
  icon,
  iconColor,
  value,
  onPress,
  switchValue,
  onSwitchChange,
  trailing,
  destructive = false,
  disabled = false,
}: ListItemProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const isSwitch = switchValue !== undefined;
  const tint = destructive ? colors.danger : (iconColor ?? colors.accent);
  const glyphColor = tint === colors.accent ? colors.onAccent : colors.onImage;

  const handlePress = isSwitch ? () => onSwitchChange?.(!switchValue) : onPress;

  return (
    <Pressable
      accessibilityRole={isSwitch ? "switch" : "button"}
      accessibilityState={{ checked: isSwitch ? switchValue : undefined, disabled }}
      disabled={disabled || !handlePress}
      onPress={handlePress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, disabled && styles.disabled]}
    >
      {icon && (
        <View style={[styles.iconTile, { backgroundColor: tint }]}>
          <Icon name={icon} size={iconSize.md} color={glyphColor} />
        </View>
      )}
      <View style={styles.text}>
        <AppText variant="bodyStrong" tone={destructive ? "danger" : "default"} numberOfLines={1}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="caption" tone="muted" numberOfLines={2}>
            {subtitle}
          </AppText>
        )}
      </View>
      {value && (
        <AppText variant="label" tone="muted" numberOfLines={1} style={styles.value}>
          {value}
        </AppText>
      )}
      {trailing}
      {isSwitch && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          disabled={disabled}
          trackColor={{ false: colors.borderStrong, true: colors.accent }}
          thumbColor={colors.onImage}
        />
      )}
      {!isSwitch && onPress && !trailing && (
        <Icon name="chevron_right" size={iconSize.md} color={colors.textSubtle} />
      )}
    </Pressable>
  );
}

interface ListGroupProps {
  title?: string;
  children: ReactNode;
}

/** Rounded card of list rows with hairline dividers, like Android's settings screens. */
export function ListGroup({ title, children }: ListGroupProps) {
  const styles = useStyles();
  const rows = Children.toArray(children).filter(Boolean);

  return (
    <View style={styles.group}>
      {title && (
        <AppText variant="overline" tone="subtle" style={styles.groupTitle}>
          {title}
        </AppText>
      )}
      <View style={styles.card}>
        {rows.map((row, index) => (
          <Fragment key={isValidElement(row) ? row.key : index}>
            {index > 0 && <View style={styles.divider} />}
            {row}
          </Fragment>
        ))}
      </View>
    </View>
  );
}

const ICON_TILE = 34;

const useStyles = createStyles(({ colors }) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: 60,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  pressed: {
    backgroundColor: colors.surfacePressed,
  },
  disabled: {
    opacity: 0.5,
  },
  iconTile: {
    width: ICON_TILE,
    height: ICON_TILE,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    gap: spacing.xxs,
  },
  value: {
    maxWidth: "40%",
  },
  group: {
    gap: spacing.sm,
  },
  groupTitle: {
    paddingHorizontal: spacing.lg,
  },
  card: {
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  divider: {
    height: 1,
    marginLeft: spacing.lg + ICON_TILE + spacing.md,
    backgroundColor: colors.border,
  },
}));
