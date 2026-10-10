import { Redirect, useLocalSearchParams } from "expo-router";

import { WatchStatusSheet } from "@/screens/watch-status";

export default function WatchStatusRoute() {
  const { animeId, title } = useLocalSearchParams<{ animeId: string; title: string }>();
  const id = typeof animeId === "string" ? Number(animeId) : NaN;
  if (!Number.isInteger(id)) return <Redirect href="/" />;
  return <WatchStatusSheet animeId={id} title={typeof title === "string" ? title : ""} />;
}
