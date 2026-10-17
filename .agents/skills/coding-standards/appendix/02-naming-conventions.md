# Appendix 02 — Naming Conventions & Code Structure

All names and code patterns in the Sumio monorepo are **deterministic** — given the thing's architectural role and domain purpose, there is exactly one canonical name and structure.

---

## 1. Files & Directories (Monorepo-wide)

All file names across all packages must use `kebab-case` with dot-separated suffixes denoting their architectural layer:

| Sub-system   | Type             | Convention                             | Example                                     |
| :----------- | :--------------- | :------------------------------------- | :------------------------------------------ |
| **Frontend** | Component file   | `kebab-case.tsx`                       | `transaction-form-modal.tsx`                |
|              | Hook file        | `use-kebab-case.ts`                    | `use-transaction-filters.ts`                |
|              | Utility file     | `kebab-case.ts`                        | `format-currency.ts`                        |
|              | Query/API file   | `<entity>-queries.ts`                  | `transaction-queries.ts`                    |
|              | Route file       | TanStack Router file convention        | `_app.transactions.tsx`                     |
| **Backend**  | Controller file  | `<entity>.controller.ts`               | `transaction.controller.ts`                 |
|              | Command Use Case | `<verb>-<entity>.use-case.ts`          | `create-transaction.use-case.ts`            |
|              | Query Use Case   | `<verb>-<entity>.use-case.ts`          | `list-transactions.use-case.ts`             |
|              | Domain Repo Port | `<entity>.repository.ts`               | `transaction.repository.ts`                 |
|              | Persistence Repo | `typeorm-<entity>.repository.ts`       | `typeorm-transaction.repository.ts`         |
|              | TypeORM Entity   | `<entity>.entity.ts`                   | `transaction.entity.ts`                     |
|              | Domain Exception | `<error-name>.domain-exception.ts`     | `transaction-not-found.domain-exception.ts` |
|              | NestJS Module    | `<entity>.module.ts`                   | `transaction.module.ts`                     |
|              | Guard / Filter   | `<name>.<role>.ts`                     | `firebase-auth.guard.ts`                    |
|              | Migration        | `<timestamp>-<description>.ts`         | `1713334455-create-transactions.ts`         |
| **Shared**   | Contract Router  | `<entity>.contract.ts`                 | `transaction.contract.ts`                   |
|              | Zod Schema       | `<entity>.schema.ts`                   | `transaction.schema.ts`                     |
|              | Common Utility   | `kebab-case.ts`                        | `currency-minor-units.ts`                   |
| **Common**   | Test file        | `<name>.test.ts(x)` / `<name>.spec.ts` | `format-currency.test.ts`                   |
|              | Barrel export    | `index.ts`                             | `index.ts`                                  |

**Forbidden**:

- `PascalCase` file names (`TransactionRow.tsx` ❌)
- `camelCase` file names (`useTransaction.ts` ❌)
- Suffixes like `.interface.ts` (e.g. `transaction.repository.interface.ts` ❌ → `transaction.repository.ts` ✅)
- Generic numbered files (`modal2.tsx` ❌)

---

## 2. Backend Conventions (`sumio-be`) — Clean Architecture & DDD

Sumio backend strictly follows Clean Architecture / Domain-Driven Design (DDD) layered inside NestJS modules (`interface/http`, `application/commands`, `application/queries`, `domain/repositories`, `infrastructure/persistence`).

### A. Class & Interface Naming

- **Controller Class**: `<Entity>Controller` (e.g. `TransactionController`).
- **Use Case Class**: `<Verb><Entity>UseCase` (e.g. `CreateTransactionUseCase`, `ListTransactionsUseCase`).
  - Every Use Case class must expose exactly one public execution method: `execute(...)`.
- **Domain Repository Interface (Port)**: `<Entity>Repository` (e.g. `TransactionRepository`).
  - **Forbidden**: `I` prefix (e.g. `ITransactionRepository` ❌ → `TransactionRepository` ✅).
- **Persistence Repository (Adapter)**: `TypeOrm<Entity>Repository` (e.g. `TypeOrmTransactionRepository`).
- **Entity Class**: `<Entity>Entity` (e.g. `TransactionEntity`).
- **Domain Exception Class**: `<ErrorName>DomainException` (e.g. `NotFoundDomainException`, `TransactionOwnershipDomainException`).

### B. Repository & Service Method Verbs (Semantic Naming)

Method names must reflect precise domain and query semantics:

- `findById(userId, id)`: Queries an entity by ID; returns `Promise<T | null>` (returns `null` when not found, **never throws**).
- `getById(userId, id)` / `getByIdOrThrow(userId, id)`: Retrieves an entity; returns `Promise<T>` and **throws `NotFoundDomainException`** if missing.
- `list(userId, filter)`: Returns a paginated result `Promise<{ items: T[]; total: number }>`.
- `exists(userId, criteria)`: Returns `Promise<boolean>`.
- `count(userId, criteria)`: Returns `Promise<number>`.
- `create(data)` / `save(entity)`: Persists new records.
- `update(userId, id, patch)`: Mutates existing records.
- `delete(userId, id)`: Permanently deletes records.

