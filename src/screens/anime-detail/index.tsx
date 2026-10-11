import { Linking, RefreshControl, Share, View } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AnimeShelf } from "@/components/anime/anime-shelf";
import { WatchlistButton } from "@/components/anime/watchlist-button";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { StackHeader } from "@/components/ui/page-header";
import { ErrorState, MessageState } from "@/components/ui/screen-state";
import { SectionHeader } from "@/components/ui/section-header";
import { useAnimeDetail } from "@/hooks/use-anime";
import { useAdultMode } from "@/hooks/use-preferences";
import { useRefresh } from "@/hooks/use-refresh";
import { router } from "@/navigation/router";
import { useTheme } from "@/providers/theme-provider";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { AnimeDetail, AnimeTrailer } from "@/types/anime";
import { getTitle } from "@/utils/anime";

import { DetailHero } from "./components/detail-hero";
import { DetailSkeleton } from "./components/detail-skeleton";
import { DetailTopBar } from "./components/detail-top-bar";
import { FactRow } from "./components/fact-row";
import { InfoGrid } from "./components/info-grid";
import { NextEpisode } from "./components/next-episode";
import { RelationShelf } from "./components/relation-shelf";
import { Synopsis } from "./components/synopsis";
import { TagList } from "./components/tag-list";

interface AnimeDetailScreenProps {
  id: number;
}

export function AnimeDetailScreen({ id }: AnimeDetailScreenProps) {
  const styles = useStyles();
  const adultMode = useAdultMode();
  const { data, isPending, isError, error, refetch } = useAnimeDetail(id);

  if (isPending) return <DetailSkeleton />;

  if (isError) {
    return (
      <View style={styles.screen}>
        <StackHeader title="" />
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </View>
    );
  }

  if (data.isAdult && !adultMode) {
    return (
      <View style={styles.screen}>
        <StackHeader title="" />
        <MessageState
          icon="lock"
          title="This title is 18+"
          message="Sign in and turn on 18+ Mode in your profile to view it."
          actionTitle="Go back"
          actionIcon="arrow_back"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  return <DetailContent anime={data} adultMode={adultMode} refetch={refetch} />;
}

interface DetailContentProps {
  anime: AnimeDetail;
  adultMode: boolean;
  refetch: () => Promise<unknown>;
}

function DetailContent({ anime, adultMode, refetch }: DetailContentProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const { bottom } = useSafeAreaInsets();
  const { refreshing, onRefresh } = useRefresh(refetch);
  const scrollY = useSharedValue(0);
  const title = getTitle(anime);

  const relations = adultMode ? anime.relations : anime.relations.filter((r) => !r.isAdult);
  const recommendations = adultMode
    ? anime.recommendations
    : anime.recommendations.filter((r) => !r.isAdult);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const handleShare = () => {
    Share.share({ message: `${title} on AniList: https://anilist.co/anime/${anime.id}` }).catch(
      () => undefined,
    );
  };

  return (
    <View style={styles.screen}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ ...styles.content, paddingBottom: bottom + spacing.xxl }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.accent]}
            progressBackgroundColor={colors.surfaceRaised}
            progressViewOffset={spacing.xxxl}
          />
        }
      >
        <DetailHero anime={anime} scrollY={scrollY} />

        <View style={styles.section}>
          <FactRow anime={anime} />
          <View style={styles.actions}>
            <View style={styles.primaryAction}>
              <WatchlistButton anime={anime} />
            </View>
            {anime.trailer && <TrailerButton trailer={anime.trailer} />}
          </View>
          {anime.nextEpisode && (
            <NextEpisode
              episode={anime.nextEpisode.episode}
              airingAt={anime.nextEpisode.airingAt}
            />
          )}
          {anime.synopsis && <Synopsis text={anime.synopsis} />}
          <InfoGrid anime={anime} />
          {anime.genres.length > 0 && (
            <View style={styles.block}>
              <SectionHeader title="Genres" icon="category" inset={false} />
              <View style={styles.wrap}>
                {anime.genres.map((genre) => (
                  <Chip
                    key={genre}
                    label={genre}
                    onPress={() => router.openGenre(genre)}
                  />
                ))}
              </View>
            </View>
          )}
          <TagList tags={anime.tags} />
        </View>

        {relations.length > 0 && <RelationShelf relations={relations} />}
        {recommendations.length > 0 && (
          <AnimeShelf title="You might also like" icon="thumb_up" items={recommendations} />
        )}
      </Animated.ScrollView>
      <DetailTopBar title={title} scrollY={scrollY} onShare={handleShare} />
    </View>
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

  return <Button icon="play_arrow" title="Trailer" variant="tonal" onPress={() => Linking.openURL(url)} />;
}

const useStyles = createStyles(({ colors }) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.xl,
  },
  section: {
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: -spacing.sm,
  },
  primaryAction: {
    flex: 1,
  },
  block: {
    gap: spacing.md,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
}));
