# React 19 + TypeScript 7 Engineering Standards

This repository defines frontend engineering standards for **React 19** and **TypeScript 7** in 2026. It is intended to guide frontend engineers, code reviewers, and automated agents in building and maintaining production applications with React and TypeScript. The guidance is source-driven and production-focused, citing official documentation and release notes to ensure accuracy.

## README.md

**Scope:** This standards document covers coding conventions, architecture, and tooling for React 19 (stable release 19.3.0 as of Sep 2026) and TypeScript 7 (released July 8, 2026). It addresses language features, API usage, performance, accessibility, testing, and migration from previous versions. The rules are aimed at a React/TypeScript stack, but generic TypeScript guidance may also apply to other contexts.

**Navigation:** The document is organized into areas: React core conventions, hooks/effects, state management, forms/actions, performance, testing; TypeScript type safety, type modeling, tsconfig, modules/JSX, migration; quality tooling (linting, formatting, CI); and examples (good/anti-patterns). Each section is a separate markdown file listed in the project root (see table of contents).

**Adoption:** To adopt these standards, upgrade to React 19.x and TypeScript 7.x (with corresponding `@types/react@^19.0.0` and `@types/react-dom@^19.0.0` for TypeScript support). Use the new JSX Transform and default compiler settings as per React 19 requirements. We recommend a strict **TSConfig** (enabling `strict`, `noImplicitAny`, `strictNullChecks`, etc.) and a consistent **ESLint** setup (including `eslint-plugin-react` and `typescript-eslint`) to enforce rules. A sample `tsconfig.json` and `.eslintrc.js` are provided in the repository (see _quality/linting-and-formatting.md_ for details). All tools should align with React 19 and TypeScript 7 (checking compatibility).

**Baseline Configs:** Example recommended settings include `"jsx": "react-jsx"` (new transform required) and `"strict": true` in TSConfig. Ensure ESLint plugins support TS7 (e.g. use `typescript-eslint@^7.0.0`) and the latest `eslint-plugin-react@^9.0.0`. Label any framework-specific or optional rules clearly.

_All rules are documented with RFC2119-style terms (MUST, SHOULD, etc. per RFC 2119). Exceptions must be reviewed and justified._

## governance/rule-classification.md

**Rule Semantics:** We classify each rule using RFC 2119 keywords:

- **MUST** — Mandatory; absolute requirement for correctness or project policy.
- **SHOULD** — Recommended; defaults or conventions, but with possible exceptions if justified.
- **MAY** — Optional; allowed techniques without broad impact.
- **AVOID** — Discouraged; patterns likely to cause problems, with better alternatives suggested.

These terms are defined per [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119). For example, “MUST” indicates an absolute requirement (no deviation) and “SHOULD” indicates a strong recommendation with exceptions carefully weighed. For rules that depend on context (e.g. legacy code, performance trade-offs), we use **SHOULD** or **AVOID** accordingly.

**Exception Process:** Any rule can have documented exceptions. To deviate from a **MUST** or **SHOULD**, an engineer must raise an issue or RFC discussing the rationale and seeking approval from the team or architecture group. Approved exceptions should be tracked. Unresolved edge cases should be noted in the rule text (e.g. “_NOTE:_ This rule may not apply when X because Y.”).

## react/core-conventions.md

- **(React Version)**: **MUST** use React 19.x and ReactDOM 19.x for new code (React 18 is end-of-life and React 19 brings new features).
- **(Components)**: **SHOULD** prefer function components over class components for new code, using Hooks for state and side effects. Class components are still supported (and required for Error Boundaries) but lack Hooks support. The React docs emphasize that Hooks only work in function components. For example:

  ```tsx
  // Correct: Function component using Hooks
  function Greeting({ name }: { name: string }) {
    const [count, setCount] = useState(0);
    return (
      <div>
        Hello, {name}. Clicked {count} times.
      </div>
    );
  }

  // Incorrect: Class component for new code
  class GreetingClass extends React.Component<{ name: string }> {
    state = { count: 0 };
    render() {
      return (
        <div>
          Hello, {this.props.name}. Clicked {this.state.count} times.
        </div>
      );
    }
  }
  ```

