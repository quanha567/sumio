# Frontend Code Splitting, Bundle Optimization, and Type Hygiene

We decided to configure automatic route-level code splitting with TanStack Router, implement vendor chunk separation in Vite, eliminate redundant dependencies and dead hooks, and enforce a 4-tier type hierarchy with generic UI event types across `sumio-fe`.

## Context

Prior to this decision, the frontend application had accumulated technical debt and performance bottlenecks:

1. **Monolithic Bundle**: Production builds produced a single monolithic JavaScript bundle exceeding 2.15 MB (638 KB gzipped) because all routes were eagerly bundled and vendor packages were not split into independent cacheable chunks. A temporary configuration `chunkSizeWarningLimit: 2500` was masking this issue.
2. **Duplicate and Unused Code**: Custom hooks (`use-on-open.ts`, `use-row-cursor.ts`) were duplicated inline inside `src/components/motion/command-palette.tsx`, leaving the standalone files orphaned. Unused dependencies (`@tanstack/table-core`, `class-variance-authority`, `wrangler`) were present in `sumio-fe/package.json`.
3. **Type System Drift**: `src/features/dashboard/types.ts` introduced type aliases `Transaction` (conflicting with GLOSSARY domain entity `TransactionDto`) and `SpendingCategory` (redundant with `CategoryBreakdown` from `@sumio/common`). Unused prop helpers lingered in `src/types/react.types.ts`. Callbacks were authored as ad-hoc function signatures rather than standard generic handlers from `@sumio/common`.
4. **Architectural Drift**: `sumio-fe/AGENTS.md` retained obsolete paths (`ui/`, `common/`, `layout/`) that were migrated by ADR-0019 to Atomic Design layers (`atoms/`, `molecules/`, `templates/`).

## Decision

### 1. Route Code Splitting & Vendor Chunking

- **TanStack Router Plugin**: Enabled `autoCodeSplitting: true` in `vite.config.ts` to automatically split code along route boundaries (`_app/index`, `_app/transactions`, `_auth/*`).
- **Vendor Chunk Isolation**: Configured Rollup `manualChunks` function to isolate large vendor dependencies into dedicated, long-term cacheable chunks:
  - `vendor-react`: `react`, `react-dom`
  - `vendor-heroui`: `@heroui/*`, `@react-aria/*`
  - `vendor-router`: `@tanstack/react-router`, `@tanstack/react-query`
  - `vendor-charts`: `recharts`, `d3-*`
  - `vendor-firebase`: `firebase/*`, `@firebase/*`
- **Purge Size Warning Override**: Removed `chunkSizeWarningLimit: 2500` to enforce strict asset budget checks.

### 2. Dead Code Elimination & Hook Deduplication

- Removed duplicate inline hook implementations of `useRowCursor` and `useOnOpen` from `command-palette.tsx`, standardizing on canonical implementations in `src/lib/hooks/`.
- Uninstalled unused packages: `@tanstack/table-core`, `class-variance-authority`, and `wrangler`.
- Pruned redundant types in `src/types/react.types.ts`.

### 3. 4-Tier Type Hierarchy & Reusable Handler Types

- Upgraded `OnChange<T>` in `@sumio/common` to support non-distributive tuples for multi-parameter event callbacks:
  ```ts
  export type OnChange<T = string> = [T] extends [unknown[]]
    ? (...args: T) => void
    : (value: T) => void;
  ```
- Standardized callbacks across `sumio-fe` using `@sumio/common` types (`OnChange<T>`, `VoidFunction`, `AsyncVoidFunction`).
- Removed ambiguous type aliases (`Transaction`, `SpendingCategory`), directly consuming `DashboardTransactionItem` for feature presentation and `CategoryBreakdown` from `@sumio/common`.

### 4. Spacing, Formatting & Comment Hygiene

- Enforced import grouping with exactly 1 blank line between groups: External -> Workspace (`@sumio/*`) -> Internal Aliases (`@/*`) -> Relative (`./`, `../`).
- Strictly enforced 1 blank line before return statements in functions and components.
- Removed verbose banner comments (`/* --- ... --- */`) and trivial descriptive comments.
- Standardized Lucide icon tier sizes (`h-3.5 w-3.5`, `h-4 w-4`).

## Consequences

- The single 2.15 MB JS monolith is eliminated. Chunks are granularly split by route and vendor, drastically reducing initial page load weight and improving HTTP caching.
- Zero dead or duplicated hooks across `src/lib/hooks/` and `components/motion/`.
- Type safety and consistency are reinforced through `@sumio/common` and `@sumio/contract`.
- Engineering guidelines in `sumio-fe/AGENTS.md` are aligned with actual repository architecture.
