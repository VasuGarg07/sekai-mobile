import type { IconName } from "@/components/ui/icon";
import type { TintName } from "@/theme";

const GENRE_ICONS: Record<string, IconName> = {
  action: "bolt",
  adventure: "hiking",
  comedy: "sentiment_very_satisfied",
  drama: "theater_comedy",
  ecchi: "favorite_border",
  fantasy: "castle",
  hentai: "explicit",
  horror: "skull",
  "mahou shoujo": "auto_awesome",
  mecha: "smart_toy",
  music: "music_note",
  mystery: "search",
  psychological: "psychiatry",
  romance: "favorite",
  "sci-fi": "rocket_launch",
  "slice of life": "local_cafe",
  sports: "sports_soccer",
  supernatural: "nightlight",
  thriller: "swords",
};

const GENRE_TINTS: TintName[] = ["red", "blue", "violet", "green", "amber", "pink", "indigo", "yellow"];

export function getGenreIcon(genre: string): IconName {
  return GENRE_ICONS[genre.toLowerCase()] ?? "category";
}

/** Stable tint per genre name, so a genre keeps its color everywhere. */
export function getGenreTint(genre: string): TintName {
  const hash = [...genre].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return GENRE_TINTS[hash % GENRE_TINTS.length];
}
