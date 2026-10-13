# Atomic Design Component Layer Architecture

We decided to restructure `sumio-fe`'s component directories to formally follow the Atomic Design
pattern, rename directories to reflect their layer role, and enforce strict inter-layer import rules.

## Context

As `sumio-fe` grew, the `components/` directory accumulated four flat sub-directories with
ambiguous names (`ui/`, `common/`, `layout/`, `motion/`) whose responsibilities overlapped and whose
boundaries were enforced only by convention:

1. `components/ui/` held both atomic HeroUI wrappers (59 files) and some composite molecules, making
   it hard to determine at a glance what level of abstraction a component operated at.
2. `components/common/` mixed domain-agnostic molecules (`EmptyState`, `SearchFilterBar`) with
   domain-leaning organisms-in-waiting (chart components tied to financial data shapes).
3. Feature organisms — components that import `@sumio/contract` domain types — lived inside
   `features/<feature>/components/` but had no documented rule mandating this.
4. `components/motion/` had no defined position in any hierarchy; developers were unclear whether
   they could import it inside feature code.
5. No machine-enforceable import hierarchy existed across layers — only a prose rule in `AGENTS.md`.

## Decision

### 1. Directory rename to Atomic Design layer names

| Old path                       | New path                       | Atomic Design layer        |
| ------------------------------ | ------------------------------ | -------------------------- |
| `src/components/ui/`           | `src/components/atoms/`        | Atoms                      |
| `src/components/common/`       | `src/components/molecules/`    | Molecules                  |
| `src/components/layout/`       | `src/components/templates/`    | Templates                  |
| `src/components/motion/`       | `src/components/motion/`       | Cross-cutting (unchanged)  |
| `src/features/<f>/components/` | `src/features/<f>/components/` | Organisms (unchanged path) |

The path alias `@/components/ui` is migrated to `@/components/atoms`.
Barrel export `components/atoms/index.ts` replaces `components/ui/index.ts`.

### 2. Layer definitions and responsibilities

- **Atoms** (`components/atoms/`): Wraps one `@heroui/react` primitive or HTML element. No domain
  knowledge. Cannot import from other layers except sibling atoms.
- **Molecules** (`components/molecules/`): Domain-agnostic composites. Can be used in any feature
  without knowing what "Transaction" or "Budget" means. Imports atoms only. Does not call query hooks.
- **Templates** (`components/templates/`): Page-level spatial grids and navigation chrome. Imports
  atoms and molecules. No domain data. Encapsulates all responsive breakpoints.
- **Motion** (`components/motion/`): Cross-cutting animation wrappers around atoms or native HTML.
  Must include `useReducedMotion()` fallback. No business logic. Not a formal AD layer.
- **Organisms** (`features/<feature>/components/`): Domain-specific components. May import
  `@sumio/contract` types. Receives data and callbacks from controller hooks — no direct query calls.

### 3. Organism placement rule

A component belongs in `features/<feature>/components/` (organism) when it imports any type
from `@sumio/contract`. This is the machine-detectable boundary signal.

### 4. Import hierarchy enforcement

The following import directions are forbidden and enforced via `no-restricted-imports` in
`.oxlintrc.json`:

- `@heroui/react` and `@heroui/styles` outside `components/atoms/`
- `recharts` outside `components/molecules/`
- `motion/react` outside `components/motion/` and `components/atoms/`

The full strict hierarchy (high → low, may only import downward):

```
routes → templates, molecules, atoms, motion, features/*
features/* → atoms, molecules, motion, own siblings
templates → molecules, atoms
molecules → atoms
atoms → @heroui/react, lucide-react, react
motion → atoms, react, motion/react
```

### 5. Migration plan

1. Rename directories: `ui/` → `atoms/`, `common/` → `molecules/`, `layout/` → `templates/`
2. Update path alias in `tsconfig.json`: `@/components/ui` → `@/components/atoms`
3. Global search-replace all import paths across `src/`
4. Add `recharts` and `motion/react` to `no-restricted-imports` in `.oxlintrc.json`
5. Run `vp check` to verify zero regressions

## Consequences

- Component boundaries are self-documenting: a file's directory name immediately communicates its
  abstraction level and permitted dependencies.
- oxlint enforces inter-layer violations at commit time, not code review time.
- New features have an unambiguous decision tree for where to place new components.
- One-time migration cost: ~60 import path updates across `src/`.
