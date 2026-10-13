# Appendix 03 — Library Rules

Per-library usage rules for every dependency in `sumio-fe` and `sumio-be`.

---

## `@heroui/react` + `@heroui/styles`

**Rule**: Never import directly in features, routes, or molecules. Only `components/atoms/` wrappers touch HeroUI.

```tsx
// ❌ — caught by oxlint no-restricted-imports
import { Button } from "@heroui/react";

// ✅
import { Button, TextField, Modal } from "@/components/atoms";
```

When wrapping a HeroUI component in `atoms/`:

- Override only CSS tokens to match Sage & Forest theme — do not override structural layout
- Preserve all aria attributes, keyboard navigation, and built-in focus management
- Use `tv()` from `tailwind-variants` (re-exported via `@heroui/styles`) for variant composition
- HeroUI v3 API: use React Aria-based slot composition — no custom `classNames` object for structural hacks

---

## `@tanstack/react-query` v5

### Query key factories (mandatory)

Always define key factories in `features/<feature>/api/<entity>-queries.ts`:

```tsx
export const entityKeys = {
  all: ["entity"] as const,
  lists: () => [...entityKeys.all, "list"] as const,
  list: (query: Partial<ListEntityQuery>) => [...entityKeys.lists(), query] as const,
  detail: (id: string) => [...entityKeys.all, "detail", id] as const,
};
```

### Query hooks

```tsx
// ✅ Always type the error as Error, not unknown
useQuery<ResponseDto, Error>({
  queryKey: entityKeys.list(query),
  queryFn: () => fetchEntities(token, query),
  enabled: !!token,
  staleTime: QueryStaleTime.Medium, // use named constants, never raw ms
});
```

### staleTime constants (use these, do not invent new ones)

```tsx
// from @/lib/query-constants.ts (or equivalent)
export const QueryStaleTime = {
  Short: 30_000, // 30s  — volatile: transactions, dashboard metrics
  Medium: 300_000, // 5m   — semi-stable: categories, accounts
  Long: 600_000, // 10m  — stable: user profile, settings
  Infinite: Infinity, // ∞    — static reference data (currencies, timezones)
} as const;
```

### Mutations

```tsx
// ✅ Always void the invalidation promise
onSuccess: () => {
  void queryClient.invalidateQueries({ queryKey: entityKeys.all });
  toast("Success message");
},
onError: (err) => {
  toast(err.message || "Fallback error message");
},
```

### Batch operations

Use `Promise.allSettled` — never `Promise.all` for batch deletes/updates (partial failure must not abort):

```tsx
const results = await Promise.allSettled(ids.map((id) => deleteApi(token, id)));
const succeeded = results.filter((r) => r.status === "fulfilled").length;
const failed = results.filter((r) => r.status === "rejected").length;
```

### Forbidden patterns

```tsx
// ❌ Inline string key
useQuery({ queryKey: ["transactions", "list"], ... });

// ❌ Catching and swallowing inside queryFn
queryFn: async () => {
  try { return await fetch(...); } catch { return null; } // FORBIDDEN
}

// ❌ Manual refetch in useEffect
useEffect(() => { refetch(); }, [filters]); // Use queryKey instead
```

---

## `@tanstack/react-router` v1

### URL search params are the single source of truth for all list state

```tsx
// Route definition
export const Route = createFileRoute("/_app/transactions")({
  validateSearch: (search) => ListTransactionsSchema.parse(search),
});

// Reading
const { page, q, type, categoryId } = Route.useSearch();

// Writing — always use replace: true for filter changes, push for pagination
const navigate = Route.useNavigate();
navigate({ search: (prev) => ({ ...prev, q: value, page: 1 }), replace: true });
```

### Search param debouncing

Text search inputs must debounce 300ms with `replace: true` and reset page to 1:

```tsx
// use-debounced-search.ts pattern
const [localValue, setLocalValue] = useState(searchParam);
useEffect(() => {
  const timer = setTimeout(() => {
    navigate({ search: (prev) => ({ ...prev, q: localValue, page: 1 }), replace: true });
  }, DEBOUNCE_MS);
  return () => clearTimeout(timer);
}, [localValue]);
```

### Forbidden patterns

```tsx
// ❌ useState for list filters — always use URL
const [filters, setFilters] = useState({ page: 1, q: "" }); // FORBIDDEN

// ❌ useEffect to sync URL → state — redundant, Route.useSearch() is reactive
```

---

## `@tanstack/react-table` v9

### Column definitions

Always use `createColumnHelper` with a typed row model:

