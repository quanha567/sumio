# Appendix 05 — Linting, Formatting & Quality Gates

---

## Quality Gate — Must Pass Before Every Commit

Run from `sumio-fe/`:

```bash
vp check   # runs: oxfmt --check + oxlint + tsc --noEmit
```

Or individually:

```bash
bun run fmt:check   # formatting
bun run lint        # oxlint
```

**Zero tolerance**: zero warnings, zero errors. The pre-commit hook enforces this automatically via `lint-staged`.

---

## oxfmt Configuration (`.oxfmtrc.json`)

oxfmt is the formatter. It runs automatically on commit. Manual run: `bun run fmt`.

| Setting           | Value   | Why                                                     |
| ----------------- | ------- | ------------------------------------------------------- |
| `printWidth`      | 100     | Wider than 80, narrower than 120                        |
| `tabWidth`        | 2       | Industry standard for TS/JS                             |
| `semi`            | true    | Explicit semicolons                                     |
| `singleQuote`     | false   | Double quotes for JSX compatibility                     |
| `trailingComma`   | `"all"` | Cleaner diffs, required by TS                           |
| `sortImports`     | true    | Auto-groups: external → workspace → internal → relative |
| `sortTailwindcss` | true    | Consistent Tailwind class order                         |

**Do not fight the formatter** — if oxfmt reformats your code, accept it. Do not disable rules locally.

---

## oxlint Rule Set — Frontend (`sumio-fe`)

### Active Rules

| Rule                                 | Severity         | Description                                          |
| ------------------------------------ | ---------------- | ---------------------------------------------------- |
| `no-unused-vars`                     | error            | No declared-but-never-used variables                 |
| `no-console`                         | error            | `console.log` forbidden; `warn`/`error` allowed      |
| `no-nested-ternary`                  | error            | No `a ? b ? c : d : e` patterns                      |
| `prefer-const`                       | error            | Always `const` unless reassigned                     |
| `max-params`                         | error (max: 3)   | Functions max 3 positional parameters                |
| `max-lines`                          | error (max: 350) | Max 350 lines per file (excl. blanks/comments)       |
| `max-lines-per-function`             | warn (max: 100)  | Max 100 lines per function                           |
| `react/jsx-key`                      | error            | Keys required in mapped JSX                          |
| `react/no-array-index-key`           | error            | No array index as key                                |
| `react/jsx-no-target-blank`          | error            | `target="_blank"` requires `rel="noopener"`          |
| `react/rules-of-hooks`               | error            | Hooks only at top level, only in React functions     |
| `react/exhaustive-deps`              | warn             | Hook dependency arrays must be complete              |
| `react/set-state-in-effect`          | warn             | Avoid setState directly in effects                   |
| `typescript/no-explicit-any`         | error            | No `any` — use `unknown` or proper types             |
| `typescript/consistent-type-imports` | error            | Always `import type` for type-only imports           |
| `unicorn/prefer-node-protocol`       | error            | Use `node:path` not `path`                           |
| `no-restricted-imports`              | error            | No `@heroui/react` or `@heroui/styles` outside atoms |
| `jsx-a11y/*`                         | warn             | Accessibility rules (except disabled ones)           |

### Target Rule Set (add to `.oxlintrc.json` now)

```json
{
  "rules": {
    "no-unused-vars": "error",
    "no-console": ["error", { "allow": ["warn", "error"] }],
    "no-nested-ternary": "error",
    "prefer-const": "error",
    "max-params": ["error", { "max": 3 }],
    "max-lines": ["error", { "max": 350, "skipBlankLines": true, "skipComments": true }],
    "max-lines-per-function": [
      "warn",
      { "max": 100, "skipBlankLines": true, "skipComments": true }
    ],
    "react/jsx-key": "error",
    "react/no-array-index-key": "error",
    "react/jsx-no-target-blank": "error",
    "react/rules-of-hooks": "error",
    "react/exhaustive-deps": "warn",
    "react/react-in-jsx-scope": "off",
    "react/incompatible-library": "off",
    "react/set-state-in-effect": "warn",
    "jsx-a11y/label-has-associated-control": "off",
    "jsx-a11y/prefer-tag-over-role": "off",
    "typescript/no-explicit-any": "error",
    "typescript/consistent-type-imports": "error",
    "unicorn/prefer-node-protocol": "error",
    "unicorn/prefer-top-level-await": "off",
    "no-duplicate-imports": "off",
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "@heroui/react",
            "message": "Import from '@/components/atoms' instead."
          },
          {
            "name": "@heroui/styles",
            "message": "Import from '@/components/atoms' instead."
          },
          {
            "name": "recharts",
            "message": "Import chart components from '@/components/molecules' instead."
          },
          {
            "name": "motion/react",
            "message": "Import motion components from '@/components/motion' instead."
          }
        ]
      }
    ]
  }
}
```

