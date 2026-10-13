# Appendix 02 — Naming Conventions

All names are **deterministic** — given the thing's purpose, there is exactly one correct name.

---

## Files & Directories

| Type                 | Convention                                | Example                      |
| -------------------- | ----------------------------------------- | ---------------------------- |
| Component file       | `kebab-case.tsx`                          | `transaction-form-modal.tsx` |
| Hook file            | `use-kebab-case.ts`                       | `use-transaction-filters.ts` |
| Utility file         | `kebab-case.ts`                           | `format-currency.ts`         |
| Query/API file       | `<entity>-queries.ts` / `<entity>-api.ts` | `transaction-queries.ts`     |
| Type definition file | `<entity>.types.ts`                       | `transaction.types.ts`       |
| Constants file       | `<entity>.constants.ts`                   | `transaction.constants.ts`   |
| Route file           | TanStack Router convention                | `_app.transactions.tsx`      |
| Test file            | `<file>.test.ts(x)`                       | `format-currency.test.ts`    |
| Index barrel         | `index.ts`                                | `index.ts`                   |

**Never**: `PascalCase` files, `camelCase` files, numbered files (`component1.tsx`).

---

## Components

| Type               | Convention                        | Example                               |
| ------------------ | --------------------------------- | ------------------------------------- |
| React component    | `PascalCase` function             | `TransactionFormModal`                |
| Atom component     | `PascalCase`, matches HeroUI name | `Button`, `TextField`, `Modal`        |
| Molecule component | `PascalCase`, noun phrase         | `StatCard`, `DataTable`, `EmptyState` |
| Organism component | `PascalCase`, domain-qualified    | `TransactionRow`, `CategoryChip`      |
| Template component | `PascalCase`, layout noun         | `PageContainer`, `SplitLayout`        |

**Props interface**: always named `Props` (not `ButtonProps`, `CardProps`) — the file name provides the context.

```tsx
// ✅ Correct
interface Props {
  label: string;
  onPress: () => void;
}

export function TransactionRow({ label, onPress }: Props) { ... }

// ❌ Wrong
interface TransactionRowProps { ... }
```

**Exception**: When a props type must be exported for consumers, name it `<Component>Props`:

```tsx
export interface StatCardProps {
  value: number;
  trend: "up" | "down";
}
```

---

## Hooks

| Type                      | Pattern                                | Example                                                        |
| ------------------------- | -------------------------------------- | -------------------------------------------------------------- |
| Controller hook (feature) | `use<Entity>List`, `use<Entity>Modals` | `useTransactionList`, `useTransactionModals`                   |
| Form controller hook      | `use<Entity>FormModal`                 | `useTransactionFormModal`                                      |
| Selection hook            | `use<Entity>Selection`                 | `useTransactionSelection`                                      |
| Filter/search hook        | `use<Entity>Filters`                   | `useTransactionFilters`                                        |
| Query hook                | `use<Entity>Query`                     | `useTransactionsQuery`, `useCategoriesQuery`                   |
| Mutation hook             | `use<Action><Entity>Mutation`          | `useCreateTransactionMutation`, `useDeleteTransactionMutation` |
| Utility hook              | `use<Description>`                     | `useDebouncedSearch`, `useMediaQuery`                          |
| Context hook              | `use<Context>`                         | `useAuth`, `useTheme`                                          |

**All hooks must have explicit return types**:

```tsx
// ✅ Correct
export function useTransactionList(): TransactionListController {
  ...
}

// ❌ Wrong — implicit return type
export function useTransactionList() {
  ...
}
```

---

## Query Key Factories

Every feature's `api/<entity>-queries.ts` must export a typed key factory:

```tsx
// ✅ Correct pattern
export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (query: Partial<ListTransactionsQuery>) => [...transactionKeys.lists(), query] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};

// ❌ Wrong — inline string key
useQuery({ queryKey: ["transactions", "list", filters], ... });
```

Naming: `<entityPlural>Keys` (camelCase, entity in plural form).

