/** Every field `toAnimeListItem` reads. Shared by all list queries so list items are always complete. */
export const MEDIA_LIST_FIELDS = /* GraphQL */ `
  id
  title { english romaji }
  coverImage { large }
  bannerImage
  format
  duration
  averageScore
  startDate { year month day }
  description(asHtml: false)
  synonyms
  status
  genres
  episodes
  season
  seasonYear
  isAdult
`;

/** AniList's `isAdult` argument: `false` hides adult titles, `undefined` omits the filter entirely. */
export function adultFilter(adultMode: boolean): false | undefined {
  return adultMode ? undefined : false;
}
