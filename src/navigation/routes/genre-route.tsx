import { GenreScreen } from "@/screens/genre";

import type { RootStackScreenProps } from "../types";

export function GenreRoute({ route }: RootStackScreenProps<"Genre">) {
  return <GenreScreen genre={route.params.name} />;
}
