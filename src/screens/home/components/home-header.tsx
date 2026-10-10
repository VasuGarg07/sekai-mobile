import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/app-text";
import { Avatar } from "@/components/ui/avatar";
import { GlassView } from "@/components/ui/glass";
import { IconButton } from "@/components/ui/icon-button";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { fonts, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import { getDisplayName } from "@/utils/user";

const LOGO_SIZE = 26;
const FADE_DISTANCE = 120;

const logoForDark = require("@/assets/images/logo-white.png");
const logoForLight = require("@/assets/images/logo-black.png");

interface HomeHeaderProps {
  scrollY: SharedValue<number>;
  solidAt: number;
}

export function HomeHeader({ scrollY, solidAt }: HomeHeaderProps) {
  const { dark } = useTheme();
  const { user } = useAuth();
  const { top } = useSafeAreaInsets();
  const styles = useStyles();

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [solidAt - FADE_DISTANCE, solidAt], [0, 1], "clamp"),
  }));

  return (
    <View style={[styles.header, { paddingTop: top + spacing.xs }]}>
      <Animated.View style={[StyleSheet.absoluteFill, backgroundStyle]} pointerEvents="none">
        <GlassView style={styles.background} />
      </Animated.View>
      <View style={styles.brandSlot}>
        <GlassView style={styles.brand}>
          <Image source={dark ? logoForDark : logoForLight} style={styles.logo} contentFit="contain" />
          <AppText style={styles.wordmark}>Sekai</AppText>
        </GlassView>
      </View>
      <IconButton
        icon="search"
        variant="glass"
        accessibilityLabel="Search anime"
        onPress={() => router.navigate("/explore")}
      />
      {user ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Your profile"
          onPress={() => router.navigate("/profile")}
          hitSlop={4}
        >
          <Avatar name={getDisplayName(user)} photoURL={user.photoURL} size={40} />
        </Pressable>
      ) : (
        <IconButton
          icon="login"
          variant="glass"
          accessibilityLabel="Sign in"
          onPress={() => router.push("/login")}
        />
      )}
    </View>
  );
}

const useStyles = createStyles(() => ({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  background: {
    flex: 1,
    borderWidth: 0,
  },
  brandSlot: {
    flex: 1,
    alignItems: "flex-start",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingLeft: spacing.sm,
    paddingRight: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  wordmark: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 28,
  },
}));
