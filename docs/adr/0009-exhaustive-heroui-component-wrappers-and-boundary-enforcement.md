# Exhaustive HeroUI Component Wrappers and Boundary Enforcement

We decided to wrap 100% of HeroUI components in `src/components/ui/`, adopt a Dual Compound API pattern, map financial `SemanticTone` values to a unified `color` property, and enforce strict import boundaries via Oxlint.

## Context

In [ADR 0002](./0002-frontend-design-system-and-tokens.md), we established a strict Component Wrapper architecture prohibiting direct imports from `@heroui/react` in feature directories. However, only a subset of HeroUI components were initially wrapped. Some existing wrappers contained flaws:

- Using raw template string concatenation (`${className}`) instead of `cn()`.
- Leaking arbitrary Tailwind colors (e.g. `bg-emerald-100`) rather than semantic OKLCH Mint tokens.
- Inconsistent compound API exposure (e.g. `Card` only had flat exports, `Table` only had dot notation, and `Modal` was a monolithic component locking out sub-parts).
- Lack of compile/lint-time automated boundary checks preventing direct `@heroui/react` imports in feature code.

## Decision

1. **Exhaustive Upfront Wrapping**: Every UI primitive exported by `@heroui/react` (v3.2.6) is wrapped in a dedicated module under `sumio-fe/src/components/ui/` and centralized in `src/components/ui/index.ts`. Feature modules and layouts must import exclusively from `@/components/ui`.
2. **Dual Compound API Pattern**: All composite/compound primitives support both Flat Exports (`export const ModalHeader = ...`) and Namespaced Dot Notation (`Modal.Header = ModalHeader`), maximizing developer ergonomics while preserving tree-shakeability.
3. **Unified Color and Tone Mapping**: Components accepting a `color` prop support both standard HeroUI color variants (`"primary"`, `"secondary"`, `"default"`) and Sumio's domain `SemanticTone` values (`"accent"`, `"neutral"`, `"success"`, `"danger"`, `"warning"`), mapped internally to canonical Mint OKLCH tokens.
4. **Standardized Interactive Props**: Interactive primitives normalize aliases such as `disabled` and `isDisabled`, ensuring seamless interoperability across HTML forms and third-party libraries.
5. **Single Icon and Utility Standard**: The `cn` utility is re-exported from `@/components/ui`. HeroUI's internal icon components are deliberately unexported to maintain `lucide-react` as the single canonical icon system.
6. **Linter-Enforced Boundary**: Oxlint is configured with `no-restricted-imports` prohibiting `@heroui/react` and `@heroui/styles` across `src/**`, with a scoped override only within `src/components/ui/`.

## Consequences

- Prevents visual and architectural drift across feature teams.
- Any future upgrade, customization, or replacement of the underlying UI library can be executed entirely within `src/components/ui/` without touching feature screens.
- Comprehensive UI toolkit is instantly available without incremental wrapper PRs.
- Oxlint will instantly fail CI if an unauthorized import from `@heroui/*` is introduced.
