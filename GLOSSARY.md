# Sumio

Front-end web application and CI/CD delivery infrastructure for the Sumio platform, a personal finance dashboard.

## Product language

**Sumio**:
The product name shown in the UI. Mockups may use other working names (e.g. Mintly); they are not the product name.
_Avoid_: Mintly, Summer (Summer is the demo user, not the app)

**Transaction**:
A single recorded movement of money owned by one User, with a date, description, Category, Transaction Type and Amount. Deleting a Transaction removes it permanently.
_Avoid_: Entry, record

**Transaction Type**:
Whether a Transaction is `income` (money in) or `expense` (money out).
_Avoid_: Direction, sign

**Amount**:
The positive size of a Transaction in its own currency; whether it adds or subtracts is determined by its Transaction Type. A Transaction's currency is fixed at creation from the User's base currency and is never converted afterwards.
_Avoid_: Signed amount, value, total

**Category**:
A User-owned label that classifies Transactions (e.g. Food, Rent, Salary). Each User starts with a default set and can add their own.
_Avoid_: Tag, label, type

**Upcoming Bill**:
A known recurring payment (rent, internet, subscription) that is due soon and not yet paid.
_Avoid_: Reminder, scheduled expense

**Financial Goal**:
A named savings target with a saved amount and a target amount (e.g. "Save for a new laptop").
_Avoid_: Budget (a budget limits spending; a goal accumulates savings)

**App Shell**:
The page chrome shared by every authenticated page: sidebar navigation and top bar around a content slot.
_Avoid_: Layout (ambiguous with page grid layout)

**Auth Shell**:
The page layout enclosing unauthenticated authentication flows (Sign In, Sign Up, Password Recovery), featuring brand storytelling and illustration backdrops, completely separated from the authenticated App Shell.
_Avoid_: Login layout, auth wrapper

## Design system language

**Sage & Forest Theme**:
The canonical color palette for Sumio Design System v1.0 based on OKLCH tokens centered on Forest Green (`#245C45`) for primary brand actions, Sage (`#7DA58B`) for supporting elements, Mist (`#F5F6F4`) for clean neutral canvas, and Soft Sand (`#FCF8EF` - `#B78D4E`) for savings goals. Replaces the experimental Mint theme.
_Avoid_: Mint Theme, Pastel washes, Arbitrary gradients, Tailwind raw colors

**Financial Domain Tokens**:
A dedicated, independent semantic token layer (`finance-income`, `finance-expense`, `finance-neutral`, `finance-pending`, `finance-investment`, `finance-transfer`) separating financial cash-flow direction and transaction status from brand identity colors.
_Avoid_: Status colors for income, using brand green for positive money

**Component Wrapper**:
An encapsulated atomic UI primitive located strictly in `src/components/atoms/` that binds HeroUI v3 and Tailwind CSS v4 to Sumio's design tokens. Wrappers must only override the minimal styles required to align with theme tokens, strictly preserving third-party built-in accessibility, navigation, and core behaviors. Feature modules, routes, templates, and molecules are forbidden from importing third-party UI packages directly.
_Avoid_: Custom component, HeroUI element, direct `@heroui/*` imports in features

**Molecule Component**:
A reusable, domain-agnostic composite component located strictly in `src/components/molecules/` assembled from `src/components/atoms/` compound primitives, offering an ergonomic props-first API (80/20 rule) to eliminate repetitive boilerplate in feature modules.
_Avoid_: Feature component, ad-hoc dialog, helper widget, common base component

**Adaptive Virtualized DataTable**:
A unified data table component in `src/components/molecules/data-table.tsx` combining TanStack Table v9 and TanStack Virtual: rendering URL-synchronized paginated columns on desktop and transitioning to a virtualized card-row list on mobile.
_Avoid_: Desktop-only table, unvirtualized mobile list

**Internal Breakpoint Encapsulation**:
The architectural practice of embedding responsive utility breakpoints (`xs`, `sm`, `md`, `lg`) directly inside `atoms/` primitives and `molecules/` base components (for touch targets, paddings, typography scales, and flex flows), relieving feature modules from managing responsive scaffolding.
_Avoid_: Feature media queries, manual breakpoint boilerplate

**Dual Compound API**:
The design pattern for complex UI primitives exposing both flat named exports (e.g. `ModalHeader`) and namespaced dot-notation properties (e.g. `Modal.Header`), ensuring syntactic flexibility and tree-shakeability.
_Avoid_: Compound-only, flat-only

**High-Level Form Wrapper**:
A dual-mode component (`TextField`, `PasswordField`, `SelectField`) prioritizing concise prop-based authoring for labels, icons, and validation, while preserving lower-level compound sub-parts for bespoke compositions.
_Avoid_: Raw input with absolute icon, ad-hoc input layout

