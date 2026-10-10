/** Outcome of a write or auth action. `message: null` means there is nothing to show (e.g. cancelled). */
export type ActionResult = { success: true } | { success: false; message: string | null };
