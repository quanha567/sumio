# Sumio — Personal Finance Platform

> A calm, precise, and privacy-focused personal finance platform designed to bring clarity and control to personal financial management.

---

## 1. Monorepo Architecture

Sumio is organized as a high-performance Bun monorepo comprising frontend, serverless backend, and shared contract packages:

```
sumio/
├── sumio-fe/           # Frontend Single-Page App (React 19, Vite+, TanStack, Tailwind v4, HeroUI v3)
├── sumio-be/           # Backend API (NestJS v12 on Cloudflare Workers, Fastify, TypeORM, Supabase)
├── packages/
│   ├── contract/       # Shared @sumio/contract (Zod schemas, DTOs, @ts-rest contract endpoints)
│   └── common/         # Shared @sumio/common (Utilities, Day.js, money minor-unit algorithms)
└── docs/               # Architecture Decision Records (ADRs) and UI Design System Guidelines
```

### Technology Stack

| Domain                 | Core Technologies                                                                                        |
| :--------------------- | :------------------------------------------------------------------------------------------------------- |
| **Frontend**           | React 19, TypeScript, Vite+, TanStack Router, TanStack Query v5, Tailwind CSS v4, HeroUI v3 wrappers     |
| **Backend**            | NestJS v12 (Fastify adapter) deployed to Cloudflare Workers, TypeORM, Supabase PostgreSQL, Firebase Auth |
| **API Contract**       | End-to-end typed contract via `@ts-rest` and Zod validation                                              |
| **Design System**      | Sumio "Sage & Forest" Theme v1.0, OKLCH color space, strict atomic component encapsulation               |
| **Monorepo & Tooling** | Bun Workspaces, `oxlint` (Rust linter), `oxfmt` (Rust formatter), Husky & lint-staged                    |

---

## 2. Essential Commands

All commands are executed from the monorepo root:

### Development

```bash
bun dev:fe         # Start Vite frontend dev server (port 5173)
bun dev:be         # Start NestJS backend in Cloudflare Workers watch mode
bun dev:contract   # Watch & build @sumio/contract during API drafting
```

### Building & Compilation

```bash
bun build:contract # Compile @sumio/contract to dist/
bun build:common   # Compile @sumio/common to dist/
bun build          # Compile all packages in dependency order
```

### Code Quality & Testing

```bash
bun lint           # Run oxlint across all workspaces
bun fmt            # Format all workspaces using oxfmt
bun test           # Run unit and integration tests across all workspaces
```

---

## 3. Documentation & Architecture Reference

- **Single Source of Truth (Engineering Guidelines)**: [AGENTS.md](./AGENTS.md)
- **Domain Terminology & Financial Rules**: [GLOSSARY.md](./GLOSSARY.md)
- **Design System & UI/UX Guidelines**: [docs/design-guidelines.md](./docs/design-guidelines.md)
- **Architecture Decision Records (ADRs)**: [docs/adr/README.md](./docs/adr/README.md)
  - [ADR-0001: Branch-Based Promotion via PRs to Production](./docs/adr/0001-frontend-cicd-pipeline.md)
  - [ADR-0003: Backend Core Stack on Cloudflare Workers](./docs/adr/0003-backend-architecture-and-stack.md)
  - [ADR-0004: Backend CI/CD Pipeline & Migrations](./docs/adr/0004-backend-cicd-pipeline.md)
  - [ADR-0006: Money as Integer Minor Units with Per-Transaction Currency](./docs/adr/0006-money-as-minor-units-with-per-transaction-currency.md)
  - [ADR-0010: Frontend Server State & Controller-Presenter Pattern](./docs/adr/0010-frontend-server-state-and-controller-presenter-architecture.md)
  - [ADR-0013: Sumio Design System v1.0 — Sage & Forest](./docs/adr/0013-design-system-v1-sage-and-forest.md)
  - [ADR-0017: Atomic UI Primitives vs Common Base Components](./docs/adr/0017-ui-primitives-and-common-base-components-architecture.md)

---

## 4. Financial Calculation Principles

Per [ADR-0006](./docs/adr/0006-money-as-minor-units-with-per-transaction-currency.md):

- **Integer Minor Units**: All monetary values are exchanged and stored as integer minor units (e.g. cents, hào, yen). Floating-point arithmetic for currency is strictly prohibited.
- **Fixed Currency**: Each transaction fixes its currency code (ISO 4217) at creation time and is never retroactively mutated upon base currency settings changes.
