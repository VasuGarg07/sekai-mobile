// Raw AniList GraphQL shapes. Every field is optional because each query selects a subset.

interface AniListTitle {
  english?: string | null;
  romaji?: string | null;
}

interface AniListCoverImage {
  large?: string | null;
  extraLarge?: string | null;
}

export interface AniListRelationEdge {
  relationType: string;
  node: {
    id: number;
    title?: AniListTitle | null;
    coverImage?: AniListCoverImage | null;
    isAdult?: boolean | null;
  };
}

export interface AniListMedia {
  id: number;
  title?: AniListTitle | null;
  coverImage?: AniListCoverImage | null;
  bannerImage?: string | null;
  format?: string | null;
  duration?: number | null;
  averageScore?: number | null;
  startDate?: { year?: number | null; month?: number | null; day?: number | null } | null;
  description?: string | null;
  synonyms?: string[] | null;
  status?: string | null;
  genres?: string[] | null;
  episodes?: number | null;
  season?: string | null;
  seasonYear?: number | null;
  isAdult?: boolean | null;
  countryOfOrigin?: string | null;
  tags?:
    | {
        name: string;
        rank: number | null;
        isGeneralSpoiler: boolean;
        isMediaSpoiler: boolean;
      }[]
    | null;
  popularity?: number | null;
  favourites?: number | null;
  relations?: { edges?: AniListRelationEdge[] | null } | null;
  recommendations?: {
    edges?: { node?: { mediaRecommendation?: AniListMedia | null } | null }[] | null;
  } | null;
  trailer?: { id: string; site: string } | null;
  nextAiringEpisode?: { episode: number; airingAt: number } | null;
}

interface AniListPageInfo {
  total: number;
  currentPage: number;
  hasNextPage: boolean;
}

export interface MediaPageResponse {
  Page: {
    pageInfo?: AniListPageInfo;
    media: AniListMedia[];
  };
}

export interface MediaResponse {
  Media: AniListMedia | null;
}

export interface GenreCollectionResponse {
  GenreCollection: string[];
}