```tsx
import type { TransactionDto } from "@sumio/contract";
import { createColumnHelper } from "@tanstack/react-table";

const helper = createColumnHelper<TransactionDto>();

const columns = [
  helper.accessor("description", {
    header: "Description",
    cell: ({ getValue }) => <Text>{getValue()}</Text>,
  }),
  helper.accessor("amount", {
    header: "Amount",
    cell: ({ row }) => <AmountCell transaction={row.original} />,
  }),
];
```

### Forbidden patterns

```tsx
// ❌ Untyped columns array
const columns = [{ accessorKey: "name", header: "Name" }]; // loses type safety

// ❌ Inline renderCell with styling — extract into sub-component
cell: ({ getValue }) => <span className="text-sm font-bold">{getValue()}</span>; // styling in feature
```

---

## `@tanstack/react-virtual`

Only used inside `DataTable` in `molecules/` — features must not import it directly.
Mobile card-row virtualization is handled automatically by `<DataTable>`.

---

## `react-hook-form` + `zod`

### Form setup pattern

```tsx
const form = useForm<CreateTransaction>({
  resolver: zodResolver(CreateTransactionSchema),
  defaultValues: { amount: 0, type: "expense", description: "" },
});
```

### Auto-wiring via FormProvider

Wrap form fields in `<FormProvider>` and pass `name` prop — fields auto-wire registration:

```tsx
// ✅ Auto-wired
<FormProvider {...form}>
  <TextField name="description" label="Description" isRequired />
  <TextField name="amount" label="Amount" type="number" />
</FormProvider>

// ❌ Manual registration boilerplate
<Input {...form.register("description")} />
{form.formState.errors.description && <p>{...}</p>}
```

### Async form submission

Use `form.handleSubmit` with `startTransition` for non-blocking UX:

```tsx
const onSubmit = form.handleSubmit(async (data) => {
  await createMutation.mutateAsync(data);
  onClose();
});
```

### Zod schema rules

- Define schemas in `packages/contract/src/` for shared schemas, or in `features/<feature>/api/` for feature-local schemas
- Name: `PascalCase` + `Schema` suffix — `CreateTransactionSchema`, `ListTransactionsSchema`
- Reuse contract DTOs — do not define duplicate schemas for the same shape

---

## `lucide-react`

Always use the sizing tier system — never use arbitrary sizes:

| Tier            | Size                            | Usage                                   |
| --------------- | ------------------------------- | --------------------------------------- |
| Mini / Inline   | `h-3 w-3` or `h-3.5 w-3.5`      | Delta arrows, chevrons, info dots       |
| Action / Form   | `h-4 w-4`                       | Button icons, input prefixes, dropdowns |
| Navigation      | `h-5 w-5`                       | Sidebar nav, bottom nav tabs            |
| Category Anchor | `h-5 w-5` inside `40-44px` pill | `IconBadge` category indicators         |

```tsx
// ✅
import { ArrowUp } from "lucide-react";
<ArrowUp className="h-3 w-3" />

// ❌ Arbitrary size
<ArrowUp size={13} />
<ArrowUp className="h-[13px] w-[13px]" />
```

Always use `strokeWidth={2}` for Tier 1-3, `strokeWidth={1.75}` for Tier 4.

---

## `motion` (Framer Motion v14)

**All animations must be wrapped in `components/motion/` — features never import `motion` directly.**

```tsx
// ❌ Direct import in feature
import { motion } from "motion/react";

// ✅ Feature code
import { AnimatedSidebar } from "@/components/motion/animated-sidebar";
```

### Rules for `motion/` wrappers

1. Always declare a `reduced-motion` fallback via `useReducedMotion()`:

   ```tsx
   const shouldReduce = useReducedMotion();
   const variants = shouldReduce ? staticVariants : animatedVariants;
   ```

2. Use easing and duration from design token CSS variables — never hardcode:

   ```tsx
   // ✅
   transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } // ease-spring constant

   // ❌
   transition: { duration: 0.3, ease: "easeOut" }
   ```

3. Duration tier reference:
   - `100-150ms` — micro (button press, color shift)
   - `200-250ms` — component (tab indicator, dropdown)
   - `300-400ms` — surface/page entrance
   - `600-800ms` — data viz reveal (chart sweep, sparkline draw)

4. `useAnimate` and `useMotionValue` are forbidden in feature code — only permitted inside `motion/` wrappers.

---

## `recharts` v3

**All chart components must be wrapped in `components/molecules/` — features never import recharts directly.**