- **(Component Files)**: **SHOULD** use `PascalCase` for component file names and default exports matching the component name (e.g. `UserProfile.tsx` exports `UserProfile` component). This aids clarity and tooling (e.g. eslint-plugin-import).
- **(Props & Types)**: **MUST** type all component props explicitly (use TypeScript interfaces or `type`). Do not rely on JavaScript defaults. Deprecated React features like `propTypes` and `defaultProps` on function components are removed in React 19. Instead, use ES6 default parameters and TS types:

  ```tsx
  // Before (not allowed in React 19):
  function Card({ title }: { title: string }) {
    return <h1>{title}</h1>;
  }
  Card.defaultProps = { title: "Default" }; // ❌

  // After: use default parameter
  interface CardProps {
    title?: string;
  }
  function Card({ title = "Default" }: CardProps) {
    return <h1>{title}</h1>;
  }
  ```

- **(Composition over Inheritance)**: **MUST** use composition (children, props) instead of class inheritance. React’s core philosophy is composition. Avoid custom inheritance patterns.
- **(Component Purity)**: **SHOULD** design components as pure functions of props/state. Avoid side effects in the render path – move logic to Hooks (e.g. `useEffect`) or callbacks. For example, do not perform data fetching or DOM manipulation during render; do it in effects or event handlers.
- **(Top-Level Hooks)**: **MUST** follow the Rules of Hooks: call Hooks only at the top level of function components or custom Hooks (never inside loops, conditions, nested functions, or class components). Using `eslint-plugin-react-hooks` enforces this rule.

  ```tsx
  // Good: Hook at top level
  function Login() {
    const [user, setUser] = useState<User | null>(null);
    // ...
  }
  // Bad: Hook inside condition (this would violate Rules of Hooks)
  function MaybeUser({ showUser }: { showUser: boolean }) {
    if (showUser) {
      const [user, setUser] = useState(null); // ❌ Not at top level
    }
    // ...
  }
  ```

- **(Descriptive Names)**: **SHOULD** use clear, descriptive names for components and props. Avoid abbreviations that reduce readability. For hooks, prefix custom hooks with “use” (e.g. `useAuth`) and name them for what they do.

## react/hooks-and-effects.md

- **(State Initialization)**: **MUST** initialize state in Hooks only on first render. Do not derive initial state from props on every render – use lazy initializers or effects when props change.
- **(Derived State)**: **AVOID** storing “derived” data in state if it can be computed from props/state during render. Only store state that has independent life. Derived data should be computed on-the-fly (or memoized with `useMemo` if expensive), to avoid stale values.
- **(Immutable Updates)**: **MUST** update state immutably. When using `useState` or `useReducer`, never mutate the existing state object/array in place. Instead, return new objects. React relies on reference equality to detect changes.

  ```tsx
  const [items, setItems] = useState<string[]>([]);
  // Bad: Mutating state directly
  function addItemBad(newItem: string) {
    items.push(newItem); // ❌ Direct mutation
    setItems(items);
  }
  // Good: Immutable update
  function addItemGood(newItem: string) {
    setItems([...items, newItem]);
  }
  ```

- **(useEffect Dependencies)**: **MUST** declare all reactive dependencies in the dependency array of `useEffect`, `useMemo`, `useCallback`, etc. If a variable (props, state, or function) is used inside the effect, include it. This ensures consistency and avoids bugs. Use `eslint-plugin-react-hooks` (rule `react-hooks/exhaustive-deps`) to verify correctness. If you intentionally omit a dependency, document it with a comment (e.g. `// eslint-disable-next-line react-hooks/exhaustive-deps` with rationale).
- **(Cleanup)**: **SHOULD** return a cleanup function from `useEffect` for subscriptions or timers to avoid leaks. Always clear timers or unsubscribe in cleanup.
- **(Subscriptions and Effects)**: **SHOULD** avoid heavy work inside effects. If possible, do minimal effect work, and move heavy tasks (e.g. data fetch) to async functions or server-side code. If using effects for data fetching, consider alternatives like React 19’s **Actions** (see _react/forms-and-actions.md_) which handle pending states and errors.
- **(Rules of Hooks)**: Reiterate **MUST** follow React’s [Rules of Hooks]: only call Hooks from React components or custom hooks, at the top level. The `eslint-plugin-react-hooks` enforces `rules-of-hooks` and `exhaustive-deps` (see [Rules of Hooks doc]).

