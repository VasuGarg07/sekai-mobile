const ANILIST_URL = "https://graphql.anilist.co";
const TIMEOUT_MS = 15_000;

interface GraphQLError {
  message: string;
  status?: number;
}

interface GraphQLResponse<T> {
  data?: T | null;
  errors?: GraphQLError[];
}

export class AniListError extends Error {
  /** HTTP or GraphQL status; null when no response arrived (offline or timed out). */
  readonly status: number | null;

  constructor(message: string, status: number | null) {
    super(message);
    this.name = "AniListError";
    this.status = status;
  }

  get isRateLimited(): boolean {
    return this.status === 429;
  }

  /** Failures that can succeed on a second try. */
  get isTransient(): boolean {
    return this.status === null || this.status >= 500;
  }
}

function messageForStatus(status: number): string {
  if (status === 429) {
    return "AniList is receiving too many requests. Please wait a moment and try again.";
  }
  if (status === 404) return "We couldn't find what you were looking for.";
  if (status >= 500) return "AniList is having trouble right now. Please try again later.";
  if (status >= 400) return "The request to AniList was rejected.";
  return "Something went wrong while talking to AniList.";
}

async function post(body: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(ANILIST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body,
      signal: controller.signal,
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    throw new AniListError(
      timedOut ? "The request timed out. Please try again." : "Network error. Check your connection.",
      null,
    );
  } finally {
    clearTimeout(timer);
  }
}

async function readPayload<T>(response: Response): Promise<GraphQLResponse<T> | null> {
  try {
    return await response.json();
  } catch {
    // Proxies and CDNs can answer with an HTML error page instead of JSON.
    return null;
  }
}

export async function queryAniList<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await post(JSON.stringify({ query, variables }));
  const payload = await readPayload<T>(response);

  // The HTTP status wins over GraphQL errors, so a 429 is always treated (and retried) as a rate limit.
  if (!response.ok) {
    throw new AniListError(messageForStatus(response.status), response.status);
  }

  const errors = payload?.errors ?? [];
  if (errors.length > 0) {
    const status = errors.find((e) => typeof e.status === "number")?.status ?? 400;
    const message =
      status === 400 ? errors.map((e) => e.message).join("; ") : messageForStatus(status);
    throw new AniListError(message, status);
  }

  if (payload?.data == null) {
    throw new AniListError("AniList returned an empty response.", response.status);
  }
  return payload.data;
}
