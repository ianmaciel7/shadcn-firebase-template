# Form Architecture & Context Standards

These are project conventions aligned with the current shadcn/ui and React Hook Form documentation, not universal framework requirements.

## Compound forms

- A composite form that renders nested field components (as with `ProfileForm`) creates exactly one `useForm` instance, wraps its content in `FormProvider {...form}` and uses `form.handleSubmit(onSubmit)`.
- Child fields access `control` with `useFormContext<ProfileValues>()`; they compose shadcn/ui `Field`, `FieldLabel`, `Input` / `Select`, and `FieldError` with React Hook Form `Controller`.
- Match each independently named `*-field.tsx` to its literal React Hook Form `Controller name`. For example `name="displayName"` is implemented by `ProfileDisplayNameField`, while the label may simply read "Name".
- A parent may pass a strongly typed set of `formProps` via spread to the composed form. The form extracts `onSubmit`, `children`, and presentation attributes **before** forwarding only `UseFormProps<ProfileValues>` to `useForm`. `onSubmit` is an application component prop, **not** a `UseFormProps` option.
- A screen/controller owns asynchronous data loading; only mount a form with prepared defaults or deliberately use RHF `values` / `reset` to synchronize subsequent changes. After successful client Firebase mutations, reset the form to the persisted values without clobbering unsaved edits.
- Avatar file selection and preview remain a separate field, since `File` / `FileList` need application-level lifecycle handling. Sign-out is an independent `type="button"` action; if placed within the form for a shared card footer, it must not trigger submit.
- The profile follows a shadcn-style composition: `ProfileCard` owns the native `Card` root, accepts `ComponentProps<typeof Card>` (including `size`) and forwards `className`/HTML props to the Card. `ProfileForm` owns `FormProvider` and the native HTML `<form>` inside that Card. It composes native `CardHeader`, `ProfileFormContent` (`CardContent` + `FieldGroup`) and `ProfileFormFooter` (`CardFooter`), with both field content and footer inside the single form. Its flex layout preserves the Card spacing variable `--card-spacing`.
- UI primitives already provided by shadcn/ui (`FieldGroup`, `FieldSet`, `FieldLegend`) are preferable to splitting basic fields into arbitrary grouping components without a semantic responsibility.

## Profile form action safety (repository guard)

- `ProfileCard` renders the native shadcn `Card` as the outer container (including loading/error states); `ProfileForm` owns the only native HTML `<form>` inside it under `FormProvider`, and must not render another Card.
- `ProfileFormContent` provides `CardContent` + `FieldGroup`; `ProfileFormFooter` provides `CardFooter`. Both remain children of `ProfileForm` (and its native `<form>`) inside `ProfileCard`.
- `ProfileButton` is the only submit action and must force `type="submit"`. `SignOutButton` must force `type="button"` so sign-out never triggers profile persistence.
- Spread caller attributes **before** fixed `type` and computed `disabled`, so even if a caller supplies a conflicting `type` the component enforces its intended action. A late `...props` may silently override both safeguards. The separate AST guard also disallows explicit `type` overrides at profile call sites.
- `pnpm check:components` enforces these concrete profile invariants through TypeScript AST tests. This is a **UI action-safety guard**, not a substitute for Firebase security rules, authorization or server-side validation.

## Accessibility and Next.js

- For `Controller`-bound fields, set `data-invalid={fieldState.invalid}` on `Field`, `aria-invalid={fieldState.invalid}` on the input or Select trigger, and show `FieldError` for errors. Associate `FieldLabel` with the control.
- Preserve the `"use client"` entry boundary for the Firebase client-side workflow. Imported field files need no additional directive solely because they are imported by this client subtree.
- Do not replace the Firebase SDK submit handler with `next/form`, which serves different navigation/Server Action use cases.

## Repository verification

- `pnpm check:structure` applies `require-form-provider` to owned `*-form.tsx` files; here forms with nested fields intentionally use a Provider. This is a *repository guard*, not an official shadcn/ui requirement for every form.
- `pnpm check:components` validates single primary named export, filename semantics and literal Controller-name-to-field-name matching, plus the profile controller prop boundary.

## Native primitive audit

The profile components were compared with all maintained UI component modules under `src/components/ui` (excluding story/test fixtures), including `card.tsx`, `field.tsx`, `input.tsx`, `select.tsx`, `avatar.tsx`, `button.tsx` and the compound patterns used by `dialog.tsx`, `item.tsx` and `tabs.tsx`.

- Keep application-owned components in private `_components/`, importing rather than modifying the registry.
- Preserve native slots: `Card`, `CardHeader`, `CardContent`, and `CardFooter` come from the registry. `ProfileCard` is the Card wrapper with native `size`/className/HTML props; `ProfileForm` adds `data-slot="profile-form"` and a flex column with `gap-(--card-spacing)` to retain Card section spacing.
- Follow `ComponentProps<typeof Primitive>`, native children, `cn()` overrides and named exports for component adapters.
- Use `useId()` for reusable field label/control pairs; do not hard-code duplicate `id` values when a profile form might mount more than once.
- Keep `type="submit"` and `type="button"` fixed after props spreads. These are explicit repository conventions, not mandatory official shadcn file structure.

## Primary sources

- [shadcn/ui React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form)
- [shadcn/ui Field](https://ui.shadcn.com/docs/components/field)
- [React Hook Form useForm](https://react-hook-form.com/docs/useform)
- [React Hook Form FormProvider](https://react-hook-form.com/docs/formprovider)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
