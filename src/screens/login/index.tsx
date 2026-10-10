import { Image } from "expo-image";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/app-text";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { IconButton } from "@/components/ui/icon-button";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { signInWithGoogle } from "@/services/auth";
import { iconSize, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

import { ModeSwitch, type LoginMode } from "./components/mode-switch";
import { OrDivider } from "./components/or-divider";
import { ResetPasswordForm } from "./components/reset-password-form";
import { SignInForm } from "./components/sign-in-form";
import { SignUpForm } from "./components/sign-up-form";

const COPY: Record<LoginMode, { title: string; subtitle: string }> = {
  signin: { title: "Welcome back", subtitle: "Sign in to sync your list with the Sekai website." },
  signup: { title: "Create account", subtitle: "One list for the app and the website." },
  reset: { title: "Reset password", subtitle: "We'll email you a link to choose a new one." },
};

const LOGO_SIZE = 56;
const logoForDark = require("@/assets/images/logo-white.png");
const logoForLight = require("@/assets/images/logo-black.png");
const googleLogo = require("@/assets/images/google.svg");

export function LoginScreen() {
  const { dark } = useTheme();
  const styles = useStyles();
  const { user } = useAuth();
  // Only an already signed-in user is redirected; a sign-in on this screen closes it itself.
  const [signedInOnOpen] = useState(user !== null);
  const [mode, setMode] = useState<LoginMode>("signin");
  const [email, setEmail] = useState("");
  const google = useAction();

  if (signedInOnOpen) return <Redirect href="/" />;

  const handleClose = () => router.back();

  const handleGoogle = async () => {
    if (await google.run(signInWithGoogle)) handleClose();
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.topRow}>
            <Image source={dark ? logoForDark : logoForLight} style={styles.logo} contentFit="contain" />
            <IconButton icon="close" variant="tonal" accessibilityLabel="Close" onPress={handleClose} />
          </View>

          <View style={styles.heading}>
            <AppText variant="display">{COPY[mode].title}</AppText>
            <AppText tone="muted">{COPY[mode].subtitle}</AppText>
          </View>

          {mode !== "reset" && (
            <>
              <Button
                fullWidth
                variant="outline"
                leading={<Image source={googleLogo} style={styles.googleLogo} contentFit="contain" />}
                title="Continue with Google"
                loading={google.pending}
                onPress={handleGoogle}
              />
              <FormError message={google.error} />
              <OrDivider />
            </>
          )}

          {mode === "signin" && (
            <SignInForm
              email={email}
              onEmailChange={setEmail}
              onForgotPassword={() => setMode("reset")}
              onSignedIn={handleClose}
            />
          )}
          {mode === "signup" && (
            <SignUpForm email={email} onEmailChange={setEmail} onSignedUp={handleClose} />
          )}
          {mode === "reset" && <ResetPasswordForm email={email} onEmailChange={setEmail} />}

          <ModeSwitch mode={mode} onChange={setMode} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = createStyles(({ colors }) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    gap: spacing.lg,
    padding: spacing.xl,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  googleLogo: {
    width: iconSize.md,
    height: iconSize.md,
  },
  heading: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
}));
