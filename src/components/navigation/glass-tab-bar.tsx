import type { TabTriggerSlotProps } from "expo-router/ui";
import { useEffect, type ReactNode } from "react";
import { Pressable, View, type GestureResponderEvent, type ViewProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/app-text";
import { GlassView } from "@/components/ui/glass";
import { Icon, type IconName } from "@/components/ui/icon";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, radius, spacing, TAB_BAR_HEIGHT } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import { confirmTap } from "@/utils/feedback";

interface GlassTabBarProps extends ViewProps {
  children: ReactNode;
}

export function GlassTabBar({ children, style, ...viewProps }: GlassTabBarProps) {
  const styles = useStyles();
  const { bottom } = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { bottom: bottom + spacing.sm }]}>
      <GlassView style={[styles.bar, style]} {...viewProps}>
        {children}
      </GlassView>
    </View>
  );
}

interface TabButtonProps extends TabTriggerSlotProps {
  label: string;
  icon: IconName;
}

const SPRING = { damping: 18, stiffness: 220 };

export function TabButton({ label, icon, isFocused = false, onPress, ...props }: TabButtonProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const progress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isFocused ? 1 : 0, SPRING);
  }, [isFocused, progress]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.6 + progress.value * 0.4 }],
  }));

  const handlePress = (event: GestureResponderEvent) => {
    if (!isFocused) confirmTap();
    onPress?.(event);
  };

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: isFocused }}
      {...props}
      style={styles.tab}
      onPress={handlePress}
    >
      <View style={styles.iconWrap}>
        <Animated.View style={[styles.pill, pillStyle]} />
        <Icon name={icon} size={iconSize.lg} color={isFocused ? colors.accentText : colors.textMuted} />
      </View>
      <AppText variant="caption" tone={isFocused ? "default" : "muted"} style={isFocused && styles.labelActive}>
        {label}
      </AppText>
    </Pressable>
  );
}

const useStyles = createStyles(({ colors }) => ({
  wrapper: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
  },
  bar: {
    height: TAB_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    borderRadius: radius.xl,
  },
  tab: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xxs,
  },
  iconWrap: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: radius.full,
    backgroundColor: colors.accentSoft,
  },
  labelActive: {
    fontWeight: "700",
  },
}));
