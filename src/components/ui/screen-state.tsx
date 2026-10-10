import { ActivityIndicator, View, type StyleProp, type ViewStyle } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Button } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { useTheme } from "@/providers/theme-provider";
import { radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

interface MessageStateProps {
  icon?: IconName;
  title?: string;
  message?: string;
  actionTitle?: string;
  actionIcon?: IconName;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function MessageState({
  icon,
  title,
  message,
  actionTitle,
  actionIcon,
  onAction,
  style,
}: MessageStateProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={[styles.container, style]}>
      {icon && (
        <View style={styles.iconCircle}>
          <Icon name={icon} size={32} color={colors.accentText} />
        </View>
      )}
      {title && (
        <AppText variant="headline" align="center">
          {title}
        </AppText>
      )}
      {message && (
        <AppText tone="muted" align="center">
          {message}
        </AppText>
      )}
      {actionTitle && onAction && (
        // Button aligns itself to the start, so it needs a centred wrapper.
        <View style={styles.action}>
          <Button title={actionTitle} icon={actionIcon} variant="tonal" onPress={onAction} />
        </View>
      )}
    </View>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ErrorState({ message, onRetry, style }: ErrorStateProps) {
  return (
    <MessageState
      icon="cloud_off"
      title="Something went wrong"
      message={message}
      actionTitle={onRetry ? "Try again" : undefined}
      actionIcon="refresh"
      onAction={onRetry}
      style={style}
    />
  );
}

export function LoadingState() {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.accent} size="large" />
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.xxl,
  },
  action: {
    alignSelf: "center",
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
    backgroundColor: colors.accentSoft,
  },
}));
