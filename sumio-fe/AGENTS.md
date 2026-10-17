# Sumio Frontend (`sumio-fe`) — Engineering Guidelines & Agent Instructions

This document specifies the rules and architectural guardrails for developing within `sumio-fe`.

---

## 1. Tech Stack Overview

- **Framework & Runtime**: React 19, TypeScript
- **Toolchain**: Vite+ (`vp dev`, `vp check`, `vp test`, `vp build`)
- **Routing**: `@tanstack/react-router` with code-based route tree (`src/routes/`)
- **Server State**: `@tanstack/react-query` v5
- **Design & Styling**: Tailwind CSS v4, HeroUI v3 wrappers (`src/components/ui/`), Sage & Forest theme tokens (ADR-0013)
- **Contracts**: `@sumio/contract` and `@sumio/common`

---

## 2. Hard Architectural Rules

### 🚫 Rule 1: Strict UI Component Wrapper Boundary (ADR-0009, ADR-0019)

- **Direct import of `@heroui/react` and `@heroui/styles` is FORBIDDEN** in all feature modules (`src/features/*`), routes (`src/routes/*`), templates, and molecules.
- **Import UI primitives from `@/components/atoms` and composite molecules from `@/components/molecules`** (e.g., `ConfirmModal`, `DataTable`, `PageHeader`).
- Only atomic wrapper primitives located in `src/components/atoms/*` are permitted to touch `@heroui/*`. Wrappers must only override the minimal styles needed to align with theme tokens, preserving built-in accessibility and behaviors.

### 🚫 Rule 2: Headless Feature Controllers (ADR-0010)

- **Do not mix business logic, queries, and modal states into view/presentational components.**
- Every feature module must separate concerns using the Controller-Presenter pattern:
  - **Controllers (Custom Hooks)**: `useXList`, `useXModals`, `useXAnalytics` encapsulating mutations, state, dialog flags, selection.
  - **Presenters (Components)**: Receive clean props and callbacks, focusing strictly on markup and user interaction.
- **Query Key Factories**: All TanStack Query cache keys must be defined in typed query factories within `src/features/<feature>/api/*-queries.ts`. Never use inline string keys.

### 🚫 Rule 3: Single Source of Truth via URL Search State

- All list filters, search keywords (`q`), pagination (`page`, `pageSize`), and sort parameters **must sync with the URL** using TanStack Router search params schema (`validateSearch`).
- Never maintain duplicate local state for pagination or filters that isn't reflected in the URL.

### 🚫 Rule 4: Strict Type Safety & 4-Tier Type Hierarchy (ADR-0019, ADR-0020)

- Never use `any`. Use `unknown`, Zod-inferred types, or DTO types from `@sumio/contract`.
- Custom hooks and exported components/utilities must have explicit return types (`: React.JSX.Element`, `: void`).
- **4-Tier Type Hierarchy**:
  - **Tier 1 (Domain)**: Strictly consume `@sumio/contract` Zod types (`TransactionDto`). Never alias domain entity names (e.g. do not alias `export type Transaction = ...`).
  - **Tier 2 (General & UI Types)**: Consume `@sumio/common` types (`OnChange<T>`, `VoidFunction`, `AsyncVoidFunction`, `OnToggle`, `OnPageChange`, `CategoryBreakdown`). Do not write ad-hoc callback types like `(val: string) => void`.
  - **Tier 3 (Shared React Props)**: Component-level prop interfaces.
  - **Tier 4 (Feature-Local)**: Explicitly named view types (e.g. `DashboardTransactionItem`).

### 🚫 Rule 5: React 19 & TypeScript 7 API Modernization (ADR-0015)

- **`forwardRef` is STRICTLY FORBIDDEN**: In React 19, `forwardRef` is deprecated. All custom components must be function components that receive `ref?: React.Ref<T>` as a direct prop.
- **Modern Context API**:
  - Always render `<Context value={...}>` directly. Never use `<Context.Provider>`.
  - Always read contexts using `use(Context)` instead of `useContext(Context)`.
  - Context values must always be memoized with `useMemo` (or constants) to prevent downstream re-renders (`jsx-no-constructed-context-values`).
- **No RSC Directives**: Never use `"use client";` in `sumio-fe`. This is a pure Vite SPA.
- **TypeScript 7 & Modern ES**:
  - Always use `import type` for type-only imports (`verbatimModuleSyntax`).
  - Use modern ES methods (e.g. `.at(-1)` instead of index calculation, `toSorted` instead of mutating sort).

