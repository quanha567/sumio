# Backend CI/CD Pipeline and Cloudflare Workers Delivery

We decided that `sumio-be` uses dedicated GitHub Actions workflows (`ci-be.yml`, `cd-be-dev.yml`, `cd-be-prod.yml`), deploys to Cloudflare Workers via Wrangler multi-environment configurations (`sumio-be-dev` and `sumio-be`), runs pre-deployment database migrations against Supabase PostgreSQL via the Session Pooler (`MIGRATION_DATABASE_URL`), and shares the monorepo Promotion PR gate to `production`.

## Context
The Sumio backend (`sumio-be`) is a NestJS application using Fastify adapted for Cloudflare Workers, persisting state into Supabase PostgreSQL via TypeORM. It shares API contracts with the frontend via `@sumio/contract`. We needed an automated, robust delivery pipeline adhering to production-grade CI/CD standards (zero-downtime migrations, strict quality gates, secret hygiene, and auditable releases).

We evaluated:
1. Unified monorepo matrix workflows vs. dedicated service workflows.
2. In-place single worker deployments vs. Wrangler multi-environment isolation (`env.dev` vs. `env.production`).
3. Running migrations through Supabase Transaction Pooler (port 6543) vs. Session Pooler / direct port 5432.
4. Independent backend release branches vs. unified monorepo Promotion PRs.

## Decision
1. **Dedicated Workflow Topology**: We maintain `ci-be.yml`, `cd-be-dev.yml`, and `cd-be-prod.yml`, triggering on changes to `sumio-be/**`, `packages/contract/**`, and backend workflow files. This isolates execution times, prevents frontend/backend CI coupling, and triggers immediately on shared contract changes.
2. **Standard Ephemeral Quality Gate**: The PR Quality Gate enforces code formatting (`oxfmt --check`), linting (`oxlint`), static type checking across `@sumio/contract` and `sumio-be` (`tsc --noEmit`), unit testing (`vitest run`), and worker bundling verification (`wrangler deploy --dry-run --env dev` & `--env production`) in under 2 minutes.
3. **Multi-Environment Wrangler Configuration**: `sumio-be/wrangler.jsonc` defines top-level defaults with `env.dev` (worker: `sumio-be-dev`) and `env.production` (worker: `sumio-be`). Non-sensitive runtime variables (`NODE_ENV`, `DATABASE_SSL`, `FIREBASE_PROJECT_ID`, `CORS_ORIGINS`) reside as code in `wrangler.jsonc`.
4. **Pre-deployment Database Migrations**: Before deploying updated worker bundles, CI/CD executes TypeORM migrations (`bun run db:migrate`) using `MIGRATION_DATABASE_URL` connected to Supabase Session Pooler (port 5432). This supports DDL transactions and advisory locks, while the serverless worker runtime continues using `DATABASE_URL` connected to the Transaction Pooler (port 6543). Migrations strictly follow the Expand and Contract pattern.
5. **Unified Promotion PR Release Gate**: Consistent with ADR 0001, successful deployment to `sumio-be-dev` ensures an automated Promotion PR from `main` to `production` is active. Merging to `production` triggers `cd-be-prod.yml`, executing production database migrations, deploying to `sumio-be`, running smoke tests, and generating release notes.
6. **Post-Deployment Smoke Verification**: Each CD deployment executes an automated health probe (`GET /health`) with retries to verify worker boot readiness before marking the release complete.

## Consequences
- Supabase credentials must be separated into `MIGRATION_DATABASE_URL` (port 5432) and `DATABASE_URL` (port 6543) in GitHub Environment Secrets for both `development` and `production`.
- Database schema changes must remain backward-compatible with currently executing workers during the migration-to-deploy transition window.
- The single Promotion PR now serves as the consolidated release gate for both frontend and backend updates.
