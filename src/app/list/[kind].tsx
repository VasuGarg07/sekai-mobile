import { Redirect, useLocalSearchParams } from "expo-router";

import { isRankedListKind } from "@/constants";
import { RankedListScreen } from "@/screens/ranked-list";

export default function RankedListRoute() {
  const { kind } = useLocalSearchParams<{ kind: string }>();
  if (!isRankedListKind(kind)) return <Redirect href="/" />;
  return <RankedListScreen kind={kind} />;
}
