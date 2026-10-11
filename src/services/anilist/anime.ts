import type {
  AnimeDetail,
  AnimeListItem,
  AnimePage,
  AnimeSearchFilters,
  AnimeSpotlight,
} from "@/types/anime";
import type { Season } from "@/utils/date";

import { AniListError, queryAniList } from "./client";
import { adultFilter, BANNER_FIELDS, CARD_FIELDS, DETAIL_FIELDS, EXPORT_FIELDS } from "./fields";
import { toAnimeDetail, toAnimeListItem, toAnimePage, toAnimeSpotlight } from "./mappers";
import type { GenreCollectionResponse, MediaPageResponse, MediaResponse } from "./types";

const PAGE_INFO_FIELDS = /* GraphQL */ `
  pageInfo { total currentPage hasNextPage }
`;

const listQuery = (fields: string) => /* GraphQL */ `
  query ($page: Int, $perPage: Int, $sort: [MediaSort], $status: MediaStatus, $isAdult: Boolean) {
    Page(page: $page, perPage: $perPage) {
      ${PAGE_INFO_FIELDS}
      media(type: ANIME, sort: $sort, status: $status, isAdult: $isAdult) {
        ${fields}
      }
    }
  }
`;

const LIST_QUERY = listQuery(CARD_FIELDS);
const LIST_WITH_BANNER_QUERY = listQuery(`${CARD_FIELDS}${BANNER_FIELDS}`);

const SEARCH_QUERY = /* GraphQL */ `
  query (
    $page: Int
    $perPage: Int
    $search: String
    $genreIn: [String]
    $genreNotIn: [String]
    $formatIn: [MediaFormat]
    $statusIn: [MediaStatus]
    $season: MediaSeason
    $year: Int
    $country: CountryCode
    $sort: [MediaSort]
    $isAdult: Boolean
  ) {
    Page(page: $page, perPage: $perPage) {
      ${PAGE_INFO_FIELDS}
      media(
        type: ANIME
        search: $search
        genre_in: $genreIn
        genre_not_in: $genreNotIn
        format_in: $formatIn
        status_in: $statusIn
        season: $season
        seasonYear: $year
        countryOfOrigin: $country
        sort: $sort
        isAdult: $isAdult
      ) {
        ${CARD_FIELDS}
      }
    }
  }
`;

const SPOTLIGHT_QUERY = /* GraphQL */ `
  query ($season: MediaSeason, $seasonYear: Int, $perPage: Int, $isAdult: Boolean) {
    Page(perPage: $perPage) {
      media(type: ANIME, season: $season, seasonYear: $seasonYear, sort: [POPULARITY_DESC], isAdult: $isAdult) {
        ${CARD_FIELDS}
        ${BANNER_FIELDS}
      }
    }
  }
`;

const DETAIL_QUERY = /* GraphQL */ `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      ${CARD_FIELDS}
      ${DETAIL_FIELDS}
      coverImage { extraLarge large }
      countryOfOrigin
      tags { name rank isGeneralSpoiler isMediaSpoiler }
      popularity
      favourites
      relations {
        edges {
          relationType
          node {
            id
            title { romaji english }
            coverImage { large }
            isAdult
          }
        }
      }
      recommendations(perPage: 24, sort: RATING_DESC) {
        edges { node { mediaRecommendation { ${CARD_FIELDS} isAdult } } }
      }
      trailer { id site }
      nextAiringEpisode { airingAt episode }
    }
  }
`;

const byIdsQuery = (fields: string) => /* GraphQL */ `
  query ($ids: [Int], $perPage: Int) {
    Page(page: 1, perPage: $perPage) {
      media(type: ANIME, id_in: $ids) {
        ${fields}
      }
    }
  }
`;

const BY_IDS_QUERY = byIdsQuery(CARD_FIELDS);
const BY_IDS_FOR_EXPORT_QUERY = byIdsQuery(`${CARD_FIELDS}${EXPORT_FIELDS}`);

const GENRES_QUERY = /* GraphQL */ `
  query {
    GenreCollection
  }
`;

