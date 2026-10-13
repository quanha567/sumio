# Sumio Architecture Decision Records (ADRs)

This directory maintains the immutable architectural decisions governing the Sumio monorepo.

> **Historical Note**: ADR-0002 (Preliminary Mint Theme) was superseded by [ADR-0013](./0013-design-system-v1-sage-and-forest.md) and [docs/design-guidelines.md](../design-guidelines.md).

---

## Index of Architecture Decisions

### 1. Monorepo Infrastructure & CI/CD

| ADR                                                                | Title                                                                              | Scope           | Status     |
| :----------------------------------------------------------------- | :--------------------------------------------------------------------------------- | :-------------- | :--------- |
| [ADR-0001](./0001-frontend-cicd-pipeline.md)                       | Branch-Based Promotion via Automated Pull Requests to Production                   | Root / Frontend | `Accepted` |
| [ADR-0004](./0004-backend-cicd-pipeline.md)                        | Backend CI/CD Pipeline and Cloudflare Workers Delivery                             | Backend         | `Accepted` |
| [ADR-0008](./0008-monorepo-common-package.md)                      | Monorepo Common Package (`@sumio/common`)                                          | Packages        | `Accepted` |
| [ADR-0011](./0011-monorepo-rule-architecture-and-quality-gates.md) | Monorepo Rule Architecture, Hierarchical Agent Guidelines, and Local Quality Gates | Root            | `Accepted` |

### 2. Backend & Data Architecture

| ADR                                                                              | Title                                                                                    | Scope         | Status     |
| :------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- | :------------ | :--------- |
| [ADR-0003](./0003-backend-architecture-and-stack.md)                             | Backend Architecture and Core Stack (NestJS, Fastify, Cloudflare Workers, Supabase)      | Backend       | `Accepted` |
| [ADR-0006](./0006-money-as-minor-units-with-per-transaction-currency.md)         | Money as Integer Minor Units with Per-Transaction Currency                               | Domain / Core | `Accepted` |
| [ADR-0007](./0007-backend-refactor-bundler-paths-auth-and-error-architecture.md) | Backend Refactor: Bundler Resolution, Clean Paths, Decoupled Auth, and Domain Exceptions | Backend       | `Accepted` |

### 3. Frontend Architecture & State Management

| ADR                                                                                      | Title                                                              | Scope    | Status     |
| :--------------------------------------------------------------------------------------- | :----------------------------------------------------------------- | :------- | :--------- |
| [ADR-0005](./0005-frontend-auth-architecture.md)                                         | Frontend Authentication Architecture and Flow Specification        | Frontend | `Accepted` |
| [ADR-0010](./0010-frontend-server-state-and-controller-presenter-architecture.md)        | Frontend Server State and Controller-Presenter Architecture        | Frontend | `Accepted` |
| [ADR-0012](./0012-exhaustive-frontend-zero-warning-and-controller-presenter-standard.md) | Exhaustive Frontend Zero-Warning and Controller-Presenter Standard | Frontend | `Accepted` |
| [ADR-0015](./0015-react-19-and-typescript-7-modernization.md)                            | React 19 and TypeScript 7 API Modernization                        | Frontend | `Accepted` |

### 4. Design System & UI Components

| ADR                                                                                 | Title                                                                               | Scope             | Status     |
| :---------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- | :---------------- | :--------- |
| [ADR-0009](./0009-exhaustive-heroui-component-wrappers-and-boundary-enforcement.md) | Exhaustive HeroUI Component Wrappers and Boundary Enforcement                       | Frontend / UI     | `Accepted` |
| [ADR-0013](./0013-design-system-v1-sage-and-forest.md)                              | Sumio Design System v1.0 — Sage & Forest and Tailwind Variants Wrapper Architecture | Frontend / UI     | `Accepted` |
| [ADR-0014](./0014-form-context-and-convenience-wrappers.md)                         | Form Context Integration and High-Level Convenience Component Wrappers              | Frontend / UI     | `Accepted` |
| [ADR-0016](./0016-strict-ui-primitives-and-semantic-token-encapsulation.md)         | Strict UI Primitives and Semantic Token Encapsulation                               | Frontend / UI     | `Accepted` |
| [ADR-0017](./0017-ui-primitives-and-common-base-components-architecture.md)         | UI Primitives and Common Base Components Architecture (`ui/` vs `common/`)          | Frontend / UI     | `Accepted` |
| [ADR-0018](./0018-page-layout-primitives-and-mock-data-purge.md)                    | Standard Page Layout Primitives and Complete Mock Data Purge                        | Frontend / Layout | `Accepted` |
