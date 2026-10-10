import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { useGenres } from "@/hooks/use-anime";
import { colors, fontSize, fontWeight, radius, spacing } from "@/theme";

import {
  COUNTRY_OPTIONS,
  FORMAT_OPTIONS,
  SEASON_OPTIONS,
  SORT_OPTIONS,
  STATUS_OPTIONS,
  type ExploreFilters,
} from "../filter-options";
import { OptionGroup } from "./option-group";

interface FilterSheetProps {
  visible: boolean;
  filters: ExploreFilters;
  onApply: (filters: ExploreFilters) => void;
  onClose: () => void;
}

export function FilterSheet({ visible, filters, onApply, onClose }: FilterSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable accessibilityLabel="Close filters" style={styles.backdrop} onPress={onClose} />
      {/* Remounted on every open, so the draft always starts from the applied filters. */}
      {visible && <FilterForm initial={filters} onApply={onApply} />}
    </Modal>
  );
}

interface FilterFormProps {
  initial: ExploreFilters;
  onApply: (filters: ExploreFilters) => void;
}

const toggle = (values: string[] | undefined, key: string) =>
  values?.includes(key) ? values.filter((value) => value !== key) : [...(values ?? []), key];

const toggleSingle = (value: string | undefined, key: string) => (value === key ? undefined : key);

function FilterForm({ initial, onApply }: FilterFormProps) {
  const { bottom } = useSafeAreaInsets();
  const [draft, setDraft] = useState<ExploreFilters>(initial);
  const [yearText, setYearText] = useState(initial.year ? String(initial.year) : "");

  const update = (changes: Partial<ExploreFilters>) => setDraft((current) => ({ ...current, ...changes }));

  const handleApply = () => {
    const year = Number(yearText);
    onApply({ ...draft, year: Number.isInteger(year) && year > 1900 ? year : undefined });
  };

  const handleReset = () => {
    setDraft({});
    setYearText("");
  };

  return (
    <View style={[styles.sheet, { paddingBottom: bottom + spacing.lg }]}>
      <Text style={styles.title}>Filters</Text>
      <ScrollView contentContainerStyle={styles.groups} keyboardShouldPersistTaps="handled">
        <OptionGroup
          title="Sort by"
          options={SORT_OPTIONS}
          selected={draft.sort ?? []}
          onToggle={(key) => update({ sort: draft.sort?.[0] === key ? undefined : [key] })}
        />
        <OptionGroup
          title="Format"
          options={FORMAT_OPTIONS}
          selected={draft.formatIn ?? []}
          onToggle={(key) => update({ formatIn: toggle(draft.formatIn, key) })}
        />
        <OptionGroup
          title="Status"
          options={STATUS_OPTIONS}
          selected={draft.statusIn ?? []}
          onToggle={(key) => update({ statusIn: toggle(draft.statusIn, key) })}
        />
        <OptionGroup
          title="Season"
          options={SEASON_OPTIONS}
          selected={draft.season ? [draft.season] : []}
          onToggle={(key) => update({ season: toggleSingle(draft.season, key) })}
        />
        <TextField
          label="Year"
          value={yearText}
          onChangeText={setYearText}
          keyboardType="number-pad"
          maxLength={4}
          placeholder="Any"
        />
        <OptionGroup
          title="Country"
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
          <Button title="Reset" variant="secondary" onPress={handleReset} />
        </View>
        <View style={styles.action}>
          <Button title="Apply" onPress={handleApply} />
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
      title="Genres (tap again to exclude)"
      options={options}
      selected={[...included, ...excluded]}
      onToggle={handleToggle}
    />
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.scrim,
  },
  sheet: {
    maxHeight: "85%",
    gap: spacing.lg,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
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
});
