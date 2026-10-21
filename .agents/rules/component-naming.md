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

- Use `kebab-case.tsx` and one matching PascalCase named export:
  `profile-card.tsx` defines `function ProfileCard()` and
  `export { ProfileCard }`. Do not use `export default` or
  `export function` in owned reusable components.
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
