import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { IconButton } from "@/components/ui/icon-button";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

const FADE_MS = 150;

interface ScrollToTopButtonProps {
  visible: boolean;
  onPress: () => void;
  /** Distance from the bottom of the list's container to the button. */
  bottomOffset: number;
}

export function ScrollToTopButton({ visible, onPress, bottomOffset }: ScrollToTopButtonProps) {
  const styles = useStyles();
  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(FADE_MS)}
      exiting={FadeOut.duration(FADE_MS)}
      style={[styles.wrapper, { bottom: bottomOffset }]}
    >
      <IconButton icon="arrow_upward" variant="tonal" accessibilityLabel="Scroll to top" onPress={onPress} />
    </Animated.View>
  );
}

const useStyles = createStyles(() => ({
  wrapper: {
    position: "absolute",
    right: spacing.lg,
  },
}));
