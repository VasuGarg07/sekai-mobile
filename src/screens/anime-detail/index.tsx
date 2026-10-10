import { router } from "expo-router";
import { Linking, RefreshControl, ScrollView, StyleSheet, View } from "react-native";

import { AnimeShelf } from "@/components/anime/anime-shelf";
import { WatchlistButton } from "@/components/anime/watchlist-button";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { ErrorState, LoadingState, MessageState } from "@/components/ui/screen-state";
import { useAnimeDetail } from "@/hooks/use-anime";
import { useAdultMode } from "@/hooks/use-preferences";
import { useRefresh } from "@/hooks/use-refresh";
import { colors, spacing } from "@/theme";
import type { AnimeDetail, AnimeTrailer } from "@/types/anime";

import { DetailHero } from "./components/detail-hero";
import { FactRow } from "./components/fact-row";
import { NextEpisode } from "./components/next-episode";
import { RelationShelf } from "./components/relation-shelf";
import { Synopsis } from "./components/synopsis";

interface AnimeDetailScreenProps {
  id: number;
}

export function AnimeDetailScreen({ id }: AnimeDetailScreenProps) {
  const adultMode = useAdultMode();
  const { data, isPending, isError, error, refetch } = useAnimeDetail(id);
  const { refreshing, onRefresh } = useRefresh(refetch);

  if (isPending) return <LoadingState />;
  if (isError) return <ErrorState message={error.message} onAction={() => refetch()} />;
  if (data.isAdult && !adultMode) {
    return (
      <MessageState
        title="This title is 18+"
        message="Sign in and turn on 18+ Mode in your profile to view it."
        actionTitle="Go back"
        onAction={() => router.back()}
      />
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.accent]}
          progressBackgroundColor={colors.surfaceRaised}
        />
      }
    >
      <DetailHero anime={data} />
      <View style={styles.section}>
        <WatchlistButton anime={data} />
      </View>
      <FactRow anime={data} />
      <DetailBody anime={data} adultMode={adultMode} />
    </ScrollView>
  );
}

interface DetailBodyProps {
  anime: AnimeDetail;
  adultMode: boolean;
}

function DetailBody({ anime, adultMode }: DetailBodyProps) {
  const relations = adultMode ? anime.relations : anime.relations.filter((r) => !r.isAdult);
  const recommendations = adultMode
    ? anime.recommendations
    : anime.recommendations.filter((r) => !r.isAdult);

  return (
    <>
      <View style={styles.section}>
        {anime.nextEpisode && (
          <NextEpisode
            animeId={anime.id}
            episode={anime.nextEpisode.episode}
            airingAt={anime.nextEpisode.airingAt}
          />
        )}
        {anime.synopsis && <Synopsis text={anime.synopsis} />}
        {anime.genres.length > 0 && (
          <View style={styles.genres}>
            {anime.genres.map((genre) => (
              <Chip
                key={genre}
                label={genre}
                onPress={() => router.push(`/genre/${encodeURIComponent(genre)}`)}
              />
            ))}
          </View>
        )}
        {anime.trailer && <TrailerButton trailer={anime.trailer} />}
      </View>
      {relations.length > 0 && <RelationShelf relations={relations} />}
      {recommendations.length > 0 && <AnimeShelf title="You might also like" items={recommendations} />}
    </>
  );
}

interface TrailerButtonProps {
  trailer: AnimeTrailer;
}

function TrailerButton({ trailer }: TrailerButtonProps) {
  const url =
    trailer.site === "dailymotion"
      ? `https://www.dailymotion.com/video/${trailer.id}`
      : `https://www.youtube.com/watch?v=${trailer.id}`;

  return <Button title="Watch trailer" variant="secondary" onPress={() => Linking.openURL(url)} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  section: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
