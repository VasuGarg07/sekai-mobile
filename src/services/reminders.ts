import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import { fetchNextEpisodes, type NextEpisode } from "@/services/anilist/anime";
import type { ActionResult } from "@/types/result";

const STORAGE_KEY = "episode-reminders";
const CHANNEL_ID = "episode-reminders";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function readReminderIds(): Promise<Set<number>> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  return new Set<number>(stored ? JSON.parse(stored) : []);
}

async function writeReminderIds(ids: Set<number>): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

const notificationId = (animeId: number) => `episode-${animeId}`;

export async function hasReminder(animeId: number): Promise<boolean> {
  return (await readReminderIds()).has(animeId);
}

// Android 13+ only shows the permission prompt once a channel exists.
async function ensurePermission(): Promise<boolean> {
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Episode reminders",
    importance: Notifications.AndroidImportance.HIGH,
  });
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

async function schedule({ animeId, title, episode, airingAt }: NextEpisode): Promise<void> {
  if (airingAt.getTime() <= Date.now()) return;
  await Notifications.scheduleNotificationAsync({
    identifier: notificationId(animeId),
    content: {
      title,
      body: `Episode ${episode} is out now.`,
      data: { animeId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: airingAt,
      channelId: CHANNEL_ID,
    },
  });
}

export async function enableReminder(animeId: number): Promise<ActionResult> {
  try {
    if (!(await ensurePermission())) {
      return { success: false, message: "Allow notifications for Sekai to get episode reminders." };
    }
    const [next] = await fetchNextEpisodes([animeId]);
    if (!next) return { success: false, message: "No upcoming episode is scheduled for this anime." };

    await schedule(next);
    const ids = await readReminderIds();
    ids.add(animeId);
    await writeReminderIds(ids);
    return { success: true };
  } catch (error) {
    console.warn("Couldn't set the reminder:", error);
    return { success: false, message: "Couldn't set the reminder. Please try again." };
  }
}

export async function disableReminder(animeId: number): Promise<ActionResult> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId(animeId));
    const ids = await readReminderIds();
    ids.delete(animeId);
    await writeReminderIds(ids);
    return { success: true };
  } catch (error) {
    console.warn("Couldn't remove the reminder:", error);
    return { success: false, message: "Couldn't remove the reminder. Please try again." };
  }
}

/**
 * Re-schedules each reminded anime for its next episode. Run on app start, so reminders keep
 * going after an episode airs. Anime that have finished airing are dropped.
 */
export async function syncReminders(): Promise<void> {
  const ids = await readReminderIds();
  if (ids.size === 0) return;

  const upcoming = await fetchNextEpisodes([...ids]);
  await Promise.all(upcoming.map(schedule));

  const stillAiring = new Set(upcoming.map((next) => next.animeId));
  const finished = [...ids].filter((id) => !stillAiring.has(id));
  await Promise.all(
    finished.map((id) => Notifications.cancelScheduledNotificationAsync(notificationId(id))),
  );
  await writeReminderIds(stillAiring);
}
