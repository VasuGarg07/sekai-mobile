import { View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { SectionHeader } from "@/components/ui/section-header";
import { radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { AnimeTag } from "@/types/anime";

const MAX_TAGS = 12;

interface TagListProps {
  tags: AnimeTag[];
}

export function TagList({ tags }: TagListProps) {
  const styles = useStyles();
  const visible = tags.filter((tag) => !tag.isGeneralSpoiler && !tag.isMediaSpoiler).slice(0, MAX_TAGS);
  if (visible.length === 0) return null;

  return (
    <View style={styles.container}>
      <SectionHeader title="Tags" icon="sell" inset={false} />
      <View style={styles.tags}>
        {visible.map((tag) => (
          <View key={tag.name} style={styles.tag}>
            <AppText variant="caption" tone="muted">
              #{tag.name}
            </AppText>
            {tag.rank !== null && (
              <AppText variant="caption" tone="accent">
                {tag.rank}%
              </AppText>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  container: {
    gap: spacing.md,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  tag: {
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
}));
