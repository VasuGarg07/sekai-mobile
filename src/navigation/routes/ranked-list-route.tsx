import { isRankedListKind } from "@/constants";
import { RankedListScreen } from "@/screens/ranked-list";

import { Redirect } from "../redirect";
import type { RootStackScreenProps } from "../types";

export function RankedListRoute({ route }: RootStackScreenProps<"RankedList">) {
  const { kind } = route.params;
  if (!isRankedListKind(kind)) return <Redirect to="home" />;
  return <RankedListScreen kind={kind} />;
}
