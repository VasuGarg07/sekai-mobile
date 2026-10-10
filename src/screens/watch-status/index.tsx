import { router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { SheetHeader } from "@/components/ui/sheet-header";
import { WatchStatusPicker } from "@/components/watch-status-picker";
import {
  useRemoveFromWatchlist,
  useUpdateWatchStatus,
  useWatchStatus,
} from "@/hooks/use-watchlist";
import { spacing } from "@/theme";
import { createStyles } from "@/theme/create-styles";
import type { WatchStatus } from "@/types/watchlist";
import { WATCH_STATUS_LABELS } from "@/utils/anime";
import { confirmTap, showMessage } from "@/utils/feedback";

interface WatchStatusSheetProps {
  animeId: number;
  title: string;
}

export function WatchStatusSheet({ animeId, title }: WatchStatusSheetProps) {
  const styles = useStyles();
  const { bottom } = useSafeAreaInsets();
  const current = useWatchStatus(animeId);
  const updateStatus = useUpdateWatchStatus();
  const remove = useRemoveFromWatchlist();
  const busy = updateStatus.isPending || remove.isPending;

  const handleSelect = async (watchStatus: WatchStatus) => {
    if (watchStatus === current) {
      router.back();
      return;
    }
    const result = await updateStatus.mutateAsync({ animeId, watchStatus });
    if (result.success) {
      confirmTap();
      showMessage(`Moved to ${WATCH_STATUS_LABELS[watchStatus]}`);
      router.back();
    } else if (result.message) {
      showMessage(result.message);
    }
  };

  const handleRemove = async () => {
    const result = await remove.mutateAsync(animeId);
    if (result.success) {
      confirmTap();
      showMessage(`Removed ${title} from your list`);
      router.back();
    } else if (result.message) {
      showMessage(result.message);
    }
  };

  return (
    <View style={[styles.sheet, { paddingBottom: bottom + spacing.lg }]}>
      <SheetHeader title={title} subtitle="Move it to another list" />
      <WatchStatusPicker value={current} onSelect={handleSelect} disabled={busy} />
      <Button
        fullWidth
        variant="danger"
        icon="delete"
        title="Remove from My List"
        loading={remove.isPending}
        disabled={busy}
        onPress={handleRemove}
      />
    </View>
  );
}

const useStyles = createStyles(() => ({
  sheet: {
    gap: spacing.lg,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
}));
