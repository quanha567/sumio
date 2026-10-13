---
name: coding-standards
description: >
  Canonical coding standards, conventions, and library usage rules for the Sumio monorepo.
  Load BEFORE writing any code in sumio-fe or sumio-be.
  Load BEFORE reviewing any PR or changeset.
  Covers: Atomic Design layers, naming, library rules, React 19 patterns, linting, modern API versions.
---

# Sumio Coding Standards

This skill is the single authoritative source for engineering standards in the Sumio monorepo.
It supersedes any conflicting inline comment or ad-hoc pattern found in the codebase.

## When to load this skill

| Trigger                                         | Action                                             |
| ----------------------------------------------- | -------------------------------------------------- |
| Creating any new component, hook, or feature    | Read index + load `01-atomic-design` + `02-naming` |
| Writing or modifying any query/mutation/API     | Load `03-library-rules` (TanStack Query section)   |
| Using any third-party library                   | Load `03-library-rules`                            |
| Writing hooks, context, refs, memoization       | Load `04-react-patterns`                           |
| Before committing / oxlint errors appear        | Load `05-linting-and-quality`                      |
| Writing any React / TS / Tailwind / HeroUI code | Load `06-modern-api-versions` (use latest API)     |
| Reviewing a PR or changeset                     | Load all appendices relevant to changed files      |

## Appendix map

Read the index (this file) first. Load full appendices on demand:

| Appendix                                                            | Covers                                                                                        |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [`01-atomic-design.md`](./appendix/01-atomic-design.md)             | Directory structure, layer rules, import hierarchy, component placement                       |
| [`02-naming-conventions.md`](./appendix/02-naming-conventions.md)   | Files, components, hooks, queries, types, constants, handlers                                 |
| [`03-library-rules.md`](./appendix/03-library-rules.md)             | Per-library API rules for every dependency in sumio-fe and sumio-be                           |
| [`04-react-patterns.md`](./appendix/04-react-patterns.md)           | useCallback/useMemo, useTransition, ref patterns, context, error boundaries                   |
| [`05-linting-and-quality.md`](./appendix/05-linting-and-quality.md) | oxlint rule set, oxfmt config, how to fix common violations, quality gates                    |
| [`06-modern-api-versions.md`](./appendix/06-modern-api-versions.md) | Modern APIs for React 19, TS7, Tailwind v4, TanStack v5, HeroUI v3 — replaces legacy patterns |

---

## Quick Reference — 15 Non-Negotiable Rules

These rules are enforced unconditionally. Violation = must fix before commit.

### Architecture

1. **No direct `@heroui/react` imports** outside `components/atoms/` — import via `@/components/atoms`
2. **No styling utilities in features** — only layout utils (`flex`, `grid`, `gap-*`, `p-*`, `w-*`, `h-*`)
3. **No cross-layer imports** — atoms cannot import from molecules; molecules cannot import from features (see `01-atomic-design`)

### TypeScript

4. **No `any`** — use `unknown`, Zod-inferred types, or DTOs from `@sumio/contract`
5. **Always `import type`** for type-only imports (`verbatimModuleSyntax`)
6. **No functions with > 3 parameters** — consolidate extras into an options object

### React 19

7. **No `forwardRef`** — accept `ref?: React.Ref<T>` as a direct prop
8. **No `useContext()`** — use `use(Context)` instead
9. **No `<Context.Provider>`** — use `<Context value={...}>` instead
10. **Memoize all context values** with `useMemo` or static constants

### Data & State

11. **No inline string query keys** — always use typed query key factories
12. **No local-only filters/pagination** — sync all list state with TanStack Router URL search params
13. **No mock data in production builds** — all data from live backend queries

### Modern APIs

14. **Always use the latest API** — no `forwardRef`, `useContext`, `<Context.Provider>`, `React.FC`, `onClick` on HeroUI, legacy `[...arr].sort()`, hardcoded hex colors (see `06-modern-api-versions`)
15. **No legacy TanStack Query patterns** — use `isPending` not `isLoading`, use `skipToken` not `enabled: false`, prefer `useSuspenseQuery` inside Suspense boundaries

### Quality

16. **`vp check` must pass with zero warnings and zero errors** before every commit
17. **No `console.log`** — only `console.warn` / `console.error` for exceptional cases

---

## Review Checklist (quick pass)

When reviewing a PR, verify these in order:

- [ ] No `@heroui/react` direct imports in features/routes
- [ ] No styling classes (`text-*`, `bg-*`, `border-*`, `rounded-*`, `shadow-*`) in feature code
- [ ] All new hooks have explicit return types
- [ ] All new query hooks use key factory — no inline string keys
- [ ] No `forwardRef`, `useContext`, `<Context.Provider>` in new code
- [ ] No function signatures with > 3 positional parameters
- [ ] No `any` (error in oxlint = fix before merge)
- [ ] New components placed in the correct Atomic Design layer
- [ ] File names in `kebab-case`, component names in `PascalCase`
- [ ] No legacy patterns: `React.FC`, `onClick` on HeroUI, `[...arr].sort()`, hardcoded hex colors
- [ ] TanStack Query v5: `isPending` not `isLoading`, `skipToken` not `enabled: false`
- [ ] Tailwind v4: OKLCH tokens only, no arbitrary hex/rgb values
- [ ] `vp check` passes

For deep review of specific areas, load the relevant appendix and use its checklist.
