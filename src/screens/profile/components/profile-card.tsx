import { View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { router } from "@/navigation/router";
import { useTheme } from "@/providers/theme-provider";
import { radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { SekaiUser } from "@/types/user";
import { getDisplayName, hasPassword } from "@/utils/user";

interface ProfileCardProps {
  user: SekaiUser | null;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  if (!user) {
    return (
      <View style={styles.guestCard}>
        <View style={styles.guestIcon}>
          <Icon name="person" size={32} color={colors.accentText} />
        </View>
        <View style={styles.guestText}>
          <AppText variant="subtitle" style={styles.centered}>
            You&apos;re browsing as a guest
          </AppText>
          <AppText variant="caption" tone="muted" style={styles.centered}>
            Sign in to keep a list that syncs with the Sekai website.
          </AppText>
        </View>
        <Button fullWidth icon="login" title="Sign in" onPress={() => router.openLogin()} />
      </View>
    );
  }

  const name = getDisplayName(user);
  const verified = !hasPassword(user) || user.emailVerified;

  return (
    <View style={styles.card}>
      <Avatar name={name} photoURL={user.photoURL} size={64} />
      <View style={styles.text}>
        <AppText variant="headline" numberOfLines={1}>
          {name}
        </AppText>
        {user.email && (
          <AppText variant="caption" tone="muted" numberOfLines={1}>
            {user.email}
          </AppText>
        )}
        <Badge
          variant={verified ? "accent" : "surface"}
          icon={verified ? "verified" : "mark_email_unread"}
          iconColor={verified ? colors.accentText : colors.warning}
          label={verified ? "Verified" : "Email not verified"}
        />
      </View>
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
  },
  guestCard: {
    alignItems: "center",
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
  },
  guestText: {
    alignSelf: "stretch",
    gap: spacing.xs,
  },
  centered: {
    textAlign: "center",
  },
  guestIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentSoft,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
}));
