import { Redirect, useLocalSearchParams } from "expo-router";

import { AnimeDetailScreen } from "@/screens/anime-detail";

export default function AnimeDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const animeId = typeof id === "string" ? Number(id) : NaN;
  if (!Number.isInteger(animeId)) return <Redirect href="/" />;
  return <AnimeDetailScreen id={animeId} />;
}
