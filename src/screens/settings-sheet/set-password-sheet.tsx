import { router } from "expo-router";
import { useState } from "react";

import { PasswordField } from "@/components/password-field";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { SheetHeader } from "@/components/ui/sheet-header";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/providers/auth-provider";
import { setPassword } from "@/services/auth";
import { confirmTap, showMessage } from "@/utils/feedback";
import { isStrongPassword } from "@/utils/password-rules";

import { SheetLayout } from "./sheet-layout";

export function SetPasswordSheet() {
  const { user, refreshUser } = useAuth();
  const [password, setPasswordValue] = useState("");
  const { run, pending, error } = useAction();
  const canSubmit = isStrongPassword(password);

  const handleSubmit = async () => {
    if (!canSubmit || pending) return;
    if (!(await run(() => setPassword(password)))) return;

    confirmTap();
    showMessage("Password set. You can also sign in with your email now.");
    try {
      await refreshUser();
    } catch {
      // The password is already set; a failed refresh only delays the UI catching up.
    }
    router.back();
  };

  return (
    <SheetLayout>
      <SheetHeader
        title="Set a password"
        subtitle={`Also sign in with ${user?.email ?? "your email"}, here or on the website.`}
      />
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
      <Button
        fullWidth
        icon="key"
        title="Set password"
        loading={pending}
        disabled={!canSubmit}
        onPress={handleSubmit}
      />
    </SheetLayout>
  );
}