## react/state-management.md

- **(Local vs External State)**: **SHOULD** keep state as local as possible. The component that directly uses a piece of state should own it. Lift state up only when multiple siblings need to share it (per [React docs on Lifting State Up]). Avoid hoisting state to context or global store unless truly needed.
- **(Context)**: **SHOULD** use React Context sparingly, for truly global data (theme, locale, user auth). Overusing context can harm performance and maintainability. Always define the context with an interface and default value, and document its intended use.
- **(Context Provider)**: **MUST** wrap consumers in a single provider at the nearest common ancestor. Do not spread multiple providers of the same context unnecessarily.
- **(useContext)**: **MUST** only use the `useContext` Hook inside function components (enforced by Rules of Hooks). Avoid reading context in non-React code.
- **(Immutable State)**: **MUST** follow immutable patterns when updating complex state (use `setState(prev => ({...prev, changes}))` or `useReducer`). Do not mutate context value or state directly.
- **(State in Forms)**: For uncontrolled vs controlled inputs, prefer controlled components for React state-binding (controlled by `value` prop) unless there’s a performance reason to use uncontrolled with refs. For example, use `value={state}` and `onChange` to manage form inputs.
- **(Error Boundaries)**: **MUST** use React Error Boundaries (`componentDidCatch` in a class or `<ErrorBoundary>` wrapper) to capture runtime errors in UI and avoid entire app crashes. Because Hooks don’t support `componentDidCatch`, use a class-based boundary for top-level. Report errors via your error-logging service (React 19’s `onUncaughtError`/`onCaughtError` callbacks can be used).

## react/forms-and-actions.md

- **(React 19 Actions)**: **SHOULD** prefer React 19’s new Action-based data submission for forms and async actions. React 19 introduces “Actions” (async functions in transitions) to handle pending, success, error, and optimistic updates. For example, use `useTransition`, `useOptimistic`, and `<form action={...}>` instead of manual state:

  ```tsx
  // Using useTransition for pending state (React 19)
  function SubmitButton() {
    const [isPending, startTransition] = useTransition();
    function handleClick() {
      startTransition(async () => {
        await saveData();
      });
    }
    return (
      <button onClick={handleClick} disabled={isPending}>
        Save
      </button>
    );
  }
  ```

- **(useActionState)**: **MUST** use `useActionState` for common Action patterns. It returns `[error, actionFn, isPending]`. It encapsulates pending and error state automatically.
- **(useOptimistic)**: **SHOULD** use `useOptimistic` to implement optimistic UI updates for form state. For instance, update a display value immediately while the network request is ongoing.
- **(Form Attributes)**: **MAY** use native form `action` and `formAction` attributes with function values (React 19 feature) to wire up `<form>` automatically. React will handle submission and reset.
- **(Controlled Inputs)**: **MUST** use controlled components (`value` + `onChange`) for most form inputs to keep React state in sync. If you use uncontrolled components (with refs), ensure you handle the `ref` safely (see _refs and forwardRef_ rules).
- **(Prevent Default)**: **MUST** on form submission, either use React 19’s `<form action={submitFn}>` or call `event.preventDefault()` in a handler, otherwise HTML form will reload page.
- **(Validation)**: **SHOULD** validate form data before sending. Use HTML5 validation attributes or libraries, but always perform final checks server-side. For TypeScript, validate incoming data with run-time checks (e.g. `zod`, `io-ts`) – see _TypeScript: API validation_ (TypeScript types do not enforce runtime validation).

## react/performance.md

