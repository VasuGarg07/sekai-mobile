import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { disableReminder, enableReminder, hasReminder } from "@/services/reminders";

export function useReminder(animeId: number) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.reminder(animeId);

  const { data: enabled = false } = useQuery({
    queryKey,
    queryFn: () => hasReminder(animeId),
    staleTime: Infinity,
  });

  const toggle = useMutation({
    mutationFn: () => (enabled ? disableReminder(animeId) : enableReminder(animeId)),
    onSuccess: (result) => {
      if (result.success) queryClient.setQueryData(queryKey, !enabled);
    },
  });

  return { enabled, toggle };
}
