import { StyleSheet, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/app-text";
import { GlassView } from "@/components/ui/glass";
import { IconButton } from "@/components/ui/icon-button";
import { router } from "@/navigation/router";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

import { BANNER_HEIGHT } from "./detail-hero";

interface DetailTopBarProps {
  title: string;
  scrollY: SharedValue<number>;
  onShare: () => void;
}

export function DetailTopBar({ title, scrollY, onShare }: DetailTopBarProps) {
  const { top } = useSafeAreaInsets();
  const styles = useStyles();

  const solidStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [BANNER_HEIGHT * 0.5, BANNER_HEIGHT * 0.85], [0, 1], "clamp"),
  }));

  return (
    <View style={[styles.bar, { paddingTop: top + spacing.xs }]}>
      <Animated.View style={[StyleSheet.absoluteFill, solidStyle]} pointerEvents="none">
        <GlassView style={styles.background} />
      </Animated.View>
      <IconButton icon="arrow_back" variant="glass" accessibilityLabel="Go back" onPress={() => router.back()} />
      <Animated.View style={[styles.titleSlot, solidStyle]}>
        <AppText variant="subtitle" numberOfLines={1}>
          {title}
        </AppText>
      </Animated.View>
      <IconButton icon="share" variant="glass" accessibilityLabel="Share" onPress={onShare} />
    </View>
  );
}

const useStyles = createStyles(() => ({
  bar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  background: {
    flex: 1,
    borderWidth: 0,
  },
  titleSlot: {
    flex: 1,
  },
}));
