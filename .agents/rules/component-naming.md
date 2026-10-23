# Component Architecture and Naming

These are **repository conventions**, not filename rules prescribed by Next.js or shadcn/ui.

## Three independent dimensions

| Dimension | Convention | Examples |
| --- | --- | --- |
| Runtime | Import graphs determine membership; `"use client"` declares a boundary, while a shared module can compile in both graphs | `ProfileCard` may participate in a client subtree without its own directive |
| Responsibility | Describe the composition or behavior, not its runtime | `ProfileCard`, `ProfileForm`, `ProfileAvatarFieldClient`, `AuthProvider`, `ProtectedGate`, `SignInAuthFlow` |
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
  presentation that declares `"use client"`. Existing legacy integration files
  in `LEGACY_SEMANTIC_STEM_ALLOWLIST` keep semantic exports and prop types
  unchanged (such as `ProfileForm` and `ProfileFormProps` in `profile-form-client.tsx`),
  whereas new and modernized integration components enforce exact 1:1 term parity
  (such as `HomeSectionClient` and `HomeSectionClientProps` in `home-section-client.tsx`).
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

Owned component files outside the legacy allowlist enforce exact 1:1 term parity between the filename stem and component identifiers:

- **Term-for-term matching**: The kebab-case filename stem and PascalCase component identifiers are tokenized into semantic terms (e.g., `home-section-client` -> `["home", "section", "client"]`). Every term present in the filename stem must exist in the component name, and no extraneous terms may appear.
- **No missing terms**: Declaring a component that drops terms from the filename (such as declaring `HomeSection` in `home-section-client.tsx`, which omits `Client`) triggers an error: `missing term(s): "client"`.
- **No unexpected terms**: Declaring a component with terms absent from the filename (such as `HomeViewClient` or `HomeSectionViewClient` in `home-section-client.tsx`) triggers an error: `unexpected term(s): "view"`.
- **Reference implementation (`HomeSectionClient`)**: `src/app/_components/home-section-client.tsx` enforces exact 1:1 term parity:
  - Component declaration and named export: `HomeSectionClient`
  - Prop type declaration: `HomeSectionClientProps` (`HomeSectionProps` is rejected)
  - Hook coordination: `useHomeSectionClient` in `src/app/_hooks/use-home-section-client.ts` (`useHomeSection` is rejected)
- **Legacy allowlist (`LEGACY_SEMANTIC_STEM_ALLOWLIST`)**: Existing legacy integration components (such as `profile-form-client.tsx` exporting `ProfileForm`) maintain their semantic unsuffixed exports for backward compatibility. All new and modernized components enforce exact 1:1 term parity.

Simple presentation hooks such as `useId`, `useTranslations`, and React Hook
Form's `useFormContext` and `useWatch` may be called directly in a field component.
Do not create component-specific wrapper hooks solely to group these calls.
Keep custom hooks for reusable stateful behavior, effects, and data coordination.

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

## Composition matching local shadcn/ui primitives

Use `src/components/ui/card.tsx`, `button.tsx` and `field.tsx` as reference implementations for application-owned components:

- Use a local named function followed by an explicit named export. Prefer `ComponentProps<typeof Primitive>` or `ComponentProps<"element">` for wrappers that forward standard element props. Specialized third-party component contracts (such as `UseFormProps`) are also valid when that is the real component API.
- Forward applicable `className` and `...props` to the underlying component; use `cn(..., className)` for application-specific styles. Do not blindly spread HTML attributes into `useForm`.
- Use `children` for genuine component composition, as in `Card` and `FieldGroup`. A compound `ProfileForm` can accept independently declared field components via `children` and provide `FormProvider` context.
- Keep application-owned Card adapters **composable**: `ProfileCard`, `ProfileCardHeader`, `ProfileCardTitle`, `ProfileCardDescription` and `ProfileCardContent` each forward native Card primitive props and `children`; `ProfileSection` assembles data-backed form content and handles loading/error states. `ProfileFormContent` provides `FieldGroup`, not a second `CardContent`. The form content/footer remain children of the same native `<form>`. Do not confuse an application view that renders a Card with a Card primitive wrapper.
- Fields connected via `Controller name="displayName"` must use the semantically matching component/file name `ProfileDisplayNameField` / `profile-display-name-field.tsx`. The component may expose a friendly display label without renaming the Firebase field.
- Prefer narrow component props; do not hand `ProfileForm` or `ProfileAvatarFieldClient` the entire profile controller as a `profile` prop.
- `FieldGroup`, `FieldSet`, `Field` and `Controller` are real primitives/API integrations; do not introduce arbitrary *Fields wrapper components solely for visual grouping.
- The family-root and root-prefixed-part convention applies to every owned module, including Server and Client Components. The profile Card and Form retain exact-part guards on top of the general contract. Upstream shadcn/ui files also export related primitives together; generated registries remain unchanged.

