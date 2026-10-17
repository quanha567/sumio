# Standard Page Layout Primitives and Complete Mock Data Purge

We decided to establish canonical page-level layout primitives (`PageContainer`, `SplitLayout`, `DashboardGrid`) in `src/components/layout/`, purge all client-side mock data and disconnected mock widgets across features, and encapsulate residual ad-hoc styling utility classes into reusable UI/common primitives.

## Context

Following ADR-0016 (Strict UI Primitives & Semantic Token Encapsulation) and ADR-0017 (UI Primitives & Common Base Components Architecture), feature pages still exhibited structural inconsistencies:

1. **Ad-hoc Layout Grids & Breakpoints**: Pages like `TransactionsPage` and `DashboardPage` authored bespoke Tailwind grid layouts (`grid grid-cols-1 gap-6 lg:grid-cols-12`, `xl:col-span-7`, etc.), violating Rule 7's requirement that responsive breakpoints be encapsulated within layout primitives.
2. **Disconnected Mock Data & Widgets**: `src/features/dashboard/data/mock.ts` contained static mock data (`mockTransactions`, `mockSpending`, `weeklyCashflow`, `upcomingBills`). Widgets such as `UpcomingBills`, `FinancialGoalCard`, and `IncomeVsExpenses` had no backend API contracts and displayed hardcoded numbers. In `use-dashboard-analytics.ts`, empty states fell back to fake transactions instead of genuine database representations. Hardcoded profile values ("Summer Wells", Unsplash avatars) existed in root app routes.
3. **Residual Style Drift**: Several feature components authored raw styling classes (`border-border`, `bg-foreground`, `rounded-full`, `shadow-xl`, raw `<span>` color dots), violating Rule 6 (Zero Style Drift in features).

## Decision

1. **Standard Page Layout Primitives (`src/components/layout/`)**:
   - **`PageContainer`**: Standard page wrapping container providing consistent vertical cadence (`space-y-6`), fluid responsive constraints, and standard content padding.
   - **`SplitLayout`**: Canonical 2-column master-detail split layout encapsulating all responsive breakpoints (`grid-cols-1 lg:grid-cols-12`), providing typed `main` (primary table/data view) and `aside` (summary panel/sidebar) slots with configurable ratios (e.g. 8/4 or 9/3).
   - **`DashboardGrid`**: Responsive metric and widget grid component encapsulating column distribution across screen tiers.

2. **Complete Client-Side Mock Data Purge**:
   - Permanently delete `src/features/dashboard/data/mock.ts`.
   - Remove orphaned mock-only widgets (`UpcomingBills`, `FinancialGoalCard`, `IncomeVsExpenses`) until corresponding backend API contracts are designed and implemented.
   - Refactor `useDashboardAnalytics` to derive all metrics, categories, and recent transactions purely from live backend queries (`useTransactionsQuery`), gracefully handling genuine empty states.
   - Replace hardcoded profile fallbacks ("Summer Wells", static Unsplash images) with dynamic user profile data from `useAuth()`.

3. **Residual Style Encapsulation into Primitives**:
   - **`BatchActionBar`** (`src/components/common/batch-action-bar.tsx`): Encapsulates floating multi-select action bars (dark pill container, backdrop blur, badge counter, and action slots).
   - **`ColorDot`** (`src/components/ui/color-dot.tsx`): Encapsulates status and category color dots with theme-aware tones or dynamic category color codes.
   - **`Separator with label`**: Enhances `Separator` to support an optional centered text label (`label="or"`), eliminating ad-hoc absolute positioning in auth forms.
   - Feature components in `src/features/*` must strictly consume these primitives, with zero remaining ad-hoc color/border/shadow/rounded utilities.

## Consequences

- All feature pages achieve 100% adherence to Rule 6 (Zero Style Drift) and Rule 7 (Internal Breakpoint Encapsulation).
- Zero mock data in production builds; what the user sees reflects real database state.
- Layout patterns are reusable, DRY, and consistent across desktop, tablet, and mobile.
