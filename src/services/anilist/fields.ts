// Each query asks for exactly what its screens render. AniList's cost grows with the fields it has to
// build (a 30-item list took about a second longer with descriptions), so don't add a field to a shared
// group because one screen wants it; use the matching group or a new one.

/** What a poster, ranked or My List card shows. Every list-style query starts from this. */
export const CARD_FIELDS = /* GraphQL */ `
  id
  title { english romaji }
  coverImage { large }
  format
  averageScore
  episodes
  seasonYear
`;

/** Wide cards and the home spotlight draw the banner and list genres. */
export const BANNER_FIELDS = /* GraphQL */ `
  bannerImage
  genres
`;

/** The detail page's own facts, on top of the card fields. */
export const DETAIL_FIELDS = /* GraphQL */ `
  ${BANNER_FIELDS}
  duration
  startDate { year month day }
  status
  season
  isAdult
  description(asHtml: false)
`;

/** The export's extra columns, on top of the card fields. */
export const EXPORT_FIELDS = /* GraphQL */ `
  genres
  duration
  status
  season
  description(asHtml: false)
`;

/** AniList's `isAdult` argument: `false` hides adult titles, `undefined` omits the filter entirely. */
export function adultFilter(adultMode: boolean): false | undefined {
  return adultMode ? undefined : false;
}
