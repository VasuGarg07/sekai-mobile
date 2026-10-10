import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { fetchEntireWatchlist } from "@/services/watchlist";
import type { ActionResult } from "@/types/result";
import type { WatchlistItem } from "@/types/watchlist";
import { formatScore, WATCH_STATUS_LABELS } from "@/utils/anime";

export type ExportFormat = "csv" | "json" | "xml";

// Same columns as the web app's export, so files from either app line up.
const EXPORT_COLUMNS = [
  "id",
  "titleEnglish",
  "titleRomaji",
  "type",
  "episodes",
  "duration",
  "score",
  "status",
  "watchStatus",
  "season",
  "seasonYear",
  "genres",
  "synopsis",
  "addedAt",
  "image",
] as const;

type ExportRow = Record<(typeof EXPORT_COLUMNS)[number], string>;

const MIME_TYPES: Record<ExportFormat, string> = {
  csv: "text/csv",
  json: "application/json",
  xml: "application/xml",
};

function toRow(item: WatchlistItem): ExportRow {
  return {
    id: String(item.id),
    titleEnglish: item.titleEnglish ?? "N/A",
    titleRomaji: item.titleRomaji ?? "N/A",
    type: item.format ?? "N/A",
    episodes: item.episodes?.toString() ?? "N/A",
    duration: item.episodeDuration ? `${item.episodeDuration} mins` : "N/A",
    score: item.averageScore !== null ? formatScore(item.averageScore) : "N/A",
    status: item.status ?? "N/A",
    watchStatus: WATCH_STATUS_LABELS[item.watchStatus],
    season: item.season ?? "N/A",
    seasonYear: item.seasonYear?.toString() ?? "N/A",
    genres: item.genres.length > 0 ? item.genres.join(", ") : "N/A",
    synopsis: item.synopsis ?? "N/A",
    addedAt: new Date(item.addedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    image: item.coverImage ?? "N/A",
  };
}

const quoteCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;

function toCsv(rows: ExportRow[]): string {
  const lines = rows.map((row) => EXPORT_COLUMNS.map((column) => quoteCsv(row[column])).join(","));
  return [EXPORT_COLUMNS.map(quoteCsv).join(","), ...lines].join("\n");
}

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

function toXml(rows: ExportRow[]): string {
  const items = rows.map((row) => {
    const fields = EXPORT_COLUMNS.map((column) => `    <${column}>${escapeXml(row[column])}</${column}>`);
    return ["  <anime>", ...fields, "  </anime>"].join("\n");
  });
  return ['<?xml version="1.0" encoding="UTF-8"?>', "<watchlist>", ...items, "</watchlist>"].join("\n");
}

const SERIALIZERS: Record<ExportFormat, (rows: ExportRow[]) => string> = {
  csv: toCsv,
  json: (rows) => JSON.stringify(rows, null, 2),
  xml: toXml,
};

/** Writes the whole watchlist to a file and opens the Android share sheet for it. */
export async function exportWatchlist(uid: string, format: ExportFormat): Promise<ActionResult> {
  try {
    const { items } = await fetchEntireWatchlist(uid);
    if (items.length === 0) {
      return { success: false, message: "Your watchlist is empty. Nothing to export." };
    }

    const file = new File(Paths.cache, `sekai-watchlist.${format}`);
    file.create({ overwrite: true });
    file.write(SERIALIZERS[format](items.map(toRow)));

    await Sharing.shareAsync(file.uri, {
      mimeType: MIME_TYPES[format],
      dialogTitle: "Export watchlist",
    });
    return { success: true };
  } catch (error) {
    console.warn("Watchlist export failed:", error);
    return { success: false, message: "Couldn't export your watchlist. Please try again." };
  }
}
