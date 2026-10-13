# Appendix 01 — Atomic Design & Component Layer Rules

Sumio FE follows **Atomic Design** mapped to 4 directory layers + a cross-cutting motion layer.

---

## Layer Map

```
src/
├── components/
│   ├── atoms/       ← Atoms    : HeroUI wrappers + basic HTML primitives
│   ├── molecules/   ← Molecules: Domain-agnostic composites
│   ├── templates/   ← Templates: Page-level layout primitives
│   └── motion/      ← Cross-cutting: Animation wrappers (not an AD layer)
│
├── features/
│   └── <feature>/
│       └── components/  ← Organisms: Domain-specific composite views
│
└── routes/          ← Pages: TanStack Router route files, compose organisms
```

> **Migration note**: Previously named `ui/` → `atoms/`, `common/` → `molecules/`, `layout/` → `templates/`.
> The alias `@/components/ui` is being migrated to `@/components/atoms` (see ADR-0019).

---

## Layer Definitions

### Atoms (`components/atoms/`)

**What goes here**: Wrappers around `@heroui/react` primitives and low-level HTML elements.

Rules:

- May only import from `@heroui/react`, `@heroui/styles`, `lucide-react`, `motion/react`, `react`, and `@/components/atoms` siblings
- Must **never** import from `molecules/`, `templates/`, `motion/`, or any `features/`
- Must only override minimal styles to align with Sage & Forest tokens — preserve all built-in a11y, keyboard nav, and library behaviors
- Each file wraps **one** HeroUI component or HTML element — no compound UI logic
- File naming: `button.tsx`, `input.tsx`, `badge.tsx` (kebab-case, singular)
- All atoms are exported from `components/atoms/index.ts`

**Current atoms** (examples): `Button`, `Input`, `Badge`, `Card`, `Chip`, `Modal`, `Select`,
`Checkbox`, `Skeleton`, `Spinner`, `Tooltip`, `Separator`, `Table`, `Tabs`, `Typography`

**Signals an atom is too big and should be split**:

- It renders a list of atoms
- It fetches data or calls a query hook
- It contains business logic (calculations, validations)

---

### Molecules (`components/molecules/`)

**What goes here**: Domain-agnostic composite components assembled from atoms. Can be dropped into
any feature without knowing what "Transaction" or "Budget" means.

Rules:

- May import from `atoms/` only — never from `templates/`, `motion/`, or `features/`
- Must not import types from `@sumio/contract` domain DTOs — use generic props instead
- Must not call query hooks or mutation hooks
- Provides ergonomic prop API covering 80% of use cases + compound sub-components for advanced use

**Decision test**: _"Could this component be used in a completely different financial app without
modification?"_ If yes → molecule. If no (it needs to know about Transaction, Category, Budget) → organism.

**Current molecules** (examples):

- `PageHeader` — generic title + description + action slot
- `EmptyState` — icon + title + message + optional action
- `ConfirmModal` — generic confirmation dialog
- `SearchFilterBar` — search input + filter toggle row
- `StatCard` — metric card with trend indicator
- `DataTable` — TanStack Table v9 + TanStack Virtual (desktop table / mobile card-row)
- `BatchActionBar` — floating multi-select action bar

---

### Organisms (`features/<feature>/components/`)

**What goes here**: Domain-specific composite views gated to one feature. These understand
domain types from `@sumio/contract`.

Rules:

- Lives in `src/features/<feature>/components/` — never in `molecules/` or `templates/`
- May import from `atoms/`, `molecules/`, and sibling `components/` in the same feature
- May import domain types from `@sumio/contract`
- Must **not** call query/mutation hooks directly — receives data and callbacks from a controller hook
- Must **not** contain business logic — presentational only

**Signal**: If a component imports `TransactionDto`, `CategoryDto`, or any `@sumio/contract` type →
it is an organism and must live in `features/<feature>/components/`.

**Examples**: `TransactionRow`, `TransactionFormModal`, `CategoryFilterChip`, `BudgetProgressBar`

---

### Templates (`components/templates/`)

**What goes here**: Page-level layout primitives that define spatial grids and navigation chrome.

Rules:

- May import from `atoms/` and `molecules/`
- Must **not** contain domain logic or feature-specific data
- Encapsulates all responsive breakpoints (`sm:`, `md:`, `lg:`) — features must not duplicate them
- Features consume templates as empty shells, passing content via children/slots

**Current templates**: `PageContainer`, `SplitLayout`, `DashboardGrid`, `AppShell`,
`Sidebar`, `Topbar`, `BottomNav`

---

### Motion (`components/motion/`)

**What goes here**: Animated versions of atoms or native HTML elements using `motion` (Framer Motion v14).

Rules:

- Cross-cutting concern — not part of the Atoms→Molecules→Templates hierarchy
- May only wrap atoms or native HTML — never molecules, templates, or organisms
- Must never contain business logic
- Must always provide a `prefers-reduced-motion` safe fallback
- All duration/easing values must reference design token variables — no hardcoded `0.3s ease`
- Feature code must not import `motion` directly — use wrappers from `components/motion/`

---

## Import Hierarchy (Strict)

```
routes/           → may import from: templates, molecules, atoms, motion, features/*
features/*        → may import from: atoms, molecules, motion, own siblings
  └─ components/  → atoms, molecules only (no query calls)
  └─ hooks/       → atoms, molecules, own api/
  └─ api/         → @sumio/contract, @sumio/common, @tanstack/react-query
templates/        → may import from: atoms, molecules
molecules/        → may import from: atoms only
atoms/            → may import from: @heroui/react, lucide-react, react
motion/           → may import from: atoms, react, motion/react
```

**Violations detected at lint time** via `no-restricted-imports` in `.oxlintrc.json`.

---

## Component File Anatomy

Every component file must follow this structure:

```tsx
// 1. External imports (sorted by oxfmt)
import type { ... } from "...";
import { ... } from "...";

// 2. Workspace imports
import type { ... } from "@sumio/contract";

// 3. Internal imports
import { ... } from "@/components/atoms";

// [1 blank line]
// 4. Types & interfaces
interface Props {
  // ...
}

// [1 blank line]
// 5. Component function
export function ComponentName({ prop1, prop2 }: Props) {
  // state
  // refs
  // [1 blank line]
  // effects / handlers
  // [1 blank line]

  return (...);
}
```

---

## Component Splitting Decision Tree

```
Is it a HeroUI wrapper or basic HTML primitive?
  YES → atoms/
  NO  ↓

Does it import domain types from @sumio/contract?
  YES → features/<feature>/components/ (organism)
  NO  ↓

Does it define a page grid or navigation chrome?
  YES → templates/
  NO  ↓

Is it an animated wrapper of an atom?
  YES → motion/
  NO  ↓

→ molecules/
```

---

## Review Checklist — Atomic Design

- [ ] No atom imports from molecules, templates, or features
- [ ] No molecule imports from templates or features
- [ ] No molecule that imports `@sumio/contract` domain types (move to organism)
- [ ] No feature organism placed in `molecules/` or `atoms/`
- [ ] No responsive breakpoint utilities (`sm:`, `md:`, `lg:`) in feature components
- [ ] No `motion` imported directly in features — use `components/motion/` wrappers
- [ ] No `@heroui/react` direct import outside `atoms/`
