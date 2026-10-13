# Sumio Design Guidelines

> Official Design System & UI/UX Standards for the Sumio Personal Finance Platform.

---

## 1. Brand Philosophy & Aesthetic Direction

Sumio is a modern personal finance platform designed to bring **calm, clarity, and control** to individual financial management. Managing finances can often feel overwhelming; Sumio counters this with a clean, peaceful, and premium visual experience.

### Core Aesthetic Pillars

- **Calm & Trustworthy**: Centered on the **Sage & Forest** palette with neutral Mist canvas, conveying security, stability, and institutional trust without pastel visual clutter.
- **Crisp & Modern**: Flat, border-first design with minimal to zero muddy drop shadows. Surfaces feel elevated through hairline borders (`border-border`) and soft tonal depth.
- **Tactile & Snappy**: Every interaction feels physical and deliberate through tailored spring easings (`cubic-bezier(0.16, 1, 0.3, 1)`), micro-scaling (`active:scale-[0.98]`), and smooth sliding indicators.
- **Financial Precision**: Every monetary value, percentage change, and date aligns with strict tabular number rules (`tabular-nums`), eliminating layout shift and visual clutter.

---

## 2. Foundations

### 2.1 Color System (Sage & Forest Theme v1.0)

Sumio uses OKLCH color spaces for perceptual uniformity across light and dark modes. All colors are consumed via CSS custom properties in `src/index.css`; **hardcoded HEX/RGB values and arbitrary Tailwind color shades are strictly prohibited**.

#### Primary Brand & Surface Tokens

| Token                 | Light Mode Value                       | Dark Mode Value                        | Usage & Meaning                                                       |
| :-------------------- | :------------------------------------- | :------------------------------------- | :-------------------------------------------------------------------- |
| `--accent`            | `oklch(43% 0.071 163.6)` (`#245C45`)   | `oklch(82.5% 0.063 153.6)` (`#A7D2B3`) | Primary brand (Forest Green in Light, Soft Sage in Dark), primary CTA |
| `--accent-foreground` | `oklch(100% 0 0)`                      | `oklch(22.3% 0.012 156.1)`             | High-contrast text on accent surfaces                                 |
| `--accent-hover`      | `oklch(36.8% 0.058 164.1)`             | `oklch(87.3% 0.048 153.7)`             | Hover state for accent buttons                                        |
| `--background`        | `oklch(97.2% 0.003 128.5)` (`#F5F6F4`) | `oklch(22.3% 0.012 156.1)` (`#171D19`) | Main canvas page background (Mist in Light, Deep Forest in Dark)      |
| `--surface`           | `oklch(100% 0 0)` (`#FFFFFF`)          | `oklch(25.9% 0.016 152.8)` (`#1E2620`) | Primary card and container surface                                    |
| `--surface-secondary` | `oklch(95.9% 0.003 145.5)` (`#F0F2F0`) | `oklch(28.3% 0.016 152.9)` (`#242C26`) | Nested sections, alternating rows, muted containers                   |
| `--surface-tertiary`  | `oklch(94% 0.014 148.8)`               | `oklch(31.4% 0.017 151.9)`             | Soft badges, pill backgrounds, inactive tab indicator                 |
| `--overlay`           | `oklch(100% 0 0)`                      | `oklch(31.4% 0.017 151.9)`             | Solid popovers, select dropdowns, menus (Never translucent)           |
| `--border`            | `oklch(85.7% 0.011 149.8)` (`#CBD2CC`) | `oklch(34.2% 0.016 152)`               | Hairline boundaries for cards, inputs, dividers                       |
| `--foreground`        | `oklch(23.8% 0.016 152.7)` (`#19211B`) | `oklch(96.4% 0.005 145.5)`             | Primary high-contrast body & heading text                             |
| `--muted`             | `oklch(48% 0.02 150.8)` (`#566158`)    | `oklch(68.5% 0.02 150.8)`              | Secondary labels, captions, helper text                               |

#### Financial Domain Tokens (Strictly Decoupled from Brand)

> **Principle**: Brand color and financial meaning must remain separate. Green must NOT be used to mean "income" everywhere by default.

