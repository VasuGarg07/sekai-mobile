import { defaultTabsSlotRender, TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { GlassTabBar, TabButton } from "@/components/navigation/glass-tab-bar";

const TAB_COUNT = 4;
const WARM_STEP_MS = 400;

/**
 * Mounts the tabs the user hasn't opened yet, one at a time once the app is idle, so a first visit
 * switches to a screen that already exists instead of building it on the tap.
 */
function useWarmTabCount(): number {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (count >= TAB_COUNT) return;
    let idle: number | undefined;
    const timer = setTimeout(() => {
      idle = requestIdleCallback(() => setCount(count + 1));
    }, WARM_STEP_MS);
    return () => {
      clearTimeout(timer);
      if (idle !== undefined) cancelIdleCallback(idle);
    };
  }, [count]);

  return count;
}

export default function TabsLayout() {
  const warmCount = useWarmTabCount();

  return (
    <Tabs style={styles.fill}>
      <TabSlot
        renderFn={(descriptor, options) =>
          defaultTabsSlotRender(
            // Frozen tabs skip renders (theme changes, query updates) until they are shown again.
            { ...descriptor, options: { ...descriptor.options, freezeOnBlur: true } },
            { ...options, loaded: options.loaded || options.index < warmCount },
          )
        }
      />
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
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