- **(Rendering Performance)**: **SHOULD** avoid premature optimization. Only use `React.memo`, `useMemo`, or `useCallback` if a component or function is causing actual performance issues (e.g. expensive re-renders). Measure with profiling tools first.
- **(Reconciliation)**: **MUST** provide stable `key` props for lists to help React track elements. Keys should be unique and consistent (usually an ID, not array index).
- **(Pure Components)**: **MAY** use `React.memo` on function components that render heavy UI with identical props (pure functions). However, do not memoize trivially cheap components.
- **(Expensive Computations)**: **SHOULD** move heavy computations out of render. Use `useMemo` or split out into separate components. E.g. `const result = useMemo(() => expensiveCalc(a,b), [a,b]);`. Don’t wrap components in `useMemo` unnecessarily.
- **(Avoid Inline Objects/Functions)**: **SHOULD** avoid recreating objects or functions each render if passed as props to children, as this can break memoization. If needed, wrap callback definitions in `useCallback` and constant objects in `useMemo`.
- **(Debug and Profiling)**: **MUST** remove `console.log`, `debugger`, and `debug` statements from production builds. Use React Profiler and browser devtools to identify bottlenecks.
- **(Accessibility)**: **MUST** follow semantic HTML and ARIA guidelines. Use correct tags (`<button>`, `<label>`, `<main>`, `<nav>`, etc.) and `aria-` attributes for dynamic content. Employ React’s built-in support (e.g. `htmlFor` on labels). Tools like ESLint `jsx-a11y` can enforce this.
- **(Error Boundaries)**: **SHOULD** render fallback UI in production mode using Error Boundaries. In development, React 19 stops rethrowing render errors to avoid duplicates. Make sure error boundaries log errors to your monitoring service.

## react/testing.md

- **(Testing Tools)**: **MUST** use React Testing Library (RTL) for unit/integration tests of components. It encourages testing from the user’s perspective. Use Jest (or vitest) as the test runner. This combination is widely supported.
- **(Test Structure)**: **SHOULD** follow AAA (Arrange-Act-Assert) pattern. Tests should render components with minimal mock data and assert on behavior or output (not implementation details).
- **(Accessibility in Tests)**: **SHOULD** query by roles or text (e.g. `getByRole`, `getByLabelText`) rather than test IDs. This ensures components remain accessible.
- **(Mocking)**: **MUST** mock external API calls and timers in tests. Use Jest fake timers or libraries like `msw` for API mocks. Avoid making real network requests in unit tests.
- **(Coverage)**: **SHOULD** maintain at least 80% code coverage on critical modules. However, coverage is an indicator, not the only metric. Focus on testing logic and user interactions, not trivial getters/setters.
- **(CI Tests)**: **MUST** include tests in the CI pipeline. Fail build on test failures. Also consider running accessibility checks (e.g. axe) in tests for critical UIs.

## typescript/type-safety.md

- **(Strict Mode)**: **MUST** enable `strict: true` in `tsconfig.json`, which implies `strictNullChecks`, `noImplicitAny`, etc. This enforces type safety. Do not disable these without a good reason.
- **(Type Annotations)**: **SHOULD** prefer type inference where clear (e.g. `const count = 1;` infers `number`). **MUST** annotate function return types and public APIs for clarity. For variables whose type isn't obvious or to document intent, use explicit types.
- **(any vs unknown)**: **AVOID** using `any`. In cases where type is truly unknown, use `unknown` and narrow it with type checks. Using `any` is a loophole that defeats TypeScript. Cite docs: TypeScript team recommends avoiding `any` to ensure type safety.
- **(never, void, null, undefined)**: Use these sparingly:
  - `never` is only for unreachable code or exhaustive checks.
  - `void` for functions that do not return a value (usually event handlers). Do not use `void` for object properties.
  - **MUST** use `strictNullChecks` to force handling `null`/`undefined`. Use the union types (`type?` or `| null`) to allow nulls explicitly.