| Financial Token                | Light Mode Value                       | Meaning & Usage                            | Example                      |
| :----------------------------- | :------------------------------------- | :----------------------------------------- | :--------------------------- |
| `--finance-income`             | `oklch(51.1% 0.11 158.4)` (`#18794E`)  | Income, cash inflows (+), budget surplus   | Salary deposit, +12.4% MoM   |
| `--finance-expense`            | `oklch(50% 0.182 29.5)` (`#B42318`)    | Expenses, cash outflows (-), overdue bills | Grocery bill, -$85.00        |
| `--finance-neutral`            | `oklch(39% 0.019 151.3)` (`#3E4840`)   | Neutral transfers between own accounts     | Checking to Savings transfer |
| `--finance-pending`            | `oklch(52.3% 0.109 68.2)` (`#925C10`)  | Pending settlement, authorized holds       | Credit card pending swipe    |
| `--finance-investment`         | `oklch(46.8% 0.078 155.3)` (`#326747`) | Portfolio allocation, asset balances       | Index ETF purchase           |
| `--finance-transfer`           | `oklch(45% 0.092 240.1)` (`#175B83`)   | Cross-institution external transfers       | Wire transfer                |
| `--sand-500` / `--sand-subtle` | `oklch(67% 0.096 76)` (`#B78D4E`)      | Financial Goals & Savings Targets          | Emergency fund progress      |

#### Accessibility & Contrast Rule (WCAG 2.2 AA)

- **White on Sage is PROHIBITED**: White text on Sage (`#7DA58B`) fails WCAG contrast (2.8:1 ratio). Always pair Sage surfaces with dark text (`--foreground` or `--accent-subtle-foreground`).
- Color must never be the single visual indicator: Always accompany status colors with signed icons (`+`, `-`), labels, or chips.

#### Categorical Chart Palette Ramp

Charts utilize a calibrated 6-step palette designed for financial category distribution without rainbow noise:

- `--chart-1`: Forest Green (`oklch(43% 0.071 163.6)`)
- `--chart-2`: Green (`oklch(64.7% 0.081 154.6)`)
- `--chart-3`: Warm Sand (`oklch(56.4% 0.084 74.5)`)
- `--chart-4`: Blue (`oklch(54.2% 0.098 260.3)`)
- `--chart-5`: Plum (`oklch(57.7% 0.082 339.6)`)
- `--chart-6`: Slate (`oklch(57.4% 0.019 150.9)`)

---

### 2.2 Typography System

Sumio uses **`Inter Variable`** as its single typography foundation.

#### Type Scale & Semantic Hierarchy

| Role                   | Component Primitive          | Tailwind Utility Classes                                     | Context                                     |
| :--------------------- | :--------------------------- | :----------------------------------------------------------- | :------------------------------------------ |
| **Display Metric**     | `<Metric size="lg" />`       | `text-2xl font-bold tracking-tight sm:text-3xl tabular-nums` | Main Net Worth, Big Account Balances        |
| **KPI Metric**         | `<Metric size="md" />`       | `text-xl font-bold tracking-tight tabular-nums`              | StatCard values, Monthly Inflow/Outflow     |
| **Page Heading**       | `<Heading level={1} />`      | `text-xl font-bold text-foreground sm:text-2xl`              | Top of page title (e.g. Dashboard)          |
| **Section Heading**    | `<Heading level={2} />`      | `text-sm font-bold text-foreground`                          | Card header titles (`SectionCard`)          |
| **Subsection Heading** | `<Heading level={3} />`      | `text-xs font-semibold text-foreground`                      | Group headers inside cards                  |
| **Body Standard**      | `<Text variant="body" />`    | `text-sm font-normal text-foreground leading-normal`         | Descriptions, list items, dialog copy       |
| **Secondary / Muted**  | `<Text variant="muted" />`   | `text-xs font-normal text-muted`                             | Subtitles, timestamps, metadata             |
| **Micro Caption**      | `<Text variant="caption" />` | `text-[11px] font-medium text-muted`                         | Delta captions ("vs. last month"), tooltips |

#### Mandatory Tabular Figures Rule

> **Rule**: Any monetary amount, currency symbol combination, delta percentage, or sequential numeric list **MUST** include the `tabular-nums` CSS property (`font-variant-numeric: tabular-nums`). This guarantees digits share identical widths so columns do not jitter when data updates.

---

### 2.3 Iconography

Sumio relies exclusively on **`lucide-react`** with a uniform geometric aesthetic.

#### Icon Sizing Matrix

| Tier                         | Dimensions                                | Stroke Width | Primary Usage                                                        |
| :--------------------------- | :---------------------------------------- | :----------- | :------------------------------------------------------------------- |
| **Tier 1 (Mini / Inline)**   | `12px - 14px` (`h-3 w-3` / `h-3.5 w-3.5`) | `2px`        | Delta arrows (`ArrowUp`, `ArrowDown`), Chevron links, Info dots      |
| **Tier 2 (Action / Form)**   | `16px` (`h-4 w-4`)                        | `2px`        | Button icons, input prefixes, notification bell, dropdown indicators |
| **Tier 3 (Navigation)**      | `18px - 20px` (`h-5 w-5`)                 | `2px`        | Sidebar navigation items, Bottom navigation tabs                     |
| **Tier 4 (Category Anchor)** | `20px - 24px` inside `40-44px` pill       | `1.75px`     | `IconBadge` category indicators (Food, Transport, Rent, Salary)      |

