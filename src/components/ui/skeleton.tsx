import { useEffect } from "react";
import type { DimensionValue, StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
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

/** Pulsing placeholder in the shape of content that is still loading. */
export function Skeleton({ width = "100%", height, aspectRatio, rounded = radius.md, style }: SkeletonProps) {
  const styles = useStyles();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.45, { duration: PULSE_MS, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

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