- **(Generics)**: **SHOULD** use generics for reusable abstractions (e.g. `function identity<T>(x: T): T`). **MUST** constrain generics when needed (e.g. `T extends object`). Avoid overly complex generic expressions that confuse readers. Type aliases and interfaces are preferred for named patterns.
- **(Utility Types)**: **MUST** leverage built-in utility types (`Partial<T>`, `Pick<T,K>`, `Record<K,T>`, etc.) instead of reinventing them. This reduces redundancy. For example, use `Omit<User, 'password'>` instead of custom omission.
- **(Mapped & Conditional Types)**: **MAY** use advanced types (`{ [K in Keys]: ... }`, `T extends U ? X : Y`) for type transformations. However, ensure they remain understandable. Provide comments for complex types.
- **(Discriminated Unions)**: **SHOULD** use discriminated union types for variant props or API responses. This allows exhaustive type checking (with `switch` or `if` on a `kind` field). Always handle all union cases or add a `never` default for exhaustiveness.
- **(Type Narrowing)**: **MUST** narrow types when dealing with `union` or `unknown`. Use `typeof`, `instanceof`, or custom type predicates (`function isFoo(x: any): x is Foo`) to narrow. Avoid non-null assertions (`!`) except when you are certain a value is not null (rare; document why).
- **(API Data)**: **MUST** treat external data (e.g. JSON from server) as untyped until validated. Use runtime validation (e.g. Zod, Yup) to enforce schema. Do not assume TS types guarantee runtime safety. TS only checks types at compile time.
- **(React Props/Events)**: **MUST** use the correct React types: e.g. `React.MouseEvent<HTMLButtonElement>` for button events. For refs, use `useRef<HTMLDivElement>(null)`. For forwardRef, use `ForwardedRef`. Use `JSX.IntrinsicElements` for element props if needed.
- **(Async/Await)**: **SHOULD** type async functions to `Promise<ReturnType>` if they return a value, or `Promise<void>` otherwise. Handle promise rejections (`try/catch` or `.catch`). Avoid `async void`.
- **(Import Types)**: **MAY** use `import type { Foo }` to import only types. This can help avoid circular dependencies or bundling types. React 19’s new JSX transform works with `import type`.
- **(Module Resolution)**: **MUST** configure `moduleResolution` as `node16` or appropriate for ESM. Use `"target": "ES2022"` or later for modern code, and `"jsx": "react-jsx"` for React 19. For TS 7, ensure `"module": "esnext"` or `"nodenext"` if using ESM imports.
- **(Declaration Files)**: **SHOULD** use `.d.ts` only for external library patches. Prefer to let TS infer types. No handwritten `.d.ts` for your own codebase (use TS files).
- **(Project References)**: **MAY** use TypeScript Project References for large monorepos or libraries to speed up incremental builds. Ensure `composite: true` is set.
- **(Performance)**: Complex types can slow down the compiler. If compile times degrade, simplify types. TypeScript 7’s rewrite improves performance (8–12x speedup), but keep types reasonable for maintainability.

## typescript/type-modeling.md

- **(Interfaces vs Types)**: **SHOULD** use `interface` for object shapes and classes, and `type` for unions or complex mapped types. This is a convention (TS team vs eslint can enforce).
- **(Literal Types)**: **SHOULD** use string/number literal types and enums for fixed sets (e.g. `'red' | 'green'`). Use `as const` or `enum` if many constants.
- **(Generics in React Props)**: **MUST** be explicit: e.g. `function List<T>({items}: {items: T[]}) { ... }`. Use `extends` to constrain if needed.
- **(Tuple vs Array)**: **SHOULD** use tuple types (e.g. `[number, string]`) when the number of elements is fixed. Use `Array<T>` or `T[]` for variable-length lists.
- **(Readonly)**: **SHOULD** mark arrays/objects as `readonly` when they shouldn’t be mutated (e.g. public props). This communicates immutability. E.g. `readonly items: string[]`.
- **(Index Signatures)**: **AVOID** using `[key: string]: any` or very loose index types unless necessary. Prefer explicit property definitions.
- **(Function Props)**: **MUST** type callback props fully, including `void` returns or event arguments (e.g. `(e: MouseEvent) => void`).
- **(Nullish Values)**: **MUST** check for `null`/`undefined` in code when types include them. Use the `?.` operator where appropriate. Prefer optional chaining over nested `if` checks for readability.

## typescript/tsconfig.md

- **(Compiler Options)**: Provide a recommended baseline `tsconfig.json`. For example:

  ```json
  {
    "compilerOptions": {
      "target": "ES2022",
      "module": "ESNext",
      "lib": ["DOM", "ES2022"],
      "jsx": "react-jsx",
      "strict": true,
      "noImplicitAny": true,
      "noImplicitThis": true,
      "strictNullChecks": true,
      "strictBindCallApply": true,
      "strictFunctionTypes": true,
      "strictPropertyInitialization": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true,
      "moduleResolution": "bundler",
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true
    },
    "include": ["src"],
    "exclude": ["node_modules"]
  }
  ```

