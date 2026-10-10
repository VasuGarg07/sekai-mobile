import { useState } from "react";
import { Pressable, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

const COLLAPSED_LINES = 4;

interface SynopsisProps {
  text: string;
}

export function Synopsis({ text }: SynopsisProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <SectionHeader title="Story" icon="auto_stories" inset={false} />
      <Pressable
        accessibilityRole="button"
        accessibilityHint={expanded ? "Shows less" : "Shows the full story"}
        onPress={() => setExpanded((current) => !current)}
        style={styles.body}
      >
        <AppText tone="muted" numberOfLines={expanded ? undefined : COLLAPSED_LINES}>
          {text}
        </AppText>
        <View style={styles.toggle}>
          <AppText variant="label" tone="accent">
            {expanded ? "Show less" : "Read more"}
          </AppText>
          <Icon name={expanded ? "expand_less" : "expand_more"} size={iconSize.md} color={colors.accentText} />
        </View>
      </Pressable>
    </View>
  );
}

const useStyles = createStyles(() => ({
  container: {
    gap: spacing.md,
  },
  body: {
    gap: spacing.xs,
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
  },
}));
