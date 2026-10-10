import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { colors, fontSize, fontWeight, lineHeight, spacing } from "@/theme";

interface ScreenStateProps {
  title?: string;
  message?: string;
  actionTitle?: string;
  onAction?: () => void;
}

export function LoadingState() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.accent} size="large" />
    </View>
  );
}

export function ErrorState({ message, onAction }: Pick<ScreenStateProps, "message" | "onAction">) {
  return (
    <MessageState
      title="Something went wrong"
      message={message}
      actionTitle={onAction ? "Try again" : undefined}
      onAction={onAction}
    />
  );
}

export function MessageState({ title, message, actionTitle, onAction }: ScreenStateProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {message && <Text style={styles.message}>{message}</Text>}
      {actionTitle && onAction && (
        <Button title={actionTitle} variant="secondary" size="sm" onPress={onAction} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    textAlign: "center",
  },
  message: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    lineHeight: lineHeight.sm,
    textAlign: "center",
  },
});
