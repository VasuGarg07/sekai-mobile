import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Button } from "@/components/ui/button";
import { SheetHeader } from "@/components/ui/sheet-header";
import { useAuth } from "@/providers/auth-provider";
import { resendVerification } from "@/services/auth";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import { confirmTap, showMessage } from "@/utils/feedback";

import { SheetLayout } from "./sheet-layout";

export function VerifyEmailSheet() {
  const styles = useStyles();
  const { user, refreshUser } = useAuth();
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    setSending(true);
    const result = await resendVerification();
    setSending(false);
    if (result.success) {
      setSent(true);
      showMessage("Verification email sent. Check your spam folder too.");
    } else if (result.message) {
      showMessage(result.message);
    }
  };

  const handleCheck = async () => {
    setChecking(true);
    try {
      const refreshed = await refreshUser();
      if (refreshed?.emailVerified) {
        confirmTap();
        showMessage("Email verified. Thanks!");
        router.back();
      } else {
        showMessage("Not verified yet. Open the link in the email, then try again.");
      }
    } catch {
      showMessage("Couldn't check right now. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <SheetLayout>
      <SheetHeader title="Verify your email" subtitle={user?.email ?? undefined} />
      <AppText tone="muted">
        We sent you a link when you signed up. Verifying makes sure you can reset your password if you
        ever forget it. It&apos;s optional, and everything works without it.
      </AppText>
      <View style={styles.actions}>
        <Button
          fullWidth
          variant="tonal"
          icon="send"
          title={sent ? "Email sent" : "Resend email"}
          loading={sending}
          disabled={sent || checking}
          onPress={handleResend}
        />
        <Button
          fullWidth
          icon="verified"
          title="I've verified it"
          loading={checking}
          disabled={sending}
          onPress={handleCheck}
        />
      </View>
    </SheetLayout>
  );
}

const useStyles = createStyles(() => ({
  actions: {
    gap: spacing.sm,
  },
}));