---

## Types & Interfaces

| Type               | Convention                                        | Example                                                            |
| ------------------ | ------------------------------------------------- | ------------------------------------------------------------------ |
| Interface          | `PascalCase`                                      | `TransactionListController`                                        |
| Type alias         | `PascalCase`                                      | `TransactionType`, `FilterState`                                   |
| Enum               | `PascalCase` enum, `PascalCase` members           | `TransactionStatus.Pending`                                        |
| Zod schema         | `PascalCase` + `Schema` suffix                    | `CreateTransactionSchema`                                          |
| Zod inferred type  | `z.infer<typeof XSchema>` aliased as `PascalCase` | `type CreateTransaction = z.infer<typeof CreateTransactionSchema>` |
| Generic type param | Single uppercase letter or descriptive `TProp`    | `T`, `TData`, `TError`                                             |

**Forbidden**:

- `I` prefix on interfaces (`ITransaction` → `Transaction`)
- `_` suffix/prefix on private members (use `#` private fields in classes instead)
- Hungarian notation (`strName`, `bIsLoading`)

---

## Constants

```tsx
// ✅ Module-level constants: SCREAMING_SNAKE_CASE
export const PAGE_SIZE = 20;
export const MAX_BATCH_DELETE = 50;
export const DEBOUNCE_MS = 300;

// ✅ Object-shaped constants: PascalCase
export const QueryStaleTime = {
  Short: 1000 * 30, // 30s — volatile data
  Medium: 1000 * 60 * 5, // 5m — semi-stable data (categories)
  Long: 1000 * 60 * 10, // 10m — stable data
} as const;
```

---

## Event Handlers

| Context                                  | Convention                | Example                                         |
| ---------------------------------------- | ------------------------- | ----------------------------------------------- |
| Callback prop (component API)            | `on<Action>`              | `onPress`, `onChange`, `onClose`, `onDelete`    |
| Internal handler (inside component/hook) | `handle<Action>`          | `handleSubmit`, `handleBatchDelete`             |
| Derived/computed handler                 | `handle<Subject><Action>` | `handleTransactionDelete`, `handleFilterChange` |

```tsx
// ✅ Correct: prop = "on", internal = "handle"
interface Props {
  onDelete: (id: string) => void;
}

function TransactionRow({ onDelete }: Props) {
  function handleDeleteClick() {
    // confirm, then:
    onDelete(transaction.id);
  }

  return <Button onPress={handleDeleteClick}>Delete</Button>;
}
```

---

## Boolean Props & Variables

Prefix with `is`, `has`, `can`, `should`:

```tsx
// ✅
isLoading, isFetching, isError, isEmpty, hasSelection, canDelete, shouldRefetch

// ❌
loading, fetching, error (ambiguous — is it the boolean or the Error object?)
```

---

## Barrel Exports (`index.ts`)

Feature `index.ts` exports **only the public surface** — the page component and any types needed by routes:

```tsx
// features/transactions/index.ts
export { TransactionsPage } from "./transactions-page";
export type { TransactionListController } from "./hooks/use-transaction-list";
```

**Never re-export everything** (`export * from "./hooks"`) — it creates invisible public surfaces.

Atoms `index.ts` is the **only place** that exports all primitives. It is auto-maintained.

---

## Review Checklist — Naming

- [ ] All files in `kebab-case.tsx/ts`
- [ ] All components in `PascalCase`, exported as named function (not default export)
- [ ] All hooks start with `use`, have explicit return types
- [ ] Query hooks: `use<Entity>Query` / `use<Action><Entity>Mutation`
- [ ] Zod schemas: `<Entity>Schema` (PascalCase + Schema suffix)
- [ ] No `IInterface` prefix
- [ ] Callback props named `on<Action>`, internal handlers named `handle<Action>`
- [ ] Boolean variables prefixed `is`/`has`/`can`/`should`
- [ ] Feature `index.ts` only exports page component + needed types (no `export *`)
