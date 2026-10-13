# Appendix 04 — React 19 Patterns & Best Practices

---

## React 19 API Modernization (Mandatory)

### ❌ `forwardRef` is forbidden

In React 19, `ref` is a regular prop. Accept it directly:

```tsx
// ✅ React 19
interface Props {
  ref?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}

export function Card({ ref, children }: Props) {
  return <div ref={ref}>{children}</div>;
}

// ❌ Deprecated
export const Card = forwardRef<HTMLDivElement, Props>((props, ref) => { ... });
```

### ❌ `useContext` is forbidden — use `use(Context)`

```tsx
// ✅ React 19
import { use } from "react";
const auth = use(AuthContext);

// ❌ Legacy
const auth = useContext(AuthContext);
```

### ❌ `<Context.Provider>` is forbidden — use `<Context>`

```tsx
// ✅ React 19
<AuthContext value={authValue}>
  {children}
</AuthContext>

// ❌ Legacy
<AuthContext.Provider value={authValue}>
  {children}
</AuthContext.Provider>
```

### Context values MUST be memoized

```tsx
// ✅ Memoized — prevents downstream re-renders
const authValue = useMemo(() => ({ user, token, signOut }), [user, token, signOut]);
return <AuthContext value={authValue}>{children}</AuthContext>;

// ❌ Inline object — new reference on every render
return <AuthContext value={{ user, token, signOut }}>{children}</AuthContext>;
```

---

## `useCallback` and `useMemo` Discipline

### MUST use `useCallback`

Use when passing a callback as prop to a child component that is wrapped in `memo()` or
when passing a callback as a dependency of another hook:

```tsx
// ✅ — callback passed to memoized child
const handleDelete = useCallback(
  (id: string) => {
    deleteTransaction(id);
  },
  [deleteTransaction],
);
return <TransactionList onDelete={handleDelete} />;
```

### MUST use `useMemo`

- Context values (see above)
- Expensive computations (sort, filter, aggregate of large arrays)
- Derived data used in multiple places within the same component

```tsx
// ✅ — expensive derivation
const sortedItems = useMemo(() => items.toSorted((a, b) => b.date.localeCompare(a.date)), [items]);
```

### Do NOT use `useCallback`/`useMemo` for

- Simple inline callbacks not passed to children
- Cheap computations (string formatting, boolean checks)
- Functions defined inside `useEffect` (define inside the effect instead)

```tsx
// ❌ Premature optimization
const label = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);
// Just: const label = `${firstName} ${lastName}`;
```

---

## `useTransition` and `startTransition`

Use `useTransition` to mark state updates as **non-urgent** so React can keep the UI responsive:

```tsx
// ✅ — filter changes are non-urgent; expensive re-render can be deferred
const [isPending, startTransition] = useTransition();

function handleFilterChange(newFilter: string) {
  startTransition(() => {
    setFilter(newFilter);
  });
}
```

**When to use `useTransition`**:

- Switching between heavy tabs or views
- Triggering a search/filter that causes expensive re-renders
- Any state update where keeping the current UI interactive is more important than the update speed

**Do not use** `useTransition` for:

- Async mutations (use mutation `isPending` from TanStack Query)
- Input `onChange` typing — use debounce instead

---

## `ref` Over Props (Imperative Handles)

Use `useImperativeHandle` when a parent needs to imperatively trigger an action in a child
**without lifting state**:

```tsx
// ✅ — parent calls focus/reset without owning the state
export interface SearchFieldHandle {
  focus: () => void;
  clear: () => void;
}

interface Props {
  ref?: React.Ref<SearchFieldHandle>;
}

export function SearchField({ ref }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => {
        inputRef.current && (inputRef.current.value = "");
      },
    }),
    [],
  );

  return <input ref={inputRef} />;
}

// Parent
const searchRef = useRef<SearchFieldHandle>(null);
searchRef.current?.focus(); // imperative call
```

**When to prefer `ref` over props**:

| Scenario                                                  | Prefer                        |
| --------------------------------------------------------- | ----------------------------- |
| Parent triggers focus, scroll, or reset in child          | `ref` + `useImperativeHandle` |
| Parent needs to read child's current render state         | Lift state up (props)         |
| Prop-drilling deeper than 2 levels                        | Context                       |
| Child updates frequently and parent doesn't need to track | Keep state local in child     |

**Typed handle interface rule**: Every component exposing a ref handle must export a `<Name>Handle` type:

```tsx
export interface SearchFieldHandle {
  focus(): void;
  clear(): void;
}
```

---

## Prop Drilling Limit

**Maximum prop-drilling depth: 2 levels.**

If a value must be passed through 3 or more intermediate components that do not use it themselves,
use Context or a controller hook instead.

