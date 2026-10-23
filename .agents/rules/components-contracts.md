# Component Architecture and Naming: Dimensions and File Contracts

These are **repository conventions**, not filename rules prescribed by Next.js or shadcn/ui.
This rule covers component contracts; see also [Component Composition, Hooks, and Enforcement](components-composition.md).

## Three independent dimensions

| Dimension | Convention | Examples |
| --- | --- | --- |
| Runtime | Import graphs determine membership; `"use client"` declares a boundary, while a shared module can compile in both graphs | `ProfileCard` may participate in a client subtree without its own directive |
| Responsibility | Describe the composition or behavior, not its runtime | `ProfileCard`, `ProfileFormClient`, `ProfileAvatarFieldClient`, `AuthProviderClient`, `ProtectedGateClient`, `SignInAuthFlowClient` |
| Placement | Colocate route components in private `_components/`, hooks in `_hooks/` and shared components in `src/components/ui/extensions/` | App Router private folders do not become routes |

The shadcn primitives live under `src/components/ui/`; Firebase registry output
lives under `src/components/firebase/`; generated AI Elements live under
`src/components/ai-elements/`. Those folders are vendor-owned and excluded
from application naming checks. Application-owned extensions under
`src/components/ui/extensions/` **are** checked.

## Component file contracts

- Use `kebab-case.tsx` and a matching PascalCase family root. Every owned component module may also export related parts prefixed by the root name, such as `AccountCardHeader` in `account-card.tsx`. Declare each as a local named function and export the parts together. Simple components retain one export. The profile Card and Form families have additional exact-part safety checks. Do not use `export default` or `export function` in owned reusable components.
- Component value exports must preserve the local function name. Aliases such as `OtherCard as AccountCard` and component re-exports cannot satisfy the filename contract, even when an unused matching local function exists. Type-only exports are exempt.
- Use `ProfileCardProps` for props of `ProfileCard`; inherit React/HTML
  component props according to the existing component-props rule.
- Prefer semantic roles: `*-field`, `*-fields`, `*-form`, `*-card`,
  `*-dialog`, `*-header`, `*-button`, `*-table`, `*-list`, `*-provider`,
  `*-gate`, `*-flow`, `*-hero`, `*-section`, or `*-content`. This is **not** a closed list.
  `Flow` specifically denotes navigation or application flow wiring.
- Do not name route-private components after screen or page terms (`-page`, `-screen`, `-view`);
  name by semantic role. Prohibit generic implementation terms (`View`, `Screen`, `Presentation`) in component identifiers.
- Reserve `-client.tsx` for browser integrations and `-server.tsx` for server
  integrations. Presentation components keep no suffix, including interactive
  presentation that declares `"use client"`. Owned component exports and
  props types must match their complete filename stem, including `Client`
  or `Server`. The checker no longer defines a legacy semantic suffix
  exception. For example, `HomeSectionClient` uses
  `HomeSectionClientProps` in `home-section-client.tsx`.
- Integrations own application data, persistence, authentication, navigation or
  platform access, directly or through focused hooks/helpers. Examples include
  Firebase, browser storage, object URLs, theme persistence and external fetches.
  React state, Effects, events, React Hook Form context, translations, or the
  presence/name of a custom hook alone do not justify an integration suffix.
- Browser integration entrypoints declare `"use client"`; server integration
  entrypoints import `"server-only"`. Interactive presentation also uses client
  boundaries where required. Unsuffixed does not mean server-compatible.
  Do not use `"use server"` to classify ordinary Server Components.
  Prohibit generic implementation suffixes `-component`, `-ui`, and `-presentation`.
- Server Components can fetch data and render Client Components; only
  browser-interactive entrypoints need explicit client boundaries.
  A `"use client"` module must not directly import server-only APIs
  (`next/headers`, `next/cache`, `next/server`, `next-intl/server`,
  `server-only` or `firebase-admin`). These are provable errors;
  the guard does not attempt to infer the complete transitive import graph.
