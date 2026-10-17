# Sumio Monorepo — Engineering Guidelines & Agent Instructions

This document is the **canonical Single Source of Truth** for all developers and AI coding agents working in the Sumio monorepo. All sub-projects inherit these baseline rules.

---

## 1. Monorepo Architecture & Workspaces

The Sumio platform is structured as a Bun monorepo comprising:

- [`sumio-fe/`](file:///d:/projects/sumio/sumio-fe): React 19 single-page frontend application (Vite+, TanStack Router/Query, Tailwind CSS v4, HeroUI wrappers).
- [`sumio-be/`](file:///d:/projects/sumio/sumio-be): NestJS serverless backend service (Cloudflare Workers via `httpServerHandler`, TypeORM, Supabase PostgreSQL).
- [`packages/contract/`](file:///d:/projects/sumio/packages/contract): Shared `@sumio/contract` library containing Zod schemas, contract DTOs, and `@ts-rest` API definitions.
- [`packages/common/`](file:///d:/projects/sumio/packages/common): Shared `@sumio/common` library providing utilities (`dayjs`, `nanoid`, `lodash-es`, currency algorithms).

### Workspace Dependency Rules

- Internal cross-package dependencies **must** use `"workspace:*"`. Never pin local package versions.
- Code in `sumio-fe` and `sumio-be` must **never** import files directly from sibling source directories across projects via relative paths (`../../sumio-be`). All sharing goes through `@sumio/contract` or `@sumio/common`.

---

## 2. Essential Commands & Quality Gates

Run these commands from the monorepo root:

| Command              | Description                                               |
| -------------------- | --------------------------------------------------------- |
| `bun dev:fe`         | Starts frontend development server                        |
| `bun dev:be`         | Starts backend development server with watch mode         |
| `bun dev:contract`   | Watches and builds contract package during API drafting   |
| `bun build:contract` | Compiles `@sumio/contract` to `dist/`                     |
| `bun build:common`   | Compiles `@sumio/common` to `dist/`                       |
| `bun build`          | Compiles all packages in dependency order                 |
| `bun lint`           | Runs `oxlint` across all workspaces                       |
| `bun fmt`            | Formats all workspaces using `oxfmt`                      |
| `bun test`           | Runs unit & integration test suites across all workspaces |

### Automated Quality Gates

- **Pre-commit Hook**: Automatically executes `oxfmt --write` and `oxlint` via `lint-staged` on all staged files. Commits will be rejected if lint errors exist.
- **Commit Message Hook**: Validates messages using `@commitlint/config-conventional` (e.g. `feat(fe): ...`, `fix(be): ...`).

---

## 3. Workflow: Contract-First Development (Mandatory)

When introducing or modifying any API endpoint or shared data structure:

1. **Contract First**: Define or update Zod schemas and endpoint definitions in [`packages/contract/src/`](file:///d:/projects/sumio/packages/contract/src).
2. **Compile Contract**: Run `bun build:contract`.
3. **Implement Backend**: Bind the NestJS controller method using `@ts-rest/nest` with the contract.
4. **Implement Frontend**: Consume the contract client and query hooks in `sumio-fe`.
5. **Verify**: Ensure `bun lint` and `bun test` succeed before committing.

---

## 4. Domain & Financial Rules (Canonical)

Refer to [`GLOSSARY.md`](file:///d:/projects/sumio/GLOSSARY.md) and [`docs/adr/0006-money-as-minor-units-with-per-transaction-currency.md`](file:///d:/projects/sumio/docs/adr/0006-money-as-minor-units-with-per-transaction-currency.md).

- **Minor Units for Amounts**: All financial amounts (`Amount`) **must** be stored and exchanged as integer minor units (e.g., cents, hào). Never use floating-point numbers for money calculations.
- **Fixed Transaction Currency**: A transaction currency is fixed at creation based on the User's base currency and is never converted afterwards.
- **Signed Amounts**: Amounts are strictly positive magnitudes; direction is determined solely by `type: "income" | "expense"`.

---

## 5. Universal Code Style & Spacing Rules

All code throughout the monorepo must strictly adhere to these formatting guidelines:

### Import Organization

- **Sorting**: Imports are automatically grouped and sorted via `bun fmt` / `bun fmt:imports`:
  1. External dependencies (`react`, `@nestjs/common`, etc.)
  2. Workspace packages (`@sumio/contract`, `@sumio/common`)
  3. Internal aliases (`@/...`)
  4. Relative paths (`./...`, `../...`)
- **Type-only Imports**: Always use `import type { ... }` for types and interfaces.
- **Newline After Imports**: Exactly **1 blank line** must separate the import header from the code body.

### Vertical Spacing & Padding

- **Variable & State Blocks**: Group related `useState`, `useRef`, or variable definitions. Leave **1 blank line** before subsequent effects, hooks, or handlers.
- **Functions & Handlers**: Leave **1 blank line** between individual functions, callbacks (`useCallback`), and methods.
- **Return Statements**: Leave **1 blank line** before `return` statements (unless the function is a single-line return).
- **Consecutive Blank Lines**: Never have 2 or more consecutive blank lines anywhere in a file.

### Deterministic Naming & Clean Code Guardrails

- **File Naming**: Strictly `kebab-case` with layer suffixes (`*.controller.ts`, `*.use-case.ts`, `*.repository.ts`, `*-modal.tsx`).
- **No `I` Prefix on Interfaces**: Always `<Entity>Repository`, `<Entity>Record` (never `ITransactionRepository`).
- **Event Props vs Handlers**: Event props must be `on<Action>` (e.g. `onPress`, `onChange`), and handlers must be `handle<Action>` (`react/jsx-handler-names`).
- **Guard Clauses & Early Return**: Validate edge cases and return early; avoid arrow-nested `if/else` structures (`no-else-return`).
- **Automated Guardrails**: No nested ternaries (`no-nested-ternary`), max 3 positional parameters per function (`max-params: 3`), and strictly zero `any` (`typescript/no-explicit-any: error`).

---

## 6. Git Commit Convention

Commit messages must follow the Conventional Commits format with a defined scope:

```
<type>(<scope>): <subject>
```

- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- **Allowed Scopes**: `fe`, `be`, `common`, `contract`, `root`, `deps`, `ci`, `docs`, `release`

_Examples_:

- `feat(fe): add transaction filter by category`
- `fix(be): handle duplicate email on jit provisioning`
- `chore(contract): add transaction pagination schema`

---

## 7. Sub-Project Specific Guidelines

For deep architectural constraints and project-level rules, see:

- [`sumio-fe/AGENTS.md`](file:///d:/projects/sumio/sumio-fe/AGENTS.md)
- [`sumio-be/AGENTS.md`](file:///d:/projects/sumio/sumio-be/AGENTS.md)
