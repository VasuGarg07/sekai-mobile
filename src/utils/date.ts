export type Season = "WINTER" | "SPRING" | "SUMMER" | "FALL";

const SEASONS_BY_QUARTER: Season[] = ["WINTER", "SPRING", "SUMMER", "FALL"];

export function getCurrentSeason(now = new Date()): { season: Season; year: number } {
  return {
    season: SEASONS_BY_QUARTER[Math.floor(now.getMonth() / 3)],
    year: now.getFullYear(),
  };
}

interface PartialDate {
  year?: number | null;
  month?: number | null;
  day?: number | null;
}

/** "Oct 6, 2023", "Oct 2023" or "2023", depending on how much of the date AniList knows. */
export function formatPartialDate({ year, month, day }: PartialDate): string | null {
  if (!year) return null;
  if (!month) return String(year);

  const date = new Date(Date.UTC(year, month - 1, day ?? 1));
  const options: Intl.DateTimeFormatOptions = day
    ? { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }
    : { month: "short", year: "numeric", timeZone: "UTC" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