**Form Context Auto-Wiring**:
The automatic binding of form input wrappers to React Hook Form context via a `name` or `fieldId` prop, extracting registration, field errors, and validation states without boilerplate.
_Avoid_: Manual register wiring, duplicate error rendering

**Semantic Tone**:
The standardized color mapping for UI elements and financial states (`accent`, `success`, `danger`, `warning`, `neutral`, `income`, `expense`, `sand`) used across cards, badges, chips, and charts.
_Avoid_: Color variant, status color

**Typography Primitive**:
A standardized text element (`Heading`, `Text`, `Metric`) enforcing Inter Variable type scale and mandatory tabular figures for financial amounts.
_Avoid_: Raw heading, raw text tag

**Motion Choreography**:
The timed sequence of easing curves and duration tiers governing staggered entrances, sliding indicators, and micro-interactions.
_Avoid_: Custom CSS animation, transitions

**Adaptive Data Display**:
The responsive rendering pattern that presents full multi-column tables on desktop and compact card/list rows on mobile.
_Avoid_: Horizontal table scrolling, responsive table hack

**Semantic Token Encapsulation**:
The strict architectural boundary where all colors, font scales, weights, borders, radii, and elevations are declared in `index.css` and encapsulated solely within `src/components/atoms/`. Features, templates, and routes are strictly forbidden from authoring raw styling classes.
_Avoid_: Inline styling, ad-hoc text size classes, arbitrary background colors

**Layout-Only Utility Rule**:
The engineering constraint restricting CSS classes in feature views (`src/features/*`, `src/routes/*`, `src/components/templates/*`) strictly to layout positioning and dimensional flow (`flex`, `grid`, `gap-*`, `p-*`, `m-*`, `w-*`, `h-*`, `col-span-*`), offloading all visual design to primitives.
_Avoid_: Styling classes in features, custom borders on feature cards

**Ergonomic Base Primitive**:
A convenience component wrapper (such as `<Card title="..." subtitle="..." />` or `<PageHeader />`) offering concise prop-based authoring for 80% of use-cases while maintaining lower-level compound subcomponents for bespoke layouts.
_Avoid_: Repetitive boilerplate JSX, bespoke header layouts

**3D Clay Asset Style**:
The canonical visual art direction for decorative illustrations in Sumio, featuring warm 3D matte clay dioramas with ambient lighting, pastel sage/sand accents, generated via AI in WebP format and smoothly blended into surfaces.
_Avoid_: Cartoon clip-art, children's drawings, harsh image borders

**Data-First Page Header**:
The standardized, compact header layout across all functional pages (Transactions, Budgets, Goals, Reports, Settings) prioritizing filters and data actions over decorative banners.
_Avoid_: Decorative hero banner on inner pages, full-width illustrations outside dashboard

## Frontend architecture language

**Headless Feature Controller**:
A specialized custom hook encapsulating server-state queries, mutations, selection tracking, and dialog states for a domain feature, keeping presentation components completely free of business logic.
_Avoid_: God component, container component, fat view

**Route Search State**:
The validated URL search parameter schema serving as the single source of truth for table filters, pagination, and sorting across page refreshes and browser history navigation.
_Avoid_: Local filter state, component query state

**Query Key Factory**:
A centralized, typed object dictionary generating hierarchical cache keys for TanStack Query across feature domains to guarantee type-safe cache invalidation.
_Avoid_: Ad-hoc query keys, inline cache strings

**Form Controller**:
A headless hook encapsulating form state, validation schemas, loading flags, and authentication/mutation logic completely away from form markup.
_Avoid_: Form container, view model hook, inline form handler

**Analytics Controller**:
A headless hook aggregating financial server state, computing balance and savings metrics, converting currency minor units, and cleanly isolating mock data fallbacks.
_Avoid_: Dashboard manager, stats calculator, widget container

**Zero-Warning Quality Gate**:
The strict static analysis threshold prohibiting any unresolved linter warnings or errors from existing in frontend source files.
_Avoid_: Advisory linting, permissive checking

**Direct Ref Prop**:
The React 19 pattern of passing and accessing `ref` as a standard component prop on function components, replacing deprecated `forwardRef`.
_Avoid_: `forwardRef`, `ForwardedRef` wrapper

**Modern Context Provider**:
The React 19 convention of rendering `<Context value={...}>` directly and reading it with `use(Context)`, paired with mandatory memoization of context values.
_Avoid_: `<Context.Provider>`, legacy `useContext`

## Delivery language

**Dev Environment**:
The pre-production Cloudflare deployment (`sumio-dev` on Pages and `sumio-be-dev` on Workers) deployed automatically from the `main` branch after CI checks pass, also hosting ephemeral PR previews.
_Avoid_: Staging, test bed, QA server