```
Feature Page
  └── Controller Hook (holds the state)
        └── Presenter Component (uses the state directly) ✅

Feature Page
  └── Section Component (passes state down, doesn't use it) ← 1 level
        └── Row Component (passes state down, doesn't use it) ← 2 levels
              └── Cell Component (finally uses it) ← STOP HERE: use Context ❌
```

---

## Error Boundaries

Every route must be wrapped by an error boundary. TanStack Router provides this via `errorComponent`:

```tsx
export const Route = createFileRoute("/_app/transactions")({
  component: TransactionsPage,
  errorComponent: RouteErrorBoundary, // mandatory on every route
});
```

**Placement rules**:

1. Root-level: catches unexpected crashes — shows full-page error with reload button
2. Per-route: catches data fetching failures — shows inline error with retry action
3. Feature widget level: catches isolated chart/widget crashes — shows `<EmptyState>` without breaking the page

```tsx
// ✅ Query error state — inline alert with refetch
if (isError) {
  return <Alert status="danger" action={<Button onPress={() => refetch()}>Retry</Button>} />;
}
```

---

## Conditional Rendering

### ❌ No nested ternaries

```tsx
// ❌ — unreadable
return isLoading ? <Skeleton /> : isError ? <Alert /> : isEmpty ? <EmptyState /> : <Table />;

// ✅ — early returns
if (isLoading) return <Skeleton />;
if (isError) return <Alert status="danger" />;
if (isEmpty) return <EmptyState />;
return <Table />;
```

### ✅ Short-circuit for optional renders

```tsx
// ✅ — single optional element
{
  hasSelection && <BatchActionBar count={selectedIds.size} />;
}
```

---

## List Rendering

### ❌ No array index as React key

```tsx
// ❌ — breaks reconciliation on reorder/delete
{
  items.map((item, index) => <Row key={index} item={item} />);
}

// ✅ — use stable domain ID
{
  items.map((item) => <Row key={item.id} item={item} />);
}
```

---

## Function Signature Rule (max 3 parameters)

No function may have more than 3 positional parameters. When you need more, group into an options object:

```tsx
// ❌ 4 positional params
function fetchTransactions(token: string, page: number, pageSize: number, query: string) {}

// ✅ Options object
function fetchTransactions(
  token: string,
  opts: { page: number; pageSize: number; query: string },
) {}

// ✅ Also fine — 3 or fewer
function fetchTransactions(token: string, query: Partial<ListTransactionsQuery>) {}
```

**Exceptions** (do not apply max-params):

- React component functions — they receive one `Props` object (always 1 param)
- React hooks — same: single destructured object

**Enforcement**: `max-params: ["error", { "max": 3 }]` in `.oxlintrc.json`.

---

## `cn()` and Class Composition in JSX

### No nested ternary inside `className`

```tsx
// ❌
className={`text-${isError ? "danger" : isSuccess ? "success" : "muted"}`}

// ✅
function getStatusClass(isError: boolean, isSuccess: boolean): string {
  if (isError) return "text-danger";
  if (isSuccess) return "text-success";
  return "text-muted";
}
// then:
className={getStatusClass(isError, isSuccess)}
```

---

## Modern ES Methods (TypeScript 7 Requirement)

Prefer modern ES methods over legacy equivalents:

| Legacy                      | Modern                   |
| --------------------------- | ------------------------ |
| `arr[arr.length - 1]`       | `arr.at(-1)`             |
| `arr.sort(...)` (mutates)   | `arr.toSorted(...)`      |
| `arr.splice(...)` (mutates) | `arr.toSpliced(...)`     |
| `arr.reverse()` (mutates)   | `arr.toReversed()`       |
| `Object.assign({}, a, b)`   | `{ ...a, ...b }`         |
| `parseInt(x, 10)`           | `Number.parseInt(x, 10)` |

---

## Review Checklist — React Patterns

- [ ] No `forwardRef` — ref as direct prop
- [ ] No `useContext` — `use(Context)` instead
- [ ] No `<Context.Provider>` — `<Context value={...}>` instead
- [ ] All context values memoized with `useMemo`
- [ ] `useCallback` only where callback is a dep of another hook or passed to `memo()` child
- [ ] `useMemo` only for genuinely expensive computations or context values
- [ ] `useTransition` used for heavy view-switch state updates
- [ ] No nested ternaries in JSX or `className`
- [ ] No array index keys
- [ ] All list keys are stable domain IDs
- [ ] Error boundaries on every route (`errorComponent`)
- [ ] Prop drilling not deeper than 2 levels
- [ ] Functions with > 3 params use options object
- [ ] `useImperativeHandle` used for imperative child actions (focus, scroll, reset)
- [ ] `handle` exports a typed `<Name>Handle` interface
- [ ] Modern ES array methods used (`.at()`, `.toSorted()`, `.toReversed()`)
