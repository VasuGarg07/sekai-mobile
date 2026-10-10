import type { TintName } from "@/theme";

const GENRE_TINTS: TintName[] = ["red", "blue", "violet", "green", "amber", "pink", "indigo", "yellow"];

/**
 * Tint by grid position. The grid has two columns, so neighbours differ by 1 (side by side) or 2
 * (stacked) positions, and both are distinct modulo the palette size.
 */
export function getGenreTint(index: number): TintName {
  return GENRE_TINTS[index % GENRE_TINTS.length];
}
