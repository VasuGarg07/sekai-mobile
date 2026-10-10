import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { fireStore } from "@/lib/firebase";
import type { ActionResult } from "@/types/result";
import { WATCH_STATUSES, type Preferences, type WatchStatus } from "@/types/watchlist";

interface PreferencesDoc {
  app_theme?: string;
  default_watch_status?: string;
  adult_mode?: boolean;
}

export const DEFAULT_PREFERENCES: Preferences = {
  defaultWatchStatus: "watching",
  adultMode: false,
};

const NEW_PREFERENCES_DOC: Required<PreferencesDoc> = {
  app_theme: "rose",
  default_watch_status: DEFAULT_PREFERENCES.defaultWatchStatus,
  adult_mode: DEFAULT_PREFERENCES.adultMode,
};

const preferencesRef = (uid: string) => doc(fireStore, "preferences", uid);

function isWatchStatus(value: unknown): value is WatchStatus {
  return WATCH_STATUSES.some((status) => status === value);
}

function fromDoc(data: PreferencesDoc): Preferences {
  return {
    defaultWatchStatus: isWatchStatus(data.default_watch_status)
      ? data.default_watch_status
      : DEFAULT_PREFERENCES.defaultWatchStatus,
    adultMode: data.adult_mode ?? DEFAULT_PREFERENCES.adultMode,
  };
}

export async function fetchPreferences(uid: string): Promise<Preferences> {
  const snapshot = await getDoc(preferencesRef(uid));
  if (snapshot.exists()) return fromDoc(snapshot.data());

  await setDoc(preferencesRef(uid), NEW_PREFERENCES_DOC);
  return DEFAULT_PREFERENCES;
}

export async function updatePreferences(
  uid: string,
  updates: Partial<Preferences>,
): Promise<ActionResult> {
  const changes: PreferencesDoc = {};
  if (updates.defaultWatchStatus !== undefined) {
    changes.default_watch_status = updates.defaultWatchStatus;
  }
  if (updates.adultMode !== undefined) changes.adult_mode = updates.adultMode;

  try {
    await updateDoc(preferencesRef(uid), { ...changes });
    return { success: true };
  } catch (error) {
    console.warn("Couldn't save preferences:", error);
    return { success: false, message: "Couldn't save your settings. Please try again." };
  }
}
