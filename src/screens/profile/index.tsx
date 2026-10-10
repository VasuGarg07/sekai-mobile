import { router } from "expo-router";
import { Linking, ScrollView, View } from "react-native";

import { ListGroup, ListItem } from "@/components/ui/list-item";
import { PageHeader } from "@/components/ui/page-header";
import { UpdateBanner } from "@/components/update-banner";
import { WEB_APP_URL } from "@/constants";
import { usePreferences, useUpdatePreferences } from "@/hooks/use-preferences";
import { useTabBarSpace } from "@/hooks/use-tab-bar-space";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { currentVersion } from "@/services/app-update";
import { signOut } from "@/services/auth";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { SekaiUser } from "@/types/user";
import { WATCH_STATUS_ICONS, WATCH_STATUS_LABELS } from "@/utils/anime";
import { confirmTap, showMessage } from "@/utils/feedback";
import { getSignInMethodsLabel, hasPassword } from "@/utils/user";

import { AppearanceCard } from "./components/appearance-card";
import { ProfileCard } from "./components/profile-card";

type SettingsSheet = "default-status" | "export" | "set-password" | "verify-email";

export function ProfileScreen() {
  const { tints } = useTheme();
  const styles = useStyles();
  const { user } = useAuth();
  const bottomSpace = useTabBarSpace();

  return (
    <View style={styles.screen}>
      <PageHeader title="Profile" />
      <ScrollView contentContainerStyle={{ ...styles.content, paddingBottom: bottomSpace }}>
        <ProfileCard user={user} />
        <UpdateBanner />
        <AppearanceCard />
        {user && <SignedInSettings user={user} />}
        <ListGroup title="About">
          <ListItem icon="info" title="Version" value={currentVersion} />
          <ListItem
            icon="public"
            iconColor={tints.blue}
            title="Sekai on the web"
            subtitle="Same account, same list"
            onPress={() => Linking.openURL(WEB_APP_URL)}
          />
          <ListItem
            icon="dataset"
            iconColor={tints.green}
            title="Anime data by AniList"
            onPress={() => Linking.openURL("https://anilist.co")}
          />
        </ListGroup>
      </ScrollView>
    </View>
  );
}

interface SignedInSettingsProps {
  user: SekaiUser;
}

function SignedInSettings({ user }: SignedInSettingsProps) {
  const { statusColors, tints } = useTheme();
  const preferences = usePreferences();
  const updatePreferences = useUpdatePreferences();

  const handleAdultMode = async (adultMode: boolean) => {
    confirmTap();
    const result = await updatePreferences.mutateAsync({ adultMode });
    if (!result.success && result.message) showMessage(result.message);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      showMessage("Couldn't sign out. Please try again.");
    }
  };

  const openSheet = (sheet: SettingsSheet) =>
    router.push({ pathname: "/settings/[sheet]", params: { sheet } });

  return (
    <>
      <ListGroup title="My List">
        <ListItem
          icon={WATCH_STATUS_ICONS[preferences.defaultWatchStatus]}
          iconColor={statusColors[preferences.defaultWatchStatus]}
          title="Default status"
          subtitle="Used when you add something to your list"
          value={WATCH_STATUS_LABELS[preferences.defaultWatchStatus]}
          onPress={() => openSheet("default-status")}
        />
        <ListItem
          icon="download"
          iconColor={tints.green}
          title="Export list"
          subtitle="CSV, JSON or XML"
          onPress={() => openSheet("export")}
        />
      </ListGroup>

      <ListGroup title="Content">
        <ListItem
          icon="explicit"
          iconColor={tints.red}
          title="18+ Mode"
          subtitle="Show adult titles and genres. You must be 18 or older."
          switchValue={preferences.adultMode}
          onSwitchChange={handleAdultMode}
          disabled={updatePreferences.isPending}
        />
      </ListGroup>

      <ListGroup title="Account">
        <ListItem
          icon="badge"
          iconColor={tints.indigo}
          title="Signed in with"
          value={getSignInMethodsLabel(user)}
        />
        {!hasPassword(user) && user.email && (
          <ListItem
            icon="key"
            iconColor={tints.amber}
            title="Set a password"
            subtitle="Also sign in with your email"
            onPress={() => openSheet("set-password")}
          />
        )}
        {hasPassword(user) && !user.emailVerified && (
          <ListItem
            icon="mark_email_unread"
            iconColor={tints.yellow}
            title="Verify your email"
            subtitle="So you can always reset your password"
            onPress={() => openSheet("verify-email")}
          />
        )}
        <ListItem icon="logout" title="Sign out" destructive onPress={handleSignOut} />
      </ListGroup>
    </>
  );
}

const useStyles = createStyles(({ colors }) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
}));
