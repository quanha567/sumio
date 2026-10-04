# Frontend Design System and Component Wrapper Architecture

We decided to establish a strict Design System based on semantic OKLCH "Mint" tokens, mandatory Component Wrappers in `src/components/ui/`, semantic Typography primitives, and adaptive layout rules.

## Context
The Sumio personal finance platform requires high trust, visual cohesion, and rapid feature development without design drift. Without an architectural boundary, developers often import disparate third-party UI components, invent arbitrary Tailwind color utilities, and format financial numbers inconsistently across different screens.

## Decision
1. **Semantic OKLCH Tokens**: All design properties (colors, surfaces, borders, radius, animation curves) are centrally declared as CSS variables in `src/index.css`. Arbitrary hex codes and unmapped Tailwind colors in feature components are strictly prohibited.
2. **Strict Component Wrappers**: Feature screens must exclusively consume UI elements from `@/components/ui/`. Direct imports from `@heroui/react` or other external UI packages inside feature directories are disallowed.
3. **Standardized Typography Primitives**: All headings, body text, and monetary numbers must use `@/components/ui/typography` (`Heading`, `Text`, `Metric`). All monetary amounts and percentage deltas must enforce `tabular-nums` to guarantee vertical numeric alignment.
4. **Card Hierarchy & Adaptive Data Presentation**: Containers follow a 3-tier structure (`StatCard` for KPIs, `SectionCard` for standard sections, `Card` for nested wrappers). Data grids render as full multi-column tables on desktop (>= 768px) and adapt into compact list rows on mobile (< 768px).
5. **Modern Motion Choreography**: Animations follow natural fluid easing (`cubic-bezier(0.16, 1, 0.3, 1)`), 4 duration tiers, staggered page entrances, and strict compliance with `prefers-reduced-motion`.

## Consequences
- Theme adjustments, dark mode refinements, and brand updates can be executed globally with zero feature-level refactoring.
- Guarantees financial numbers, deltas, and semantic tones (`accent`, `success`, `danger`, `warning`, `neutral`) remain identical throughout the entire product.
- Slightly higher initial boilerplate when introducing new UI elements, as they must be vetted and encapsulated in `@/components/ui/`.
