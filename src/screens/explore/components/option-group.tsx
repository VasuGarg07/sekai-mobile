import { StyleSheet, Text, View } from "react-native";

import { Chip } from "@/components/ui/chip";
import { colors, fontSize, fontWeight, spacing } from "@/theme";

import type { FilterOption } from "../filter-options";

interface OptionGroupProps {
  title: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (key: string) => void;
}

export function OptionGroup({ title, options, selected, onToggle }: OptionGroupProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chips}>
        {options.map((option) => (
          <Chip
            key={option.key}
            label={option.label}
            selected={selected.includes(option.key)}
            onPress={() => onToggle(option.key)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
