import { StyleSheet, View, type ViewProps } from "react-native";

import { createStyles } from "@/theme/create-styles";

interface GlassViewProps extends ViewProps {
  strong?: boolean;
}

/**
 * Translucent surface for controls floating over artwork or scrolling content. It is a tinted
 * fill without a blur: a live blur re-renders everything behind it every frame, which made
 * scrolling and tab switches janky.
 */
export function GlassView({ strong = false, style, children, ...viewProps }: GlassViewProps) {
  const styles = useStyles();

  return (
    <View style={[styles.container, strong ? styles.fillStrong : styles.fill, style]} {...viewProps}>
      {children}
    </View>
  );
}

const useStyles = createStyles(({ glass }) => ({
  container: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: glass.border,
  },
  fill: {
    backgroundColor: glass.fill,
  },
  fillStrong: {
    backgroundColor: glass.fillStrong,
  },
}));
