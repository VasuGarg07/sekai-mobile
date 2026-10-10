import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { MessageState } from "@/components/ui/screen-state";
import { UpdateBanner } from "@/components/update-banner";
import { ScreenHeader } from "@/components/ui/screen-header";
import { useAuth } from "@/providers/auth-provider";
import { currentVersion } from "@/services/app-update";
import { signOut } from "@/services/auth";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import type { SekaiUser } from "@/types/user";
import { getDisplayName, getSignInMethodsLabel, hasPassword } from "@/utils/user";

import { ExportSection } from "./components/export-section";
import { PreferenceSection } from "./components/preference-section";
import { SetPasswordForm } from "./components/set-password-form";
import { VerifyEmailNote } from "./components/verify-email-note";

export function ProfileScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Profile" showBack={false} />
      {user ? (
        <SignedInProfile user={user} />
      ) : (
        <MessageState
          title="You're browsing as a guest"
          message="Sign in to keep a watchlist that syncs with the Sekai website."
          actionTitle="Sign in"
          onAction={() => router.push("/login")}
        />
      )}
    </View>
  );
}

interface SignedInProfileProps {
  user: SekaiUser;
}

function SignedInProfile({ user }: SignedInProfileProps) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <UpdateBanner />
      <View style={styles.account}>
        <Text style={styles.name}>{getDisplayName(user)}</Text>
        <Text style={styles.detail}>{user.email}</Text>
        <Text style={styles.detail}>Signed in with {getSignInMethodsLabel(user)}</Text>
      </View>
      {hasPassword(user) && !user.emailVerified && <VerifyEmailNote />}
      <PreferenceSection />
      <ExportSection />
      {!hasPassword(user) && user.email && <SetPasswordForm email={user.email} />}
      <Button title="Sign out" variant="secondary" onPress={signOut} />
      <Text style={styles.version}>Sekai {currentVersion}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.xl,
    padding: spacing.lg,
  },
  account: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  detail: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
  version: {
    color: colors.textSubtle,
    fontSize: fontSize.xs,
    textAlign: "center",
  },
});