---

### 2.4 Radius & Elevation

To maintain a clean, professional, non-childish look:

- **Card & Container Radius**: `rounded-xl` (`0.75rem` / `12px`). Crisp and refined.
- **Controls & Input Radius**: `rounded-lg` (`0.5rem` / `8px`) to `rounded-xl` (`0.75rem` / `12px`).
- **Pills, Chips, Avatars**: `rounded-full` (`9999px`).
- **Elevation**: Rely strictly on **hairline borders** (`border border-border`). Eliminate heavy black drop shadows; use minimal ambient diffusion (`shadow-none` or `shadow-xs`).

---

## 3. Modern Motion & Animation System

Sumio embraces a fluid, snappy, and responsive motion language.

### 3.1 Easing Curves

- **Spring / Snappy Deceleration (`ease-spring`)**:
  `cubic-bezier(0.16, 1, 0.3, 1)`
  _Used for_: Sliding tabs indicators, dialog/modal appearances, sheet openings.
- **Smooth Natural Curve (`ease-in-out`)**:
  `cubic-bezier(0.4, 0, 0.2, 1)`
  _Used for_: Color transitions, opacity fades, border highlights.

### 3.2 Duration Tiers

1. **Instant / Micro (100ms - 150ms)**:
   - Button press state: `active:scale-[0.98]`
   - Hover color shifts: `transition-colors duration-150`
   - Checkbox / Toggle state toggle
2. **Component Transitions (200ms - 250ms)**:
   - `SegmentedTabs` indicator pill slide
   - Dropdown menu reveal & scale (`scale-95` to `scale-100`)
   - Tooltip visibility
3. **Surface & Page Entrances (300ms - 400ms)**:
   - Staggered card entrance on route load: fade in + subtle `translate-y-2` (8px) upward slide with a 50ms stagger per card.
4. **Data Visualization Reveal (600ms - 800ms)**:
   - Donut chart angle sweep animation
   - Sparkline SVG path draw (`stroke-dashoffset`)

### 3.3 Accessibility (Reduced Motion)

Always wrap animations or provide CSS overrides for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 4. Component Decision Matrix ("Khi nào dùng cái gì?")

To prevent inconsistency, follow this authoritative selection guide:

### 4.1 Card Hierarchy

```
┌────────────────────────────────────────────────────────┐
│  StatCard (KPI Only)                                   │
│  - Top of page overview (Balance, Income, Expense)     │
│  - IconBadge + Big Value + Delta % + Sparkline         │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  SectionCard (Standard Feature Container)              │
│  - Title + optional Description + Action (right)       │
│  - Houses Tables, Charts, Goal lists, Upcoming bills   │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  Card (Primitive Container)                            │
│  - Raw wrapper for nested items or custom layouts      │
│  - Inside SectionCards or custom dialog bodies         │
└────────────────────────────────────────────────────────┘
```

- **Use `StatCard`**: Only when displaying a standalone summary metric card in the top summary row.
- **Use `SectionCard`**: For any cohesive section requiring a standard header with optional action (`SectionLink` or `SelectPill`).
- **Use raw `Card`**: Only when nesting a sub-card inside another card or building an unconventional dialog layout.

### 4.2 Labels, Tags & Anchors

- **`IconBadge`**: Use as a **visual anchor** beside transaction descriptions or category items. Displays an icon inside a soft tinted circular container.
- **`Chip`**: Use as a **text badge** for category names ("Food & Beverage", "Salary") or interactive filter tags.
- **`Badge`**: Use strictly as a **numeric counter or status dot** overlaid on or next to other elements (e.g. unread count on notification bell).

### 4.3 Action Triggers & Navigation

- **`Button`**: Form submissions, primary screen calls-to-action ("Add Transaction", "Transfer").
- **`SegmentedTabs`**: In-page or in-card view filters where all options must be visible side-by-side (e.g. "All / Income / Expense", "7D / 30D / 1Y").
- **`SelectPill`**: Compact dropdown selector when options exceed 4 or space is constrained (e.g. "This Month v").
- **`SectionLink`**: Header action that navigates deeper into a full dedicated page (e.g. "View all >").