The TypeScript AST guard checks literal Controller names against owned `*-field.tsx` filenames and prevents whole-controller `profile` props on the profile components listed above. These checks cannot judge all component responsibilities and do not inspect dynamic Controller names.

References: [shadcn/ui Field](https://ui.shadcn.com/docs/components/field), [shadcn/ui React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form), [React Hook Form FormProvider](https://react-hook-form.com/docs/formprovider).

## Component behavior and custom hooks

Owned components keep rendering, translations, primitive prop forwarding and simple UI composition. Place stateful effects, Firebase operations and asynchronous workflow handlers in responsibility-specific custom hooks. Focused hooks compose inside the component-named orchestration hook described below; do not restore a single controller that owns every field and action.

- Expose discriminated status states for session components (`loading`, `hidden`, `error`, `ready`). Components render `state.status` and an already resolved error message, rather than deriving readiness from user, authentication and preferences flags.
- Keep responsibilities local: `useProfileStatus` derives session status, `useProfileForm` coordinates form lifecycle, and `useProfileAvatarFieldClient` prepares avatar data. Auth provider, gate, navigation button and auth flow navigation have separate hooks.
- `check:components` rejects React state/effect imports (including aliases), namespace state/effect calls, Firebase value imports, async workflow functions, compound `if` conditions/derived locals and error fallbacks inside owned component functions. Async Server Components, simple discriminated-state branches, translations, form context and presentation props such as `disabled={disabled || pending}` remain valid.
- The guard checks syntax, not arbitrary semantic equivalence or the ideal number of hooks. Generated Firebase/UI registries and Next.js special files retain their existing scope exclusions. Module-level setup is outside component branch analysis.

### Component-named orchestration hooks

A component that uses behavior/context hooks or coordinates multiple hooks must call a single imported `use<ComponentName>` hook in a separate hook module. For example, `ProfileSection` calls `useProfileSection`, which composes `useProfileSession`, `useProfileStatus` and translations internally. `ProfileAvatarFieldClient`, `ProfileSaveButton`, profile fields and auth flows follow the same naming rule. Their hooks may compose focused hooks; this does not restore a global controller.

`check:components` verifies the called hook's canonical imported name (including aliased imports), rejects extra hook calls alongside it, and rejects missing imports. Components with no hooks and components using only one presentation hook (`useTranslations`, `useFormatter` or `useId`) do not require a boilerplate wrapper. This rule applies to all owned component functions; existing vendor and route-entrypoint exclusions remain. `HomeSectionClient` strictly enforces this pattern by delegating orchestration exclusively to `useHomeSectionClient` in `src/app/_hooks/use-home-section-client.ts`; attempting to call `useHomeSection` or other mismatched hook identifiers is rejected by `check:components`.

### Banned generic naming terms

Do not use `View` or `Screen` as words in owned component, hook, type, variable, parameter, import-binding or file names. Use the responsibility instead (`ProfileSection`, `useProfileSection`, `useProfileStatus`, `AuthContent`, `AuthFlow`). `useProfileStatus` replaces `useProfileView`; profile rendering consumes `state.status`.

`check:components` scans owned `.ts` and `.tsx` files throughout `src`, including hooks and library modules. CamelCase, kebab-case and numbered words are checked, so `AccountScreenState`, `AccountScreen2` and `use-account-view.ts` fail; unrelated words such as `Viewport` and `preview` remain valid. Generated registries and test/story files retain their exclusions. Preserve external API export names, but alias their local bindings (`SignInAuthScreen as SignInAuthContent`).

Export aliases, named function/class expressions, enums and type parameters also follow this policy. Re-export external names with a semantic public alias (`AccountScreen as AccountContent`); exporting `AccountContent as AccountScreen` is prohibited. Comments and string content are outside this naming check.

## General composition contract

[CODING_STANDARDS.md](../../CODING_STANDARDS.md#compound-components-and-serverclient-boundaries)
owns the explanation, examples, and Server/Client distinctions for all owned
components. [Guard coverage](../../CODING_STANDARDS.md#composition-guard-coverage)
defines the automatically enforced subset and its limitations. A module without
`"use client"` may still belong to a client import graph. Presentation modules
keep unsuffixed names, whether interactive or compatible with both environments.
Integration responsibilities determine suffixes; directives determine boundaries.
Do not invent parts for simple components. Compound parts use separate named
exports instead of static properties on the root function.

## Owned component placement

Place shared application components in `src/components/ui/extensions/` and
route-private components in `src/app/**/_components/`. For example,
`LoadingIndicator` belongs alongside `Loading` in `ui/extensions` because both
route components and Firebase UI consume it. Do not create parallel application
component folders such as `src/components/loading/`.

`pnpm check:components` rejects JavaScript and TypeScript source files (including
colocated tests and barrel files) outside the `ui`, `firebase`, and `ai-elements`
registry trees under `src/components`. Existing registry trees remain allowed;
their generated source retains its existing exclusions. This is repository
policy, not a Next.js requirement.
