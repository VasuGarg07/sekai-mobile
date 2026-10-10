import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { ScreenHeader } from "@/components/ui/screen-header";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";

import { FilterSheet } from "./components/filter-sheet";
import { GenreList } from "./components/genre-list";
import { SearchResults } from "./components/search-results";
import { countActiveFilters, type ExploreFilters } from "./filter-options";

const SEARCH_DELAY_MS = 400;

export function ExploreScreen() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ExploreFilters>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const term = useDebouncedValue(search.trim(), SEARCH_DELAY_MS);
  const activeFilterCount = countActiveFilters(filters);

  const handleApplyFilters = (next: ExploreFilters) => {
    setFilters(next);
    setFiltersOpen(false);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Explore" showBack={false} />
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color={colors.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search anime"
          placeholderTextColor={colors.textSubtle}
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
            <Icon name="close" size={20} color={colors.textMuted} />
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            activeFilterCount > 0 ? `Filters, ${activeFilterCount} active` : "Filters"
          }
          onPress={() => setFiltersOpen(true)}
          hitSlop={8}
          style={styles.filterButton}
        >
          <Icon name="tune" size={20} color={activeFilterCount > 0 ? colors.accent : colors.textMuted} />
          {activeFilterCount > 0 && <Text style={styles.badge}>{activeFilterCount}</Text>}
        </Pressable>
      </View>

      {term || activeFilterCount > 0 ? <SearchResults search={term} filters={filters} /> : <GenreList />}

      <FilterSheet
        visible={filtersOpen}
        filters={filters}
        onApply={handleApplyFilters}
        onClose={() => setFiltersOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.base,
    paddingVertical: spacing.md,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  badge: {
    color: colors.accent,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
});
