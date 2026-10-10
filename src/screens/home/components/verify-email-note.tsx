import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { resendVerification } from "@/services/auth";
import { colors, fontSize, fontWeight, lineHeight, radius, spacing } from "@/theme";

export function VerifyEmailNote() {
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  const handleResend = async () => {
    setPending(true);
    const result = await resendVerification();
    setPending(false);

    if (result.success) {
      setSent(true);
      setStatus("Verification email sent. Check your spam folder too.");
    } else {
      setStatus(result.message);
    }
  };

  const handleCheck = async () => {
    setPending(true);
    try {
      const user = await refreshUser();
      setStatus(
        user?.emailVerified
          ? "Email verified. Thanks!"
          : "Not verified yet. Open the link in the email, then try again.",
      );
    } catch {
      setStatus("Couldn't check right now. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.body}>
        We sent you a link when you signed up. Verifying makes sure you can reset your password if
        you forget it. It&apos;s optional.
      </Text>
      <View style={styles.actions}>
        <Button
          title={sent ? "Email sent" : "Resend email"}
          variant="secondary"
          size="sm"
          disabled={pending || sent}
          onPress={handleResend}
        />
        <Button
          title="I've verified it"
          variant="secondary"
          size="sm"
          disabled={pending}
          onPress={handleCheck}
        />
      </View>
      {status && <Text style={styles.status}>{status}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    backgroundColor: colors.warningSurface,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  body: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  status: {
    color: colors.text,
    fontSize: fontSize.sm,
  },
});
