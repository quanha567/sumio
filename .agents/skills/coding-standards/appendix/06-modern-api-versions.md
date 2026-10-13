# Appendix 06 — Modern API Versions (Use Latest, Not Legacy)

Agents frequently fall back to older API patterns from training data. This appendix documents
the **canonical modern API** for each library version in use. When you see a legacy pattern,
replace it — do not preserve it.

---

## React 19 — Modern API Mandate

### Ref as direct prop (not `forwardRef`)

```tsx
// ✅ React 19 — ref is a normal prop
interface Props {
  ref?: React.Ref<HTMLInputElement>;
  value: string;
}
export function SearchInput({ ref, value }: Props) {
  return <input ref={ref} value={value} />;
}

// ❌ Legacy React 18 — FORBIDDEN
export const SearchInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input ref={ref} {...props} />;
});
```

### Context: `use()` + `<Context>` (not `useContext` + `<Context.Provider>`)

```tsx
// ✅ React 19
import { use, createContext, useMemo } from "react";

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => buildTheme(), []);
  return <ThemeContext value={value}>{children}</ThemeContext>; // ← no .Provider
}

export function useTheme() {
  return use(ThemeContext); // ← use(), not useContext()
}

// ❌ Legacy
<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
const theme = useContext(ThemeContext);
```

### `useOptimistic` — optimistic UI updates

Use instead of manual `useState` + rollback logic:

```tsx
// ✅ React 19
const [optimisticItems, addOptimistic] = useOptimistic(items, (state, newItem: TransactionDto) => [
  newItem,
  ...state,
]);

async function handleCreate(dto: CreateTransactionDto) {
  addOptimistic({ ...dto, id: "temp", status: "pending" });
  await createMutation.mutateAsync(dto);
}
```

### `useActionState` — form submission state

For async form actions, prefer `useActionState` over manual `isLoading` state:

```tsx
// ✅ React 19 — async action with pending + error state built-in
const [state, formAction, isPending] = useActionState(async (prev, formData: FormData) => {
  const result = await submitForm(formData);
  return result;
}, null);
```

### `use(Promise)` — suspense-compatible data reading

```tsx
// ✅ React 19 — inside Suspense boundary
function TransactionDetails({ dataPromise }: { dataPromise: Promise<TransactionDto> }) {
  const transaction = use(dataPromise); // suspends until resolved
  return <div>{transaction.description}</div>;
}
```

### Legacy React patterns that are FORBIDDEN

| Legacy                                | Modern replacement                               |
| ------------------------------------- | ------------------------------------------------ |
| `forwardRef(fn)`                      | `function Comp({ ref }: { ref?: React.Ref<T> })` |
| `useContext(Ctx)`                     | `use(Ctx)`                                       |
| `<Ctx.Provider value={v}>`            | `<Ctx value={v}>`                                |
| `React.FC<Props>`                     | `function Comp(props: Props): React.ReactNode`   |
| `React.VFC`                           | Removed — same as above                          |
| `React.ReactChild`                    | `React.ReactNode`                                |
| `"use client"` directive              | Never in Vite SPA                                |
| `defaultProps` on function components | Default parameter values                         |

---

## TypeScript 7 — Modern Type System

### `import type` is mandatory for type-only imports

`verbatimModuleSyntax: true` and `erasableSyntaxOnly: true` are enforced.

```tsx
// ✅ TypeScript 7
import type { TransactionDto, CreateTransactionDto } from "@sumio/contract";
import { useMutation } from "@tanstack/react-query";

// ❌ Legacy — mixing value and type in one import
import { TransactionDto, useMutation } from "...";
```

### Explicit return types on all exported functions

```tsx
// ✅
export function formatCurrency(amount: number, currency: string): string { ... }
export function useTransactionList(): TransactionListController { ... }

// ❌
export function formatCurrency(amount: number, currency: string) { ... }  // implicit return
```

### Use `satisfies` for narrowed type checking without widening

```tsx
// ✅ TypeScript 5+ — type is checked but stays narrow
const config = {
  currency: "VND",
  locale: "vi-VN",
} satisfies Record<string, string>;

config.currency; // type: "VND", not string

// ❌ Legacy — widens the type
const config: Record<string, string> = { currency: "VND" };
config.currency; // type: string
```

### Use `const` type parameters for literal inference

```tsx
// ✅ TypeScript 5.4+
function createQueryKey<const T extends readonly unknown[]>(key: T): T {
  return key;
}
// returns readonly ["transactions", "list"], not string[]
```

### Modern ES array methods (non-mutating)