---

## 5. Responsive Breakpoints & Adaptive Layout Rules

### 5.1 Breakpoint Scale

Sumio aligns with modern Tailwind v4 breakpoints:

- **Mobile (`< 640px`)**: Single column stacked layout, touch-optimized.
- **Tablet / Phablet (`640px - 1023px`)**: 2-column grids, adaptive navigation.
- **Desktop (`>= 1024px`)**: Full sidebar layout, multi-column dashboard grid.
- **Large Desktop (`>= 1280px`)**: 4-column KPI overview, expanded data tables.

### 5.2 Navigation Transformation

- **Desktop (>= 1024px)**: Fixed left sidebar (`w-60` to `w-64`) with brand logo, primary navigation links, upcoming bill indicators, and user footer.
- **Mobile & Tablet (< 1024px)**:
  - Sidebar is hidden.
  - **Bottom Navigation Bar** anchored at the viewport base with 4-5 core tabs (Dashboard, Transactions, Bills, Goals, Settings).
  - Search field in Topbar contracts into an icon trigger button opening a search dialog.

### 5.3 Adaptive Data Display (Table vs List Row)

Financial tables become unusable when crammed onto mobile screens:

- **Desktop (`md:` and above, >= 768px)**: Render standard `<Table>` with full headers (Date, Description, Category, Amount, Status).
- **Mobile (`< 768px`)**: Automatically adapt into a **Compact List Row** stack:
  ```
  ┌────────────────────────────────────────────────────────┐
  │ [IconBadge]  Spotify Subscription            -$14.99   │
  │              Entertainment • Yesterday        [Expense]│
  └────────────────────────────────────────────────────────┘
  ```
  _(Icon on left, Title + Category + Date stacked in center, Amount and Status Chip right-aligned)._

### 5.4 Density & Touch Targets

- **Card Padding**: Mobile uses `p-4` (16px); Desktop uses `p-5` (20px).
- **Minimum Touch Target**: Every interactive element on mobile (buttons, pills, tabs) must maintain a minimum bounding box of **`44px × 44px`** to adhere to WCAG 2.1 AA standards.

---

## 6. Engineering & Implementation Rules

1. **Strict Wrapper Rule**:
   ```tsx
   // ❌ FORBIDDEN: Direct imports from third-party UI packages
   import { Button as HeroUIButton } from "@heroui/react";

   // ✅ CORRECT: Import exclusively from the UI wrapper directory
   import { Button, Card, SectionCard, StatCard, Heading, Text, Metric } from "@/components/ui";
   ```
2. **No Arbitrary Colors**:
   ```tsx
   // ✅ CORRECT: Semantic design tokens
   <span className="text-foreground bg-surface border-border text-success">

   // ❌ FORBIDDEN: Arbitrary hex or unmapped colors
   <span className="text-[#10b981] bg-white border-gray-200">
   ```
3. **Always Use Currency Formatters**:
   ```tsx
   // ✅ CORRECT:
   import { formatCurrency, formatSignedCurrency } from "@sumio/common";
   <Metric value={formatSignedCurrency(transaction.amount, transaction.type, transaction.currency)} />

   // ❌ FORBIDDEN:
   <span>{`$${amount}.00`}</span>
   ```
4. **Mandatory Semantic Typography**:
   ```tsx
   // ✅ CORRECT:
   <Heading level={2}>Recent Transactions</Heading>
   <Text variant="muted">Last updated 5m ago</Text>

   // ❌ FORBIDDEN:
   <h2 className="text-sm font-bold text-gray-800">Recent Transactions</h2>
   ```
5. **Encapsulated Sizing & Breakpoints in UI Components**:
   All default sizing, responsive typography scales, responsive paddings, touch targets, and adaptive view transitions (e.g. `<Table.Adaptive>`, `<StatCard.Grid>`) must live strictly inside `@/components/ui/`. Feature code should never duplicate ad-hoc responsive utilities (e.g. `hidden md:block`, `p-4 sm:p-5`) — updating a breakpoint or density must only happen in one place.
   ```tsx
   // ✅ CORRECT: Let the UI component handle responsiveness
   <Table.Adaptive desktop={<Table>...</Table>} mobile={<ul>...</ul>} />
   <StatCard.Grid>{kpis.map(...)}</StatCard.Grid>
   <Heading level={1}>Dashboard</Heading>

   // ❌ FORBIDDEN: Duplicating responsive logic in feature code
   <div className="hidden md:block"><Table>...</Table></div>
   <div className="block md:hidden"><ul>...</ul></div>
   <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
   ```