```tsx
// ❌
import { PieChart, Pie } from "recharts";

// ✅
import { DonutChart, SparkLine, GroupedBarChart } from "@/components/molecules";
```

### Chart rules

1. Always use `<ResponsiveContainer width="100%" height={...}>` — never hardcode `width`/`height` as numbers
2. Color palette: exclusively from `--chart-1` through `--chart-6` CSS tokens — never arbitrary hex values
3. Tooltip text: `var(--foreground)`, label: `var(--muted)` — never hardcoded colors
4. Legend: only if the chart has > 2 data series; always use `var(--muted)` text
5. Animations: set `isAnimationActive={!prefersReducedMotion}` on all animated chart elements

---

## `firebase` v12

Only used inside `features/auth/` and `@/lib/firebase.ts`. No other module imports Firebase directly.

```tsx
// ✅ — centralized in lib/firebase.ts
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ❌ — firebase usage scattered in features
import { getAuth } from "firebase/auth"; // FORBIDDEN outside auth feature
```

Authentication token must always be obtained via `useAuth()` hook — never read directly from `firebase/auth`.

---

## `clsx` + `tailwind-merge` + `cn()`

The `cn()` utility (`clsx` + `twMerge`) is defined in `components/atoms/cn.ts`.

**When to use `cn()`**:

- Inside `atoms/` when merging base classes with conditional or external className props
- Inside `molecules/` when assembling variant classes

**When NOT to use `cn()`**:

- In feature components (they should have no styling classes to merge)
- For simple single-branch conditions — use a ternary directly

```tsx
// ✅ Atoms — merging variant + external className
function Button({ className, isDestructive, ...props }: Props) {
  return <button className={cn("base-classes", isDestructive && "text-danger", className)} />;
}

// ❌ Feature code — has styling classes that shouldn't exist
function TransactionRow() {
  return <div className={cn("text-sm text-muted", isSelected && "bg-surface-secondary")} />;
  // ^ styling in feature = violation
}
```

---

## `class-variance-authority` (`cva` / `tv()`)

Use `tv()` from `@heroui/styles` (re-export of `tailwind-variants`) for multi-variant atom composition.
Use `cva` only when `tv()` is insufficient.

```tsx
// ✅ tv() for HeroUI-integrated atoms
import { tv } from "@heroui/styles";

const button = tv({
  base: "...",
  variants: {
    intent: { primary: "bg-accent text-accent-foreground", ghost: "bg-transparent" },
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
  },
  defaultVariants: { intent: "primary", size: "md" },
});
```

---

## `@sumio/common` utilities

Always import utility functions from `@sumio/common` — never re-implement:

| Utility         | Import                                                           | Notes                                 |
| --------------- | ---------------------------------------------------------------- | ------------------------------------- |
| Date formatting | `import { dayjs } from "@sumio/common"`                          | Configured with locale and plugins    |
| ID generation   | `import { nanoid } from "@sumio/common"`                         | Do not import nanoid directly         |
| Array utilities | `import { ... } from "@sumio/common"`                            | From es-toolkit — do not re-implement |
| Currency math   | `import { formatMinorUnits, toMinorUnits } from "@sumio/common"` | Never use floating-point for money    |

---

## `@ts-rest/core` (frontend contract client)

Use the contract client generated from `@sumio/contract` — never write raw fetch calls:

```tsx
// ✅
import { client } from "@/lib/contract-client";
const result = await client.transactions.list({
  query: filters,
  headers: { authorization: `Bearer ${token}` },
});

// ❌ Raw fetch
fetch("/api/transactions?page=1");
```

---

## Review Checklist — Library Rules

- [ ] No `@heroui/react` import outside `components/atoms/`
- [ ] No `recharts` import outside `components/molecules/`
- [ ] No `motion` import outside `components/motion/` or `atoms/`
- [ ] No `firebase` import outside `features/auth/` and `@/lib/firebase.ts`
- [ ] All query hooks use `entityKeys.*` key factories
- [ ] staleTime uses named `QueryStaleTime` constants — no raw milliseconds
- [ ] `Promise.allSettled` used for all batch operations
- [ ] All list state (filters, page, sort) synced via TanStack Router search params
- [ ] Lucide icons use correct tier size (`h-3`, `h-4`, or `h-5`)
- [ ] Chart colors from `--chart-1..6` tokens only
- [ ] Motion wrappers have `useReducedMotion()` fallback
- [ ] Money formatted via `@sumio/common` utilities — no floating-point arithmetic
