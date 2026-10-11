import { useState } from "react";
import { View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Button } from "@/components/ui/button";
import { SheetHeader } from "@/components/ui/sheet-header";
import { router } from "@/navigation/router";
import { signOut } from "@/services/auth";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import { showMessage } from "@/utils/feedback";

import { SheetLayout } from "./sheet-layout";

export function SignOutSheet() {
  const styles = useStyles();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.back();
    } catch {
      setSigningOut(false);
      showMessage("Couldn't sign out. Please try again.");
    }
  };

  return (
    <SheetLayout>
      <SheetHeader title="Sign out?" />
      <AppText tone="muted">You&apos;ll need to sign in again to see and sync your list.</AppText>
      <View style={styles.actions}>
        <View style={styles.action}>
          <Button
            fullWidth
            variant="outline"
            title="Cancel"
            disabled={signingOut}
            onPress={() => router.back()}
          />
        </View>
        <View style={styles.action}>
          <Button
            fullWidth
            variant="danger"
            icon="logout"
            title="Sign out"
            loading={signingOut}
            onPress={handleSignOut}
          />
        </View>
      </View>
    </SheetLayout>
  );
}

const useStyles = createStyles(() => ({
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  action: {
    flex: 1,
  },
}));
