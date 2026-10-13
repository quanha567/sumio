# Monorepo Common Package (@sumio/common)

We decided to create a dedicated `@sumio/common` workspace package in `packages/common` to share general-purpose TypeScript utility types, pre-configured utility libraries (`dayjs`, `es-toolkit`, `lodash-es`, `nanoid`), and cross-cutting domain algorithms (currency minor units) between frontend (`sumio-fe`) and backend (`sumio-be`).

## Context

While `@sumio/contract` serves as the Single Source of Truth for HTTP schemas and `@ts-rest` contracts, both the frontend and backend require common TypeScript utility types (`Nullable<T>`, `Optional<T>`, `PaginatedResult<T>`) and shared runtime helpers (standardized `dayjs` with UTC/timezone plugins, `nanoid` generation, ISO 4217 minor unit conversions). Placing general utility code inside `@sumio/contract` would blur its focus as a pure API contract boundary.

## Decision

1. **Workspace Package**: Introduce `packages/common` (`@sumio/common`) within the Bun monorepo workspace topology.
2. **Shared Types**: Export fundamental TypeScript utility types (`Nullable<T>`, `Optional<T>`, `Maybe<T>`, `DeepPartial<T>`, `AsyncResult<T, E>`, `PaginatedResult<T>`, `PaginationMetadata`, `AuditTimestamps`).
3. **Pre-configured Dayjs**: Centralize `dayjs` plugin registration (`utc`, `timezone`, `isSameOrAfter`, `isSameOrBefore`, `relativeTime`) to guarantee unified UTC parsing and formatting across edge workers and web clients.
4. **Modern Utilities**: Provide `es-toolkit` (modern, ultra-lightweight, 2-3x faster than lodash) alongside `lodash-es` for maximum developer ergonomics without CommonJS bundle penalties.
5. **Collision-Resistant IDs**: Standardize URL-safe identifier generation using `nanoid` (Web Crypto native).

## Consequences

- Both `sumio-fe` and `sumio-be` depend directly on `"@sumio/common": "workspace:*"`.
- `@sumio/contract` remains cleanly dedicated exclusively to network contracts and Zod endpoint schemas.
- Monorepo build and prebuild hooks automatically compile `@sumio/common` ahead of consumer packages.
