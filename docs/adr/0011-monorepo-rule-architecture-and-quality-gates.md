# Monorepo Rule Architecture, Hierarchical Agent Guidelines, and Local Quality Gates

We decided to establish a hierarchical rule and guidance system (`AGENTS.md`) anchored at the monorepo root and specialized within each project, backed by deterministic local quality gates using `oxlint`, `oxfmt`, `husky`, `lint-staged`, and `@commitlint`.

## Context

As the Sumio monorepo expanded to include a modern frontend (`sumio-fe`), serverless backend (`sumio-be`), and shared workspace packages (`@sumio/contract`, `@sumio/common`), code quality and architectural conventions faced multiple failure points:

1. **Rule Divergence**: Agent guidelines were either absent (`sumio-be`) or contained stale templates (`sumio-fe`), leading to AI agents and developers violating established boundaries (e.g., importing directly from external UI packages, using `any`, or introducing inconsistent formatting).
2. **Missing Local Verification**: Shared packages (`packages/common`, `packages/contract`) lacked uniform `lint` and `fmt` scripts, leaving quality checks purely to manual discovery or CI failures.
3. **Unbounded Code Bloat**: Without explicit line and function limits, modules risked growing into unwieldy "God components" or monolithic services.
4. **Tooling Inconsistency**: Lack of pre-commit hooks allowed malformed commit messages and unformatted files to slip into Git history.

## Decision

1. **Hierarchical Rule Organization**:
   - **Root (`AGENTS.md`)**: Single Source of Truth for monorepo-wide architecture, workspace dependency rules (`"workspace:*"`), contract-first workflow, financial minor units policy (ADR-0006), and universal spacing conventions.
   - **Project-Level (`sumio-fe/AGENTS.md`, `sumio-be/AGENTS.md`)**: Specialized constraints for frontend (HeroUI wrapper boundaries, Controller-Presenter separation, URL search state) and backend (Fastify on Cloudflare Workers, `@ts-rest/nest` binding, `@CurrentUser()` injection, Supabase Session Pooler).
   - **Compatibility Pointers**: Maintain lightweight `CLAUDE.md` and `GEMINI.md` files referencing the canonical `AGENTS.md` at each level.
2. **Static Enforcement & Line Budgets**:
   - **Frontend**: Maximum 350 lines per file (`max-lines`), maximum 100 lines per function (`max-lines-per-function`). Hard ban on direct `@heroui/*` imports outside `src/components/ui/`.
   - **Backend**: Maximum 250 lines per file (`max-lines`), maximum 50 lines per method (`max-lines-per-function`). Ban on raw `console.log` in favor of NestJS `Logger`.
   - **Shared Packages**: Maximum 200 lines per file.
3. **Universal Formatting & Spacing**:
   - Automated import sorting via `oxfmt` with enforced `import type` declarations.
   - Strict vertical spacing: exactly 1 blank line after variable/state declaration blocks, between function definitions, and before return statements.
4. **Automated Quality Gates**:
   - Integrate `husky` and `lint-staged` to execute `oxfmt --write` and `oxlint` automatically on staged files during `git commit`.
   - Enforce Conventional Commits via `@commitlint/cli` and `@commitlint/config-conventional` with scopes: `fe`, `be`, `common`, `contract`, `root`, `deps`, `ci`, `docs`, `release`.
   - Equip all workspace packages with deterministic `bun run lint` and `bun run fmt` scripts.

## Consequences

- Guarantees 100% adherence to monorepo architectural boundaries across all AI agents and human contributors.
- Pre-commit execution via Rust-based `oxlint` and `oxfmt` takes milliseconds, introducing zero perceptible latency during Git commits.
- Completely prevents CI failures caused by trivial linting, formatting, or commit-message issues.
- Provides clear, maintainable boundaries between domain features, UI primitives, and backend services.
