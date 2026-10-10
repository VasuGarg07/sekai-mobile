import { router } from "expo-router";

import { SheetHeader } from "@/components/ui/sheet-header";
import { WatchStatusPicker } from "@/components/watch-status-picker";
import { usePreferences, useUpdatePreferences } from "@/hooks/use-preferences";
import type { WatchStatus } from "@/types/watchlist";
import { confirmTap, showMessage } from "@/utils/feedback";

import { SheetLayout } from "./sheet-layout";

export function DefaultStatusSheet() {
  const { defaultWatchStatus } = usePreferences();
  const updatePreferences = useUpdatePreferences();

  const handleSelect = async (status: WatchStatus) => {
    confirmTap();
    router.back();
    const result = await updatePreferences.mutateAsync({ defaultWatchStatus: status });
    if (!result.success && result.message) showMessage(result.message);
  };

  return (
    <SheetLayout>
      <SheetHeader title="Default status" subtitle="New additions to your list start here" />
      <WatchStatusPicker value={defaultWatchStatus} onSelect={handleSelect} />
    </SheetLayout>
  );
}
