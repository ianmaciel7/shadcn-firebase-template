# Form Architecture & Context Standards

This document establishes the architecture standards for forms across the application, specifically regarding React Hook Form, shadcn primitives, and form context propagation.

## Core Directives

1. **Composite Forms Must Use `FormProvider`**:
   - Any multi-field form orchestrator component (`*-form.tsx`) using `react-hook-form` must wrap its form content in `<FormProvider {...form}>` (or shadcn's `<Form {...form}>`).
   - This eliminates prop drilling of form instances, `register`, `control`, `errors`, and other form state methods into subcomponents.

2. **Child Field Sections Consume `useFormContext`**:
   - Subcomponents grouping fields (e.g., `*-fields.tsx`) or individual field components (e.g., `*-field.tsx`) must obtain form state through `useFormContext<FormValues>()` rather than receiving the form state object or form methods as props.
   - Props for subcomponents should only receive behavior flags or presentation props (e.g., `isBusy?: boolean`, `className?: string`, or non-form domain objects like `user`).

3. **Field Primitives & Accessibility**:
   - Form controls must use the primitives from `@/components/ui/field`: `<Field>`, `<FieldLabel>`, `<FieldError>`, and `<FieldGroup>`.
   - Any controlled input or component wrapped in `<Controller>` or consuming `fieldState` must reflect validation status to `<Field>` using `data-invalid={Boolean(fieldState.error)}` or `data-invalid={Boolean(errors.fieldName)}`.
   - Never use the Next.js `<Form>` (`next/form`) for client-driven Firebase SDK actions (e.g., client authentication, Firestore/Storage uploads), as `next/form` is designed for Server Actions and GET search navigations.

## Automated Verification

- Enforcement is performed automatically via the ast-grep structural rule:
  - `require-form-provider`: Ensures composite form orchestrators (`*-form.tsx`) wrap `<form>` in `<FormProvider>` or `<Form>`.
  - `require-field-data-invalid`: Ensures `<Field>` elements bind `data-invalid`.
- Verify with `pnpm check:structure`.
