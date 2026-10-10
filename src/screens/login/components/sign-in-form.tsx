import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { PasswordField } from "@/components/password-field";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { TextLink } from "@/components/ui/text-link";
import { useAuthAction } from "@/hooks/use-auth-action";
import { signInWithEmail } from "@/services/auth";
import { spacing } from "@/theme";

import { EmailField } from "./email-field";

interface SignInFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  onForgotPassword: () => void;
  onSignedIn: () => void;
}

export function SignInForm({ email, onEmailChange, onForgotPassword, onSignedIn }: SignInFormProps) {
  const [password, setPassword] = useState("");
  const { run, pending, error } = useAuthAction();

  const canSubmit = email.trim() !== "" && password !== "";

  const handleSubmit = async () => {
    if (!canSubmit || pending) return;
    if (await run(() => signInWithEmail(email, password))) onSignedIn();
  };

  return (
    <View style={styles.form}>
      <EmailField value={email} onChangeText={onEmailChange} />
      <PasswordField
        value={password}
        onChangeText={setPassword}
        autoComplete="current-password"
        textContentType="password"
        onSubmitEditing={handleSubmit}
      />
      <TextLink title="Forgot password?" onPress={onForgotPassword} style={styles.forgot} />
      <FormError message={error} />
      <Button title="Sign in" loading={pending} disabled={!canSubmit} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
  forgot: {
    alignSelf: "flex-end",
  },
});
