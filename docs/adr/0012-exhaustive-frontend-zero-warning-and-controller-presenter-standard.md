# Exhaustive Frontend Zero-Warning and Controller-Presenter Standard

We decided to enforce a strict Zero-Warning Quality Gate and standardize the Headless Controller-Presenter architecture across all frontend domains (Auth, Dashboard, and Transactions) with co-located sub-components and encapsulated fallback data.

## Context

Following the adoption of ADR-0009 (HeroUI component boundary) and ADR-0010 (Server State and Controller-Presenter Architecture), the frontend still accumulated 23 Oxlint warnings (mostly `max-lines-per-function > 100`, unmemoized Context values, and inline comments). Additionally, `features/dashboard` still performed business metrics calculation inline and mixed raw mock datasets, while `features/auth` mixed form validation, Firebase authentication mutations, and extensive SVG presentation in bloated single-file components.

## Decision

1. **Zero-Warning Tolerance**:
   - Every file must pass `oxlint` with 0 errors and 0 warnings.
   - Any component or hook exceeding 100 lines must be decomposed into co-located sub-presenters or sub-hooks within the same domain directory.
2. **Headless Form & Analytics Controllers**:
   - `features/auth`: Introduce `useLoginForm`, `useRegisterForm`, and `useForgotPasswordForm` encapsulating form registration, submit handling, Google authentication, and loading/error states.
   - `features/dashboard`: Introduce `useDashboardAnalytics` calculating financial KPIs, cash flow totals, and currency unit transformations, cleanly encapsulating mock fallback data away from view components.
3. **Co-located Sub-Components**:
   - Split large view files (`transaction-table-view`, `transaction-hero-banner`, `transaction-form-modal`, `register-form`, `login-form`) into co-located sub-presenters (e.g. `transaction-table-row`, `google-auth-button`, `auth-password-field`).
4. **Context & Route Optimization**:
   - Memoize React Context values in `AuthContext` to prevent unnecessary render cascades.
   - Use async/await route loaders instead of promise chains in TanStack Router routes.

## Consequences

- Guarantees deterministic, warning-free CI quality gates.
- Improves readability, testability, and maintainability across all frontend domains.
- Dashboard views remain pure presentation components, making future migration from mock fallbacks to backend contracts effortless.
