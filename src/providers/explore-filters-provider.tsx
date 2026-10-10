import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import type { ExploreFilters } from "@/screens/explore/filter-options";

interface ExploreFiltersContextValue {
  filters: ExploreFilters;
  setFilters: (filters: ExploreFilters) => void;
}

const ExploreFiltersContext = createContext<ExploreFiltersContextValue | null>(null);

interface ExploreFiltersProviderProps {
  children: ReactNode;
}

/** Lives above the router so the filter sheet route and the Explore screen share one state. */
export function ExploreFiltersProvider({ children }: ExploreFiltersProviderProps) {
  const [filters, setFilters] = useState<ExploreFilters>({});
  const value = useMemo(() => ({ filters, setFilters }), [filters]);
  return <ExploreFiltersContext.Provider value={value}>{children}</ExploreFiltersContext.Provider>;
}

export function useExploreFilters() {
  const value = useContext(ExploreFiltersContext);
  if (!value) throw new Error("useExploreFilters must be used within ExploreFiltersProvider");
  return value;
}
