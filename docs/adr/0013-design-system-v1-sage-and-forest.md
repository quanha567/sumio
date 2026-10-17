# Sumio Design System v1.0 — Sage & Forest and Tailwind Variants Wrapper Architecture

We decided to establish Sumio Design System v1.0, superseding the preliminary Mint theme (ADR-0002). This architecture centers on a Sage & Forest palette with Mist canvas, independent Financial Domain Tokens, and standardizes all HeroUI component wrappers in `src/components/ui/` using `tv` (`tailwind-variants`).

## Context

The earlier Mint theme relied on generic mint tones where brand colors and financial income states were conflated. In financial applications, confusing brand identity with transaction direction (+income vs primary CTA) undermines cognitive clarity. Furthermore, HeroUI v3 wrappers previously mixed prop resolution ad-hoc instead of using HeroUI's first-class variant extension API (`tv` with `extend: componentVariants`).

## Decision

1. **Sage & Forest Palette with Neutral Mist Canvas**:
   - **Primary Brand**: Forest Green (`#245C45` / `oklch(43.5% 0.088 153.2)`), conveying security and premium institutional trust for primary actions and active brand chrome.
   - **Secondary Brand**: Sage (`#7DA58B` / `oklch(68.5% 0.052 147.5)`), used for secondary accents, chart series, and contextual support. Per WCAG 2.2 AA rules, white small text on Sage is strictly prohibited due to insufficient contrast (2.8:1).
   - **Canvas & Surface**: Mist (`#F5F6F4` / `oklch(96.8% 0.003 120)`) for page canvas and Pure White (`#FFFFFF`) for cards, ensuring pristine legibility for dense financial records without relying on pastel washes or soft gradients.
   - **Soft Sand Accent**: Sand (`#FCF8EF` - `#B78D4E`) reserved strictly for `Financial Goal` entities and savings accumulations, preventing confusion with everyday cash flows.
   - **Dark Mode Pairing**: Deep forest canvas (`#171D19`) paired with soft sage accent (`#A7D2B3`).

2. **Strict Financial Domain Token Layer**:
   - Cash flow direction (`finance-income` `#18794E`, `finance-expense` `#B42318`, `finance-neutral` `#3E4840`) is decoupled from brand colors and transaction processing states (`finance-pending` `#925C10`, `finance-investment` `#326747`, `finance-transfer` `#175B83`).
   - Monetary figures must use tabular numerals (`.money-value`) and dedicated semantic helpers (`.money-income`, `.money-expense`).

3. **Standardized Tailwind Variants (`tv`) Wrapper Pattern**:
   - 100% of component wrappers in `src/components/ui/` extend HeroUI's native component variants via `tv({ extend: componentVariants, ... })`.
   - Wrappers introduce high-level semantic `intent` props (`primary`, `secondary`, `ghost`, `danger`, etc.) aligned with Section 8 of the design spec, while maintaining transparent backward-compatibility with existing `variant` and `color` call-sites.

## Consequences

- Guarantees strict WCAG 2.2 AA contrast compliance across light and dark modes.
- Prevents UI regression and provides a single, uniform API pattern across all 60+ UI wrappers.
- Completely isolates third-party HeroUI v3 styling changes behind the `src/components/ui/` abstraction boundary.
