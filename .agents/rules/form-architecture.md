# Form Architecture & Context Standards

These are project conventions aligned with the current shadcn/ui and React Hook Form documentation, not universal framework requirements.

## Compound forms

- A composite form that renders nested field components (as with `ProfileForm`) creates exactly one `useForm` instance, wraps its content in `FormProvider {...form}` and uses `form.handleSubmit(onSubmit)`.
- Child fields access `control` with `useFormContext<ProfileValues>()`; they compose shadcn/ui `Field`, `FieldLabel`, `Input` / `Select`, and `FieldError` with React Hook Form `Controller`.
- Match each independently named `*-field.tsx` to its literal React Hook Form `Controller name`. For example `name="displayName"` is implemented by `ProfileDisplayNameField`, while the label may simply read "Name".
- A reusable form can accept strongly typed `UseFormProps<Values>`, but
  never pass DOM attributes or `onSubmit` into `useForm`: they are not
  `UseFormProps` options. The current `ProfileFormClient` receives only
  DOM form props, while `useProfileFormClient` owns `useForm` options and
  the submit callback.
- A screen/controller owns asynchronous data loading; only mount a form with prepared defaults or deliberately use RHF `values` / `reset` to synchronize subsequent changes. After successful client Firebase mutations, reset the form to the persisted values without clobbering unsaved edits.
- Avatar file selection and preview remain a separate field, since `File` / `FileList` need application-level lifecycle handling.
- The profile follows native shadcn/ui composition: `ProfileCard` is a
  thin `Card` adapter forwarding primitive props and children, without
  loading data. `ProfileSectionClient` composes `ProfileCard` with
  `ProfileFormClient`, Card header/content/footer, and Form content/footer.
  `ProfileFormClientContent` provides one `FieldGroup` with the avatar,
  display name, email, locale, and theme fields as direct children.
  `ProfileFormClient` owns `FormProvider` and one native `<form>`;
  the form uses `--card-spacing` to preserve the Card layout.
- UI primitives already provided by shadcn/ui (`FieldGroup`, `FieldSet`, `FieldLegend`) are preferable to splitting basic fields into arbitrary grouping components without a semantic responsibility.

## Profile behavior ownership

- `useProfileStatus` returns a discriminated `status`:
  `loading`, `hidden`, `error` (with `message`), or `ready` (with
  `userId`). The section renders those branches without redundant
  `isLoading`, `isHidden`, or `isError` flags.
- `useProfileController` is removed. `ProfileSectionClient` uses
  `useProfileSectionClient` to compose session and status hooks with
  translations; it does not assemble field or button props.
- `ProfileFormClient` delegates its React Hook Form lifecycle to
  `useProfileFormClient`, which calls `useProfileSubmit` for persistence.
  Read `formState.isSubmitting` instead of keeping a second saving flag;
  `ProfileValues` and `ProfileFormValues` live in `src/lib/profile.ts`.
  `saveProfile` accepts typed `ProfileDependencies` with default Firebase
  adapters to test persistence without production services.
- `ProfileAvatarFieldClient` uses `useProfileAvatarFieldClient` for field state and avatar display data, with `useProfileAvatar` handling validation and preview. Only the selected `File` lives in React Hook Form so submission can upload it; preview URLs are released on replacement, successful reset and unmount. Failed saves retain the selection for retry.
- `ProfileFormClientContent` and `ProfileFormClientFooter` are colocated
  exports in `profile-form-client.tsx`; AST safety checks inspect each
  function independently. The content owns the **one** `FieldGroup`:
  do not wrap the individual profile fields in another `FieldGroup`.

## Profile form action safety (repository guard)