### 🚫 Rule 6: Strict UI Styling Encapsulation (ADR-0016, ADR-0019)

- **Zero Style Drift**: All visual styling (colors, typography sizing/weight, borders, radius, shadows) must be defined in `src/index.css` and encapsulated exclusively in `src/components/atoms/`.
- **Layout-Only in Features & Templates**: Components in `src/features/*`, `src/routes/*`, and `src/components/templates/*` are **strictly forbidden** from writing ad-hoc styling utility classes (`text-xs`, `text-sm`, `text-muted`, `bg-*`, `border-*`, `rounded-*`, `shadow-*`). They may **only** use layout utilities (`flex`, `grid`, `gap-*`, `p-*`, `m-*`, `w-*`, `h-*`, `col-span-*`) or layout primitives.
- **Ergonomic Base Primitives**: High-frequency primitives (`Card`, `Modal`, `PageHeader`, `SelectField`) must provide concise prop-based base variants for 80% use cases alongside compound subcomponents.
- **Data-First Navigation**: Only the main Dashboard page features a compact Greeting Hero with 3D clay diorama asset. All other pages must use standardized `<PageHeader>` without decorative banners.

### 🚫 Rule 7: Molecule Components & Internal Breakpoints (ADR-0017, ADR-0019)

- **Ergonomic Molecules**: Consume domain-agnostic composite components from `src/components/molecules/*` (`ConfirmModal`, `PageHeader`, `EmptyState`, `StatCard`, `DataTable`, `SearchFilterBar`) rather than writing bespoke compound JSX in features.
- **Internal Breakpoint Encapsulation**: Primitives and base components must encapsulate internal responsive breakpoints (`xs:`, `sm:`, `md:`, `lg:`). Features are strictly forbidden from writing redundant responsive media query scaffolding.
- **Adaptive Virtualized DataTable**: Core tables must utilize `DataTable` with TanStack Table v9 (URL-synced pagination on desktop) and TanStack Virtual (infinite/virtualized scrolling on mobile).

### 🚫 Rule 8: Event Handlers & Component Lifecycle Ordering

- **Event Prop vs Handler Naming (`react/jsx-handler-names`)**:
  - Callback props must be named `on<Action>` (`onPress`, `onChange`, `onClose`, `onDelete`).
  - Functions passed to event props must be named `handle<Action>` (or wrapped in inline arrow callbacks).
- **Component Lifecycle Ordering**: Group code strictly as: (1) Refs → (2) State & Context → (3) Controller/Query hooks → (4) Derived state & Memo → (5) Effects → (6) Handlers → (7) Guard clauses / Early returns → (8) Main JSX.
- **Guard Clauses & Early Return**: Prefer early returns for loading/error/empty states (`no-else-return`).
- **Clean Code Limits**: No nested ternary operators (`no-nested-ternary`), strictly max 3 positional function parameters (`max-params: 3`).

---

## 3. Code Limits & Structure

Enforced by `oxlint`:

- **Maximum Lines per File**: **350 lines** (excluding blank lines and comments). If a component or hook approaches this limit, decompose it into smaller sub-components or sub-hooks.
- **Maximum Lines per Function**: **100 lines** (warn on TSX presentation, error on hooks and utility functions).
- **No Console**: `console.log` is strictly prohibited. Only `console.warn` or `console.error` are permitted for exceptional error logging.
- **No Array Index Key**: Never use array index as a React key when mapping elements (`react/no-array-index-key`).

---

## 4. Spacing & Formatting Rules

Follow the universal formatting rules configured in `.oxfmtrc.json`:

- **Import Sorting**: Grouped automatically by `oxfmt`. Always use `import type` for type imports.
- **Padding**:
  - Exactly **1 blank line** after the import block.
  - Exactly **1 blank line** after state/ref declaration blocks before starting effects or handlers.
  - Exactly **1 blank line** between individual handlers and callbacks (`useCallback`).
  - Exactly **1 blank line** before the main `return (...)` statement.
  - No consecutive double blank lines.

---

## 5. Development Workflow & Commands

| Command        | Description                           |
| -------------- | ------------------------------------- |
| `vp dev`       | Launch the local development server   |
| `vp check`     | Run format check, lint, and typecheck |
| `vp test`      | Run frontend Vitest test suite        |
| `bun run lint` | Run `oxlint` on frontend codebase     |
| `bun run fmt`  | Format frontend codebase with `oxfmt` |
