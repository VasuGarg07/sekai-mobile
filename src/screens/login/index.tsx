import { Redirect, router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { TextLink } from "@/components/ui/text-link";
import { useAuthAction } from "@/hooks/use-auth-action";
import { useAuth } from "@/providers/auth-provider";
import { signInWithGoogle } from "@/services/auth";
import { colors, fontSize, fontWeight, spacing } from "@/theme";

import { ModeSwitch, type LoginMode } from "./components/mode-switch";
import { OrDivider } from "./components/or-divider";
import { ResetPasswordForm } from "./components/reset-password-form";
import { SignInForm } from "./components/sign-in-form";
import { SignUpForm } from "./components/sign-up-form";

const TITLES: Record<LoginMode, string> = {
  signin: "Sign in",
  signup: "Create account",
  reset: "Reset password",
};

export function LoginScreen() {
  const { user } = useAuth();
  // Only an already signed-in user is redirected; a sign-in on this screen closes it itself.
  const [signedInOnOpen] = useState(user !== null);
  const [mode, setMode] = useState<LoginMode>("signin");
  const [email, setEmail] = useState("");
  const google = useAuthAction();

  if (signedInOnOpen) return <Redirect href="/" />;

  const handleClose = () => router.back();

  const handleGoogle = async () => {
    if (await google.run(signInWithGoogle)) handleClose();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TextLink title="Close" tone="muted" onPress={handleClose} style={styles.close} />
          <Text style={styles.title}>{TITLES[mode]}</Text>

          {mode !== "reset" && (
            <>
              <Button
                title="Continue with Google"
                variant="light"
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  close: {
    alignSelf: "flex-end",
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
});