- These options enable strict type-checking. **MUST** ensure all tools (Babel, Webpack, ESLint) align with these (e.g. `tsconfig.json` is picked up by `typescript-eslint`).
- **(Declaration)**: For libraries, set `"declaration": true` to generate `.d.ts`. Not needed for application code.
- **(Project Structure)**: You may use a root `tsconfig.json` with `references` to sub-projects (if using a monorepo or multi-package setup). For simple projects, a single tsconfig suffices.
- **(Incremental Builds)**: **MAY** enable `"incremental": true` to speed up recompilation, noting that TS7’s faster baseline may reduce the need.
- **(Deprecations)**: Review TS 6→7 migration notes for any removed compiler flags. As of TS 7, all TS6 flags are supported, but check release notes.
- **(Path Aliases)**: **MAY** use `paths` mapping for module aliases, but ensure you configure your bundler or Node resolution accordingly.
- **(JSX Settings)**: **MUST** use the new JSX transform: `"jsx": "react-jsx"`. The old transform (`react-jsxdev`/`react`/`react-jsxdev`) is not supported in new React 19 code as indicated by the React upgrade guide.

## typescript/modules-and-jsx.md

- **(ESM vs CommonJS)**: **MUST** use ES Modules (`import`/`export`) consistently. Set `"module": "ESNext"` or `"nodenext"` depending on your runtime. Avoid mixing with `require`.
- **(Imports)**: **SHOULD** use named imports where possible. `import React from 'react'` is no longer needed with new JSX transform, so prefer `import { useState } from 'react'`.
- **(Type-Only Imports)**: Use `import type { T } from 'module'` for type imports (this ensures no runtime import). TS 7 supports `import type`.
- **(JSX File Extensions)**: **MUST** use `.tsx` for files containing JSX. For TS-only files, use `.ts`. Ensure your bundler/compiler resolves them.
- **(JSX Runtime)**: **MUST** have `"jsxImportSource": "react"` (if using new JSX, not needed by default) or just rely on built-in automatic runtime.
- **(Third-Party Types)**: **MUST** install type declarations for dependencies (e.g. `@types/lodash`). If a library has built-in types, no need for `@types`. Prefer libraries with first-class TS support.
- **(JSX Elements)**: For HTML elements, TS knows standard attributes from `@types/react`. Use the right generic, e.g. `JSX.IntrinsicElements['div']` if needed.

## typescript/typescript-7-migration.md

- **(Migration Guide)**: React to TS7 requires updating the compiler. The TS team provides instructions. For example, to install TS6 alongside TS7, you can use the alias trick (`npm install -D typescript@npm:@typescript/typescript6`). This allows gradual migration of tooling.
- **(API Changes)**: TypeScript 7 has no syntax changes from TS 6; it’s primarily an internal rewrite. Existing TS6 code should compile under TS7 without changes.
- **(Tooling)**: `typescript-eslint` is gradually adding support. As of this writing, ensure you use a compatible `typescript-eslint` version or use the TS6 alias for ESLint if needed.
- **(Performance Flags)**: TS7 introduces `--checkers`, `--builders`, and `--singleThreaded` options for tuning parallelism. You can experiment with these to optimize build time on your CI. For most projects, defaults suffice. Document any non-default flags in CI config.
- **(Deprecated Flags)**: Check the TS 7 release notes for any deprecated compiler flags. (As of TS 7.0, no widely used flags were removed.)
- **(Editor Support)**: Ensure your editor is updated to support TS7. VS Code and many IDEs use the TS language server; for TS7 there is a dedicated VS Code extension or auto-update in recent versions.
- **(Compatibility)**: TS7 generated code remains compatible with the same JavaScript runtimes as TS6. No code changes are usually necessary.
- **(Versioning)**: Use `"typescript": "7.0"` in devDependencies. Lock minor/patch versions to avoid unexpected changes.

## quality/linting-and-formatting.md

- **(ESLint)**: **MUST** use ESLint for code style and simple static checks. Include:
  - `eslint-plugin-react` with recommended React rules.
  - `eslint-plugin-react-hooks` to enforce Rules of Hooks.
  - `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` for TS (with `eslint:recommended`, `plugin:@typescript-eslint/recommended`).
  - Example: enforce no-unused-vars, consistent imports, etc.
