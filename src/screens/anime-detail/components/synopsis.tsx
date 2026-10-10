import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors, fontSize, fontWeight, lineHeight, spacing } from "@/theme";

const COLLAPSED_LINES = 5;

interface SynopsisProps {
  text: string;
}

export function Synopsis({ text }: SynopsisProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={expanded ? "Shows less" : "Shows the full synopsis"}
      onPress={() => setExpanded((current) => !current)}
    >
      <Text style={styles.text} numberOfLines={expanded ? undefined : COLLAPSED_LINES}>
        {text}
      </Text>
      <Text style={styles.toggle}>{expanded ? "Show less" : "Read more"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
  },
  toggle: {
    color: colors.accent,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.xs,
  },
});
