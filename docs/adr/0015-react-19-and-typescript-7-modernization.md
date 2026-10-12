# React 19 and TypeScript 7 API Modernization

We decided to modernize the frontend architecture to strictly enforce React 19 and TypeScript 7 idioms: eliminating `forwardRef` in favor of direct `ref` props, modernizing Context providers and consumers via `<Context>` and `use(Context)`, removing RSC directives from the Vite SPA, and enforcing strict memoization of context values.

## Context

The Sumio frontend runs on **React 19.3.0** and **TypeScript 7.0.2** (Vite+ bundler with TanStack Router). However, several historical patterns remained from previous versions and framework migrations:

1. Components in `src/components/motion/` still used `forwardRef`, which is formally deprecated in React 19 in favor of function components directly accepting `ref` as a prop.
2. Context providers used legacy `<Context.Provider value={...}>` and consumed contexts via `useContext(Context)` rather than React 19's unified `<Context value={...}>` and `use(Context)` API. Furthermore, unmemoized inline context values caused unnecessary subtree re-renders and triggered linter warnings (`react/jsx-no-constructed-context-values`).
3. Next.js App Router artifacts (`"use client";` directives) lingered across several animation and utility files in a pure Vite SPA.
4. TypeScript 7 introduces strict compile-time checks (`erasableSyntaxOnly: true`, `verbatimModuleSyntax: true`), necessitating strict adherence to named type imports and modern ECMAScript methods (such as `.at()`).

## Decision

1. **Eliminate `forwardRef` across all custom components**:
   - All custom components (specifically in `src/components/motion/`) MUST be written as standard function components.
   - Components needing ref forwarding accept `ref?: React.Ref<T>` directly within their props interface.
   - The use of `forwardRef` is strictly forbidden in new or existing components.

2. **Modern Context API (`<Context>` & `use(Context)`)**:
   - All React context providers MUST render `<Context value={...}>` directly instead of `<Context.Provider>`.
   - All context consumers MUST use `use(Context)` instead of `useContext(Context)`.
   - Context `value` objects MUST be memoized using `useMemo` (or static constants) to prevent superfluous re-renders of downstream consumers.

3. **Purge RSC Directives from Vite SPA**:
   - Remove `"use client";` directives from all frontend files. The application is an SPA bundled by Vite+, making RSC directives redundant noise.

4. **Preserve Form Architecture (ADR-0014)**:
   - Form handling remains standardized on `react-hook-form` + `zod` + HeroUI v3 wrappers per ADR 0014.
   - Asynchronous transitions outside form context leverage React 19's `useTransition` / `startTransition`.

5. **Strict Quality Gates & TypeScript 7 Rules**:
   - Require `import type` for all type-only imports (`verbatimModuleSyntax`).
   - Use modern ES methods (e.g. `Array.prototype.at(-1)` instead of `[length - 1]`).
   - Enforce zero warnings in `oxlint` and zero errors in `tsc --noEmit`.

## Consequences

- Components are leaner, more idiomatic, and ready for future React releases without deprecation debt.
- Eliminates context-induced re-render bottlenecks across top-level layouts (App Shell, Animated Sidebar, Command Palette).
- Fully aligns codebase with [React 19 + TypeScript 7 Engineering Standards.md](../../React%2019%20+%20TypeScript%207%20Engineering%20Standards.md).
- Prevents architectural divergence in future feature implementations through strict agent instructions.