- **(Lint vs Compiler)**: Enforce what ESLint can’t: e.g. code style, best practices. Let TypeScript handle type correctness. Avoid overlapping rules. E.g. disable `no-unused-vars` in TS for tslint instead use TS’s `noUnusedLocals`.
- **(Prettier)**: **MAY** integrate Prettier for formatting; if used, configure ESLint to avoid conflicts (disable ESLint formatting rules in favor of Prettier).
- **(Import Order)**: **SHOULD** enforce consistent import ordering/grouping (e.g. React first, external libs, internal modules). Use `eslint-plugin-import` or similar.
- **(Security)**: **SHOULD** use plugins like `eslint-plugin-security` or `eslint-plugin-no-unsanitized` if handling user input. For web apps, ensure no-dangerous HTML injection.
- **(TypeAware Linting)**: **MUST** turn on `parserOptions.project` in `typescript-eslint` to allow rules that need type info (like consistent-type-assertions, no-explicit-any (if desired)).
- **(Formatting)**: **MUST** enforce using either Prettier or ESLint formatting rules consistently. Configure via `.editorconfig`, Prettier, or ESLint to define brace style, semicolons, quotes.
- **(Consistency)**: **SHOULD** use the same lint/format config across the codebase (share configs via `extends`). Document any overrides.

## quality/code-review-checklist.md

Provide a checklist for reviewers:

- Version match: React 19.x, TS 7.x, TSConfig strict, etc.
- Hooks rules respected (top-level calls, dependency arrays).
- No deprecated APIs (no `propTypes`, no legacy context API).
- State immutability (no direct state mutation).
- Accessibility (labels, alt text, semantic elements).
- Type correctness (no `any` escapes, proper TS usage).
- No obvious performance pitfalls (e.g. missing keys in lists).
- Tests present for new components or logic.
- Lint/formatting compliance (run `eslint` locally).
- Security checks (no eval, dangerous HTML).
- Ensure no missing cleanup in `useEffect`.
- Confirm no direct DOM/manipulation outside `useEffect` or refs misuse.

## quality/ci-quality-gates.md

- **(Type Checking)**: **MUST** run `tsc --noEmit` in CI to enforce type safety (with the chosen `tsconfig.json`). Fail build on errors.
- **(Linting)**: **MUST** run `eslint .` in CI. Fail on any rule violation (unless exceptions are documented).
- **(Testing)**: **MUST** run the test suite (e.g. `npm test` or `vitest`). Fail build on failures.
- **(Coverage)**: **MAY** enforce minimum coverage thresholds.
- **(Security Audits)**: **MAY** run `npm audit` or similar; at least review critical vulnerabilities manually.
- **(Dependency Management)**: **MUST** pin versions (`^major.minor.patch` as needed) and update regularly. Use `npm audit` or `renovate` to track updates. For React and TS, avoid locked old versions beyond maintenance.

## examples/good-patterns.md

Include idiomatic patterns, e.g.:

- Function components with Hooks (as shown above).
- Use `React.Fragment` or `<>...</>` for grouping.
- Context usage with default values and custom hook wrappers (e.g. `const auth = useContext(AuthContext);`).
- Example of an exhaustive switch on discriminated union.
- Using `useReducer` for complex state, etc.

_(Examples omitted for brevity, but each example should follow the documented rules and include code comments.)_

## examples/anti-patterns.md

List common pitfalls, e.g.:

- Updating state incorrectly (`state.count++`, missing `setState`).
- Calling Hooks incorrectly (inside `if`, loops).
- `any` usage hiding errors.
- Mutating props or external objects.
- Inline functions causing infinite loops (for useEffect).
- Using string refs or global variables for component state.

_(Examples omitted for brevity.)_

---

**Verification Date:** October 2026.  
**Versions Verified:** React 19.x (stable), ReactDOM 19.x, TypeScript 7.0.x, `@types/react@19.x`, `@types/react-dom@19.x`.  
**Sources:** React 19 release and upgrade docs, TypeScript 7 release notes, RFC2119, official React docs (Hooks, etc.), and relevant GitHub issues. Each rule above is backed by these sources or marked as a project policy.
