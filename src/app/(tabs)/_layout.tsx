import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { StyleSheet } from "react-native";

import { GlassTabBar, TabButton } from "@/components/navigation/glass-tab-bar";
import { GlassBackdrop, GlassScope } from "@/components/ui/glass";

export default function TabsLayout() {
  return (
    <GlassScope>
      <Tabs style={styles.fill}>
        <GlassBackdrop style={styles.fill}>
          <TabSlot />
        </GlassBackdrop>
        <TabList asChild>
          <GlassTabBar>
            <TabTrigger name="index" href="/" asChild>
              <TabButton label="Home" icon="home" />
            </TabTrigger>
            <TabTrigger name="explore" href="/explore" asChild>
              <TabButton label="Explore" icon="explore" />
            </TabTrigger>
            <TabTrigger name="watchlist" href="/watchlist" asChild>
              <TabButton label="My List" icon="bookmarks" />
            </TabTrigger>
            <TabTrigger name="profile" href="/profile" asChild>
              <TabButton label="Profile" icon="person" />
            </TabTrigger>
          </GlassTabBar>
        </TabList>
      </Tabs>
    </GlassScope>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
