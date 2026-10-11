import type {
  AnimeDetail,
  AnimeListItem,
  AnimePage,
  AnimeRelation,
  AnimeSpotlight,
} from "@/types/anime";
import { formatPartialDate } from "@/utils/date";
import { htmlToPlainText } from "@/utils/html";

import type { AniListMedia, AniListRelationEdge, MediaPageResponse } from "./types";

export function toAnimeListItem(media: AniListMedia): AnimeListItem {
  return {
    id: media.id,
    titleEnglish: media.title?.english ?? null,
    titleRomaji: media.title?.romaji ?? null,
    coverImage: media.coverImage?.large ?? null,
    bannerImage: media.bannerImage ?? null,
    format: media.format ?? null,
    episodeDuration: media.duration ?? null,
    averageScore: media.averageScore ?? null,
    startDate: formatPartialDate(media.startDate ?? {}),
    synopsis: media.description ? htmlToPlainText(media.description) : null,
    synonyms: media.synonyms ?? [],
    status: media.status ?? null,
    genres: media.genres ?? [],
    episodes: media.episodes ?? null,
    season: media.season ?? null,
    seasonYear: media.seasonYear ?? null,
    isAdult: media.isAdult ?? false,
  };
}

export function toAnimeSpotlight(media: AniListMedia): AnimeSpotlight {
  return toAnimeListItem(media);
}

function toAnimeRelation({ relationType, node }: AniListRelationEdge): AnimeRelation {
  return {
    id: node.id,
    relationType,
    titleEnglish: node.title?.english ?? null,
    titleRomaji: node.title?.romaji ?? null,
    coverImage: node.coverImage?.large ?? null,
    isAdult: node.isAdult ?? false,
  };
}

export function toAnimeDetail(media: AniListMedia): AnimeDetail {
  const recommendations = (media.recommendations?.edges ?? [])
    .map((edge) => edge.node?.mediaRecommendation)
    .filter((recommendation): recommendation is AniListMedia => recommendation != null)
    .map(toAnimeListItem);

  return {
    ...toAnimeListItem(media),
    coverImageExtraLarge: media.coverImage?.extraLarge ?? null,
    countryOfOrigin: media.countryOfOrigin ?? null,
    tags: media.tags ?? [],
    popularity: media.popularity ?? null,
    favourites: media.favourites ?? null,
    relations: (media.relations?.edges ?? []).filter((edge) => edge.node).map(toAnimeRelation),
    recommendations,
    trailer: media.trailer ?? null,
    nextEpisode: media.nextAiringEpisode
      ? {
          episode: media.nextAiringEpisode.episode,
          // AniList sends seconds since epoch.
          airingAt: new Date(media.nextAiringEpisode.airingAt * 1000),
        }
      : null,
  };
}

export function toAnimePage({ Page }: MediaPageResponse): AnimePage {
  return {
    items: Page.media.map(toAnimeListItem),
    currentPage: Page.pageInfo?.currentPage ?? 1,
    hasNextPage: Page.pageInfo?.hasNextPage ?? false,
    total: Page.pageInfo?.total ?? Page.media.length,
  };
}