**Prod Environment**:
The live user-facing Cloudflare deployment (`sumio` on Pages and `sumio-be` on Workers) deployed automatically upon merging into the `production` branch.
_Avoid_: Production server, live box

**Promotion PR**:
An automatically created Pull Request from `main` to `production` following successful Dev deployment, serving as the official release gate.
_Avoid_: Release ticket, manual sync

**Preview Deployment**:
An ephemeral Cloudflare Pages instance generated per Pull Request commit to inspect UI/UX changes before merging.
_Avoid_: Staging deploy, feature site

**Quality Gate**:
The automated barrier comprising linting, formatting, static type checking, and unit testing that must pass before any code is merged into `main` or `production`.
_Avoid_: Smoke check, sanity test

**Pre-deployment Migration**:
The automated database schema migration executed against Supabase PostgreSQL via the Session Pooler (`MIGRATION_DATABASE_URL` port 5432) before deploying new worker bundles.
_Avoid_: Auto sync, runtime migration, live DDL

**Worker Smoke Test**:
The automated post-deployment health probe pinging the Cloudflare Worker `/health` endpoint with retry logic to verify process readiness and HTTP 200 response before concluding delivery.
_Avoid_: Manual ping, uptime monitor

**Vite+ Toolchain**:
The unified web toolchain (`vp`) orchestrating package management, Oxlint, Oxfmt, Vitest, and bundling under a single deterministic CLI.
_Avoid_: Vite scripts, build helpers

## Backend language

**Shared Contract Package**:
The TypeScript package (`@sumio/contract`) in `packages/contract` defining Zod schemas and `@ts-rest` API contracts shared across frontend and backend.
_Avoid_: API types, shared DTOs, endpoint interface

**Shared Common Package**:
The TypeScript workspace package (`@sumio/common`) in `packages/common` providing common utility types (`Nullable`, `Optional`, `PaginatedResult`), pre-configured libraries (`dayjs`, `lodash-es`, `nanoid`), and currency minor units algorithms across frontend and backend.
_Avoid_: Shared lib, helper package, misc utils

**JIT User Provisioning**:
The runtime mechanism in `AuthModule` that lazily creates or reconciles a PostgreSQL user record upon receiving a valid Firebase ID token for an unrecorded user.
_Avoid_: Auto registration, user sync job

**Firebase Auth Guard**:
The NestJS guard validating Firebase JWT bearer tokens via public JWKS endpoints before injecting the authenticated user context into request handlers.
_Avoid_: Auth middleware, token validator

**Supabase Pooler**:
The connection pooling endpoint (PgBouncer/Supavisor) for Supabase PostgreSQL leveraged by TypeORM to prevent socket exhaustion from serverless worker connections.
_Avoid_: Direct DB URL, raw postgres socket

**Worker Adapter**:
The serverless dispatch layer bridging Cloudflare Worker `fetch` events to the underlying NestJS application instance via `httpServerHandler`.
_Avoid_: Fastify wrapper, lambda handler

**User Identity**:
The record linking an external authentication provider (Firebase Auth) to a canonical Sumio `User` entity.
_Avoid_: Login credential, account link

**User Settings**:
The user's configuration for financial display preferences including base currency, locale, and week start day.
_Avoid_: User preferences, account options

**Authenticated User Principal**:
The lightweight authorization context (`{ id, email, firebaseUid, baseCurrency }`) attached to incoming requests and injected via `@CurrentUser()`, decoupling consumer feature modules from the internal `User` domain aggregate.
_Avoid_: User session, auth token payload, user model

**Domain Exception Filter**:
A global NestJS exception filter translating internal domain exceptions (`NotFoundDomainException`, `ValidationDomainException`) into RFC/contract-compliant HTTP responses, eliminating boilerplate controller try/catch handlers.
_Avoid_: Error handler middleware, global error interceptor

## Governance and architecture language

**Contract-First Workflow**:
The mandatory development sequence requiring shared API contracts and Zod schemas to be authored and compiled in `@sumio/contract` before implementing consumer handlers or presentation components.
_Avoid_: Backend-first API design, loose contract sync

**Hierarchical Agent Rules**:
The layered documentation pattern where root-level monorepo architectural invariants (`AGENTS.md`) cascade into specialized sub-project constraints (`sumio-fe/AGENTS.md`, `sumio-be/AGENTS.md`).
_Avoid_: Flat rules, scattered instructions

**Architectural Boundary Enforcement**:
The automated blocking of cross-boundary code violations (e.g. direct `@heroui/*` imports outside UI wrappers or cross-project relative paths) via linter and pre-commit checks.
_Avoid_: Manual lint review, advisory convention
