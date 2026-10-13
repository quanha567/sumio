# Frontend Server State and Controller-Presenter Architecture

We decided to adopt `@tanstack/react-query` (v5) for frontend server state caching, synchronize table filters/pagination directly with URL search parameters via TanStack Router and Zod, and enforce a Headless Controller-Presenter separation across feature modules.

## Context

As the frontend evolved, feature screens like `TransactionsPage` accumulated 15+ concurrent `useState` variables mixing network calls, filter/search state, pagination, selection tracking, and modal controls. This resulted in several architectural deficiencies:

1. Re-fetching and cache invalidation were handled manually inside `useEffect` blocks with silent failure swallows (`catch { // ignore }`).
2. Filter and pagination states were wiped on browser reload, history navigation, or URL sharing because they lived purely in ephemeral React component state.
3. Heavy coupling between business logic (date range calculations, minor-unit conversions, batch deletion loops) and presentation markup prevented isolated unit testing and clean reuse.
4. Dashboard and other views lacked live integration with backend contracts, relying on disconnected static mocks.

## Decision

1. **Server State & Caching**: Introduce `@tanstack/react-query` (v5) managed via a root `QueryClientProvider`.
   - Use the **Query Key Factory Pattern** (e.g. `transactionKeys.all`, `transactionKeys.list(filters)`, `categoryKeys.all`) centralized in each feature's `api/*-queries.ts`.
   - Mutations (create, update, delete, batch deletion) automatically invalidate relevant query keys.
2. **URL as Single Source of Truth for Search & Filters**:
   - Route definitions in TanStack Router enforce validated search schemas via Zod (`validateSearch`).
   - Search text input uses a 300ms debounce with `{ replace: true }` and resets pagination to page 1 to maintain clean browser history without redundant re-renders.
3. **Headless Controller-Presenter Pattern & Feature Structure**:
   - Organize feature modules with strict layer boundaries:
     ```
     src/features/<feature>/
     ├── api/          # HTTP client calls & TanStack Query hooks (Query Key Factory)
     ├── hooks/        # Headless controller hooks (URL sync, selection set, modal controllers)
     ├── components/   # Pure presentation components (dumb views accepting typed props & callbacks)
     └── index.ts      # Public surface for routes & shells
     ```
   - Controllers (`useTransactionList`, `useTransactionModals`) isolate business state, pagination, and dialog lifecycles.
4. **Resilient Feedback & States**:
   - **Loading State**: Render responsive `<Skeleton>` placeholders preserving the exact table/metric dimensions to prevent layout shifts.
   - **Error State**: Display an inline `<Alert status="danger">` with an actionable "Retry" button bound to the query's `refetch()` function.
   - **Mutation Feedback**: Mount `ToastProvider` at the root and dispatch user feedback via `@/components/ui/toast` (`toastQueue`).
   - **Batch Deletion**: Process deletion promises in parallel (`Promise.allSettled`) with aggregate success/failure toast feedback.
5. **Dashboard Live Data**:
   - Derive live dashboard KPI metrics, cashflow comparisons, and recent transaction feeds dynamically from the transactions query cache, while explicitly isolating unbacked mock widgets (Upcoming Bills, Financial Goals) until backend modules are implemented.

## Consequences

- Requires installing `@tanstack/react-query` in `sumio-fe`.
- Table states become shareable, bookmarkable, and resilient to browser page reloads.
- Drastically reduces boilerplate and eliminates state synchronization bugs across feature pages.
- Establishes a scalable blueprint ("Golden Standard") for all future feature modules in Sumio.