const ADULT_GENRES = new Set(["hentai"]);

export function isAdultGenre(genre: string): boolean {
  return ADULT_GENRES.has(genre.toLowerCase());
}

interface ListParams {
  sort: string[];
  status?: string;
  page: number;
  perPage: number;
  adultMode: boolean;
  /** Wide cards also draw the banner and genres. */
  withBanner?: boolean;
}

export async function fetchAnimeList({
  adultMode,
  withBanner = false,
  ...params
}: ListParams): Promise<AnimePage> {
  const data = await queryAniList<MediaPageResponse>(withBanner ? LIST_WITH_BANNER_QUERY : LIST_QUERY, {
    ...params,
    isAdult: adultFilter(adultMode),
  });
  return toAnimePage(data);
}

interface SearchParams {
  filters: AnimeSearchFilters;
  page: number;
  perPage: number;
  adultMode: boolean;
}

export async function searchAnime({
  filters,
  page,
  perPage,
  adultMode,
}: SearchParams): Promise<AnimePage> {
  const data = await queryAniList<MediaPageResponse>(SEARCH_QUERY, {
    ...withoutEmptyValues(filters),
    page,
    perPage,
    isAdult: adultFilter(adultMode),
  });
  return toAnimePage(data);
}

const SPOTLIGHT_SIZE = 10;

export async function fetchSpotlight(
  season: Season,
  year: number,
  adultMode: boolean,
): Promise<AnimeSpotlight[]> {
  const data = await queryAniList<MediaPageResponse>(SPOTLIGHT_QUERY, {
    season,
    seasonYear: year,
    perPage: SPOTLIGHT_SIZE,
    isAdult: adultFilter(adultMode),
  });
  return data.Page.media.map(toAnimeSpotlight);
}

export async function fetchAnimeDetail(id: number): Promise<AnimeDetail> {
  const data = await queryAniList<MediaResponse>(DETAIL_QUERY, { id });
  if (!data.Media) throw new AniListError("We couldn't find this anime.", 404);
  return toAnimeDetail(data.Media);
}

export async function fetchGenres(): Promise<string[]> {
  const data = await queryAniList<GenreCollectionResponse>(GENRES_QUERY);
  return data.GenreCollection;
}

// AniList returns at most 50 items per page and allows roughly 30–90 requests a minute,
// so large lookups (a long watchlist) are batched, spaced out and retried after rate limits.
const BATCH_SIZE = 50;
const BATCH_DELAY_MS = 700;
const RATE_LIMIT_WAITS_MS = [5_000, 15_000, 30_000];

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function fetchBatch(ids: number[], query: string): Promise<MediaPageResponse> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await queryAniList<MediaPageResponse>(query, { ids, perPage: BATCH_SIZE });
    } catch (error) {
      const delay = RATE_LIMIT_WAITS_MS[attempt];
      const rateLimited = error instanceof AniListError && error.isRateLimited;
      if (!rateLimited || delay === undefined) throw error;
      await wait(delay);
    }
  }
}

/** IDs AniList no longer knows are simply missing from the result. */
export async function fetchAnimeByIds(
  ids: number[],
  { forExport = false }: { forExport?: boolean } = {},
): Promise<Map<number, AnimeListItem>> {
  const query = forExport ? BY_IDS_FOR_EXPORT_QUERY : BY_IDS_QUERY;
  const unique = [...new Set(ids)];
  const result = new Map<number, AnimeListItem>();

  for (let start = 0; start < unique.length; start += BATCH_SIZE) {
    if (start > 0) await wait(BATCH_DELAY_MS);
    const data = await fetchBatch(unique.slice(start, start + BATCH_SIZE), query);
    for (const media of data.Page.media) {
      result.set(media.id, toAnimeListItem(media));
    }
  }

  return result;
}

// Empty strings and arrays are dropped so equivalent searches send identical variables.
function withoutEmptyValues(filters: AnimeSearchFilters): Partial<AnimeSearchFilters> {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) =>
      Array.isArray(value) ? value.length > 0 : value !== undefined && value !== "",
    ),
  );
}
