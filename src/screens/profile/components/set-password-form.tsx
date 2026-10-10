import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PasswordField } from "@/components/password-field";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/providers/auth-provider";
import { setPassword } from "@/services/auth";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";
import { showMessage } from "@/utils/feedback";
import { isStrongPassword } from "@/utils/password-rules";

interface SetPasswordFormProps {
  email: string;
}

export function SetPasswordForm({ email }: SetPasswordFormProps) {
  const { refreshUser } = useAuth();
  const [password, setPasswordValue] = useState("");
  const { run, pending, error } = useAction();

  const canSubmit = isStrongPassword(password);

  const handleSubmit = async () => {
    if (!canSubmit || pending) return;
    if (!(await run(() => setPassword(password)))) return;

    setPasswordValue("");
    showMessage("Password set. You can also sign in with your email now.");
    await refreshUser();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Set a password</Text>
      <Text style={styles.description}>
        Add a password to also sign in with {email}, here or on the website.
      </Text>
      <PasswordField
        label="New password"
        value={password}
        onChangeText={setPasswordValue}
        autoComplete="new-password"
        textContentType="newPassword"
        onSubmitEditing={handleSubmit}
        showRules
      />
      <FormError message={error} />
      <Button title="Set password" loading={pending} disabled={!canSubmit} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  heading: {
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  description: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
