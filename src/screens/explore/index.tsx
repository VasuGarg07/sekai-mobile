import { router } from "expo-router";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { PageHeader } from "@/components/ui/page-header";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useExploreFilters } from "@/providers/explore-filters-provider";
import { useTheme } from "@/providers/theme-provider";
import { iconSize, radius, spacing, typography } from "@/theme";
import { createStyles } from "@/theme/create-styles";

import { GenreList } from "./components/genre-list";
import { SearchResults } from "./components/search-results";
import { countActiveFilters } from "./filter-options";

const SEARCH_DELAY_MS = 400;

export function ExploreScreen() {
  const { colors } = useTheme();
  const styles = useStyles();
  const [search, setSearch] = useState("");
  const { filters } = useExploreFilters();
  const term = useDebouncedValue(search.trim(), SEARCH_DELAY_MS);
  const activeFilterCount = countActiveFilters(filters);

  return (
    <View style={styles.screen}>
      <PageHeader title="Explore" />
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Icon name="search" size={iconSize.md} color={colors.textSubtle} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search anime"
            placeholderTextColor={colors.textSubtle}
            selectionColor={colors.accent}
            accessibilityLabel="Search anime"
            autoCorrect={false}
            returnKeyType="search"
            style={styles.input}
          />
          {search !== "" && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              onPress={() => setSearch("")}
              hitSlop={8}
            >
              <Icon name="close" size={iconSize.md} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
        <View>
          <IconButton
            icon="tune"
            variant="tonal"
            active={activeFilterCount > 0}
            accessibilityLabel={activeFilterCount > 0 ? `Filters, ${activeFilterCount} active` : "Filters"}
            onPress={() => router.navigate("/explore-filters")}
          />
          {activeFilterCount > 0 && (
            <View style={styles.badge}>
              <AppText variant="caption" tone="onAccent" style={styles.badgeText}>
                {activeFilterCount}
              </AppText>
            </View>
          )}
        </View>
      </View>

      {term || activeFilterCount > 0 ? <SearchResults search={term} filters={filters} /> : <GenreList />}

    </View>
  );
}

const BADGE_SIZE = 18;

const useStyles = createStyles(({ colors }) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceRaised,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  badge: {
    position: "absolute",
    top: -spacing.xxs,
    right: -spacing.xxs,
    minWidth: BADGE_SIZE,
    height: BADGE_SIZE,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },
  badgeText: {
    fontWeight: "700",
  },
}));
