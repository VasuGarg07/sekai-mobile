import { router } from "expo-router";
import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/app-text";
import { IconButton } from "@/components/ui/icon-button";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

/** Large title for tab screens. */
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  const { top } = useSafeAreaInsets();
  const styles = useStyles();

  return (
    <View style={[styles.page, { paddingTop: top + spacing.md }]}>
      <View style={styles.titles}>
        <AppText variant="display" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="label" tone="muted">
            {subtitle}
          </AppText>
        )}
      </View>
      {actions && <View style={styles.actions}>{actions}</View>}
    </View>
  );
}

interface StackHeaderProps {
  title: string;
  actions?: ReactNode;
}

/** Back button and title for pushed screens. */
export function StackHeader({ title, actions }: StackHeaderProps) {
  const { top } = useSafeAreaInsets();
  const styles = useStyles();

  return (
    <View style={[styles.stack, { paddingTop: top + spacing.sm }]}>
      <IconButton
        icon="arrow_back"
        variant="tonal"
        accessibilityLabel="Go back"
        onPress={() => router.back()}
      />
      <AppText variant="headline" numberOfLines={1} style={styles.stackTitle}>
        {title}
      </AppText>
      {actions && <View style={styles.actions}>{actions}</View>}
    </View>
  );
}

const useStyles = createStyles(() => ({
  page: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  titles: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  stack: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  stackTitle: {
    flex: 1,
  },
}));
