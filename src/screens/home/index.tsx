import { router } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { signOut } from "@/services/auth";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import type { SekaiUser } from "@/types/user";
import { getDisplayName, getSignInMethodsLabel, hasPassword } from "@/utils/user";

import { VerifyEmailNote } from "./components/verify-email-note";

// Placeholder until the real screens (Phase 6).
export function HomeScreen() {
  const { user, initialized } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Sekai</Text>
        {!initialized && <ActivityIndicator color={colors.textMuted} />}
        {initialized && user && <SignedIn user={user} />}
        {initialized && !user && <SignedOut />}
      </View>
    </SafeAreaView>
  );
}

interface SignedInProps {
  user: SekaiUser;
}

function SignedIn({ user }: SignedInProps) {
  return (
    <>
      <Text style={styles.subtitle}>Signed in as {getDisplayName(user)}</Text>
      <Text style={styles.muted}>{user.email}</Text>
      <Text style={styles.muted}>{getSignInMethodsLabel(user)}</Text>
      {hasPassword(user) && !user.emailVerified && <VerifyEmailNote />}
      <Button title="Sign out" variant="secondary" onPress={signOut} />
    </>
  );
}

function SignedOut() {
  return (
    <>
      <Text style={styles.subtitle}>Not signed in.</Text>
      <Button title="Sign in" onPress={() => router.push("/login")} />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    color: colors.text,
    fontSize: fontSize.lg,
  },
  muted: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
});
