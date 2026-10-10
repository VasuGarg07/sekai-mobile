import { View } from "react-native";

import { Skeleton } from "@/components/ui/skeleton";
import { POSTER_ASPECT_RATIO, radius, spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";

import { BANNER_HEIGHT } from "./detail-hero";

export function DetailSkeleton() {
  const styles = useStyles();

  return (
    <View style={styles.screen}>
      <Skeleton height={BANNER_HEIGHT} rounded={0} />
      <View style={styles.identity}>
        <Skeleton width={116} aspectRatio={POSTER_ASPECT_RATIO} />
        <View style={styles.titles}>
          <Skeleton height={28} width="90%" />
          <Skeleton height={14} width="60%" />
        </View>
      </View>
      <View style={styles.body}>
        <Skeleton height={24} width="70%" rounded={radius.full} />
        <Skeleton height={48} rounded={radius.full} />
        <Skeleton height={14} />
        <Skeleton height={14} />
        <Skeleton height={14} width="80%" />
      </View>
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  identity: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.lg,
    marginTop: -spacing.xxxl * 2,
    paddingHorizontal: spacing.lg,
  },
  titles: {
    flex: 1,
    gap: spacing.sm,
  },
  body: {
    gap: spacing.md,
    padding: spacing.lg,
  },
}));
