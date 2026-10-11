import { WatchStatusSheet } from "@/screens/watch-status";

import { Redirect } from "../redirect";
import type { RootStackScreenProps } from "../types";

export function WatchStatusRoute({ route }: RootStackScreenProps<"WatchStatus">) {
  const { animeId, title } = route.params;
  if (!Number.isInteger(animeId)) return <Redirect to="home" />;
  return <WatchStatusSheet animeId={animeId} title={typeof title === "string" ? title : ""} />;
}
