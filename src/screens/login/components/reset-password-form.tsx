import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { useAuthAction } from "@/hooks/use-auth-action";
import { sendPasswordReset } from "@/services/auth";
import { colors, fontSize, lineHeight, spacing } from "@/theme";

import { EmailField } from "./email-field";

interface ResetPasswordFormProps {
  email: string;
  onEmailChange: (email: string) => void;
}

export function ResetPasswordForm({ email, onEmailChange }: ResetPasswordFormProps) {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { run, pending, error } = useAuthAction();

  const canSubmit = email.trim() !== "";

  const handleSubmit = async () => {
    if (!canSubmit || pending) return;
    if (await run(() => sendPasswordReset(email))) setSentTo(email.trim());
  };

  if (sentTo) {
    return (
      <Text style={styles.message}>
        If an account exists for {sentTo}, we&apos;ve sent it a link to reset the password. Check
        your spam folder too.
      </Text>
    );
  }

  return (
    <View style={styles.form}>
      <Text style={styles.hint}>
        Enter the email you signed up with and we&apos;ll send you a link to choose a new password.
      </Text>
      <EmailField value={email} onChangeText={onEmailChange} onSubmitEditing={handleSubmit} />
      <FormError message={error} />
      <Button title="Send reset link" loading={pending} disabled={!canSubmit} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
  hint: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    lineHeight: lineHeight.sm,
  },
  message: {
    color: colors.text,
    fontSize: fontSize.base,
    lineHeight: lineHeight.md,
  },
});
