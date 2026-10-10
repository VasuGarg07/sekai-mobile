import { useLocalSearchParams } from "expo-router";

import { WatchStatusSheet } from "@/screens/watch-status";

export default function WatchStatusRoute() {
  const { animeId, title } = useLocalSearchParams<{ animeId: string; title: string }>();
  return <WatchStatusSheet animeId={Number(animeId)} title={title} />;
}
