import { AnimeDetailScreen } from "@/screens/anime-detail";

import { Redirect } from "../redirect";
import type { RootStackScreenProps } from "../types";

export function AnimeDetailRoute({ route }: RootStackScreenProps<"AnimeDetail">) {
  const { id } = route.params;
  if (!Number.isInteger(id)) return <Redirect to="home" />;
  return <AnimeDetailScreen id={id} />;
}
