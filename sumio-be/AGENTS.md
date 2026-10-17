# Sumio Backend (`sumio-be`) — Engineering Guidelines & Agent Instructions

This document specifies the rules and architectural guardrails for developing within `sumio-be`.

---

## 1. Tech Stack & Serverless Runtime

- **Framework**: NestJS v12 with Express adapter (via Cloudflare Workers `httpServerHandler`)
- **Runtime**: Cloudflare Workers via Wrangler (`wrangler.jsonc`)
- **Database & ORM**: PostgreSQL (Supabase) via TypeORM (`src/database/`)
- **Contract & Validation**: `@ts-rest/nest`, `@sumio/contract`, Zod
- **Authentication**: Firebase JWT validation with public JWKS (`jose`) and JIT User Provisioning

---

## 2. Hard Architectural Rules

### 🚫 Rule 1: Contract-Bound Controllers (ADR-0007)

- Controllers must connect endpoints using `@ts-rest/nest` and contract definitions from `@sumio/contract`.
- **Do not define ad-hoc HTTP route shapes or custom DTO classes** in the backend controllers. All API request/response shapes are dictated by `@sumio/contract`.

### 🚫 Rule 2: Database Connection & Session Pooler

- Serverless worker instances must connect to Supabase PostgreSQL strictly via the **Session Pooler** (PgBouncer/Supavisor on port 5432 or 6543) to prevent connection socket exhaustion.
- Never open direct unpooled TCP sockets in runtime request flows.

### 🚫 Rule 3: Authentication & User Principal

- Authenticated endpoints must use `FirebaseAuthGuard`.
- Handlers must extract caller identity using the `@CurrentUser()` decorator, yielding an `AuthenticatedUserPrincipal` (`{ id, email, firebaseUid, baseCurrency }`).
- Never parse or decode Firebase JWT tokens manually in controllers or domain services.

### 🚫 Rule 4: Domain Exception Flow

- Service layers must throw specialized domain exceptions (`NotFoundDomainException`, `ValidationDomainException`) rather than generic NestJS HTTP exceptions (`HttpException`, `BadRequestException`).
- All domain exceptions are automatically translated into RFC-compliant responses by the global `DomainExceptionFilter`.

### 🚫 Rule 5: Strict Logging (No `console.log`)

- Raw `console.log` is **forbidden** across the backend codebase.
- Always use the NestJS `Logger` service (e.g. `Logger.log(...)`, `Logger.error(...)`, `Logger.warn(...)`) with an appropriate context tag.

### 🚫 Rule 6: Zero-Downtime Database Migrations (Expand and Contract)

- Schema migrations against Supabase PostgreSQL must strictly follow the **Expand and Contract** pattern to prevent table locks and deployment downtime:
  1. **Expand**: Add new columns as `nullable` or with a safe `DEFAULT`. Existing deployed backend workers continue operating uninterrupted.
  2. **Transition**: Deploy backend code that handles both old and new shapes (dual-write when needed, read from new column).
  3. **Backfill**: Migrate legacy data in controlled batches.
  4. **Contract**: Drop legacy columns or obsolete constraints in a follow-up release only after all traffic migrates.
- Destructive operations (renaming columns directly or dropping active columns in a single release step) are **strictly forbidden**.

### 🚫 Rule 7: Clean Architecture Naming & Guardrails

- **Deterministic Layer Suffixes**: Use `<verb>-<entity>.use-case.ts`, `<entity>.controller.ts`, `<entity>.repository.ts`, `<entity>.entity.ts`.
- **No `I` Prefix on Interfaces**: Domain repository ports must be named `<Entity>Repository` (e.g. `TransactionRepository`, never `ITransactionRepository`).
- **Semantic Method Verbs**:
  - `findById`: Returns `Promise<T | null>` (returns null when not found, never throws).
  - `getById` / `getByIdOrThrow`: Returns `Promise<T>` and throws `NotFoundDomainException` if missing.
  - `list`: Returns paginated collection `{ items, total }`.
- **Guard Clauses & Early Return**: Always validate edge cases and return early to prevent deeply nested indentation (`no-else-return`).
- **Clean Code Limits**: No nested ternary operators (`no-nested-ternary`), strictly max 3 positional function parameters (`max-params: 3`), and zero `any` (`typescript/no-explicit-any: error`).

---

## 3. Code Limits & Structure

Enforced by `oxlint`:

- **Maximum Lines per File**: **250 lines** (excluding blank lines and comments). If a Service or Controller exceeds this limit, decompose it into sub-services, query handlers, or use cases.
- **Maximum Lines per Function/Method**: **50 lines**. Keep use-case and service methods concise. Extract private helper methods when logic exceeds 50 lines.
- **Strict Return Types**: Controller actions and public service methods must declare explicit return types (e.g. `Promise<TransactionResult>`).

---

## 4. Spacing & Formatting Rules

Follow the formatting rules configured in `.oxfmtrc.json`:

- **Import Sorting**: Handled by `oxfmt`. Always use `import type` for type-only imports.
- **Padding**:
  - Exactly **1 blank line** after the import block.
  - Exactly **1 blank line** between class properties and methods.
  - Exactly **1 blank line** between individual methods in Controllers and Services.
  - Exactly **1 blank line** before `return` statements in non-trivial methods.
  - No consecutive double blank lines.

---

## 5. Development Workflow & Commands

| Command                   | Description                                     |
| ------------------------- | ----------------------------------------------- |
| `bun run start:dev`       | Start NestJS development server with watch mode |
| `bun test` / `vitest run` | Run Vitest backend test suite                   |
| `bun run lint`            | Run `oxlint` on `src/` and `test/`              |
| `bun run fmt`             | Format backend codebase with `oxfmt`            |
| `bun run db:migrate`      | Run database migrations via TypeORM CLI         |
