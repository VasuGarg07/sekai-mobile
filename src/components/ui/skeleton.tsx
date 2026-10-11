import { useEffect } from "react";
import type { DimensionValue, StyleProp, ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  makeMutable,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { radius } from "@/theme";
import { createStyles } from "@/theme/create-styles";

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  aspectRatio?: number;
  rounded?: number;
  style?: StyleProp<ViewStyle>;
}

const PULSE_MS = 900;

// One animation drives every skeleton on screen, instead of a repeating animation per block.
const pulse = makeMutable(1);
let visibleCount = 0;

function startPulse() {
  if (visibleCount++ > 0) return;
  pulse.value = withRepeat(
    withTiming(0.45, { duration: PULSE_MS, easing: Easing.inOut(Easing.ease) }),
    -1,
    true,
  );
}

function stopPulse() {
  if (--visibleCount > 0) return;
  cancelAnimation(pulse);
  pulse.value = 1;
}

/** Pulsing placeholder in the shape of content that is still loading. */
export function Skeleton({ width = "100%", height, aspectRatio, rounded = radius.md, style }: SkeletonProps) {
  const styles = useStyles();

  useEffect(() => {
    startPulse();
    return stopPulse;
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <Animated.View
      style={[styles.block, { width, height, aspectRatio, borderRadius: rounded }, animatedStyle, style]}
    />
  );
}

const useStyles = createStyles(({ colors }) => ({
  block: {
    backgroundColor: colors.skeleton,
  },
}));
