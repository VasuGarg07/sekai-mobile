import { useLocalSearchParams } from "expo-router";

import { GenreScreen } from "@/screens/genre";

export default function GenreRoute() {
  const { name } = useLocalSearchParams<{ name: string }>();
  return <GenreScreen genre={name} />;
}
