# Component Architecture and Naming

These are **repository conventions**, not filename rules prescribed by Next.js or shadcn/ui.

## Three independent dimensions

| Dimension | Convention | Examples |
| --- | --- | --- |
| Runtime | Server by default; `"use client"` on a client module boundary, not in its name | `ProfileCard` may be a Client Component |
| Responsibility | Describe the composition or behavior, not its runtime | `ProfileCard`, `ProfileForm`, `ProfileAvatarField`, `SignOutButton`, `AuthProvider`, `ProtectedGate`, `SignInAuthFlow` |
| Placement | Colocate route components in private `_components/`, hooks in `_hooks/` and shared components in `src/components/` | App Router private folders do not become routes |

The shadcn primitives live under `src/components/ui/`; Firebase registry output
lives under `src/components/firebase/`; generated AI Elements live under
`src/components/ai-elements/`. Those folders are vendor-owned and excluded
from application naming checks. Application-owned extensions under
`src/components/ui/extensions/` **are** checked.

## Component file contracts

- Use `kebab-case.tsx` and a matching PascalCase named export for ordinary components. The compound `profile-card.tsx` is the **narrow exception**: it declares and exports `ProfileCard`, `ProfileCardHeader`, `ProfileCardTitle`, `ProfileCardDescription` and `ProfileCardContent` together, as `card.tsx` does. Other owned components retain a single export. Do not use `export default` or `export function` in owned reusable components.
- Use `ProfileCardProps` for props of `ProfileCard`; inherit React/HTML
  component props according to the existing component-props rule.
- Prefer semantic roles: `*-field`, `*-fields`, `*-form`, `*-card`,
  `*-dialog`, `*-header`, `*-button`, `*-table`, `*-list`, `*-provider`,
  `*-gate`, `*-flow`, or `*-content`. This is **not** a closed list.
  `Flow` specifically denotes navigation or application flow wiring.
- Prohibit generic runtime/implementation suffixes: `-client`,
  `-server`, `-component`, `-ui`. The Next.js `"use client"` directive
  defines the actual client boundary, including transitive imports.
  Components inside the client graph do not each need their own directive.
- Server Components can fetch data and render Client Components; only
  browser-interactive entrypoints need explicit client boundaries.
  A `"use client"` module must not directly import server-only APIs
  (`next/headers`, `next/cache`, `next/server`, `next-intl/server`,
  `server-only` or `firebase-admin`). These are provable errors;
  the guard does not attempt to infer the complete transitive import graph.
- Next.js `page.tsx`, `layout.tsx` and `template.tsx` use their mandatory
  framework exports and remain outside this naming guard. The separate
  `pnpm check:routes` enforces our thin-route architecture policy.

## CI enforcement

`pnpm check:components` runs self-tests and validates all owned
`src/app/**/_components/**/*.tsx` and `src/components/**/*.tsx` files,
except generated registry trees and test/story files. It is included in
`verify:fast` and `verify:static`, making it mandatory in CI.

## Official references

- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js use client directive](https://nextjs.org/docs/app/api-reference/directives/use-client)
- [Next.js private folders/project structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [shadcn/ui components.json](https://ui.shadcn.com/docs/components-json)
- [shadcn/ui Card composition](https://ui.shadcn.com/docs/components/base/card)

## Composition matching local shadcn/ui primitives

Use `src/components/ui/card.tsx`, `button.tsx` and `field.tsx` as reference implementations for application-owned components:

- Use a local named function followed by an explicit named export. Prefer `ComponentProps<typeof Primitive>` or `ComponentProps<"element">` for wrappers that forward standard element props. Specialized third-party component contracts (such as `UseFormProps`) are also valid when that is the real component API.
- Forward applicable `className` and `...props` to the underlying component; use `cn(..., className)` for application-specific styles. Do not blindly spread HTML attributes into `useForm`.
- Use `children` for genuine component composition, as in `Card` and `FieldGroup`. A compound `ProfileForm` can accept independently declared field components via `children` and provide `FormProvider` context.
- Keep application-owned Card adapters **composable**: `ProfileCard`, `ProfileCardHeader`, `ProfileCardTitle`, `ProfileCardDescription` and `ProfileCardContent` each forward native Card primitive props and `children`; `ProfileSection` assembles data-backed form content and handles loading/error states. `ProfileFormContent` provides `FieldGroup`, not a second `CardContent`. The form content/footer remain children of the same native `<form>`. Do not confuse an application view that renders a Card with a Card primitive wrapper.
- Fields connected via `Controller name="displayName"` must use the semantically matching component/file name `ProfileDisplayNameField` / `profile-display-name-field.tsx`. The component may expose a friendly display label without renaming the Firebase field.
- Prefer narrow component props; do not hand `ProfileForm`, `ProfileAvatarField` or `SignOutButton` the entire profile controller as a `profile` prop.
- `FieldGroup`, `FieldSet`, `Field` and `Controller` are real primitives/API integrations; do not introduce arbitrary *Fields wrapper components solely for visual grouping.
- The single-primary-export-per-file convention is project-specific and now has one explicitly guarded compound exception for `profile-card.tsx`. Upstream shadcn/ui files also export related primitives together; generated registries remain unchanged.

The TypeScript AST guard checks literal Controller names against owned `*-field.tsx` filenames and prevents whole-controller `profile` props on the profile components listed above. These checks cannot judge all component responsibilities and do not inspect dynamic Controller names.

References: [shadcn/ui Field](https://ui.shadcn.com/docs/components/field), [shadcn/ui React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form), [React Hook Form FormProvider](https://react-hook-form.com/docs/formprovider).
