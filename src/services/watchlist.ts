import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  startAfter,
  updateDoc,
  writeBatch,
  type DocumentSnapshot,
} from "firebase/firestore";

import { MAX_WATCHLIST_SIZE } from "@/constants";
import { fireStore } from "@/lib/firebase";
import { fetchAnimeByIds } from "@/services/anilist/anime";
import type { AnimeListItem } from "@/types/anime";
import type { ActionResult } from "@/types/result";
import type { WatchlistItem, WatchStatus } from "@/types/watchlist";

interface WatchlistEntryDoc {
  id: number;
  title_romaji: string | null;
  title_english: string | null;
  format: string | null;
  watchStatus: WatchStatus;
  addedAt: number;
}

interface LegacySnapshotFields {
  image?: string | null;
  type?: string | null;
  duration?: number | null;
  score?: number | null;
  startDateText?: string | null;
  synopsis?: string | null;
  synonyms?: string[];
  status?: string | null;
  genres?: string[];
  episodes?: number | null;
  season?: string | null;
  seasonYear?: number | null;
}

type StoredEntry = WatchlistEntryDoc & LegacySnapshotFields;

/** `addedAt` of the last entry on the previous page. A plain number, so pages survive JSON caching. */
export type WatchlistCursor = number;

export interface WatchlistPage {
  items: WatchlistItem[];
  nextCursor: WatchlistCursor | null;
  /** AniList couldn't be reached, so items show the details saved in Firestore. */
  refreshFailed: boolean;
}

const PAGE_SIZE = 24;

const readEntry = (snapshot: DocumentSnapshot) => snapshot.data() as StoredEntry;

const entriesRef = (uid: string) => collection(fireStore, "users", uid, "watchlist");
const entryRef = (uid: string, animeId: number) =>
  doc(fireStore, "users", uid, "watchlist", String(animeId));
const idsRef = (uid: string) => doc(fireStore, "users", uid, "meta", "watchlist");

export async function fetchWatchlistPage(
  uid: string,
  cursor?: WatchlistCursor,
): Promise<WatchlistPage> {
  const constraints = cursor
    ? [orderBy("addedAt", "desc"), startAfter(cursor), limit(PAGE_SIZE)]
    : [orderBy("addedAt", "desc"), limit(PAGE_SIZE)];
  const { docs } = await getDocs(query(entriesRef(uid), ...constraints));

  const { items, refreshFailed } = await hydrate(docs.map(readEntry));
  return {
    items,
    nextCursor: docs.length === PAGE_SIZE ? readEntry(docs[docs.length - 1]).addedAt : null,
    refreshFailed,
  };
}

/** Every entry, newest first, for exports. */
export async function fetchEntireWatchlist(
  uid: string,
): Promise<{ items: WatchlistItem[]; refreshFailed: boolean }> {
  const { docs } = await getDocs(query(entriesRef(uid), orderBy("addedAt", "desc")));
  return hydrate(docs.map(readEntry), { forExport: true });
}

/** One document read, so "is it saved?" works for anime not loaded in the list yet. */
export async function fetchWatchlistIds(uid: string): Promise<number[]> {
  const snapshot = await getDoc(idsRef(uid));
  return snapshot.exists() ? (snapshot.data().ids ?? []) : [];
}

/** The saved status, or null when the anime isn't in the watchlist. */
export async function fetchWatchStatus(uid: string, animeId: number): Promise<WatchStatus | null> {
  const snapshot = await getDoc(entryRef(uid, animeId));
  return snapshot.exists() ? readEntry(snapshot).watchStatus : null;
}