```tsx
// ✅ Modern — returns new array, original unchanged
const sorted = items.toSorted((a, b) => a.date.localeCompare(b.date));
const reversed = items.toReversed();
const withNew = items.toSpliced(index, 0, newItem);
const last = items.at(-1);
const secondToLast = items.at(-2);

// ❌ Legacy — mutates original array
const sorted = [...items].sort(...);
items.reverse();
const last = items[items.length - 1];
```

### Forbidden TypeScript patterns

| Legacy                                 | Modern                                 |
| -------------------------------------- | -------------------------------------- |
| `as any`                               | `as unknown` then narrow               |
| `// @ts-ignore`                        | `// @ts-expect-error` with explanation |
| `namespace` blocks                     | ES modules                             |
| `enum` (const enums ok)                | `const` objects with `as const`        |
| `!` non-null assertion without comment | Add explicit guard or `??`             |

---

## Tailwind CSS v4 — CSS-First Configuration

Tailwind v4 eliminates `tailwind.config.js`. All configuration is in CSS via `@theme`.

### Define tokens in CSS, not JS

```css
/* ✅ Tailwind v4 — src/index.css */
@import "tailwindcss";

@theme {
  --color-accent: oklch(43% 0.071 163.6);
  --color-background: oklch(97.2% 0.003 128.5);
  --font-sans: "Inter Variable", sans-serif;
  --radius-card: 0.75rem;
}

/* ❌ Legacy v3 — tailwind.config.js (does not exist in this project) */
module.exports = {
  theme: { extend: { colors: { accent: "#..." } } }
}
```

### Use CSS custom properties via `var()` in components

```tsx
// ✅ Tailwind v4 — reference tokens via class or CSS var
<div className="bg-accent text-accent-foreground" />
<div style={{ color: "var(--color-foreground)" }} /> // for dynamic values only

// ❌ Hardcoded hex or arbitrary value
<div className="bg-[#245C45]" />
<div className="text-[oklch(43%_0.071_163.6)]" />
```

### `@layer` directive for custom utilities

```css
/* ✅ v4 — define custom utilities */
@layer utilities {
  .tabular-financial {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
  }
}

/* ❌ v3 plugin syntax — not supported in v4 */
```

### New v4 classes and changes

| Old v3                         | New v4               | Note             |
| ------------------------------ | -------------------- | ---------------- |
| `text-opacity-50`              | `text-foreground/50` | Opacity modifier |
| `bg-opacity-75`                | `bg-surface/75`      | Opacity modifier |
| `shadow-sm`                    | `shadow-xs`          | Renamed          |
| `ring-offset-*`                | Merged into `ring-*` | Simplified       |
| Arbitrary value `[&>span]:...` | Same but improved    | Still supported  |

---

## TanStack Query v5 — Modern Query API

### `queryOptions` helper (v5.0+)

Use `queryOptions()` to define reusable, type-safe query configurations:

```tsx
// ✅ v5 — queryOptions for type-safe reuse
import { queryOptions } from "@tanstack/react-query";

export const transactionQueryOptions = (query: Partial<ListTransactionsQuery>) =>
  queryOptions({
    queryKey: transactionKeys.list(query),
    queryFn: ({ queryKey }) => fetchTransactions(token, queryKey[2]),
    staleTime: QueryStaleTime.Short,
  });

// Then in hook:
useQuery(transactionQueryOptions(filters));
// Or in route loader:
queryClient.ensureQueryData(transactionQueryOptions(filters));
```

### `skipToken` for conditional queries (not `enabled: false`)

```tsx
// ✅ v5 — skipToken is type-safe conditional disabling
import { skipToken } from "@tanstack/react-query";

useQuery({
  queryKey: transactionKeys.detail(id),
  queryFn: id ? () => fetchTransaction(token, id) : skipToken,
});

// ✅ Also fine for simple boolean
useQuery({
  queryKey: transactionKeys.list(query),
  queryFn: () => fetchTransactions(token, query),
  enabled: !!token,
});
```

### `isPending` vs `isLoading` (v5 renamed)

```tsx
// ✅ v5
const { isPending, isFetching, isError } = useQuery(...);
// isPending = no data yet (first load)
// isFetching = any background refetch

// ❌ v4 legacy — `isLoading` renamed to `isPending` in v5
const { isLoading } = useQuery(...); // still works but prefer isPending
```

### `useSuspenseQuery` for Suspense-compatible data fetching

```tsx
// ✅ v5 — eliminates isLoading/isError checks, works with React Suspense
function TransactionList() {
  const { data } = useSuspenseQuery(transactionQueryOptions(filters));
  // data is always defined here — no nullability handling needed
  return <ul>{data.items.map(...)}</ul>;
}

// Wrap with Suspense + ErrorBoundary at route level
<Suspense fallback={<Skeleton />}>
  <ErrorBoundary fallback={<Alert />}>
    <TransactionList />
  </ErrorBoundary>
</Suspense>
```

