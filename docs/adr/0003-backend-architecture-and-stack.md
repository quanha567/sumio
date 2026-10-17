# Backend Architecture and Core Stack

We decided that `sumio-be` runs on NestJS with the Fastify adapter deployed to Cloudflare Workers, backed by Supabase PostgreSQL via TypeORM, using `@ts-rest` for shared contracts and Firebase Auth with JIT provisioning.

## Context
The Sumio backend must serve the frontend dashboard (`sumio-fe`) with strict type-safety, rapid local development, and seamless deployment within the Cloudflare ecosystem alongside the existing Cloudflare Pages frontend. We evaluated standalone Express versus Fastify on Cloudflare Workers, Prisma versus TypeORM with Supabase, and custom JWT versus Firebase Auth.

## Decision
1. **Monorepo Topology via Bun Workspaces**: The root workspace manages `sumio-fe`, `sumio-be`, and `packages/*`. The shared API contract resides in `packages/contract` (`@sumio/contract`) using `@ts-rest/core` and Zod.
2. **NestJS on Cloudflare Workers with Fastify**: We utilize `@nestjs/platform-fastify` wrapped for Cloudflare Workers via Wrangler and `nodejs_compat`, minimizing memory footprint and cold-start latency compared to Express.
3. **Database & ORM**: We use Supabase PostgreSQL with TypeORM. Entities are explicitly registered in arrays to support bundling. Database migrations are executed strictly via CLI tooling in development and CI/CD, prohibiting `synchronize: true` in remote environments.
4. **Authentication via Firebase & JIT User Provisioning**: Authentication is delegated to Firebase Auth. Inbound HTTP requests supply a Firebase ID token (`Bearer`). A NestJS Auth Guard validates the token; on first contact, a local `User` record is automatically provisioned (Just-In-Time) into PostgreSQL (`firebase_uid`, `email`, `displayName`).
5. **Initial Domain Focus**: Development proceeds starting with `AuthModule` and `User` persistence before expanding to `Transactions`, `Bills`, and `Goals`.
6. **Clean Architecture & Domain-Driven Design (DDD)**: Business logic is decoupled from NestJS and TypeORM via 4 concentric layers: `Domain` (pure TypeScript aggregates, value objects, repository ports), `Application` (use cases, command/query handlers, outbound ports), `Infrastructure` (TypeORM entities, mappers, repository adapters, Jose token verifier), and `Interface` (NestJS controllers implementing `@ts-rest/nest` contracts, guards, decorators).
7. **Unified Toolchain via Oxlint and Oxfmt**: Backend code quality enforces the same ultra-fast Rust-based toolchain as `sumio-fe` (`oxlint` and `oxfmt`) with matching configs, deprecating Prettier in favor of `oxfmt`.

## Consequences
- NestJS bundling for Cloudflare Workers requires an explicit worker entrypoint and precludes dynamic filesystem globbing for entities and modules.
- Verification of Firebase tokens inside Workers must use lightweight Web Crypto / JOSE mechanisms rather than heavy Node-only gRPC dependencies.
- Changes to API contracts in `packages/contract` instantly propagate type checking to both frontend and backend.
- Pure domain entities require data mappers (`UserMapper`) to translate between domain models and TypeORM persistence entities, ensuring business rules remain completely framework-agnostic.

