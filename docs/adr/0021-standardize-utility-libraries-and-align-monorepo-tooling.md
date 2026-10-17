# Standardize Utility Libraries and Align Monorepo Tooling

We decided to eliminate `es-toolkit` in favor of standardizing exclusively on `lodash-es` in `@sumio/common`, resolve the backend HTTP server adapter conflict by standardizing on Express, eliminate redundant test tooling (`vite-tsconfig-paths`), and align TypeScript configurations and shared tooling across all monorepo workspaces.

## Context

Over successive development iterations, several dependency and architectural discrepancies accumulated across the monorepo:

1. **Utility Library Duplication**: `@sumio/common` installed and exported both `lodash-es` and `es-toolkit` alongside a wildcard namespace export (`export * as lodash`). This created ambiguity for developers on which utility library to use and risked bundling redundant polyfill code.
2. **Backend Platform Ambiguity**: `sumio-be/package.json` had both `@nestjs/platform-express` and `fastify` + `@fastify/cors` installed. While documentation described Fastify, actual implementations in `main.ts` and `worker.ts` initialized Express via `NestFactory.create(AppModule)`. Stubs in `wrangler.jsonc` and Fastify types in `firebase-auth.guard.ts` introduced conflicting signals.
3. **Vitest Tooling Redundancy**: In `sumio-be`, Vitest emitted a continuous warning regarding `vite-tsconfig-paths`, which is now natively supported by Vite's `resolve.tsconfigPaths: true`.
4. **TypeScript Compatibility & Tooling Drift**:
   - `sumio-fe` and root operated on TypeScript 7.0.2 (Vite+ ecosystem).
   - In-depth research revealed that `@nestjs/cli` requires the legacy programmatic compiler API (`import ts from 'typescript'`) which TypeScript 7.0 omitted. TypeScript 7 explicitly throws: _"The installed TypeScript version (7.0.2) does not expose the programmatic compiler API that the Nest CLI requires."_
   - Therefore, `sumio-be` requires TypeScript 5.8/5.9 for Nest CLI compiler transforms, while frontend and shared packages leverage TypeScript 7 idioms.
   - TypeScript 7 deprecated `baseUrl` in favor of explicit relative `paths` (`"@/*": ["./src/*"]`) and mandates explicit `rootDir: "./src"` when `outDir` is specified.

## Decision

### 1. Standardize on `lodash-es` Only & Enforce Named Exports

- **Remove `es-toolkit`**: Uninstalled `es-toolkit` completely from `@sumio/common`.
- **Pure Named Exports**: Export only specific, tree-shakeable utilities directly from `@sumio/common` (`chunk`, `clamp`, `cloneDeep`, `debounce`, `get`, `isEmpty`, `isEqual`, `merge`, `omit`, `pick`, `set`, `throttle`).
- **Remove Wildcard Namespace**: Removed `export * as lodash` to prevent accidental whole-library bundling.

### 2. Standardize Backend on Express Adapter

- **Purge Fastify**: Uninstalled `fastify` and `@fastify/cors` from `sumio-be`. Removed unnecessary `@fastify/*` aliases from `wrangler.jsonc`.
- **Express Type Integration**: Replaced `FastifyRequest` with `Request` from `express` in `firebase-auth.guard.ts`.
- **Documentation Alignment**: Synchronized `AGENTS.md` and `GLOSSARY.md` to reflect that the serverless NestJS backend runs on Cloudflare Workers via `httpServerHandler` and Express.

### 3. Eliminate Redundant Test Tooling

- **Native Tsconfig Paths**: Removed `vite-tsconfig-paths` from `sumio-be/package.json` and enabled `resolve: { tsconfigPaths: true }` in `vitest.config.ts`, achieving 100% zero-warning test runs.

### 4. Cohesive TypeScript & Tooling Configuration

- **TypeScript Pinning**: Maintained `typescript: ^7.0.2` for root, `sumio-fe`, `packages/contract`, and `packages/common`. Pinned `sumio-be` devDependencies to `typescript: ^5.8.2` until Nest CLI releases compatibility with TS 7.1+.
- **TS7 Config Hygiene**:
  - Removed deprecated `baseUrl: "."` across tsconfig files.
  - Formatted `paths` with relative `./` targets (e.g. `"@/*": ["./src/*"]`).
  - Explicitly specified `rootDir` in `packages/common`, `packages/contract`, and `sumio-be` to satisfy TS7 requirements.
- **Unified Linter & Formatter**: Synchronized `oxlint` (`^1.87.0`) and `oxfmt` (`^0.72.0`) across all workspaces.

## Consequences

- Zero duplicate utility libraries: All shared utility functions are cleanly imported from `@sumio/common`.
- Zero compiler or linter warnings across `bun lint`, `bun test`, `bun run build`, and `vp check`.
- Clear, unambiguous backend runtime architecture without phantom Fastify dependencies.
- Monorepo tooling and configs fully aligned and validated.
