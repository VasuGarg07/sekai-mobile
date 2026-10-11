import { FlashList } from "@shopify/flash-list";
import { useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";

import { AnimeGridPlaceholder } from "@/components/anime/anime-grid";
import { AppText } from "@/components/ui/app-text";
import { Chip } from "@/components/ui/chip";
import { IconButton } from "@/components/ui/icon-button";
import { PageHeader } from "@/components/ui/page-header";
import { ErrorState, MessageState } from "@/components/ui/screen-state";
import { useRefresh } from "@/hooks/use-refresh";
import { useTabBarSpace } from "@/hooks/use-tab-bar-space";
import { useWatchlist } from "@/hooks/use-watchlist";
import { router } from "@/navigation/router";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import { WATCH_STATUSES, type WatchStatus } from "@/types/watchlist";
import { WATCH_STATUS_ICONS, WATCH_STATUS_LABELS } from "@/utils/anime";

import { WatchlistGridCard, WatchlistRow } from "./components/watchlist-row";

type ViewMode = "list" | "grid";

export function WatchlistScreen() {
  const styles = useStyles();
  const bottomSpace = useTabBarSpace();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const toggle = (
    <IconButton
      icon={viewMode === "list" ? "grid_view" : "view_list"}
      variant="tonal"
      accessibilityLabel={viewMode === "list" ? "Show as grid" : "Show as list"}
      onPress={() => setViewMode((current) => (current === "list" ? "grid" : "list"))}
    />
  );

  return (
    <View style={styles.screen}>
      <PageHeader title="My List" actions={user ? toggle : undefined} />
      {user ? (
        <WatchlistContent viewMode={viewMode} />
      ) : (
        <MessageState
          style={{ paddingBottom: bottomSpace }}
          icon="bookmarks"
          title="Your list lives here"
          message="Sign in to save anime and pick up where you left off, here or on the web."
          actionTitle="Sign in"
          actionIcon="login"
          onAction={() => router.openLogin()}
        />
      )}
    </View>
  );
}

interface WatchlistContentProps {
  viewMode: ViewMode;
}

function WatchlistContent({ viewMode }: WatchlistContentProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const bottomSpace = useTabBarSpace();
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

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const filters = (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterBar}
      contentContainerStyle={styles.filters}
    >
      <Chip label="All" icon="apps" selected={filter === null} onPress={() => setFilter(null)} />
      {WATCH_STATUSES.map((status) => (
        <Chip
          key={status}
          label={WATCH_STATUS_LABELS[status]}
          icon={WATCH_STATUS_ICONS[status]}
          selected={filter === status}
          onPress={() => setFilter(status)}
        />
      ))}
    </ScrollView>
  );

  if (isPending) {
    return (
      <>
        {filters}
        <AnimeGridPlaceholder />
      </>
    );
  }
  if (isError) {
    return <ErrorState style={{ paddingBottom: bottomSpace }} message={error.message} onRetry={() => refetch()} />;
  }

  const isGrid = viewMode === "grid";
  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[colors.accent]}
      progressBackgroundColor={colors.surfaceRaised}
    />
  );

  // Outside the FlashList so the message can fill and centre in the space below the filters.
  if (visibleItems.length === 0) {
    return (
      <>
        {filters}
        <ScrollView
          refreshControl={refreshControl}
          contentContainerStyle={{ ...styles.emptyContent, paddingBottom: bottomSpace }}
        >
          <EmptyList filtered={filter !== null} />
        </ScrollView>
      </>
    );
  }

  return (
    <>
      {filters}
      {refreshFailed && (
        <AppText variant="caption" tone="muted" style={styles.notice}>
          Couldn&apos;t reach AniList, so some details may be out of date.
        </AppText>
      )}
      <FlashList
        key={viewMode}
        data={visibleItems}
        numColumns={isGrid ? 3 : 1}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (isGrid ? <WatchlistGridCard item={item} /> : <WatchlistRow item={item} />)}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={refreshControl}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator color={colors.accent} style={styles.footer} /> : null
        }
        contentContainerStyle={{
          ...(isGrid ? styles.gridContent : undefined),
          paddingBottom: bottomSpace,
        }}
      />
    </>
  );
}

interface EmptyListProps {
  filtered: boolean;
}

function EmptyList({ filtered }: EmptyListProps) {
  if (filtered) {
    return <MessageState icon="filter_list_off" message="Nothing with this status yet." />;
  }
  return (
    <MessageState
      icon="bookmark_add"
      title="Your list is empty"
      message="Find something to watch and tap “Add to My List”."
      actionTitle="Explore anime"
      actionIcon="explore"
      onAction={() => router.showTab("Explore")}
    />
  );
}

const useStyles = createStyles(({ colors }) => ({
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
  notice: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  emptyContent: {
    flexGrow: 1,
  },
  gridContent: {
    paddingHorizontal: spacing.md,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
}));
