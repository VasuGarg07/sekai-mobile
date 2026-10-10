import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { PasswordField } from "@/components/password-field";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { TextField } from "@/components/ui/text-field";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/providers/auth-provider";
import { signUpWithEmail } from "@/services/auth";
import { spacing } from "@/theme";
import { isStrongPassword } from "@/utils/password-rules";

import { EmailField } from "./email-field";

interface SignUpFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSignedUp: () => void;
}

export function SignUpForm({ email, onEmailChange, onSignedUp }: SignUpFormProps) {
  const { refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { run, pending, error } = useAction();

  const canSubmit = name.trim() !== "" && email.trim() !== "" && isStrongPassword(password);

  const handleSubmit = async () => {
    if (!canSubmit || pending) return;
    if (!(await run(() => signUpWithEmail(name, email, password)))) return;

    await refreshUser();
    onSignedUp();
  };

  return (
    <View style={styles.form}>
      <TextField
        label="Name"
        icon="person"
        value={name}
        onChangeText={setName}
        autoComplete="name"
        textContentType="name"
        maxLength={50}
      />
      <EmailField value={email} onChangeText={onEmailChange} />
      <PasswordField
        value={password}
        onChangeText={setPassword}
        autoComplete="new-password"
        textContentType="newPassword"
        onSubmitEditing={handleSubmit}
        showRules
      />
      <FormError message={error} />
      <Button fullWidth icon="person_add" title="Create account" loading={pending} disabled={!canSubmit} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
});