### C. Class Member Ordering

Order class members consistently:

1. `private readonly logger = new Logger(ClassName.name);`
2. Private fields / properties
3. `constructor(...)` (Dependency Injection)
4. Public methods (`execute(...)` or HTTP handlers)
5. Private helper methods

---

## 3. Frontend Conventions (`sumio-fe`) — React 19 & Atomic Design

### A. Components & Props

- **React Components**: `PascalCase` named function exports (never default exports).
- **Props Interface**:
  - Local props (not exported): `interface Props { ... }` (the file name provides context).
  - Exported props: `export interface <ComponentName>Props { ... }`.
- **Component File Suffixes**:
  - Form: `*-form.tsx` (`login-form.tsx`)
  - Modal: `*-modal.tsx` (`confirm-modal.tsx`)
  - Panel: `*-panel.tsx` (`transaction-summary-panel.tsx`)
  - Item / Row: `*-card.tsx`, `*-row.tsx`, `*-item.tsx`
  - Table: `*-table.tsx`

### B. Component Member Ordering (Standard Lifecycle Order)

Organize the body of every React function component in this exact order:

```tsx
export function TransactionRow({ transaction, onSelect }: Props): React.JSX.Element {
  // 1. Ref hooks
  const rowRef = useRef<HTMLDivElement>(null);

  // 2. React Core state hooks
  const [isHovered, setIsHovered] = useState(false);

  // 3. Controller hooks / Queries / Mutations
  const { deleteTransaction, isDeleting } = useTransactionModals();

  // 4. Derived state & Memoization
  const formattedAmount = useMemo(() => formatCurrency(transaction.amount), [transaction.amount]);

  // 5. Effects (minimal, non-blocking)
  useEffect(() => { ... }, []);

  // 6. Internal Event Handlers
  function handleDeletePress(): void {
    deleteTransaction(transaction.id);
  }

  // 7. Guard clauses / Early returns
  if (isDeleting) {
    return <TransactionRowSkeleton />;
  }

  // 8. Main Render JSX
  return (
    <div ref={rowRef} onMouseEnter={() => setIsHovered(true)}>
      ...
    </div>
  );
}
```

### C. Custom Hooks

- **Pattern**: `use<Entity><Purpose>` (e.g. `useTransactionList`, `useTransactionModals`, `useTransactionFilters`).
- **Explicit Return Types**: All custom hooks must explicitly declare their return type.
  ```tsx
  export function useTransactionList(): TransactionListController { ... }
  ```

### D. Query Key Factories

Every feature's `api/<entity>-queries.ts` must export a typed key factory named `<entityPlural>Keys`:

```tsx
export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (query: Partial<ListTransactionsQuery>) => [...transactionKeys.lists(), query] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};
```

---

## 4. Event Handlers & Callbacks (Enforced by `react/jsx-handler-names`)

To maintain clean separation between event interfaces and implementation logic:

| Role                                  | Convention                | Oxlint Rule                    | Examples                                                     |
| :------------------------------------ | :------------------------ | :----------------------------- | :----------------------------------------------------------- |
| **Component Prop (Event API)**        | `on<Action>`              | `eventHandlerPropPrefix: "on"` | `onPress`, `onChange`, `onClose`, `onDelete`, `onSelect`     |
| **Handler Function (Implementation)** | `handle<Action>`          | `eventHandlerPrefix: "handle"` | `handlePress`, `handleChange`, `handleClose`, `handleDelete` |
| **Derived Handler**                   | `handle<Subject><Action>` |                                | `handleTransactionDelete`, `handleFilterChange`              |

```tsx
// ✅ Correct: Prop is "on...", passed handler is "handle..."
<Button onPress={handleDeletePress}>Delete</Button>
<TransactionForm onClose={handleCloseModal} onSubmit={handleSubmit} />

// ✅ Inline arrow function calling controller action (allowed when checkInlineFunction: false)
<TransactionForm onClose={() => modals.closeForm()} />

// ❌ Forbidden: Violates react/jsx-handler-names
<Button onPress={deleteItem}>Delete</Button>
<TransactionForm close={handleCloseModal} />
<TransactionForm onClose={modals.closeForm} /> // Must be handleCloseForm or bọc arrow function
```

---

## 5. Boolean Variables & Props

All boolean variables, state variables, and component boolean props must be prefixed with a modal verb or copula:

- `is`: `isLoading`, `isFetching`, `isOpen`, `isDeleting`, `isError`, `isEmpty`
- `has`: `hasSelection`, `hasAccess`, `hasPermission`
- `can`: `canSubmit`, `canDelete`, `canEdit`
- `should`: `shouldRefetch`, `shouldValidate`

**Forbidden**: Naked adjectives or verbs (e.g. `loading` ❌, `error` ❌, `open` ❌, `select` ❌).

---

## 6. Shared Packages (`@sumio/contract` & `@sumio/common`)

### A. `@sumio/contract`

