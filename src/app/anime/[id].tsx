import { useLocalSearchParams } from "expo-router";

import { AnimeDetailScreen } from "@/screens/anime-detail";

export default function AnimeDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <AnimeDetailScreen id={Number(id)} />;
}
