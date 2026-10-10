import { useCallback, useState } from "react";

import type { ActionResult } from "@/types/result";

export function useAction() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (action: () => Promise<ActionResult>) => {
    setPending(true);
    setError(null);
    const result = await action();
    setPending(false);
    if (!result.success) setError(result.message);
    return result.success;
  }, []);

  return { run, pending, error };
}