- `ProfileCard` renders one native shadcn `Card` as its sole root and forwards arbitrary children; `ProfileSection` composes the header/content/footer, renders loading/error states, and shares loaded session data through `ProfileSessionContext`. `ProfileForm` owns the only native HTML `<form>` inside the Card under `FormProvider` and must not render another Card.
- `ProfileCardHeader`, `ProfileCardTitle`, `ProfileCardDescription`, `ProfileCardContent` and `ProfileCardFooter` are defined together in `profile-card.tsx`, forwarding their native primitives and children. `ProfileCardContent` owns `CardContent`; `ProfileFormContent` owns **only** `FieldGroup`. `ProfileCardFooter` owns the single native `CardFooter`; `ProfileFormFooter` owns only the actions layout (`div`), avoiding nested CardFooter components. Both remain inside the same `ProfileForm`/native `<form>`.
- `ProfileSaveButton` is the only form action and must force `type="submit"`.
- Spread caller attributes **before** fixed `type` and computed `disabled`, so even if a caller supplies a conflicting `type` the component enforces its intended action. A late `...props` may silently override both safeguards. The separate AST guard also disallows explicit `type` overrides at profile call sites.
- `pnpm check:components` enforces these concrete profile invariants through TypeScript AST tests. This is a **UI action-safety guard**, not a substitute for Firebase security rules, authorization or server-side validation.

## Accessibility and Next.js

- For `Controller`-bound fields, set `data-invalid={fieldState.invalid}` on `Field`, `aria-invalid={fieldState.invalid}` on the input or Select trigger, and show `FieldError` for errors. Associate `FieldLabel` with the control.
- Preserve the `"use client"` entry boundary for the Firebase client-side workflow. Imported field files need no additional directive solely because they are imported by this client subtree.
- Do not replace the Firebase SDK submit handler with `next/form`, which serves different navigation/Server Action use cases.

## Repository verification

- `pnpm check:structure` applies `require-form-provider` to owned `*-form.tsx`, `*-form-client.tsx`, and `*-form-server.tsx` files; here forms with nested fields intentionally use a Provider. This is a *repository guard*, not an official shadcn/ui requirement for every form.
- `pnpm check:components` validates a matching family root and related named parts, filename semantics and literal Controller-name-to-field-name matching, plus the profile controller prop boundary.

## Native primitive audit

The profile components were compared with all maintained UI component modules under `src/components/ui` (excluding story/test fixtures), including `card.tsx`, `field.tsx`, `input.tsx`, `select.tsx`, `avatar.tsx`, `button.tsx` and the compound patterns used by `dialog.tsx`, `item.tsx` and `tabs.tsx`.

- Keep application-owned components in private `_components/`, importing rather than modifying the registry.
- Preserve native slots: `ProfileCard`, `ProfileCardHeader`, `ProfileCardTitle`, `ProfileCardDescription`, `ProfileCardContent` and `ProfileCardFooter` are exported together from `profile-card.tsx`, following the compound-component layout of the native `card.tsx`. Each forwards the props/children of its matching `Card` primitive. `ProfileSection` composes the content; `ProfileForm` adds `data-slot="profile-form"` and uses `gap-(--card-spacing)` to preserve spacing.
- Follow `ComponentProps<typeof Primitive>`, native children, `cn()` overrides and named exports for component adapters.
- Use `useId()` for reusable field label/control pairs; do not hard-code duplicate `id` values when a profile form might mount more than once.
- Keep `type="submit"` fixed after props spreads. This is an explicit repository convention, not a mandatory official shadcn file structure.

## Primary sources

- [shadcn/ui React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form)
- [shadcn/ui Field](https://ui.shadcn.com/docs/components/field)
- [React Hook Form useForm](https://react-hook-form.com/docs/useform)
- [React Hook Form FormProvider](https://react-hook-form.com/docs/formprovider)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

## Direct parent relationships

The JSX guard requires the immediate parent chain, not merely a matching ancestor. Card header/content/footer are direct children of `ProfileForm`; the form is a direct child of `ProfileCard`. Title/description are direct header children, form content is a direct CardContent child, and form footer is a direct CardFooter child. Action buttons are direct form-footer children. An extra element wrapper at any of these boundaries fails the guard because it changes the intended sibling/slot layout.