> **Change from current**: Added `no-nested-ternary`, `prefer-const`, `max-params`,
> upgraded `typescript/no-explicit-any` from `warn` → `error`,
> upgraded `react/no-array-index-key` from `warn` → `error`,
> added `recharts` and `motion/react` to `no-restricted-imports`.

---

## oxlint Rule Set — Backend (`sumio-be`)

| Rule                                 | Severity         | Description                                |
| ------------------------------------ | ---------------- | ------------------------------------------ |
| `no-unused-vars`                     | error            |                                            |
| `no-console`                         | error            | No console at all in BE                    |
| `no-throw-literal`                   | error            | Always throw `Error` instances             |
| `prefer-const`                       | error            |                                            |
| `max-params`                         | error (max: 3)   |                                            |
| `max-lines`                          | error (max: 250) | BE files more tightly scoped than FE       |
| `max-lines-per-function`             | warn (max: 50)   |                                            |
| `typescript/no-explicit-any`         | error            |                                            |
| `typescript/consistent-type-imports` | error            |                                            |
| `no-underscore-dangle`               | off              | NestJS uses `_id` in some TypeORM contexts |
| `typescript/no-extraneous-class`     | off              | NestJS requires class-based modules        |

---

## Common Violations & How to Fix

### `typescript/no-explicit-any`

```tsx
// ❌
function processData(data: any) { ... }

// ✅ Option A — unknown with type guard
function processData(data: unknown) {
  if (typeof data === "string") { ... }
}

// ✅ Option B — Zod parse
const result = CreateTransactionSchema.parse(data);

// ✅ Option C — contract DTO
function processData(data: TransactionDto) { ... }
```

### `max-lines` (file > 350 lines)

Split the file. Typical extraction targets:

- Extract sub-components into `./components/sub-component-name.tsx`
- Extract a complex hook into `./hooks/use-specific-concern.ts`
- Extract types into `./types.ts` or `<entity>.types.ts`

### `max-lines-per-function` (function > 100 lines)

Extract early-return guard clauses, loops, or conditional branches into named sub-functions.

### `max-params` (function > 3 params)

```tsx
// ❌
function buildQuery(token: string, page: number, q: string, type: string, categoryId: string) {}

// ✅
interface QueryOptions {
  page: number;
  q: string;
  type: TransactionType;
  categoryId?: string;
}
function buildQuery(token: string, opts: QueryOptions) {}
```

### `react/exhaustive-deps`

```tsx
// ❌ Missing dependency
useEffect(() => {
  doSomething(value); // `value` not in deps
}, []); // oxlint warns

// ✅
useEffect(() => {
  doSomething(value);
}, [value]);
```

### `no-nested-ternary`

```tsx
// ❌
const label = a ? "A" : b ? "B" : "C";

// ✅ — function extraction
function getLabel(a: boolean, b: boolean): string {
  if (a) return "A";
  if (b) return "B";
  return "C";
}
```

---

## Vertical Spacing Rules (enforced by oxfmt)

```tsx
// ✅ Correct spacing anatomy of a component/hook
import type { ... } from "...";  // imports
import { ... } from "...";
                                  // ← 1 blank line after imports
interface Props { ... }
                                  // ← 1 blank line between declarations
export function MyComponent({ ... }: Props) {
  const [value, setValue] = useState("");  // state block
  const ref = useRef<HTMLDivElement>(null);
                                  // ← 1 blank line after state/ref block
  useEffect(() => { ... }, []);   // effects
                                  // ← 1 blank line between handlers
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) { ... }
                                  // ← 1 blank line before return
  return (...);
}
```

Rules:

- Exactly **1 blank line** after import block
- Exactly **1 blank line** after state/ref declaration block, before effects/handlers
- Exactly **1 blank line** between individual handlers and callbacks
- Exactly **1 blank line** before `return` statement
- **Never 2+ consecutive blank lines**

---

## Commit Message Rules

Format: `<type>(<scope>): <subject>`

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Allowed scopes**: `fe`, `be`, `common`, `contract`, `root`, `deps`, `ci`, `docs`, `release`

```
feat(fe): add transaction filter by category
fix(be): handle duplicate email on JIT provisioning
chore(contract): add transaction pagination schema
refactor(fe): migrate components/ui to atoms atomic layer
```

---

## Review Checklist — Linting & Quality

- [ ] `vp check` passes with zero warnings, zero errors
- [ ] No `any` anywhere (now error-level)
- [ ] No `console.log` (only `warn`/`error`)
- [ ] No nested ternary
- [ ] All new functions have ≤ 3 parameters
- [ ] No file exceeds 350 lines (FE) / 250 lines (BE)
- [ ] Import order matches oxfmt grouping (external → workspace → internal → relative)
- [ ] All type-only imports use `import type`
- [ ] Commit message follows Conventional Commits with valid scope
- [ ] `recharts` and `motion/react` not imported directly in features (new rule)