- Schema file: `<entity>.schema.ts`
- Contract file: `<entity>.contract.ts`
- Zod Schemas: `<Entity><Action>Schema` (e.g. `CreateTransactionSchema`, `UpdateTransactionSchema`, `TransactionDtoSchema`, `ListTransactionsQuerySchema`).
- DTO Types: Inferred directly from Zod:
  ```ts
  export type TransactionDto = z.infer<typeof TransactionDtoSchema>;
  export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;
  ```
- Contract Router: `<entity>Contract` (e.g. `transactionContract`, `categoryContract`).

### B. `@sumio/common`

- Pure utility functions: `camelCase` with explicit verbs (e.g. `toMinorUnits`, `fromMinorUnits`, `formatMoney`).
- Generic utility types: `PascalCase` (e.g. `Nullable<T>`, `Optional<T>`, `PaginatedResult<T>`).
- Constants: `SCREAMING_SNAKE_CASE` (e.g. `DEFAULT_PAGE_SIZE`, `SUPPORTED_CURRENCIES`).

---

## 7. Clean Code Guardrails (Linter-Enforced)

### A. Guard Clauses & Early Returns (`no-else-return`)

Never use the "Arrow Anti-pattern" (deeply nested `if/else`). Validate edge cases first and return early:

```ts
// ❌ Arrow Anti-pattern
function processTransaction(tx: Transaction | null) {
  if (tx) {
    if (tx.isValid) {
      save(tx);
    } else {
      throw new Error("Invalid");
    }
  }
}

// ✅ Guard Clauses (Early Return)
function processTransaction(tx: Transaction | null): void {
  if (!tx) {
    return;
  }
  if (!tx.isValid) {
    throw new Error("Invalid");
  }
  save(tx);
}
```

### B. Ban Nested Ternary (`no-nested-ternary`)

Ternary expressions are permitted for exactly **1 level** only. If more conditions are required, use `if/else`, `switch`, or a helper function.

```ts
// ❌ Forbidden
const status = isPending ? "pending" : isSuccess ? "success" : "failed";

// ✅ Allowed
const status = isPending ? "pending" : "completed";
```

### C. Function Parameter Limit (`max-params: 3`)

Functions taking > 3 positional parameters must consolidate additional arguments into a single options object or DTO.

### D. Strict Typing (`typescript/no-explicit-any: "error"`)

`any` is completely prohibited across the monorepo. Use `unknown`, Zod-inferred DTOs, or generics.

### E. File Naming (`unicorn/filename-case`)

Every single file across all monorepo workspaces must strictly use `kebab-case` (e.g. `transaction-row.tsx`, `use-transaction.ts`, `transaction.controller.ts`).

### F. JSX Component Naming (`react/jsx-pascal-case`)

User-defined JSX components must always be in `PascalCase` (e.g. `<TransactionCard />`, never `<transactionCard />`).

### G. Catch Error Variable Naming (`unicorn/catch-error-name`)

Variables in catch blocks must strictly be named `error` (e.g. `catch (error)`), never abbreviated as `err`, `e`, or `exception`.

### H. JSX Boolean Prop Values (`react/jsx-boolean-value`)

Boolean props set to `true` must omit the explicit literal (e.g. `<Modal isOpen />` instead of `<Modal isOpen={true} />`).

### I. Clean JSX Attributes (`react/jsx-curly-brace-presence`)

Unnecessary curly braces on string JSX props or children are forbidden (e.g. `<Button label="Submit" />` instead of `<Button label={"Submit"} />`).

### J. Named Component Declaration (`react/function-component-definition`)

Top-level named React components must use `function` declarations (`export function MyComponent()`) rather than `const MyComponent = () => ...` or `React.FC`.

### K. No `var` & Function Name Matching (`no-var`, `func-name-matching`)

`var` is forbidden; always use `const` or `let`. Named function expressions must match the variable name they are assigned to.

---

## 8. Review Checklist — Naming & Code Structure

Before committing or approving any PR, verify:

- [ ] All files in `kebab-case.tsx/ts` (`unicorn/filename-case`).
- [ ] No `I` prefix on interfaces (`TransactionRepository`, not `ITransactionRepository`).
- [ ] Backend use cases expose `execute(...)` and domain repos use semantic verbs (`findById`, `getByIdOrThrow`, `list`).
- [ ] Component callbacks named `on<Action>`, internal handlers named `handle<Action>` (`react/jsx-handler-names`).
- [ ] Component JSX tags in `PascalCase` (`react/jsx-pascal-case`).
- [ ] Catch parameters named `error` (`unicorn/catch-error-name`).
- [ ] Boolean props written as `<Comp isVisible />` (`react/jsx-boolean-value`).
- [ ] No redundant curly braces on string props (`react/jsx-curly-brace-presence`).
- [ ] Top-level components declared as `function Component()` (`react/function-component-definition`).
- [ ] Boolean variables prefixed with `is`, `has`, `can`, `should`.
- [ ] Guard clauses used instead of nested `if/else` (`no-else-return`).
- [ ] No nested ternary expressions (`no-nested-ternary`).
- [ ] No function has > 3 positional parameters (`max-params: 3`).
- [ ] Zero `any` in new code (`typescript/no-explicit-any`).
- [ ] Feature `index.ts` only exports public page component + needed types.
- [ ] `bun lint` passes with 0 warnings and 0 errors.
