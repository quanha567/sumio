# UI Primitives and Common Base Components Architecture

We decided to partition the frontend component layer into low-level third-party wrappers (`src/components/ui/`) and high-level ergonomic base components (`src/components/common/`), encapsulating internal responsive breakpoints and standardizing an adaptive TanStack Table v9 + TanStack Virtual data table while purging legacy tokens and misplaced styles from `src/index.css`.

## Context

As `sumio-fe` evolved, `src/components/ui/` accumulated 65 flat files, mixing atomic library wrappers with composite widgets and layout blocks. In feature modules (e.g. `src/features/transactions/*`), developers repeatedly authored duplicate modal patterns, ad-hoc text styles, and repetitive responsive classes because primitives were either too granular or required verbose compound JSX. Furthermore, `src/index.css` contained misplaced component overrides (`.popover`, `.list-box-item`, `.money-*` with `!important`) and redundant legacy tokens alongside unused dependencies in `package.json`.

## Decision

1. **Architectural Separation: `ui/` vs `common/`**:
   - **`src/components/ui/` (Atomic UI Primitives)**: Strictly wraps `@heroui/*` and low-level HTML elements. Primitives must only override the minimal classes required to align with Sage & Forest theme tokens; they must never mutate or disable built-in accessibility (A11y), keyboard navigation, or library behaviors.
   - **`src/components/common/` (Common Base Components)**: Domain-agnostic composite components assembled from `ui/` compound primitives. Optimized for rapid authoring via ergonomic props (80/20 rule) to eliminate boilerplate JSX across features.

2. **Standard Base Component Suite (`src/components/common/`)**:
   - **`ConfirmModal`**: Props-driven confirmation dialog (`title`, `description`, `confirmIntent`, `confirmText`, `onConfirm`), replacing bespoke delete/cancel modal implementations across features.
   - **`PageHeader`**: Data-first page header with responsive title, description, and action layout.
   - **`EmptyState`**: Standardized zero-data display with icon, messaging, and action button.
   - **`StatCard`**: Financial metric card with built-in trend indicators and auto-scaling typography.
   - **`DataTable`**: Unified table component integrating **TanStack Table v9**:
     - **Desktop**: Multi-column tabular view with URL search param synchronized pagination.
     - **Mobile**: Automatically transforms into a card-row list powered by **TanStack Virtual** for smooth 60fps scrolling on mobile devices.
   - **`SearchFilterBar`**: Combined search input and filter toggles.

3. **Internal Breakpoint Encapsulation (Auto-Responsive)**:
   - All `ui/` and `common/` components encapsulate internal responsive utility classes (`xs:`, `sm:`, `md:`, `lg:`):
     - Touch targets: Minimum `h-10` on mobile to prevent iOS auto-zoom, scaling to `sm:h-9` on desktop.
     - Containers: Responsive padding (`p-3.5 sm:p-5 md:p-6`).
     - Action bars and headers: Column-stacked full-width on mobile (`flex-col gap-2`), horizontal on desktop (`sm:flex-row sm:justify-end`).
   - Feature views are forbidden from authoring repetitive layout breakpoint scaffolding for standard component chrome.

4. **Stylesheet & Dependency Hygiene**:
   - Purge obsolete and conflicting tokens (`--info`, `--default`, `--sage-400`, `--sage-500`, redundant chart colors) from `src/index.css`.
   - Remove root-level overrides (`.popover`, `.list-box`, `.money-*`) and relocate them into their respective component wrappers and `<Metric>` typography primitives.
   - Remove unused dependencies (`@base-ui/react`, `shadcn`, `cn`) from `package.json`.

## Consequences

- Clean separation of concerns between raw library adaptation (`ui/`) and application building blocks (`common/`).
- Dramatically reduced boilerplate in feature views, preventing style drift.
- Guaranteed high mobile performance and responsiveness across all core data tables.
