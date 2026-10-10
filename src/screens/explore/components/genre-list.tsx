import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Chip } from "@/components/ui/chip";
import { ErrorState, LoadingState } from "@/components/ui/screen-state";
import { useGenres } from "@/hooks/use-anime";
import { colors, fontSize, fontWeight, spacing } from "@/theme";

export function GenreList() {
  const { data, isPending, isError, error, refetch } = useGenres();

  if (isPending) return <LoadingState />;
  if (isError) return <ErrorState message={error.message} onAction={() => refetch()} />;

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Browse by genre</Text>
      <View style={styles.genres}>
        {data.map((genre) => (
          <Chip
            key={genre}
            label={genre}
            onPress={() => router.push(`/genre/${encodeURIComponent(genre)}`)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  heading: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
