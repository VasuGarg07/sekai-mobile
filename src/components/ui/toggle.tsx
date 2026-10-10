import { useEffect, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet } from "react-native";

import { useTheme } from "@/providers/theme-provider";
import { radius } from "@/theme";

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 32;
const THUMB_SIZE = 24;
const THUMB_INSET = (TRACK_HEIGHT - THUMB_SIZE) / 2;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_INSET * 2;

/** Switch whose only touch target is the control itself, animating from its `value`. */
export function Toggle({ value, onValueChange, disabled = false, accessibilityLabel }: ToggleProps) {
  const { colors } = useTheme();
  const [progress] = useState(() => new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, value]);

  const trackColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.borderStrong, colors.accent],
  });
  const thumbX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_INSET, THUMB_INSET + THUMB_TRAVEL],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={() => onValueChange(!value)}
    >
      <Animated.View
        style={[styles.track, { backgroundColor: trackColor }, disabled && styles.disabled]}
      >
        <Animated.View
          style={[styles.thumb, { backgroundColor: colors.onImage, transform: [{ translateX: thumbX }] }]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: radius.full,
  },
  thumb: {
    position: "absolute",
    top: THUMB_INSET,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.full,
  },
  disabled: {
    opacity: 0.5,
  },
});
