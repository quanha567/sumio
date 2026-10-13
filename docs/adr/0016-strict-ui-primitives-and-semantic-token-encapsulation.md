# Strict UI Primitives and Semantic Token Encapsulation

We decided to establish strict UI encapsulation rules across `sumio-fe`, forbidding feature modules and routes from using ad-hoc styling utility classes and restricting them strictly to layout-only utilities, while standardizing all visual tokens, ergonomic base primitives, and 3D clay asset art direction inside `src/components/ui/` and `src/index.css`.

## Context

As the frontend evolved, styles began to drift across feature components:

- Ad-hoc typography utilities (`text-xs`, `text-[11px]`, `text-muted`, `font-bold`) and arbitrary colors (`bg-danger/10`, `text-accent`) were scattered across views rather than flowing through standard typography primitives (`<Heading>`, `<Text>`, `<Metric>`).
- Redundant and conflicting token definitions from shadcn coexisted with custom OKLCH tokens in `src/index.css`.
- The dashboard layout suffered from a cramped 3-column right rail duplicating recent transactions and truncating financial goals.
- Unregulated cartoon clip-art illustrations in greeting banners and sidebars violated the design principle of a calm, professional personal finance platform.

## Decision

1. **Zero Style Drift & Semantic Token Encapsulation**:
   - All visual styling tokens (colors, typography scales, font weights, borders, radii, ambient elevations) must be defined centrally in `src/index.css` using OKLCH and consumed exclusively by primitives inside `src/components/ui/`.
   - All shadcn residual tokens and conflicting CSS imports are purged.

2. **Strict Layout-Only Utility Rule in Features**:
   - Code inside feature modules (`src/features/*`), routes (`src/routes/*`), and page components is **strictly forbidden** from applying arbitrary style classes:
     - 🚫 No color classes (`bg-*`, `text-*`, `fill-*`, `stroke-*`).
     - 🚫 No typography sizing or weighting classes (`text-xs`, `text-sm`, `text-lg`, `font-bold`, `font-semibold`).
     - 🚫 No border or radius classes (`border-*`, `rounded-*`).
     - 🚫 No shadow classes (`shadow-*`).
   - Feature code is permitted to use **only layout utilities**:
     - ✅ Layout displays & flows: `flex`, `grid`, `inline-flex`, `block`, `hidden`.
     - ✅ Spacing & positioning: `gap-*`, `p-*`, `px-*`, `py-*`, `m-*`, `items-*`, `justify-*`, `relative`, `absolute`.
     - ✅ Dimensions & grid spans: `w-*`, `h-*`, `max-w-*`, `min-w-*`, `col-span-*`, `grid-cols-*`.

3. **Ergonomic Base Primitives alongside Compound APIs**:
   - High-frequency UI components (e.g., `Card`, `Modal`, `PageHeader`, `SelectField`) must provide concise prop-based base variants (e.g., `<Card title="..." subtitle="..." padding="md">`, `<PageHeader title="..." description="..." />`) to eliminate boilerplate for 80% of use cases.
   - Lower-level compound subcomponents (`Card.Header`, `Card.Content`) remain available for complex, bespoke composition.

4. **2-Column Responsive Dashboard & Data-First Pages**:
   - The dashboard transitions to a clean 2-column layout (collapsible navigation sidebar + single unified canvas grid), eliminating the duplicate right rail.
   - The main Dashboard page is the sole location permitted to feature a compact, warm greeting hero (~80-90px). All other functional pages (Transactions, Budgets, Goals, Reports, Settings) are strictly data-first, featuring standardized `<PageHeader>` components without decorative hero banners.

5. **3D Clay Generated Asset Art Direction**:
   - Decorative illustrations are standardized on warm **3D Matte Clay Dioramas** generated via AI, stored as optimized `.webp` images in `src/assets/illustrations/`, and smoothly integrated with CSS gradient masks to eliminate harsh borders.

## Consequences

- Guaranteed visual consistency across all feature modules and pages without visual regression.
- Faster authoring experience for developers and AI agents through high-level ergonomic primitives.
- Significantly improved data density and responsiveness across desktop and laptop screens.
