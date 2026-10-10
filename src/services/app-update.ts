import Constants from "expo-constants";

import { GITHUB_REPO } from "@/constants";

export interface AppUpdate {
  version: string;
  url: string;
}

interface GitHubRelease {
  tag_name: string;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
}

export const currentVersion = Constants.expoConfig?.version ?? "0.0.0";

function parseVersion(version: string): number[] {
  return version
    .replace(/^v/i, "")
    .split(".")
    .map((part) => parseInt(part, 10) || 0);
}

function isNewer(candidate: string, current: string): boolean {
  const a = parseVersion(candidate);
  const b = parseVersion(current);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const difference = (a[i] ?? 0) - (b[i] ?? 0);
    if (difference !== 0) return difference > 0;
  }
  return false;
}

/** The latest GitHub release when it is newer than this build; otherwise null. */
export async function fetchAvailableUpdate(): Promise<AppUpdate | null> {
  const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  // 404 means no release has been published yet.
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub responded with ${response.status}`);

  const release: GitHubRelease = await response.json();
  if (release.draft || release.prerelease || !isNewer(release.tag_name, currentVersion)) return null;
  return { version: release.tag_name.replace(/^v/i, ""), url: release.html_url };
}
