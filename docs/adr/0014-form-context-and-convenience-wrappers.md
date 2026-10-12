# Form Context Integration and High-Level Convenience Component Wrappers

We decided to introduce ergonomic, prop-driven high-level wrappers for form primitives (`TextField`, `PasswordField`, `SelectField`), support automatic React Hook Form context auto-wiring via `name`/`fieldId`, while retaining compound APIs for advanced compositions.

## Context

In [ADR 0009](./0009-exhaustive-heroui-component-wrappers-and-boundary-enforcement.md) and [ADR 0013](./0013-design-system-v1-sage-and-forest.md), we established an exhaustive component wrapper standard in `src/components/ui/` with Sage & Forest design tokens.

However, form authoring previously presented a recurring friction:

1. Low-level HeroUI compound primitives (`TextFieldRoot`, `InputGroup`, `InputGroupPrefix`, `InputGroupSuffix`, `FieldError`) required 4 to 5 layers of nested JSX tags for every simple text or password input.
2. In practice, feature screens bypassed compound primitives and resorted to raw HTML DOM (`<div className="space-y-1.5"><label>...</label><div className="relative"><Mail className="absolute..." /><Input className="pl-10" /></div><p className="text-danger">...</p></div>`), resulting in visual drift, fragile manual padding (`pl-10`), and duplicated validation error rendering.
3. Every form field repeated boilerplate for React Hook Form: passing `register(...)`, checking `errors[name]`, setting error messages, and configuring invalid states.

## Decision

1. **High-Level Prop-Driven Convenience Wrappers**:
   Form primitives (`TextField`, `PasswordField`, `SelectField`) prioritize concise prop-driven authoring:
   - Direct props for common elements: `label`, `prefix` (leading icon/content), `suffix` (trailing icon/action), `description`, `errorMessage`, `isInvalid`, `isRequired`.
   - Internal automatic layout: Prefix and suffix icons are placed into HeroUI `InputGroup` (`InputGroupPrefix`/`InputGroupSuffix`) with perfectly calculated padding, focus rings, and dark mode states.
2. **Dual-Mode Compound Access**:
   When complex or non-standard form layouts are required, sub-parts remain accessible via dot-notation namespaces (e.g. `TextField.Root`, `TextField.Group`, `TextField.Prefix`, `TextField.Suffix`, `TextField.Input`, `TextField.Label`, `TextField.Error`).
3. **React Hook Form Context Auto-Wiring**:
   - When rendered inside a React Hook Form `<FormProvider>` and given a `name` (or `fieldId`) prop, form primitives automatically extract registration, field errors, and validation states from `useFormContext()`.
   - When used outside a form provider or without a `name` prop, components function seamlessly as standard standalone/controlled inputs.
4. **Canonical `PasswordField`**:
   Promote `AuthPasswordField` to a system-wide primitive `@/components/ui/password-field.tsx` with built-in visibility toggle, `excludeFromTabOrder` for the eye toggle, and full Form Context support.

## Consequences

- Cuts form template code across authentication and transaction dialogs by up to 70%.
- Eliminates manual pixel-nudging (`pl-10`, `pr-10`, `absolute inset-y-0`) and prevents visual regressions.
- Ensures all form fields share identical error states (`intent="error"`), focus rings, and typography.
- Maintains 100% compliance with zero-warning quality gates and ADR-0009 boundary enforcement.