export async function addToWatchlist(
  uid: string,
  anime: AnimeListItem,
  watchStatus: WatchStatus,
): Promise<ActionResult> {
  const title = getTitle(anime);
  try {
    return await runTransaction(fireStore, async (transaction): Promise<ActionResult> => {
      const idsSnapshot = await transaction.get(idsRef(uid));
      const ids: number[] = idsSnapshot.exists() ? (idsSnapshot.data().ids ?? []) : [];

      if (ids.includes(anime.id)) {
        return { success: false, message: `${title} is already in your watchlist.` };
      }
      if (ids.length >= MAX_WATCHLIST_SIZE) {
        return {
          success: false,
          message: `Your watchlist is full (${MAX_WATCHLIST_SIZE.toLocaleString()} titles). Remove some to add more.`,
        };
      }

      const entry: WatchlistEntryDoc = {
        id: anime.id,
        title_romaji: anime.titleRomaji,
        title_english: anime.titleEnglish,
        format: anime.format,
        watchStatus,
        addedAt: Date.now(),
      };
      transaction.set(entryRef(uid, anime.id), entry);
      transaction.set(idsRef(uid), { ids: arrayUnion(anime.id) }, { merge: true });
      return { success: true };
    });
  } catch (error) {
    console.warn("Couldn't add to watchlist:", error);
    return { success: false, message: `Couldn't add ${title}. Please try again.` };
  }
}

export async function removeFromWatchlist(uid: string, animeId: number): Promise<ActionResult> {
  try {
    const batch = writeBatch(fireStore);
    batch.delete(entryRef(uid, animeId));
    batch.set(idsRef(uid), { ids: arrayRemove(animeId) }, { merge: true });
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.warn("Couldn't remove from watchlist:", error);
    return { success: false, message: "Couldn't remove it from your watchlist. Please try again." };
  }
}

export async function updateWatchStatus(
  uid: string,
  animeId: number,
  watchStatus: WatchStatus,
): Promise<ActionResult> {
  try {
    await updateDoc(entryRef(uid, animeId), { watchStatus });
    return { success: true };
  } catch (error) {
    console.warn("Couldn't update watch status:", error);
    return { success: false, message: "Couldn't update the watch status. Please try again." };
  }
}

function getTitle(anime: Pick<AnimeListItem, "titleEnglish" | "titleRomaji">): string {
  return anime.titleEnglish ?? anime.titleRomaji ?? "This anime";
}

async function hydrate(
  entries: StoredEntry[],
  options: { forExport?: boolean } = {},
): Promise<{ items: WatchlistItem[]; refreshFailed: boolean }> {
  if (entries.length === 0) return { items: [], refreshFailed: false };

  try {
    const fresh = await fetchAnimeByIds(
      entries.map((entry) => entry.id),
      options,
    );
    const items = entries.map((entry) => toWatchlistItem(entry, fresh.get(entry.id)));
    return { items, refreshFailed: false };
  } catch (error) {
    console.warn("Couldn't refresh watchlist details from AniList:", error);
    return { items: entries.map((entry) => toWatchlistItem(entry)), refreshFailed: true };
  }
}

function toWatchlistItem(entry: StoredEntry, fresh?: AnimeListItem): WatchlistItem {
  const userData = { watchStatus: entry.watchStatus, addedAt: entry.addedAt };
  if (fresh) return { ...fresh, ...userData, isStale: false };

  const titleEnglish = entry.title_english ?? null;
  const titleRomaji = entry.title_romaji ?? (titleEnglish ? null : `Anime #${entry.id}`);
  return {
    id: entry.id,
    titleEnglish,
    titleRomaji,
    coverImage: entry.image ?? null,
    bannerImage: null,
    format: entry.format ?? entry.type ?? null,
    episodeDuration: entry.duration ?? null,
    averageScore: entry.score ?? null,
    startDate: entry.startDateText ?? null,
    synopsis: entry.synopsis ?? null,
    synonyms: entry.synonyms ?? [],
    status: entry.status ?? null,
    genres: entry.genres ?? [],
    episodes: entry.episodes ?? null,
    season: entry.season ?? null,
    seasonYear: entry.seasonYear ?? null,
    isAdult: false,
    ...userData,
    isStale: true,
  };
}
