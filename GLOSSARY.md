# Sumio

Front-end web application and CI/CD delivery infrastructure for the Sumio platform, a personal finance dashboard.

## Product language

**Sumio**:
The product name shown in the UI. Mockups may use other working names (e.g. Mintly); they are not the product name.
_Avoid_: Mintly, Summer (Summer is the demo user, not the app)

**Transaction**:
A single recorded movement of money, either income or expense, with a date, description, category and amount.
_Avoid_: Entry, record

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

**Mint Theme**:
The canonical color palette for Sumio based on OKLCH tokens centered on calming mint greens and soft warm neutrals.
_Avoid_: Default theme, Tailwind colors

**Component Wrapper**:
An encapsulated UI primitive located strictly in `src/components/ui/` that binds HeroUI and Tailwind v4 to Sumio's design tokens.
_Avoid_: Custom component, HeroUI element

**Semantic Tone**:
The standardized color mapping for financial states (`accent`, `success`, `danger`, `warning`, `neutral`) used across cards, badges, chips, and charts.
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
The serverless dispatch layer bridging Cloudflare Worker `fetch` events to the underlying NestJS Fastify application instance.
_Avoid_: Express wrapper, lambda handler

**User Identity**:
The record linking an external authentication provider (Firebase Auth) to a canonical Sumio `User` entity.
_Avoid_: Login credential, account link

**User Settings**:
The user's configuration for financial display preferences including base currency, locale, and week start day.
_Avoid_: User preferences, account options


