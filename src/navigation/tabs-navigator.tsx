import { createBottomTabNavigator, type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";

import { GlassTabBar } from "@/components/navigation/glass-tab-bar";
import { ExploreScreen } from "@/screens/explore";
import { HomeScreen } from "@/screens/home";
import { ProfileScreen } from "@/screens/profile";
import { WatchlistScreen } from "@/screens/watchlist";

import type { TabName, TabParamList } from "./types";

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ORDER: TabName[] = ["Home", "Explore", "Watchlist", "Profile"];
const WARM_STEP_MS = 400;

// Frozen tabs skip renders (theme changes, query updates) until they are shown again.
const screenOptions = { headerShown: false, freezeOnBlur: true };

/**
 * Mounts the tabs the user hasn't opened yet, one at a time once the app is idle, so a first visit
 * switches to a screen that already exists instead of building it on the tap.
 */
function useWarmTabs(navigation: BottomTabBarProps["navigation"]) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (count >= TAB_ORDER.length) return;
    let idle: number | undefined;
    const timer = setTimeout(() => {
      idle = requestIdleCallback(() => {
        navigation.preload(TAB_ORDER[count]);
        setCount(count + 1);
      });
    }, WARM_STEP_MS);
    return () => {
      clearTimeout(timer);
      if (idle !== undefined) cancelIdleCallback(idle);
    };
  }, [count, navigation]);
}

function TabBar(props: BottomTabBarProps) {
  useWarmTabs(props.navigation);
  return <GlassTabBar {...props} />;
}

function renderTabBar(props: BottomTabBarProps) {
  return <TabBar {...props} />;
}

export function TabsNavigator() {
  return (
    <Tab.Navigator tabBar={renderTabBar} screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
