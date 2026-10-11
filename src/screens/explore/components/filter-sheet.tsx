import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { SheetHeader } from "@/components/ui/sheet-header";
import { TextField } from "@/components/ui/text-field";
import { useGenres } from "@/hooks/use-anime";
import { router } from "@/navigation/router";
import { useExploreFilters } from "@/providers/explore-filters-provider";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

import {
  COUNTRY_OPTIONS,
  FORMAT_OPTIONS,
  SEASON_OPTIONS,
  SORT_OPTIONS,
  STATUS_OPTIONS,
  type ExploreFilters,
} from "../filter-options";
import { OptionGroup } from "./option-group";

const toggle = (values: string[] | undefined, key: string) =>
  values?.includes(key) ? values.filter((value) => value !== key) : [...(values ?? []), key];

const toggleSingle = (value: string | undefined, key: string) => (value === key ? undefined : key);

export function FilterSheet() {
  const styles = useStyles();
  const { bottom } = useSafeAreaInsets();
  const { filters, setFilters } = useExploreFilters();
  const [draft, setDraft] = useState<ExploreFilters>(filters);
  const [yearText, setYearText] = useState(filters.year ? String(filters.year) : "");

  const update = (changes: Partial<ExploreFilters>) => setDraft((current) => ({ ...current, ...changes }));

  const handleApply = () => {
    const year = Number(yearText);
    setFilters({ ...draft, year: Number.isInteger(year) && year > 1900 ? year : undefined });
    router.back();
  };

  const handleReset = () => {
    setDraft({});
    setYearText("");
  };

  return (
    <View style={[styles.sheet, { paddingBottom: bottom + spacing.lg }]}>
      <SheetHeader title="Filters" subtitle="Narrow down by format, season, genre and more" />
      <ScrollView contentContainerStyle={styles.groups} keyboardShouldPersistTaps="handled">
        <OptionGroup
          title="Sort by"
          icon="sort"
          options={SORT_OPTIONS}
          selected={draft.sort ?? []}
          onToggle={(key) => update({ sort: draft.sort?.[0] === key ? undefined : [key] })}
        />
        <OptionGroup
          title="Format"
          icon="tv"
          options={FORMAT_OPTIONS}
          selected={draft.formatIn ?? []}
          onToggle={(key) => update({ formatIn: toggle(draft.formatIn, key) })}
        />
        <OptionGroup
          title="Status"
          icon="radio_button_checked"
          options={STATUS_OPTIONS}
          selected={draft.statusIn ?? []}
          onToggle={(key) => update({ statusIn: toggle(draft.statusIn, key) })}
        />
        <OptionGroup
          title="Season"
          icon="calendar_month"
          options={SEASON_OPTIONS}
          selected={draft.season ? [draft.season] : []}
          onToggle={(key) => update({ season: toggleSingle(draft.season, key) })}
        />
        <TextField
          label="Year"
          icon="event"
          value={yearText}
          onChangeText={setYearText}
          keyboardType="number-pad"
          maxLength={4}
          placeholder="Any year"
        />
        <OptionGroup
          title="Country"
          icon="public"
          options={COUNTRY_OPTIONS}
          selected={draft.country ? [draft.country] : []}
          onToggle={(key) => update({ country: toggleSingle(draft.country, key) })}
        />
        <GenreFilter
          included={draft.genreIn ?? []}
          excluded={draft.genreNotIn ?? []}
          onChange={(genreIn, genreNotIn) => update({ genreIn, genreNotIn })}
        />
      </ScrollView>
      <View style={styles.actions}>
        <View style={styles.action}>
          <Button fullWidth variant="outline" icon="restart_alt" title="Reset" onPress={handleReset} />
        </View>
        <View style={styles.action}>
          <Button fullWidth icon="check" title="Apply" onPress={handleApply} />
        </View>
      </View>
    </View>
  );
}

interface GenreFilterProps {
  included: string[];
  excluded: string[];
  onChange: (included: string[], excluded: string[]) => void;
}

/** Each tap cycles a genre: include → exclude → no filter. */
function GenreFilter({ included, excluded, onChange }: GenreFilterProps) {
  const { data: genres = [] } = useGenres();

  const handleToggle = (genre: string) => {
    if (included.includes(genre)) {
      onChange(included.filter((g) => g !== genre), [...excluded, genre]);
    } else if (excluded.includes(genre)) {
      onChange(included, excluded.filter((g) => g !== genre));
    } else {
      onChange([...included, genre], excluded);
    }
  };

  const options = genres.map((genre) => ({
    key: genre,
    label: excluded.includes(genre) ? `Not ${genre}` : genre,
  }));

  return (
    <OptionGroup
      title="Genres"
      icon="category"
      options={options}
      selected={[...included, ...excluded]}
      onToggle={handleToggle}
    />
  );
}

const useStyles = createStyles(() => ({
  sheet: {
    flex: 1,
    gap: spacing.lg,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  groups: {
    gap: spacing.xl,
    paddingBottom: spacing.lg,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  action: {
    flex: 1,
  },
}));
