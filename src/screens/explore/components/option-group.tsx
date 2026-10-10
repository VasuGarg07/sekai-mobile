import { View } from "react-native";

import { Chip } from "@/components/ui/chip";
import type { IconName } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

import type { FilterOption } from "../filter-options";

interface OptionGroupProps {
  title: string;
  icon: IconName;
  options: FilterOption[];
  selected: string[];
  onToggle: (key: string) => void;
}

export function OptionGroup({ title, icon, options, selected, onToggle }: OptionGroupProps) {
  const styles = useStyles();

  return (
    <View style={styles.group}>
      <SectionHeader title={title} icon={icon} inset={false} />
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

const useStyles = createStyles(() => ({
  group: {
    gap: spacing.sm,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
}));