- Next.js `page.tsx`, `layout.tsx` and `template.tsx` use their mandatory
  framework exports and remain outside this naming guard. The separate
  `pnpm check:routes` enforces our thin-route architecture policy.

### Exact filename stem and component term parity (`checkStemComponentTermParity`)

Owned component files enforce exact 1:1 term parity between the filename
stem and component identifiers:

- **Term-for-term matching**: The kebab-case filename stem and PascalCase component identifiers are tokenized into semantic terms (e.g., `home-section-client` -> `["home", "section", "client"]`). Every term present in the filename stem must exist in the component name, and no extraneous terms may appear.
- **No missing terms**: Declaring a component that drops terms from the filename (such as declaring `HomeSection` in `home-section-client.tsx`, which omits `Client`) triggers an error: `missing term(s): "client"`.
- **No unexpected terms**: Declaring a component with terms absent from the filename (such as `HomeViewClient` or `HomeSectionViewClient` in `home-section-client.tsx`) triggers an error: `unexpected term(s): "view"`.
- **Reference implementation (`HomeSectionClient`)**: `src/app/_components/home-section-client.tsx` enforces exact 1:1 term parity:
  - Component declaration and named export: `HomeSectionClient`
  - Prop type declaration: `HomeSectionClientProps` (`HomeSectionProps` is rejected)
  - Hook coordination: `useHomeSectionClient` in `src/app/_hooks/use-home-section-client.ts` (`useHomeSection` is rejected)
- **Profile example:** `profile-form-client.tsx` exports
  `ProfileFormClient`, with compound parts sharing the same root. This
  naming contract supersedes only the semantic export naming aspect of ADR
  0016; integration versus presentation placement remains unchanged. See
  [ADR 0017](../../docs/adr/0017-enforce-exact-component-export-names.md).

Simple presentation hooks such as `useId`, `useTranslations`, and React Hook
Form's `useFormContext` and `useWatch` may be called directly in a field.
Multiple presentation hooks are permitted. Do not create component-specific
wrappers solely to group these calls; reserve application hooks for stateful
behavior, effects, and data coordination.

## CI enforcement

`pnpm check:components` runs self-tests and validates all owned
`src/app/**/_components/**/*.tsx` and `src/components/**/*.tsx` files,
except generated registry trees and test/story files. It is included in
`verify:fast` and `verify:static`, making it mandatory in CI.

Integration checks follow static runtime imports/re-exports through local `.ts`
hooks/helpers (`@/` and relative imports), with cycle protection. They stop at
component imports: composing an integration child does not classify its parent.
Type-only imports, React UI hooks, React Hook Form and client directives alone
are not integration evidence. Known evidence includes Firebase, next-themes,
browser navigation hooks (including `useParams`), browser globals/object URLs, fetch calls, server APIs,
Node built-ins (both bare and `node:` imports) and explicit `client-only`/`server-only` markers. Fetch is classified
using the owning component boundary, not whether its URL is external.

The guard requires matching suffixes and boundaries for recognized integrations
and rejects `-client` on presentation-only modules. Unknown browser SDKs can use
`client-only` in their adapter to declare the dependency explicitly. This is a
conservative module-level syntax check, not symbol-level data-flow analysis.
Dynamic imports, computed browser access, aliases of globals, third-party SDK
internals and hooks implemented in `.tsx` require manual review. Next.js remains
responsible for the complete Server/Client graph. Native boundary checks,
exact term parity (`checkStemComponentTermParity`), and existing composition/form/field guards remain active.

## Official references

- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js use client directive](https://nextjs.org/docs/app/api-reference/directives/use-client)
- [Next.js private folders/project structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [shadcn/ui components.json](https://ui.shadcn.com/docs/components-json)
- [shadcn/ui Card composition](https://ui.shadcn.com/docs/components/base/card)



