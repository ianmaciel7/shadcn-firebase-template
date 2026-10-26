# Consolidated Agent Rules

<!-- cspell:words preinit Pipeable unobserve Rects -->

This document consolidates all persistent agent rules from `.agents/rules/` into a single authoritative reference.
Each section preserves the original guardrails, conventions, and architectural boundaries governing agent behavior across this repository.

## Table of Contents

1. [Architectural Boundary and Rule Index](#1-architectural-boundary-and-rule-index)
2. [ADR Naming and Immutability](#2-adr-naming-and-immutability)
3. [Component Architecture: Dimensions and File Contracts](#3-component-architecture-dimensions-and-file-contracts)
4. [Component Architecture: Composition, Hooks, and Enforcement](#4-component-architecture-composition-hooks-and-enforcement)
5. [Data Layer Module Conventions](#5-data-layer-module-conventions)
6. [Form Architecture and Context Standards](#6-form-architecture-and-context-standards)
7. [Language Policy](#7-language-policy)
8. [Next.js Maintenance](#8-nextjs-maintenance)
9. [React Core: Hooks, Component Primitives, and Core APIs](#9-react-core-hooks-component-primitives-and-core-apis)
10. [React DOM: DOM, Forms, and Server Architecture](#10-react-dom-dom-forms-and-server-architecture)
11. [React Quality: Compiler, Lint, and Review](#11-react-quality-compiler-lint-and-review)
12. [Next.js Route Special Files Logic](#12-nextjs-route-special-files-logic)
13. [Serena External-Research Memory](#13-serena-external-research-memory)
14. [shadcn/ui Maintenance](#14-shadcnui-maintenance)

---

## 1. Architectural Boundary and Rule Index

### Architectural boundary: `.agents/rules/` vs `docs/`

- **`.agents/rules/` (Behavioral constraints for agents)**:
  - Contains **prescriptive, enforce-everywhere agent guardrails and constraints**.
  - Dictates *how agents must behave, write, and verify code* across the codebase (e.g. naming, file limits, thin routes, language, framework patterns).
  - Kept concise and machine-actionable to conserve prompt context.
- **`docs/` (Human and domain documentation & system operations)**:
  - Contains **descriptive reference documentation, operational guides, and history**.
  - Maps system architecture ([`docs/README.md`](../../docs/README.md)), verification ownership ([`docs/quality.md`](../../docs/quality.md)), operational services ([`docs/observability.md`](../../docs/observability.md)), immutable decisions ([`docs/adr/`](../../docs/adr/)), upstream inventories ([`docs/agents/`](../../docs/agents/)), and review snapshots ([`docs/reviews/`](../../docs/reviews/)).
  - Intended for human engineers, onboarding, production operations, and authoritative reference.

### Rule Catalog

| Topic | Rule Section | Scope |
| --- | --- | --- |
| ADRs | [ADR Naming and Immutability](#2-adr-naming-and-immutability) | ADR naming and immutability |
| Components | [Component Architecture: Dimensions and File Contracts](#3-component-architecture-dimensions-and-file-contracts) | Dimensions, file contracts, term parity, CI enforcement |
| Composition | [Component Architecture: Composition, Hooks, and Enforcement](#4-component-architecture-composition-hooks-and-enforcement) | shadcn/ui composition, orchestration hooks, banned terms, placement |
| Data layer | [Data Layer Module Conventions](#5-data-layer-module-conventions) | Data modules, DAL, auth, dependency injection |
| Forms | [Form Architecture and Context Standards](#6-form-architecture-and-context-standards) | Compound forms and React Hook Form conventions |
| Language | [Language Policy](#7-language-policy) | Documentation and comments language |
| Next.js | [Next.js Maintenance](#8-nextjs-maintenance) | Version-matched docs and framework ownership |
| React | [React Core: Hooks, Component Primitives, and Core APIs](#9-react-core-hooks-component-primitives-and-core-apis) | Hooks, built-in components, core APIs, identity |
| React DOM | [React DOM: DOM, Forms, and Server Architecture](#10-react-dom-dom-forms-and-server-architecture) | React DOM, forms and Actions, Server Components, Fragment refs |
| React quality | [React Quality: Compiler, Lint, and Review](#11-react-quality-compiler-lint-and-review) | Compiler, Rules of React, lint, legacy APIs, checklist |
| Routes | [Next.js Route Special Files Logic](#12-nextjs-route-special-files-logic) | Thin route entrypoints |
| Serena | [Serena External-Research Memory](#13-serena-external-research-memory) | Cache-first external research and durable memory policy |
| shadcn/ui | [shadcn/ui Maintenance](#14-shadcnui-maintenance) | shadcn/ui maintenance workflow |

See also [README.md](../README.md) and [AGENTS.md](../../AGENTS.md).

---

## 2. ADR Naming and Immutability

Apply this rule when creating an Architecture Decision Record in `docs/adr/`.

- Name each new record `NNNN-<imperative-verb-phrase>.md`.
- Use the next unused four-digit decimal number for `NNNN`. Even though this
  repository is a template, its accepted records still preserve history. Do
  not renumber, rename, consolidate, or rewrite an accepted ADR.
- Use lowercase ASCII kebab case for the phrase. Make it a concise,
  present-tense imperative that describes the implementation stage, for example
  `0006-configure-database-migrations.md` or
  `0007-document-api-versioning.md`.
- Use the heading `# ADR NNNN: <Sentence-case imperative phrase>` inside the
  record.
- Treat accepted ADRs as historical records. When an architectural decision
  changes, add a new ADR describing the context, decision, consequences, and
  superseded scope. Update `docs/adr/README.md`; keep current operational
  details in the canonical guides. A documentation correction or upstream
  reference review does not by itself establish a new architectural decision.

This convention applies to every current and future ADR. The original five ADR
filenames were migrated to this convention on 2026-10-16 at the repository
maintainer's direction.

---

## 3. Component Architecture: Dimensions and File Contracts

These are **repository conventions**, not filename rules prescribed by Next.js or shadcn/ui.
This section covers component dimensions and file contracts; see also [Component Architecture: Composition, Hooks, and Enforcement](#4-component-architecture-composition-hooks-and-enforcement).

### Three independent dimensions

| Dimension | Convention | Examples |
| --- | --- | --- |
| Runtime | Import graphs determine membership; `"use client"` declares a boundary, while a shared module can compile in both graphs | `ProfileCard` may participate in a client subtree without its own directive |
| Responsibility | Describe the composition or behavior, not its runtime | `ProfileCard`, `ProfileFormClient`, `ProfileAvatarFieldClient`, `AuthProviderClient`, `ProtectedGuardClient`, `SignInAuthFlowClient` |
| Placement | Colocate route components in private `_components/`, hooks in `_hooks/` and shared components in `src/components/ui/extensions/` | App Router private folders do not become routes |

The shadcn primitives live under `src/components/ui/`; Firebase registry output
lives under `src/components/firebase/`; generated AI Elements live under
`src/components/ai-elements/`. That copied registry source is locally maintained and adaptable, and excluded
from application naming checks; this exclusion preserves upstream API shapes
and does not transfer maintenance ownership to vendors. Application-owned extensions under
`src/components/ui/extensions/` **are** checked.

### Component file contracts

- Use `kebab-case.tsx` and a matching PascalCase family root. Every owned component module may also export related parts prefixed by the root name, such as `AccountCardHeader` in `account-card.tsx`. Declare each as a local named function and export the parts together. Simple components retain one export. The profile Card and Form families have additional exact-part safety checks. Do not use `export default` or `export function` in owned reusable components.
- Component value exports must preserve the local function name. Aliases such as `OtherCard as AccountCard` and component re-exports cannot satisfy the filename contract, even when an unused matching local function exists. Type-only exports are exempt.
- Use `ProfileCardProps` for props of `ProfileCard`; inherit React/HTML
  component props according to the existing component-props rule.
- Prefer semantic roles: `*-field`, `*-fields`, `*-form`, `*-card`,
  `*-dialog`, `*-header`, `*-button`, `*-table`, `*-list`, `*-provider`,
  `*-guard`, `*-flow`, `*-hero`, `*-section`, or `*-content`. This is **not** a closed list.
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
  A helper module that imports `"server-only"` may use the Firebase SDK
  (`FirebaseServerApp`) without making the Server Component that calls it a
  browser integration.
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
  naming contract enforces exact filename-stem parity while preserving integration
  versus presentation placement. See
  [ADR 0005](../../docs/adr/0005-document-project-standards.md).

Simple presentation hooks such as `useId`, `useTranslations`, and React Hook
Form's `useFormContext` and `useWatch` may be called directly in a field.
Multiple presentation hooks are permitted. Do not create component-specific
wrappers solely to group these calls; reserve application hooks for stateful
behavior, effects, and data coordination.

### CI enforcement

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

### Official references

- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) (`node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`)
- [Next.js use client directive](https://nextjs.org/docs/app/api-reference/directives/use-client) (`node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md`)
- [Next.js private folders/project structure](https://nextjs.org/docs/app/getting-started/project-structure) (`node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`)
- [shadcn/ui components.json](https://ui.shadcn.com/docs/components-json)
- [shadcn/ui Card composition](https://ui.shadcn.com/docs/components/base/card)

---

## 4. Component Architecture: Composition, Hooks, and Enforcement

These are **repository conventions**, not filename rules prescribed by Next.js or shadcn/ui.
This section covers component composition, hooks, and enforcement; see also [Component Architecture: Dimensions and File Contracts](#3-component-architecture-dimensions-and-file-contracts).

### Composition matching local shadcn/ui primitives

Use `src/components/ui/card.tsx`, `button.tsx` and `field.tsx` as reference implementations for application-owned components:

- Use a local named function followed by an explicit named export. Prefer `ComponentProps<typeof Primitive>` or `ComponentProps<"element">` for wrappers that forward standard element props. Specialized third-party component contracts (such as `UseFormProps`) are also valid when that is the real component API.
- Forward applicable `className` and `...props` to the underlying component; use `cn(..., className)` for application-specific styles. Do not blindly spread HTML attributes into `useForm`.
- Use `children` for genuine component composition, as in `Card` and `FieldGroup`. The compound `ProfileFormClient` accepts independent fields as
  `children` under one `FormProvider` context.
- Keep application-owned Card adapters **composable**: `ProfileCard`, `ProfileCardHeader`, `ProfileCardTitle`, `ProfileCardDescription` and `ProfileCardContent` each forward native Card primitive props and `children`; `ProfileSectionClient` assembles data-backed form content and renders
  status branches. `ProfileFormClientContent` provides exactly one
  `FieldGroup`, not a second `CardContent` or nested field group. The form content/footer remain children of the same native `<form>`. Do not confuse an application view that renders a Card with a Card primitive wrapper.
- Fields connected via `Controller name="displayName"` must use the semantically matching component/file name `ProfileDisplayNameField` / `profile-display-name-field.tsx`. The component may expose a friendly display label without renaming the Firebase field.
- Prefer narrow component props; do not hand `ProfileFormClient` or `ProfileAvatarFieldClient` the
  entire profile controller as a `profile` prop.
- `FieldGroup`, `FieldSet`, `Field` and `Controller` are real primitives/API integrations; do not introduce arbitrary *Fields wrapper components solely for visual grouping.
- The family-root and root-prefixed-part convention applies to every owned module, including Server and Client Components. The profile Card and Form retain exact-part guards on top of the general contract. Upstream shadcn/ui files also export related primitives together; generated registries remain unchanged.

The TypeScript AST guard checks literal Controller names against owned `*-field.tsx` filenames and prevents whole-controller `profile` props on the profile components listed above. These checks cannot judge all component responsibilities and do not inspect dynamic Controller names.

References: [shadcn/ui Field](https://ui.shadcn.com/docs/components/field), [shadcn/ui React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form), [React Hook Form FormProvider](https://react-hook-form.com/docs/formprovider).

### Component behavior and custom hooks

Owned components keep rendering, translations, primitive prop forwarding and simple UI composition. Place stateful effects, Firebase operations and asynchronous workflow handlers in responsibility-specific custom hooks. Focused hooks compose inside the component-named orchestration hook described below; do not restore a single controller that owns every field and action.

- Expose explicit session flags (`isLoading`, `isHidden`, `isError`) and an
  already resolved error message. Components render the applicable flag rather
  than deriving readiness from user, authentication and preferences flags.
- Keep responsibilities local: `useProfileStatus` derives the profile session
  flags; `useProfileFormClient` owns the React Hook Form lifecycle
  and uses `formState.isSubmitting` rather than a parallel saving flag;
  `useProfileAvatarFieldClient` handles avatar field data. Do not mirror
  derived state in additional `useState` variables.
- `check:components` rejects React state/effect imports (including aliases), namespace state/effect calls, Firebase value imports, async workflow functions, compound `if` conditions/derived locals and error fallbacks inside owned component functions. Async Server Components, simple discriminated-state branches, translations, form context and presentation props such as `disabled={disabled || pending}` remain valid.
- The guard checks syntax, not arbitrary semantic equivalence or the ideal number of hooks. Generated Firebase/UI registries and Next.js special files retain their existing scope exclusions. Module-level setup is outside component branch analysis.

### Component-named orchestration hooks

A component coordinating application behavior must use the imported
`use<ComponentName>` hook in a separate module. For example,
`ProfileSectionClient` calls `useProfileSectionClient`, which composes
`useProfileSession`, `useProfileStatus`, and translations, and resolves
conditional properties (such as `userId`) so component JSX remains free of
inline `in` operator guards or ternary expressions. Stateful avatar
fields, save actions, and auth flows use focused hooks; simple display name,
email, locale, and theme fields do **not** need one-line wrappers around
standard hooks. This is a stricter project policy, not a React rule.

`check:components` checks the imported orchestration hook's canonical name,
including aliased imports, and rejects unrelated application orchestration
hooks alongside it. Any number of supported presentation hooks
(`useId`, `useTranslations`, `useFormatter`, `useFormContext`,
`useWatch`) may be used directly without a wrapper, including alongside
the one named application hook. The current AST implementation recognizes
specific syntax; it is not a proof of all React hook semantics. Scope
exclusions still apply. For example, `HomeSectionClient` delegates
application orchestration to `useHomeSectionClient`.

### Banned generic naming terms

Do not use `View` or `Screen` as words in owned component, hook, type, variable, parameter, import-binding or file names. Use the responsibility instead (`ProfileSectionClient`, `useProfileSectionClient`, `useProfileStatus`, `AuthContent`, `AuthFlow`). `useProfileStatus` replaces generic view-state naming; profile rendering consumes `state.status`.

`check:components` scans owned `.ts` and `.tsx` files throughout `src`, including hooks and library modules. CamelCase, kebab-case and numbered words are checked, so `AccountScreenState`, `AccountScreen2` and `use-account-view.ts` fail; unrelated words such as `Viewport` and `preview` remain valid. Generated registries and test/story files retain their exclusions. Preserve external API export names, but alias their local bindings (`SignInAuthScreen as SignInAuthContent`).

Export aliases, named function/class expressions, enums and type parameters also follow this policy. Re-export external names with a semantic public alias (`AccountScreen as AccountContent`); exporting `AccountContent as AccountScreen` is prohibited. Comments and string content are outside this naming check.

### General composition contract

[CODING_STANDARDS.md](../../CODING_STANDARDS.md#compound-components-and-serverclient-boundaries)
owns the explanation, examples, and Server/Client distinctions for all owned
components. [Guard coverage](../../CODING_STANDARDS.md#composition-guard-coverage)
defines the automatically enforced subset and its limitations. A module without
`"use client"` may still belong to a client import graph. Presentation modules
keep unsuffixed names, whether interactive or compatible with both environments.
Integration responsibilities determine suffixes; directives determine boundaries.
Do not invent parts for simple components. Compound parts use separate named
exports instead of static properties on the root function.

### Owned component placement

Place shared application components in `src/components/ui/extensions/` and
route-private components in `src/app/**/_components/`. For example,
`LabeledSpinner` belongs in `ui/extensions` because both
route components and Firebase UI consume it. Do not create parallel application
component folders such as `src/components/loading/`.

`pnpm check:components` rejects JavaScript and TypeScript source files (including
colocated tests and barrel files) outside the `ui`, `firebase`, and `ai-elements`
registry trees under `src/components`. Existing registry trees remain allowed;
their generated source retains its existing exclusions. This is repository
policy, not a Next.js requirement.

### Private hook module support declarations

Route-private `_hooks/**/*.ts` and `.tsx` modules contain hook implementations,
imports, exports and types. Move module-level support functions and values to
that route's `_lib/`: this includes constants, lookup collections and React
context objects. A filename starting with `use-` does not make helpers inside
that module part of the hook. `getAvatarSource` and avatar limits live in
`profile/_lib/avatar.ts`; the session context object lives in
`profile/_lib/profile-session-context.ts`.

The hook itself may be a named `useX` function declaration or a `useX` variable
initialized directly with an arrow/function expression. Local constants,
handlers, closures and lifecycle callbacks inside the hook remain valid. Do not
move code that depends on hook-local state merely to satisfy a module-level rule.

The blocking ast-grep rules `no-module-support-in-hooks-ts` and `-tsx` run in
`check:structure`, already included in fast/static verification. They inspect
top-level declarations, including exported declarations, and intentionally exclude
test/spec/story files and directories outside App Router private `_hooks`.
Type declarations and imports are allowed. This is project architecture policy,
not a React rule, a purity analysis, or proof that every `useX` function is a hook.
Wrapped factory initializers are not accepted as direct hook declarations.

### Main hooks and focused sub-hooks

Keep a component's main hook as an orchestrator over focused sub-hooks. Separate
independent initialization, subscriptions/navigation, locale synchronization,
preference loading and successful save feedback into their actual responsibility
owners. Keep derived render values in the main hook where appropriate; do not
move a pure helper into a new hook solely to reduce a function's metric.

The native budgets, exclusions and verified examples are owned by
[Coding standards](../../CODING_STANDARDS.md#owned-function-complexity-and-hook-responsibility-trees).
Biome enforces cognitive complexity, function size and callback nesting on both
orchestrators and their support modules. Those syntactic budgets do not establish
that a function has a single responsibility; review its dependencies and lifecycle
as well. Preserve cancellation, stale-result checks and authorization checks at
asynchronous boundaries during refactoring.

For every hook change, inventory the affected responsibility tree and validate all
owned hook directories and support modules. Do not finish with only the named
example or a changed-file lint result. Run the full Biome source/configured project
scan and the private hook structure rules; CI already uses these complete scopes.
Include existing hooks, new sub-hooks and shared hooks in the check. Preserve the
documented registry exclusions, and report global blockers separately from a
passing complexity scan. Main-hook cohesion and lifecycle ownership still need
manual review beyond the numeric checks.

---

## 5. Data Layer Module Conventions

This section establishes the architectural responsibilities and naming conventions for data access and domain data transfer files across the application.

### Core module responsibilities

When structuring data modeling, access control, and persistence operations, organize code into the following designated files:

| File | Primary Responsibility | Scope & Typical Contents |
| --- | --- | --- |
| `definitions.ts` | **Types, contracts, and schemas** | TypeScript `type` and `interface` definitions, data contracts, and schema validation objects (e.g., Zod schemas) that represent domain models or data shapes. |
| `dto.ts` | **Select and structure transferred data** | Data Transfer Object (DTO) transformers, mappers, and projection functions that sanitize, shape, or format data crossing system or client/server boundaries. |
| `dal.ts` | **Protected data access** | Data Access Layer (DAL) ensuring authorization, permission verification, context validation, and boundary protection before delegating to queries or mutations. |
| `data.ts` | **Data queries and operations** | Low-level queries, persistence interactions, database/SDK operations, and mutation logic. |
| `auth.ts` | **User authentication** | Authentication operations and credential verification ("Who are you?"), user sign-up, sign-in, credential validation, password recovery, and sign-out. |
| `session.ts` | **Session lifecycle & state** | Session management ("Are you authenticated and what is your active session?"), token signing/verification, session storage/cookies, and session persistence. |

### Architectural guidelines

Authentication helpers remain flat modules under `src/lib`: use `auth.ts`,
`session.ts`, and `return-url.ts`. Do not create `src/lib/auth/` for these
modules; `auth.ts` owns authentication operations, `session.ts` owns the
active Firebase session, and `return-url.ts` owns safe post-auth navigation.

1. **Separation of Concerns**:
   - `dal.ts` acts as the security and authorization boundary. Direct client or route calls must pass through the DAL rather than calling `data.ts` directly when sensitive or protected access is involved.
   - `data.ts` focuses strictly on query execution or storage mechanisms without mixing in routing, UI logic, or presentation-level concerns.
   - `dto.ts` ensures internal persistence schemas are not leaked directly to untrusted contexts, projecting and stripping sensitive or internal fields.
   - `definitions.ts` serves as the contract and single source of truth for shapes and validation rules, consumed by `dto.ts`, `dal.ts`, and `data.ts`.
   - `auth.ts` encapsulates authentication operations (login, registration, password recovery, sign-out) to answer user identity challenges.
   - `session.ts` governs session state, expiration, tokens, and cookie persistence, decoupled from specific credential checks or presentation forms.

2. **Locality and Placement**:
   - Keep pure domain types, constants, and guards in dedicated flat modules under `src/lib/` (e.g., `src/lib/role.ts`, `src/lib/locale.ts`, `src/lib/theme.ts`).
   - Keep `src/lib/firebase/` scoped to Firebase SDK initialization and server token verification (`client.ts`, `server.ts`, `admin.ts`, `config.ts`). Do not place route-specific Firestore or Storage operations under `src/lib/firebase/`.
   - For route-private or feature-colocated data access and server route guards, place modules in private `_lib/` folders (e.g., `src/app/(protected)/_lib/require-protected-access.ts`, `src/app/(protected)/profile/_lib/data.ts`). Colocate both reads (such as `readProfile` and `readUserPreferences`) and mutations (`saveProfile`, `writeUserPreferences`) in `_lib/data.ts` rather than splitting async reads into a separate `_lib/defaults.ts` file. Enforced by `pnpm check:components` (`inspectLibPlacement`).

3. **`data.ts` Method Naming, Size, and Complexity Budgets**:
   - **Method naming convention**: Every exported function in a `data.ts` module must start with an explicit camelCase operation verb followed by a PascalCase domain noun:
     - **Reads / Queries**: `read<Noun>`, `get<Noun>`, `list<Noun>`, `fetch<Noun>`, `verify<Noun>` (e.g., `readUserPreferences`, `readProfile`).
     - **Writes / Mutations**: `write<Noun>`, `save<Noun>`, `create<Noun>`, `update<Noun>`, `set<Noun>`, `upload<Noun>`, `delete<Noun>`, `remove<Noun>` (e.g., `writeUserPreferences`, `saveProfile`).
   - **Per-function budgets (Biome native)**: Every function in `data.ts` (exported or internal helper) must respect the repository's strict runtime complexity budgets enforced by Biome:
     - **Cognitive complexity**: maximum **8** (`noExcessiveCognitiveComplexity`).
     - **Function body size**: maximum **40 lines** excluding blank lines (`noExcessiveLinesPerFunction`).
     - **Callback nesting depth**: maximum **2** (`noExcessiveNestedCallbacks`).
   - **Per-file size budget**: A `data.ts` module must not exceed **150 non-empty lines** (`inspectDataModuleConventions` in `pnpm check:components`). Decompose pure transformations or unrelated domain operations into focused `_lib/` helpers when approaching this limit.

### Dependency injection and auth subscriptions

- Inject service dependencies at operation boundaries, as in
  `src/app/(protected)/profile/_lib/data.ts`, so logic can be tested independently of
  Firebase. Do not pass service containers through presentational fields.
- A Firebase Auth Effect subscription does not suspend automatically. Retain a tested loading branch instead of inventing a Promise wrapper.

### Route-private support modules

`_lib/` also owns route-private non-hook support declarations, not just persistence
operations. Use descriptive modules such as `avatar.ts` for avatar URL selection
and upload limits, and `profile-session-context.ts` for the shared context object.
Do not place these helpers in hook modules or force them into `data.ts` merely
because they are under `_lib`. Keep actual hooks in `_hooks`; a type-only reference
to a hook return type does not execute that hook or create a runtime dependency.
Enforcement scope is documented in [Component Architecture: Composition, Hooks, and Enforcement](#private-hook-module-support-declarations).

### Official references

- [Next.js data security and DAL](https://nextjs.org/docs/app/guides/data-security) (`node_modules/next/dist/docs/01-app/02-guides/data-security.md`)
- [Next.js authentication](https://nextjs.org/docs/app/guides/authentication) (`node_modules/next/dist/docs/01-app/02-guides/authentication.md`)
- [Next.js fetching data](https://nextjs.org/docs/app/getting-started/fetching-data) (`node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md`)
- [Next.js mutating data](https://nextjs.org/docs/app/getting-started/mutating-data) (`node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`)

---

## 6. Form Architecture and Context Standards

These are project conventions aligned with the current shadcn/ui and React Hook Form documentation, not universal framework requirements.

### Compound forms

- A composite form with nested field components (as with `ProfileFormClient`) uses exactly one `useForm` instance, wraps its content in `FormProvider {...form}`, and submits through `form.handleSubmit(onSubmit)`.
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

### Profile behavior ownership

- `useProfileStatus` returns `isLoading`, `isHidden`, and `isError` flags,
  plus resolved `message` and `userId` payloads. The section renders the
  applicable branch from these flags without completing error messages itself.
- `useProfileController` is removed. `ProfileSectionClient` uses
  `useProfileSectionClient` to compose session and status hooks with
  translations; it does not assemble field or button props.
- `ProfileFormClient` delegates its React Hook Form lifecycle to
  `useProfileFormClient`, which calls `useProfileSubmit` for persistence.
  Read `formState.isSubmitting` instead of keeping a second saving flag;
  `ProfileValues` and `ProfileFormValues` live in
  `src/app/(protected)/profile/_lib/definitions.ts`; persistence lives in the sibling
  `data.ts` module.
  `saveProfile` accepts typed `ProfileDependencies` with default Firebase
  adapters to test persistence without production services.
- `ProfileAvatarFieldClient` uses `useProfileAvatarFieldClient` for field state and avatar display data, with `useProfileAvatar` handling validation and preview. Only the selected `File` lives in React Hook Form so submission can upload it; preview URLs are released on replacement, successful reset and unmount. Failed saves retain the selection for retry.
- `ProfileFormClientContent` and `ProfileFormClientFooter` are colocated
  exports in `profile-form-client.tsx`; AST safety checks inspect each
  function independently. The content owns the **one** `FieldGroup`:
  do not wrap the individual profile fields in another `FieldGroup`.

### Profile form action safety (repository guard)

- `ProfileCard` renders one native shadcn `Card` as its sole root and
  forwards children and applicable primitive props. `ProfileSectionClient`
  composes its header, content, and footer, renders the discriminated status,
  and shares loaded session data through `ProfileSessionContext`.
  `ProfileFormClient` owns the only HTML `<form>` inside the Card under
  `FormProvider`; do not render a second Card.
- `ProfileCardHeader`, `ProfileCardTitle`, `ProfileCardDescription`,
  `ProfileCardContent`, and `ProfileCardFooter` share
  `profile-card.tsx` and forward their native primitive props.
  `ProfileCardContent` owns `CardContent`; `ProfileFormClientContent`
  owns the **only** `FieldGroup`. `ProfileCardFooter` owns the one
  native `CardFooter`; `ProfileFormClientFooter` owns only the action
  layout. Both are inside the same native form from `ProfileFormClient`.
- `ProfileSaveButton` is the only form action and must force `type="submit"`.
- Spread caller attributes **before** fixed `type` and computed `disabled`, so even if a caller supplies a conflicting `type` the component enforces its intended action. A late `...props` may silently override both safeguards. The separate AST guard also disallows explicit `type` overrides at profile call sites.
- `pnpm check:components` enforces these concrete profile invariants through TypeScript AST tests. This is a **UI action-safety guard**, not a substitute for Firebase security rules, authorization or server-side validation.

### Accessibility and Next.js

- For `Controller`-bound fields, set `data-invalid={fieldState.invalid}` on `Field`, `aria-invalid={fieldState.invalid}` on the input or Select trigger, and show `FieldError` for errors. Associate `FieldLabel` with the control.
- Preserve the `"use client"` entry boundary for the Firebase client-side workflow. Imported field files need no additional directive solely because they are imported by this client subtree.
- Do not replace the Firebase SDK submit handler with `next/form`, which serves different navigation/Server Action use cases.

### Repository verification

- `pnpm check:structure` applies `require-form-provider` to owned `*-form.tsx`, `*-form-client.tsx`, and `*-form-server.tsx` files; here forms with nested fields intentionally use a Provider. This is a *repository guard*, not an official shadcn/ui requirement for every form.
- `pnpm check:components` validates a matching family root and related named parts, filename semantics and literal Controller-name-to-field-name matching, plus the profile controller prop boundary.

### Native primitive audit

The profile components were compared with all maintained UI component modules under `src/components/ui` (excluding story/test fixtures), including `card.tsx`, `field.tsx`, `input.tsx`, `select.tsx`, `avatar.tsx`, `button.tsx` and the compound patterns used by `dialog.tsx`, `item.tsx` and `tabs.tsx`.

- Keep application-owned components in private `_components/`, importing rather than modifying the registry.
- Preserve native slots: `ProfileCard`, `ProfileCardHeader`,
  `ProfileCardTitle`, `ProfileCardDescription`, `ProfileCardContent`,
  and `ProfileCardFooter` are exported together from
  `profile-card.tsx`. `ProfileSectionClient` composes the content;
  `ProfileFormClient` adds `data-slot="profile-form"` and uses
  `gap-(--card-spacing)` for spacing.
- Follow `ComponentProps<typeof Primitive>`, native children, `cn()` overrides and named exports for component adapters.
- Use `useId()` for reusable field label/control pairs; do not hard-code duplicate `id` values when a profile form might mount more than once.
- Keep `type="submit"` fixed after props spreads. This is an explicit repository convention, not a mandatory official shadcn file structure.

### Direct parent relationships

The JSX guard requires the immediate parent chain, not just an ancestor.
Card header/content/footer are direct children of `ProfileFormClient`,
which is a direct child of `ProfileCard`. Title and description are
direct header children; Form content is directly in Card content, and Form
footer is directly in Card footer. Action buttons are direct Form footer
children. Additional wrappers at these boundaries fail the guard because
they change the intended slot layout.

### React Form Actions are not a migration

Preserve the React Hook Form and Firebase profile architecture. The React `<form action>` example in the [React reference](../../docs/agents/react.md#user-supplied-react-1931-reference) is explanatory, not a request to migrate. Preserve controlled and React Hook Form-owned values when using `requestFormReset`.

### Official references

- [shadcn/ui React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form)
- [shadcn/ui Field](https://ui.shadcn.com/docs/components/field)
- [React Hook Form useForm](https://react-hook-form.com/docs/useform)
- [React Hook Form FormProvider](https://react-hook-form.com/docs/formprovider)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) (`node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`)
- [Next.js Form component](https://nextjs.org/docs/app/api-reference/components/form) (`node_modules/next/dist/docs/01-app/03-api-reference/02-components/form.md`)

---

## 7. Language Policy

Write all source code, code comments, documentation, commit messages, and
agent-facing artifacts in English by default.

Use another language only when the user explicitly requests it or when the
content is intentionally localized. The locale message catalogs under
`src/messages/` are a permitted exception and must use the language of their
respective locale.

`pnpm check:english` enforces this rule in `verify:fast`, `verify:static`, the
lint-staged pre-commit step, and the `commit-msg` hook.
Intentional non-English lines outside `src/messages/` carry a
`check-english-ignore` marker with a reason.

---

## 8. Next.js Maintenance

This project uses Next.js 16.4.2 App Router with Cache Components and Partial
Prefetching. Read the relevant installed `node_modules/next/dist/docs/` guide
before implementation, then consult the immutable
[complete source review](../../docs/agents/nextjs.md). Current canary documents
are references until the installed version supports their APIs.

- Keep rendering and cache rules in
  [CODING_STANDARDS.md](../../CODING_STANDARDS.md#nextjs-request-data-and-caching),
  implemented boundaries in [ARCHITECTURE.md](../../ARCHITECTURE.md#nextjs-rendering-and-cache-model),
  and diagnostic/command ownership in
  [TOOLING.md](../../TOOLING.md#nextjs-documentation-and-cli-workflow).
- Use native Next.js, TypeScript, and Biome diagnostics first. Check the
  existing rule registry before adding custom guards; document scope and test
  invalid and valid cases for a new project policy.
- Preserve the stricter [thin-route policy](#12-nextjs-route-special-files-logic),
  [component contracts](#3-component-architecture-dimensions-and-file-contracts), cookie-driven unprefixed locale
  architecture, Firebase authorization boundary, and generated-source exclusions.
  Read [the current locale decision](../../ARCHITECTURE.md#internationalization)
  before i18n changes: [ADR 0004](../../docs/adr/0004-configure-internationalization.md)
  requires direct cookie-only locale resolution. Internal locale rewrites
  do not satisfy the maintainer's cookie-only requirement.
- Apply [security guidance](../../SECURITY.md#nextjs-server-and-environment-boundaries)
  when introducing server data, cache scopes, environment values, or endpoints.
  Syntax guards are not authorization or complete import-graph proofs.
- Do not turn an upstream recipe into an automatic dependency, runtime,
  provider, agent-skill, or hosting migration. Preserve accepted ADRs and local
  changes. Follow the [verification strategy](../../TESTING.md#nextjs-documentation-and-framework-verification)
  and report unavailable tools accurately.
- Next.js owns application roots, hydration, compilation and partial prerendering; do not replace them with isolated React DOM recipes. React `cache()` does not establish Next.js cache invalidation policy.

### Official references

- [Next.js documentation index](https://nextjs.org/docs) (`node_modules/next/dist/docs/index.md`)
- [Next.js App Router index](https://nextjs.org/docs/app) (`node_modules/next/dist/docs/01-app/index.md`)
- [Next.js caching](https://nextjs.org/docs/app/getting-started/caching) (`node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`)
- [Next.js revalidating](https://nextjs.org/docs/app/getting-started/revalidating) (`node_modules/next/dist/docs/01-app/01-getting-started/09-revalidating.md`)
- [Next.js adopting Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching) (`node_modules/next/dist/docs/01-app/02-guides/adopting-partial-prefetching.md`)
- [Next.js migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components) (`node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`)
- [Next.js internationalization](https://nextjs.org/docs/app/guides/internationalization) (`node_modules/next/dist/docs/01-app/02-guides/internationalization.md`)

---

## 9. React Core: Hooks, Component Primitives, and Core APIs

Apply this rule to React implementation, review, and reference maintenance.
Read the [detailed reference and examples](../../docs/agents/react.md#user-supplied-react-1931-reference)
for full explanations, 15 examples, API tables, and evidence boundaries.

Keep the broader [coding standards](../../CODING_STANDARDS.md#react-rendering-hooks-and-identity),
[component policy](#3-component-architecture-dimensions-and-file-contracts), [route policy](#12-nextjs-route-special-files-logic),
and [form contract](#6-form-architecture-and-context-standards) in force. Those local conventions can
be stricter than React itself.

Model UI phases with explicit flags such as `isLoading`, `isHidden`, and
`isError`. Keep phase payloads nullable when unavailable, and avoid deriving
flags from duplicated local state.
Presentation-only hooks may be composed directly; do not add single-line
wrappers just to satisfy a naming heuristic. An asynchronous subscription Effect
does not suspend automatically; retain a tested loading branch instead of
inventing an ad-hoc Promise wrapper.

### 1. Overview and supported versions

Use installed React/React DOM 19.3.1 and Compiler 1.0.0 as the baseline. Verify
the owning package, installed types, framework integration, and build pipeline
before adopting an API from live documentation.

The reference describes 18 ordinary stable hooks from `react` plus
`useFormStatus` from `react-dom`, six built-in components, ten other modern
React APIs, and eight legacy React APIs. Treat those as catalog counts. They
exclude the resource API `use`, deprecated/unstable hooks, custom hooks,
HTML/SVG elements, and renderer entry points. Do not turn the counts into a
claim about every export or an obligation to use every feature.

### 2. Hooks

Ordinary hooks must be called unconditionally at the top level of a component
or custom hook, before early returns. Do not call them in handlers, loops,
conditions, or ordinary utility functions. `use` has the separate exception in
section 4. Apply these purpose-specific rules to all 19 hooks:

| Hook | Required implementation/review guidance |
| --- | --- |
| `useState` | Prefer it for independent local state; use pure functional updaters for changes based on the previous value. |
| `useReducer` | Use a pure reducer for related transitions; return a new state rather than mutating the previous one. |
| `useContext` | Consume an intentional shared context; do not move every local value into Context or use it as authorization. |
| `useActionState` | Model the Action result and pending state; handle validation/failure and preserve the Action's calling contract. |
| `useOptimistic` | Base temporary feedback on confirmed state and an in-flight Action; provide failure recovery. |
| `useEffect` | Synchronize with an external system; declare dependencies, clean up, and invalidate obsolete async work. Do not use it to mirror derived values or event-handler work. |
| `useLayoutEffect` | Reserve it for measurement/positioning that must precede repaint; prefer `useEffect` otherwise. |
| `useInsertionEffect` | Reserve it for style-library insertion needs, not ordinary application data flow. |
| `useEffectEvent` | Call Effect Events only in their supported local Effect logic; do not use them to hide dependencies or as ordinary handlers. |
| `useRef` | Store DOM references or mutable non-rendering values; do not expect writes to trigger a render. |
| `useImperativeHandle` | Expose a small intentional imperative API, such as focus/reset, while preserving ref and cleanup contracts. |
| `useMemo` | Memoize only an expensive calculation or a justified identity contract; never rely on it for correctness or resource lifetime. |
| `useCallback` | Stabilize callbacks only when a concrete consumer/integration needs that identity. |
| `useTransition` | Mark controlled updates as non-urgent and show pending feedback; keep text-input state urgent. |
| `useDeferredValue` | Defer expensive consumers of an incoming value when the original update is outside their control. |
| `useId` | Associate labels, fields, and descriptions; never generate list keys with it. |
| `useDebugValue` | Supply useful custom-hook diagnostics for DevTools; it does not hold application state. |
| `useSyncExternalStore` | Use a stable subscription and unchanged snapshots; preserve server/hydration snapshot agreement. |
| `useFormStatus` | Import from `react-dom` and call in a descendant of the form being observed. |

Prefer derived values during render to duplicated state plus an Effect. Pair
subscriptions, listeners, timers, observers, object URLs, and connections with
cleanup. Handle a resource that resolves after cleanup by releasing it rather
than attaching it to an obsolete component. A `useEffect` invocation is not
guaranteed always to happen after paint.

`useTransition` controls the update and returns pending state;
`useDeferredValue` defers a consumer's value. Neither supplies debounce,
throttling, cancellation, request ordering, or Web Worker parallelism. Keep
post-`await` state updates inside another transition when required by the
current API. Profile before adding manual memoization.

### 3. Built-in components

| Component | Required implementation/review guidance |
| --- | --- |
| `Fragment` | Group nodes without extra DOM; use explicit `Fragment` syntax for keys/refs where needed. |
| `StrictMode` | Use development diagnostics to find impure rendering and asymmetric resource setup/cleanup; do not interpret extra development cycles as production transactions. |
| `Suspense` | Use a compatible suspended resource or `lazy` component; an arbitrary Effect fetch does not activate it. Provide separate render-error handling. |
| `Profiler` | Use real render measurements to investigate performance; a configuration check is not a profiling session. |
| `Activity` | Preserve hidden state/DOM while allowing Effect teardown and restart; verify hide/reveal behavior for forms, media, subscriptions, and focus. |
| `ViewTransition` | Coordinate supported updates and `enter`, `exit`, `update`, `share`, and `default` behavior; verify browser support, reduced motion, and fallback presentation. |

Do not replace Error Boundaries with Suspense, Activity, or animation wrappers.
The detailed reference includes lazy loading, preserved-tab state, and visual
transition examples; these are optional capabilities, not mandatory UI features.

### 4. Other modern React APIs

| API | Required implementation/review guidance |
| --- | --- |
| `createContext()` | Define a shared value with explicit provider ownership; keep state and access-control responsibilities clear. |
| `lazy()` | Declare a stable component loader with a compatible module export and Suspense fallback. |
| `memo()` | Use only for a justified render optimization; keep correctness independent of skipped renders. |
| `startTransition()` | Mark non-urgent updates; use `useTransition` when the component needs pending state. |
| `addTransitionType()` | Identify a transition's cause/type inside the supported transition flow. |
| `act()` | Flush React test work through the test runner/library's supported integration. |
| `cache()` | Reuse the cached server function for render/request-scoped sharing; do not assume durable cross-request caching. |
| `cacheSignal()` | Tie supported server work to the cache lifetime; do not use it as a universal client cancellation source. |
| `captureOwnerStack()` | Use for development diagnostics, not production application data or authorization. |
| `use()` | Read a supported resource during component/hook render, including conditionally or in a loop. Never call it in a handler or wrap it in local `try/catch`. |

Provide stable compatible Promises to `use`; do not create a fresh uncached
Promise on every client render. Put rejection handling at an Error Boundary
or another supported resource boundary. Keep the distinction between `cache`
for server call sharing and `useMemo` for a component's render calculation.
Neither establishes authorization or durable server-side cache invalidation policy.

### 12. Identity, composition, and Error Boundaries

Use `key` to identify siblings and intentional reset boundaries, `children` for
nested composition, and props as component inputs. Keep controlled inputs
controlled throughout their lifetime; let uncontrolled fields retain DOM
ownership. Callback refs can own setup and cleanup. Hydration must match the
initial server output. Custom hooks share behavior, not a single state instance.

There is no stable native hook for a full Error Boundary. Class boundaries can
use `static getDerivedStateFromError()` and `componentDidCatch()`; preserve valid
framework integrations. Handle asynchronous callbacks and event-handler failures
at their own boundary. Suspense handles suspension, Error Boundaries handle
render failures, Activity manages visibility/state, and ViewTransition animates
visual changes. None substitutes for the others.

---

## 10. React DOM: DOM, Forms, and Server Architecture

Apply this rule to React rendering boundaries, DOM integration, form workflows, and Server Component contracts.
Read the [detailed reference and examples](../../docs/agents/react.md#user-supplied-react-1931-reference)
for full explanations, 15 examples, API tables, and evidence boundaries.

### 5. React DOM and rendering APIs

| API group | APIs | Required guidance |
| --- | --- | --- |
| DOM integration | `createPortal`, `flushSync` | Preserve portal focus/event semantics; use synchronous flushing only for a necessary external integration. |
| Resource hints | `prefetchDNS`, `preconnect`, `preload`, `preloadModule`, `preinit`, `preinitModule` | Match the resource and owning framework; avoid speculative or duplicate loading policies. |
| Browser-only subtree | `browser` | Import from `react-dom`, consume through `use` in a compatible Suspense boundary, and handle browser API failures. |
| Form reset | `requestFormReset` | Reset uncontrolled inputs intentionally; preserve controlled and library-owned form values. |
| Client roots | `createRoot`, `hydrateRoot` | Import from `react-dom/client`; let the framework own application roots and hydration. |
| Server streams | `renderToReadableStream`, `renderToPipeableStream` | Respect Web/Node stream contracts and framework ownership. |
| Resuming server rendering | `resume`, `resumeToPipeableStream` | Use compatible postponed render state; these are framework/renderer capabilities. |
| Server strings | `renderToString`, `renderToStaticMarkup` | Understand limited Suspense behavior and that static markup cannot be hydrated. |
| Static rendering | `prerender`, `prerenderToNodeStream`, `resumeAndPrerender`, `resumeAndPrerenderToNodeStream` | Use `react-dom/static` in a supported rendering pipeline; do not replace framework partial prerendering with an isolated recipe. |

`browser` is present in installed React DOM 19.3.1 and its types.
Preserve this correction to the earlier local documentation.
`requestFormReset` is also present even though the input omitted it. A
`"use client"` directive alone does not prevent server prerendering.

### 6. HTML and SVG

Keep native elements distinct from built-in React components. Use semantic
structure (`div`, `section`, `main`, `article`), navigation (`nav`, `a`), text
(`p`, `span`, `h1`-`h6`), forms (`form`, `input`, `select`, `textarea`), grouping
and labels (`label`, `fieldset`, `legend`), and native UI (`dialog`, `details`,
`summary`) according to their accessibility and behavior contracts.

Treat `title`, `meta`, and `link` as metadata/resource integrations owned with
the framework. Preserve proper handling of `script`, `style`, and `img` and
SVG elements such as `svg`, `path`, and `circle`. React escaping does not make
arbitrary HTML or URLs safe. Review labels, keyboard behavior, native props,
focus, and controlled-input semantics at the actual usage boundary.

### 7. Forms and Actions

Understand `<form action={fn}>`, submit-button `formAction`, `useActionState`,
`useFormStatus`, and `useOptimistic` as related but distinct tools. An Action
may execute on the client; only a properly marked/integrated Server Function
crosses that server boundary.

Validate input, handle failures/pending state, prevent inappropriate duplicate
submissions, and authenticate/authorize server operations. Choose controlled
or uncontrolled input ownership deliberately. Do not duplicate form state in
local state, nest forms, or lose new edits when an old submission completes.
Successful Actions can reset uncontrolled fields, so review the reset contract.

### 8. Server Components and Server Functions

Server Components can read authorized private server resources, be async for
data reading, render Client Components, and contribute initial HTML. They do
not use client state/Effects or interactive event handlers and cannot access
browser APIs. Client Components support those interactive hooks/handlers, may
also contribute server-rendered initial HTML, and access browser APIs only
when executing in the browser.

`"use client"` marks a module-graph boundary. Keep transitive imports safe and
pass server-rendered content through composition slots rather than importing
server implementations into client code. `"use server"` marks asynchronous
Server Functions; it is not a generic Server Component directive and does not
perform validation, authentication, or authorization for the implementation.

Validate each remotely received argument and each caller's permissions. Keep
credentials/private resources on the server and respect serialization/transport
contracts. Do not infer server Context support from the version-history
summary without checking the concrete API and framework.

### 14. Fragment refs

Use an explicit `Fragment` ref for grouped DOM interaction when it avoids a
wrapper needed only for a ref. Shorthand Fragments cannot carry that prop.
Understand all supplied `FragmentInstance` capabilities:

| Methods | Required guidance |
| --- | --- |
| `addEventListener`, `removeEventListener`, `dispatchEvent` | Preserve event semantics and remove owned registrations. |
| `focus`, `focusLast`, `blur` | Verify focus across eligible descendants and accessible keyboard flows. |
| `observeUsing`, `unobserveUsing` | Pair supported observer registration and cleanup. |
| `getClientRects`, `getRootNode` | Respect Fragment geometry/root semantics instead of assuming one wrapper element. |
| `compareDocumentPosition` | Exists in installed renderer source but is absent from installed Fragment types; resolve that mismatch before typed usage. |
| `scrollIntoView` | Follow the installed optional-boolean signature and test grouped scrolling behavior. |

Do not hide a runtime/type mismatch with an unchecked cast or replace semantic
wrappers without evaluating layout/accessibility. Method presence is not a
browser behavior test.

### 15. Experimental APIs

Treat `experimental_taintObjectReference` and `experimental_taintUniqueValue`
as experimental server/client data-boundary tools, not stable default exports.
Check the runtime channel and framework integration before use. Object/value
tainting cannot replace authentication, authorization, input validation, or
control of sensitive derived data. Do not adopt an experimental dependency
simply because a live reference describes it.

---

## 11. React Quality: Compiler, Lint, and Review

Apply this rule to React Compiler optimization, Rules of React, lint diagnostics, legacy migration, feature selection, and verification workflows.
Read the [detailed reference and examples](../../docs/agents/react.md#user-supplied-react-1931-reference)
for full explanations, 15 examples, API tables, and evidence boundaries.

### 9. React Compiler

Compiler can automate eligible `memo`, `useMemo`, and `useCallback` style
optimizations during build. Prefer pure code, measure actual performance,
and keep correctness independent of memoization. Compiler cannot fix invalid
logic, guarantee third-party mutable API compatibility, or manage resources.

Use `"use memo"` to request compilation only under a supported configuration;
use `"use no memo"` for a documented reason rather than hiding a problem.
Resolve React rule violations and inspect actual diagnostics. Check pinned
Compiler 1.0.0 before copying newer options. Installing Compiler does not
enable it in every build pipeline or establish that every component was
optimized.

### 10. Rules of React

Keep render pure and idempotent: equivalent inputs must produce equivalent
results without externally visible effects. Treat props, state, context, and
hook inputs/results as immutable snapshots. Use setters/reducers and copied
values instead of mutating received data. Newly created local values can be
assembled locally without mutating a prior snapshot.

Keep side effects in appropriate event handlers or Effects. Call ordinary
hooks only at the top level of React functions. Let React call components
through JSX instead of invoking them as ordinary functions. Prefer explicit
composition for reusable UI and behavior. Keep component types at module
scope and keys stable by data identity. Do not mislabel stricter repository
component orchestration or route policies as universal React requirements.

### 11. Upstream hook and Compiler lint rules

Understand each supplied upstream rule when reviewing its related pattern:

| Rule | Review concern |
| --- | --- |
| `rules-of-hooks` | Hook ordering and valid call sites. |
| `exhaustive-deps` | Correct reactive dependencies. |
| `component-hook-factories` | Unstable component/hook factories. |
| `config` | Compiler configuration. |
| `error-boundaries` | Render error-handling patterns. |
| `gating` | Conditional Compiler activation. |
| `globals` | Global mutation during render. |
| `immutability` | Mutated React snapshots. |
| `incompatible-library` | Incompatible library APIs. |
| `preserve-manual-memoization` | Lost manual memoization guarantees. |
| `purity` | Impure render operations. |
| `refs` | Invalid ref use. |
| `set-state-in-effect` | Unnecessary synchronous Effect state updates. |
| `set-state-in-render` | Problematic render-time updates. |
| `static-components` | Dynamically recreated component definitions. |
| `unsupported-syntax` | Unsupported Compiler syntax. |
| `use-memo` | Invalid `useMemo` usage. |

Use the project's native diagnostic tooling first. Upstream names describe
semantics; they do not establish that every check is implemented in the
project's linter. Enable compatible checks at their intended severity and use
Compiler diagnostics, existing guards, and tests for their actual scopes. Do not
install a second lint stack or add duplicate custom syntax parsers.

### 13. Legacy and removed APIs

| Available legacy API | Direction for new code |
| --- | --- |
| `Children` | Prefer explicit composition over unnecessary child inspection. |
| `cloneElement` | Prefer composition and explicit props. |
| `Component` | Usually prefer function components; retain classes where needed for Error Boundaries. |
| `PureComponent` | Prefer function components and justified optimization. |
| `createElement` | Prefer JSX. |
| `createRef` | Use `useRef` in function components. |
| `forwardRef` | Prefer React 19 ref props. |
| `isValidElement` | Inspect an element only for a concrete integration need. |

For removed APIs, use `createRoot` instead of `ReactDOM.render`, `hydrateRoot`
instead of `ReactDOM.hydrate`, explicit refs instead of `findDOMNode`,
`root.unmount()` instead of `unmountComponentAtNode`, and JSX instead of
`createFactory`. Do not describe a still-available legacy API as removed or
mechanically rewrite valid boundaries.

### 16. Version history and applicability

Preserve the supplied release context: React 19.0 introduces Actions and
related hooks, `use`, form/metadata changes, and ref props; 19.2 adds Activity,
`useEffectEvent`, `cacheSignal`, Performance Tracks, and partial-rendering
features; 19.3 describes ViewTransition, `addTransitionType`, Fragment refs,
`browser`, Trusted Types, and server Context improvements; 19.3.1 describes RSC
transport changes.

Use section 16 of the detailed reference for the evidence distinction. Local
exports/types/renderer checks establish named API availability, not every
historical statement. Recheck release/security notes, exact server Context
behavior, Trusted Types integration, and framework compatibility before an
implementation or upgrade. Do not infer a broader Context capability or a
transport fix from this table alone. Preserve the original source inventory's
retrieval date unless it is actually refreshed.

### 17. Feature selection

| Need | Starting point |
| --- | --- |
| Simple state | `useState` |
| Related complex state transitions | `useReducer` |
| Shared contextual value | `createContext` and `useContext` |
| Compatible async resource | `use` with `Suspense` |
| On-demand component | `lazy` with `Suspense` |
| Action result/pending state | `useActionState` |
| Ancestor form status | `useFormStatus` |
| Temporary feedback | `useOptimistic` |
| External synchronization | `useEffect` |
| Non-reactive Effect logic | `useEffectEvent` |
| External store | `useSyncExternalStore` |
| Controlled non-urgent update | `useTransition` |
| Deferred incoming value | `useDeferredValue` |
| Preserved hidden interface | `Activity` |
| Visual changes | `ViewTransition` |
| DOM access | `useRef` |
| Grouped-child DOM interaction | Fragment refs with verified signatures |
| Modals/overlays | `createPortal` with focus/accessibility integration |
| Render measurement | `Profiler` |
| Development diagnostics | `StrictMode` plus configured lint/Compiler tools |
| Rendering error isolation | Error Boundary |
| Render optimization | Actual profiling and eligible Compiler optimization |

Choose a feature for the actual need; retain simpler working code when a modern
alternative adds no concrete benefit.

### 18. Implementation and review checklist

- [ ] Keep components pure.
- [ ] Avoid direct props/state mutation.
- [ ] Avoid duplicated derived state.
- [ ] Reduce unnecessary Effects without deleting legitimate synchronization.
- [ ] Clean up subscriptions and external resources, including late results.
- [ ] Follow the Rules of Hooks and the `use` exception.
- [ ] Make custom-hook abstractions useful and focused.
- [ ] Prefer composition over inheritance where appropriate.
- [ ] Use ref props in new React 19 wrappers.
- [ ] Use Actions when appropriate to the actual workflow.
- [ ] Avoid duplicating form-owned state.
- [ ] Respect Server/Client Component boundaries.
- [ ] Validate and authorize Server Functions.
- [ ] Use compatible resources with Suspense.
- [ ] Handle rendering failures with Error Boundaries.
- [ ] Evaluate Compiler eligibility and the actual pipeline.
- [ ] Run supported lint diagnostics.
- [ ] Measure before optimizing.
- [ ] Avoid unnecessary manual memoization.
- [ ] Consider Activity and ViewTransition when needed.
- [ ] Verify accessibility.
- [ ] Test critical behavior, ordering, and lifecycle cleanup.
- [ ] Prefer modern APIs for new code without unrelated legacy rewrites.

### 19. Documentation, evidence, and tooling

Use the [official documentation directory](../../docs/agents/react.md#19-official-documentation)
for React APIs/hooks/components, React DOM and HTML/SVG, Server Components,
Compiler, Rules of React, hook lint rules, legacy APIs, the React 19.3 release,
and the official source repositories. Resolve the correct topic and installed
version before copying an example. Use immutable revisions for reproducible
source review.

Match [lifecycle verification](../../TESTING.md#react-rules-and-lifecycle-verification)
to real resources, hydration, and hide/reveal behavior. A source lookup,
configuration regression, or lint success is not complete behavior coverage
or profiling. Follow [security guidance](../../SECURITY.md#react-rendering-and-input-boundaries)
at HTML/URL/data boundaries; optimistic UI and context do not authorize access.

### 20. Application principle

Choose the simplest supported abstraction that correctly solves the problem.
The full catalog covers hooks, components, React/DOM rendering, native
elements, Actions, Server Components/Functions, Compiler, lint, identity,
legacy APIs, Fragment refs, experiments, version context, feature selection,
and accessibility/security/testing practices. Apply those explanations to the
concrete code instead of requiring every listed feature in every project.

When refreshing this rule, preserve topic coverage, keep examples and evidence
in the detailed reference, and update both files when a verified capability
or applicability constraint changes.

---

## 12. Next.js Route Special Files Logic

Repository policy: `page.tsx`, `layout.tsx`, and `template.tsx` stay as
thin **Server Component** entrypoints. This is stricter than the Next.js API,
which permits data access in pages/layouts and Client Components in templates.

- Allow route parameter and search parameter reads, server-side data
  orchestration, Next.js generators (`generateMetadata`,
  `generateViewport`, `generateStaticParams`), static route exports, root
  document setup, and composition of providers and UI.
- Reject `"use client"`, React and third-party hooks (`useState`,
  `useTranslations`, `useRouter`, etc.), direct Firebase SDK imports,
  browser APIs, JSX event handlers, local mutation, conditional control flow,
  loops, exception handling, and inline helper/callback functions.
- Extract UI to colocated `_components/`, client behavior to `_hooks/`,
  and domain operations to dedicated `src/lib/` modules. Server-side data
  reads through those modules are allowed in route entrypoints.
- The mandatory `pnpm check:routes` command scans **all** matching files,
  including the route-group root and future `template.tsx` files. It runs
  self-tests and fails CI on violations; `ast-grep` also marks hook violations
  as errors through `review-route-special-files-logic`.
- `loading.tsx`, `error.tsx`, and `not-found.tsx` retain their individual
  Next.js conventions and are outside this three-file enforcement.

### Official references

- [Next.js layouts and pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) (`node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`)
- [Next.js page](https://nextjs.org/docs/app/api-reference/file-conventions/page) (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`)
- [Next.js layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout) (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md`)
- [Next.js template](https://nextjs.org/docs/app/api-reference/file-conventions/template) (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/template.md`)

---

## 13. Serena External-Research Memory

Apply this rule before performing an external information query, including web
searches, upstream documentation lookups, external API queries, and connected
service searches.

1. Read Serena's instructions and activate the project when the current
   session has not already done so.
2. Search the relevant Serena memory topic before issuing the external query.
   Reuse a current, sufficiently specific finding when one exists.
3. Query the external source only when the memory is absent, insufficient, or
   potentially stale. Prefer the source required by the repository's existing
   documentation workflows.
4. Record the durable, reusable result in a project-scoped Serena memory after
   the query. Use a meaningful topic/name, include the source and retrieval
   date, and state any version or freshness boundary.

Do not store secrets, credentials, personal data, full copyrighted source
content, or transient/raw responses. Do not treat a memory as authoritative
when its recorded version or retrieval date makes it unsuitable for the task.

---

## 14. shadcn/ui Maintenance

Apply this rule to UI work and shadcn/ui documentation updates. Load
[../skills/shadcn/SKILL.md](../skills/shadcn/SKILL.md) for the upstream workflow. This section adds repository
context; it does not replace or duplicate the upstream rule examples.

### Establish project context

- Inspect `components.json`, `package.json`, the target local source, and the
  CLI's project information. This project uses `base-nova` with Base UI,
  Tailwind v4, Lucide, TypeScript, and the `@/*` aliases.
- Run the installed CLI through pnpm. Obtain and read component docs before
  advising on or changing an API. Follow [TOOLING.md](../../TOOLING.md#shadcnui-cli-workflow).
- Read the Base UI variant. Do not infer `asChild`, Radix state attributes,
  Sonner, or React Aria props from a generic example. Installed component
  source and primitive types define the API available to this project.
- When a lookup fails, report it and use accessible official documentation or
  the installed source. Do not claim an unavailable CLI or network check passed.

### Preserve owned source

- Reuse installed primitives and named parts before creating custom UI.
  Keep application adapters in owned component directories and preserve their
  native props, children, refs, slots, and semantics.
- Preview source updates with `add --dry-run`, `--diff`, or `--view`. Review
  imports, dependency changes, CSS, and each resolved file; preserve local
  adaptations. Do not fetch raw upstream component files to bypass CLI
  transforms or silently use `--overwrite`.
- Treat preset, primitive-family, icon, RTL, and AI Elements migrations as
  separate scoped implementation work. A request to refresh documentation does
  not perform these migrations or install a new MCP server.

### Persist verified knowledge

- `DESIGN.md` owns theme and visual composition; `CODING_STANDARDS.md` owns
  component/API conventions; `TOOLING.md` owns commands; `TESTING.md` and
  `SECURITY.md` own their validation and trust boundaries.
- `docs/agents/shadcn.md` owns the upstream applicability map and source
  inventory. Record a revision and retrieval date when refreshing it.
- Label repository guards as repository policy. Upstream examples do not
  require our filenames, one primary export, profile hook layout, or every
  compound form's Provider boundary.
- Preserve accepted ADRs, upstream skill provenance, and unrelated local work.
  Apply the local `save` skill for `/save`; run documentation checks and agent
  synchronization when available, reporting any missing host tool.
