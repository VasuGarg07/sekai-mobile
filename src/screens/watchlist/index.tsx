import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import { Chip } from "@/components/ui/chip";
import { ErrorState, LoadingState, MessageState } from "@/components/ui/screen-state";
import { ScreenHeader } from "@/components/ui/screen-header";
import { useRefresh } from "@/hooks/use-refresh";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useAuth } from "@/providers/auth-provider";
import { colors, fontSize, spacing } from "@/theme";
import { WATCH_STATUSES, type WatchStatus } from "@/types/watchlist";
import { WATCH_STATUS_LABELS } from "@/utils/anime";

import { WatchlistRow } from "./components/watchlist-row";

export function WatchlistScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Watchlist" showBack={false} />
      {user ? (
        <WatchlistContent />
      ) : (
        <MessageState
          title="Your watchlist lives here"
          message="Sign in to save anime and pick up where you left off, on the web or here."
          actionTitle="Sign in"
          onAction={() => router.push("/login")}
        />
      )}
    </View>
  );
}

function WatchlistContent() {
  const [filter, setFilter] = useState<WatchStatus | null>(null);
  const {
    items,
    isPending,
    isError,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refreshFailed,
  } = useWatchlist();
  const { refreshing, onRefresh } = useRefresh(refetch);

  // Filters the loaded pages; more pages load as the user scrolls.
  const visibleItems = useMemo(
    () => (filter ? items.filter((item) => item.watchStatus === filter) : items),
    [items, filter],
  );

  if (isPending) return <LoadingState />;
  if (isError) return <ErrorState message={error.message} onAction={() => refetch()} />;

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filters}
      >
        <Chip label="All" selected={filter === null} onPress={() => setFilter(null)} />
        {WATCH_STATUSES.map((watchStatus) => (
          <Chip
            key={watchStatus}
            label={WATCH_STATUS_LABELS[watchStatus]}
            selected={filter === watchStatus}
            onPress={() => setFilter(watchStatus)}
          />
        ))}
      </ScrollView>
      {refreshFailed && (
        <Text style={styles.notice}>Couldn&apos;t reach AniList, so some details may be out of date.</Text>
      )}
      <FlashList
        data={visibleItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <WatchlistRow item={item} />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.accent]}
            progressBackgroundColor={colors.surfaceRaised}
          />
        }
        ListEmptyComponent={<EmptyWatchlist filtered={filter !== null} />}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.textMuted} /> : null}
        contentContainerStyle={styles.list}
      />
    </>
  );
}

interface EmptyWatchlistProps {
  filtered: boolean;
}

function EmptyWatchlist({ filtered }: EmptyWatchlistProps) {
  if (filtered) {
    return <MessageState message="Nothing with this status yet." />;
  }
  return (
    <MessageState
      title="Your watchlist is empty"
      message="Find something to watch and tap “Add to watchlist”."
      actionTitle="Explore anime"
      onAction={() => router.navigate("/explore")}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterBar: {
    flexGrow: 0,
  },
  filters: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  notice: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
});