---

## TanStack Router v1 — Modern Navigation API

### Type-safe search params (not query string manipulation)

```tsx
// ✅ v1 — Zod-validated search schema
export const Route = createFileRoute("/_app/transactions")({
  validateSearch: (search) => ListTransactionsSchema.parse(search),
  component: TransactionsPage,
});

// Reading — fully typed, no casting
const { page, q, type } = Route.useSearch();

// Writing — type-checked
const navigate = Route.useNavigate();
navigate({
  search: (prev) => ({ ...prev, q: newQuery, page: 1 }),
  replace: true,
});

// ❌ Legacy — manual URLSearchParams
const params = new URLSearchParams(window.location.search);
const page = Number(params.get("page")) || 1;
```

### `useParams` for dynamic segments

```tsx
// ✅ v1 — type-safe params
const { transactionId } = Route.useParams();

// ❌ Legacy
const { id } = useParams<{ id: string }>(); // from react-router
```

---

## HeroUI v3 — React Aria API

### Slot-based composition (not `classNames` overrides)

```tsx
// ✅ HeroUI v3 — use slot props
<TextField>
  <Label>Email</Label>
  <Input placeholder="user@example.com" />
  <FieldError />
</TextField>

// ❌ Legacy v2 — classNames object hacks
<Input classNames={{ input: "text-sm", label: "font-bold" }} />
```

### `tv()` for variant composition (not arbitrary class strings)

```tsx
// ✅ v3 — tailwind-variants
import { tv } from "@heroui/styles";

const chip = tv({
  base: "inline-flex items-center rounded-full",
  variants: {
    color: { income: "bg-finance-income/15 text-finance-income",
              expense: "bg-finance-expense/15 text-finance-expense" },
    size: { sm: "px-2 py-0.5 text-xs", md: "px-3 py-1 text-sm" },
  },
});

// ❌ Arbitrary template string
className={`rounded-full ${isIncome ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
```

### Event props: `onPress` not `onClick`

HeroUI v3 uses React Aria's pointer event model. `onClick` is not guaranteed to fire on all
interaction types (keyboard, touch, pointer):

```tsx
// ✅ HeroUI v3 — pointer-agnostic
<Button onPress={handleSubmit}>Submit</Button>

// ❌ — misses keyboard activation
<Button onClick={handleSubmit}>Submit</Button>
```

---

## Summary: Legacy Pattern → Modern Replacement

| Legacy pattern        | Modern replacement             | Library           |
| --------------------- | ------------------------------ | ----------------- |
| `forwardRef(fn)`      | `ref` as direct prop           | React 19          |
| `useContext(Ctx)`     | `use(Ctx)`                     | React 19          |
| `<Ctx.Provider>`      | `<Ctx value={}>`               | React 19          |
| `React.FC<P>`         | `function F(p: P): ReactNode`  | React 19          |
| `useState` + rollback | `useOptimistic`                | React 19          |
| `isLoading` (TQ)      | `isPending`                    | TanStack Query v5 |
| `enabled: false`      | `skipToken`                    | TanStack Query v5 |
| `useQuery` everywhere | `useSuspenseQuery` in Suspense | TanStack Query v5 |
| `tailwind.config.js`  | `@theme` in CSS                | Tailwind v4       |
| Hex color values      | OKLCH tokens                   | Tailwind v4       |
| `classNames={}`       | Slot composition               | HeroUI v3         |
| `onClick`             | `onPress`                      | HeroUI v3         |
| `[...arr].sort()`     | `arr.toSorted()`               | TS7 / ES2023      |
| `arr[arr.length-1]`   | `arr.at(-1)`                   | TS7 / ES2023      |
| `import { Type }`     | `import type { Type }`         | TS7               |
| `// @ts-ignore`       | `// @ts-expect-error`          | TS7               |

---

## Review Checklist — Modern APIs

- [ ] No `forwardRef` anywhere in new or modified components
- [ ] No `useContext()` — `use(Context)` only
- [ ] No `<Context.Provider>` — `<Context value={}>` only
- [ ] No `React.FC<P>` type annotation
- [ ] `isLoading` → verified it means `isPending` (TanStack Query v5)
- [ ] `enabled: false` → replaced with `skipToken` where appropriate
- [ ] No hardcoded hex/rgb/hsl colors — OKLCH tokens only
- [ ] No `tailwind.config.js` references — config is in `src/index.css`
- [ ] `onClick` on HeroUI components → replaced with `onPress`
- [ ] `[...arr].sort()` → `arr.toSorted()`
- [ ] `arr[arr.length - 1]` → `arr.at(-1)`
- [ ] All type-only imports use `import type`
- [ ] No `// @ts-ignore` — use `// @ts-expect-error` with reason comment
