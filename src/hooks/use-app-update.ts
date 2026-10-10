import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { fetchAvailableUpdate } from "@/services/app-update";

/** Checked once per app session; a failed check just means no prompt. */
export function useAppUpdate() {
  const { data } = useQuery({
    queryKey: queryKeys.appUpdate(),
    queryFn: fetchAvailableUpdate,
    staleTime: Infinity,
    retry: false,
  });
  return data ?? null;
}
