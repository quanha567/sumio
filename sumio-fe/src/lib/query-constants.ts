/**
 * Standard TanStack Query staleTime constants across Sumio FE.
 * As mandated in Coding Standards Appendix 03 (Library Rules).
 */
export const QueryStaleTime = {
  /** 30s — volatile: transactions, dashboard metrics */
  Short: 30_000,
  /** 5m — semi-stable: categories, accounts */
  Medium: 300_000,
  /** 10m — stable: user profile, settings */
  Long: 600_000,
  /** Infinity — static reference data */
  Infinite: Number.POSITIVE_INFINITY,
} as const;
