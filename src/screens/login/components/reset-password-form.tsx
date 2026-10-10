import { useState } from "react";
import { View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { MessageState } from "@/components/ui/screen-state";
import { useAction } from "@/hooks/use-action";
import { sendPasswordReset } from "@/services/auth";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

import { EmailField } from "./email-field";

interface ResetPasswordFormProps {
  email: string;
  onEmailChange: (email: string) => void;
}

export function ResetPasswordForm({ email, onEmailChange }: ResetPasswordFormProps) {
  const styles = useStyles();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { run, pending, error } = useAction();

  const canSubmit = email.trim() !== "";

  const handleSubmit = async () => {
    if (!canSubmit || pending) return;
    if (await run(() => sendPasswordReset(email))) setSentTo(email.trim());
  };

  if (sentTo) {
    return (
      <MessageState
        icon="mark_email_read"
        title="Check your inbox"
        message={`If an account exists for ${sentTo}, we've sent it a link to reset the password. Check your spam folder too.`}
      />
    );
  }

  return (
    <View style={styles.form}>
      <AppText tone="muted">
        Enter the email you signed up with and we&apos;ll send you a link to choose a new password.
      </AppText>
      <EmailField value={email} onChangeText={onEmailChange} onSubmitEditing={handleSubmit} />
      <FormError message={error} />
      <Button
        fullWidth
        icon="send"
        title="Send reset link"
        loading={pending}
        disabled={!canSubmit}
        onPress={handleSubmit}
      />
    </View>
  );
}

const useStyles = createStyles(() => ({
  form: {
    gap: spacing.lg,
  },
}));
