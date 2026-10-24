# Component Architecture and Naming: Composition, Hooks, and Enforcement

These are **repository conventions**, not filename rules prescribed by Next.js or shadcn/ui.
This rule covers component composition and hooks; see also [Component Dimensions and File Contracts](components-contracts.md).

## Composition matching local shadcn/ui primitives

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

## Component behavior and custom hooks

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
`LabeledSpinner` belongs in `ui/extensions` because both
route components and Firebase UI consume it. Do not create parallel application
component folders such as `src/components/loading/`.

`pnpm check:components` rejects JavaScript and TypeScript source files (including
colocated tests and barrel files) outside the `ui`, `firebase`, and `ai-elements`
registry trees under `src/components`. Existing registry trees remain allowed;
their generated source retains its existing exclusions. This is repository
policy, not a Next.js requirement.



## Private hook module support declarations

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

## Main hooks and focused sub-hooks

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
