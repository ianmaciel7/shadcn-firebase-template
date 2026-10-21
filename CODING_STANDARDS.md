# Coding Standards

## Sources of truth

When standards conflict, apply them in this order:

1. `AGENTS.md` for repository-wide engineering rules.
2. Accepted ADRs in `docs/adr/` for architectural decisions.
3. Tool configuration (`biome.json`, `tsconfig.json`, `next.config.ts`, and
   `components.json`) for executable rules.
4. This document for day-to-day conventions that do not belong in tooling.

## TypeScript and React

- Write TypeScript that passes the repository's strict compiler configuration.
- Follow the Rules of React. React Compiler is enabled, so manual
  memoization (`useMemo`, `useCallback`, `memo`) is usually redundant. Keep it
  only for a stated reason, such as a stable Effect dependency. ast-grep reports
  it as a warning, not an error.
- Prefer Server Components. Add `"use client"` only at the smallest boundary
  that needs browser APIs, state, effects, or event handlers.
- Keep client-only providers in dedicated component seams so route layouts can
  remain Server Components.
- Whenever a client component uses an Effect, consider whether a descriptive
  feature-local custom hook would make its purpose and data flow clearer. React
  recommends considering a custom hook for each Effect ([Reusing Logic with
  Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)). Remove unnecessary Effects first, and extract a hook only when it creates a useful boundary; do not add one solely to shorten a component.
- **State derivation and Effect elimination**:
  - Do not use `useEffect` to copy, derive, or mirror state from props or other state variables. Calculate derived values during rendering or synchronize atomic changes directly in event handlers ([You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)).
  - Consolidate state variables that always transition together into a single atomic state object rather than maintaining fragmented, dependent `useState` declarations.
  - When managing external imperatively allocated browser resources (such as `URL.createObjectURL`), manage creation and revocation synchronously in handlers or during unmount cleanup, avoiding cascaded rendering ticks.
- When a component owns several related stateful behaviors, consider a
  component-specific hook such as `useProfileSubmit`. The component can keep
  independent hooks, while the custom hook can compose React hooks and other
  custom hooks ([Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level)). Keep
  this code colocated with its route in a private `_hooks` folder when
  appropriate ([Next.js private folders](https://nextjs.org/docs/app/getting-started/project-structure#private-folders)). This is a project heuristic, not a framework requirement
  for every component.
- **Form Architecture and State Propagation**:
  - Compound forms composed with field-component `children` use a single `useForm` and `<FormProvider {...form}>`; nested field components obtain `control` through `useFormContext()`. The repository currently enforces Providers for owned `*-form.tsx` files, although the official shadcn/ui examples do not universally require one.
  - Name standalone field components after their React Hook Form data property (for example `ProfileDisplayNameField` for `Controller name="displayName"`). Prefer built-in `FieldGroup`/`FieldSet` over arbitrary wrapper components.
  - Allow React Hook Form `UseFormProps<Values>` as an appropriate form component contract. Extract `onSubmit` and component presentation props before passing only RHF options into `useForm`.
  - Form fields use `Field`, `FieldLabel`, `FieldError`, `data-invalid` and `aria-invalid` as documented by shadcn/ui.
  - See `.agents/rules/form-architecture.md`; run `pnpm check:structure` and `pnpm check:components`.

- **Data and Authentication Module Architecture**:
  - Follow the canonical module taxonomy in [.agents/rules/data-layer-modules.md](.agents/rules/data-layer-modules.md) for data and auth boundaries:
    - `definitions.ts`: Types, interfaces, and validation schemas (e.g. Zod schemas).
    - `dto.ts`: Select and structure transferred data crossing system boundaries.
    - `dal.ts`: Protected data access and authorization boundary (`verifySession()`).
    - `data.ts`: Low-level database/persistence operations and query execution.
    - `auth.ts`: Authentication operations answering identity verification ("Who are you?"), such as credential validation, sign-in, sign-up, password recovery, and sign-out.
    - `session.ts`: Session lifecycle, state, token verification, and cookie persistence ("Are you authenticated and what is your active session?").

## Next.js App Router

- Keep route entrypoints and Next.js special files in `src/app`.
- **Server and Client boundary separation**: Route entrypoints (`page.tsx`, `layout.tsx`) cannot be simultaneously Server and Client Components. In the React Server Components model:
  - Adding `"use client"` transforms the entire module into a Client Component boundary, rendering it and all its imports in the client bundle.
  - Server-only exports such as `metadata`, `generateMetadata`, and server-side data fetching functions cannot be exported from files marked with `"use client"`.
  - Conversely, server components cannot use React hooks (`useState`, `useEffect`, `useRouter`) or event handlers (`onClick`).
  - Therefore, keep route entrypoint files (`page.tsx`) as Server Components by default. Whenever interactivity or client hooks are required, never create a generic `*-page-client.tsx` at the route root. Instead, extract the client logic into a semantically named UI component in a private `_components/` directory (e.g., following shadcn conventions such as `_components/register-auth-flow.tsx`, `_components/sign-in-auth-flow.tsx`, or `_components/forgot-password-auth-flow.tsx`) and render it from the server `page.tsx`.
- Use the generated `PageProps`, `LayoutProps`, and `RouteContext` helpers for
  route parameters rather than hand-written equivalents:
  - **Route entrypoint parameters (`page.tsx`)**: When a page does not consume `params`
    or `searchParams`, declare the component with empty parentheses (e.g., `export default function ProfilePage()`).
    Do not add unused `_props: PageProps<Route>` signatures to pages that do not take parameters; doing so forces
    required `params` and `searchParams` properties in JSX, breaking component unit tests (e.g., `<ProfilePage />`).
  - **Layout entrypoints (`layout.tsx`)**: Layouts must always receive `{ children }: LayoutProps<Route>`
    (or `{ children }: { children: ReactNode }`) so nested routes render properly; layouts must never have empty `()`.
  - **Route error & feedback boundaries**: `not-found.tsx` and `loading.tsx` use empty `()`, while `error.tsx`
    receives `{ error, reset }`.
- Colocate route-specific code when it improves locality. Use `_components`,
  `_hooks`, or `_lib` when marking the folder as a private implementation detail
  is useful, following [Next.js private-folder guidance](https://nextjs.org/docs/app/getting-started/project-structure#private-folders).
- Use route groups only to organize routes or layouts without changing the URL.

## Components and styling

- Consult [DESIGN.md](DESIGN.md) for tokens and component conventions. Update
  that reference when changing fonts, theme tokens, or `components.json`.
- The owned-component naming and Next.js Client/Server boundary guard is enforced by `pnpm check:components` (included in CI); registry-generated UI is excluded. See [.agents/rules/component-naming.md](.agents/rules/component-naming.md).
- Follow the component taxonomy and file naming conventions in
  [.agents/rules/component-naming.md](.agents/rules/component-naming.md) for UI
  and feature components (such as `*-field.tsx`, `*-fields.tsx`, `*-form.tsx`,
  `*-card.tsx`, `*-dialog.tsx`, and `*-header.tsx`).
- Biome disables formatting and import organization for vendored UI and AI
  Elements files, with targeted lint exceptions. `ui/extensions` remains
  application code; do not extend vendor exceptions to it.

- Reuse `src/components/ui` primitives before creating new ones.
- Follow the existing shadcn component convention across UI primitives and
  private `_components/`: declare a named function and export it explicitly via
  named export (for example, `function Button()` then `export { Button }`).
  Never use inline `export function ComponentName()` or `export default function`
  in `_components/` or `src/components/`; reserve `export default function` solely
  for Next.js route entry points (`page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`).
- Component prop types should extend the corresponding HTML element or base component
  primitive (for example, button components extend `ComponentProps<typeof Button>` or `ComponentProps<"button">`,
  and form components extend `ComponentProps<"form">`) so they inherit standard attributes,
  support `className` pass-through, and remain composable.
- Maintain single-responsibility module separation: keep domain types, constants,
  and type guards (such as `theme.ts` and `locale.ts`) in dedicated modules under
  `src/lib/`, decoupled from persistence and database clients (e.g. `src/lib/firebase/firestore/`).
- **Enforced thin route entrypoints**: `page.tsx`, `layout.tsx`, and `template.tsx` are Server Component composition seams in this repository. They can orchestrate server data reads, access route props, declare metadata, and compose UI, but must not embed client hooks, direct Firebase SDK calls, browser APIs, event handlers, state mutation, branching, loops, or helper callbacks. Extract UI into `_components/`, hooks into `_hooks/`, and business logic into dedicated `src/lib/` services. Run `pnpm check:routes` locally; it is mandatory in `verify:fast` and `verify:static` CI. This is a repository policy, not a general Next.js restriction. See [.agents/rules/route-special-files.md](.agents/rules/route-special-files.md).
- Use the configured `@/*` path aliases instead of deep relative imports when
  crossing module boundaries.
- Use Tailwind CSS and the existing design tokens. Avoid inline styles unless a
  value must be computed at runtime.

### Compound components and Server/Client boundaries

These conventions apply to **all application-owned components**, both Server
and Client Components: route-private `_components/`, shared `src/components/`,
and `src/components/ui/extensions/`. They are not limited to the profile route.
Generated registry trees retain their documented exclusions.

Composition describes a component's public API. A compound component exposes a
root and independently usable parts, such as `Card`, `CardHeader`, `CardTitle`,
and `CardContent`. The caller assembles those parts through `children` or named
slots. Each adapter inherits its corresponding primitive's props and forwards
applicable attributes, `className`, `children`, and `ref`. React 19 can carry
`ref` through the ordinary props contract and spread.

A simple `Button`, field, or application view does not need invented parts or
an unused `children` prop. A primitive adapter preserves the primitive contract;
a feature view may own its content, actions, and loading states. Do not confuse
a fixed feature view with a general-purpose Card adapter.

Use separate named exports from one family module. `account-card.tsx` declares
`AccountCard` plus any actual parts named `AccountCardHeader`,
`AccountCardContent`, etc. The root matches the filename, every part is a local
named function with the same root prefix, and each props type matches its part.
Unrelated components belong in their own modules. The exact profile families
retain their additional safety checks.

```tsx
import type { ComponentProps } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function AccountCard(props: ComponentProps<typeof Card>) {
  return <Card {...props} />;
}

function AccountCardHeader(props: ComponentProps<typeof CardHeader>) {
  return <CardHeader {...props} />;
}

function AccountCardContent(props: ComponentProps<typeof CardContent>) {
  return <CardContent {...props} />;
}

export { AccountCard, AccountCardHeader, AccountCardContent };
```

At the call site, the caller supplies the content for each part:

```tsx
<AccountCard>
  <AccountCardHeader>{heading}</AccountCardHeader>
  <AccountCardContent>{children}</AccountCardContent>
</AccountCard>
```

Compose only the parts with content. An adapter that extracts `className` merges
it with its layout classes using `cn`; an extracted `children` value must reach
the primitive. Forward remaining standard props instead of copying a small
selection such as `id` and `title` and silently dropping everything else.

Server/Client describes module graphs and rendering, independently of compound
anatomy. It is not a third component naming taxonomy:

| Situation | Meaning |
| --- | --- |
| Module without a directive | It can participate in the server graph, client graph, or both depending on imports; the missing directive alone does not prove it is a Server Component |
| Module with `"use client"` in its directive prologue | It establishes a client boundary; its runtime dependencies join the client graph without repeating the directive in every file |
| Client Component on an initial request | Next.js can render its initial HTML on the server and hydrate it in the browser; Client does not mean browser-only rendering |
| Server parent passes `<ServerDetails />` as `children` to a Client Component | The server renders the details and passes their output; the Client Component does not import the server module |
| Ordinary callback inside the client graph | It can pass between Client Components; React serialization constraints apply when values cross the Server-to-Client boundary |

Keep browser interactivity behind the smallest useful client boundary. Shared
components do not gain a runtime from names such as `Card`, `Form`, `Header`,
`Section`, or `Provider`. `"use server"` marks server functions; it is not a
way to declare an ordinary Server Component. An exported component at a client
boundary cannot be an async function; an async event handler inside it is valid.

Expose compound parts as named exports rather than assigning static properties
such as `AccountCard.Header = AccountCardHeader` or using
`Object.assign(AccountCard, { Header })`. A Server Component importing a Client
Component receives a client reference, so looking up an arbitrary static part
on it is not a safe cross-boundary API. Named exports let the framework create
an independent reference for each client part. This is our portable project
contract even for a family currently used inside one graph; upstream React also
supports static compound patterns within a single graph.

The import graph and the rendered tree are different. A client boundary must
not import runtime server-only APIs. Type-only imports are erased and do not
establish runtime dependencies. Passing server-rendered nodes through slots is
valid; importing their server-only implementation into client code is not.
See the installed Next.js boundary guide and the
[official Server and Client boundary reference](https://nextjs.org/docs/app/guides/server-and-client-boundary).

### Composition guard coverage

`pnpm check:components` tests and runs the TypeScript AST guard for all owned
components, without restricting the scan to files with `"use client"`.
It enforces semantic filenames, a matching family root, locally declared named
parts with the root prefix, matching props names, and separate named exports.
It rejects static component-property assignment and direct `Object.assign`,
`Object.defineProperty`, or `Object.defineProperties` on a component family.

For direct returned adapters whose local parameter contract resolves to
`ComponentProps<typeof Primitive>` (including React's ref variants, local type
aliases, intersections, and `Omit`) and whose primitive is a named value import
from `@/components/ui/`, the guard checks remaining-props spreads and forwarding
of explicitly extracted `children` and `className`, including renamed bindings.
It also detects client directives in the full directive prologue, ignores
erased type imports, and preserves the existing direct runtime server-only
import checks at client boundaries. Biome's native
`noNextAsyncClientComponent` rule owns async client-component diagnostics;
the custom composition guard does not duplicate it.

This is a bounded source guard, not a proof of complete RSC behavior. It does
not resolve the transitive import graph, barrel/namespace imports, arbitrary
wrapper helpers, external/interface type contracts, conditional return trees,
all prop/ref data flow, or the semantic purpose of a slot. It does not infer
that every component without a directive is server-only or require every view
to have compound parts. TypeScript, Next.js builds, structural checks, and
behavior/accessibility tests remain responsible for their respective contracts.

### Form and Field Architecture (shadcn/ui & React Hook Form)

Use `FieldGroup`, `Field`, `FieldLabel`, `FieldDescription`, and `FieldError`
from the installed `@/components/ui/field` alongside React Hook Form
`Controller`. The upstream guide demonstrates a choice of schema validation;
it does not require a specific schema library or `FormProvider` in every form.
The profile currently uses RHF defaults, controlled values, and field-level
rules, without a schema resolver. Add one only when the feature needs it.

- Initialize complete defaults for controlled values. When external values
  change, choose RHF `values` or `reset` deliberately and preserve unsaved edits.
- Follow [.agents/rules/form-architecture.md](.agents/rules/form-architecture.md)
  for the single form instance, compound children, Provider boundary, profile
  operation lock, reset, avatar cleanup, and fixed button action types. These
  are repository policies rather than universal shadcn/ui requirements.
- Use `FieldGroup` for field layout and `FieldSet` with `FieldLegend` for
  semantically related controls. `*-fields.tsx` is available for a real grouped
  responsibility, not a requirement to wrap every set of inputs.
- Bind `data-invalid={fieldState.invalid}` on `Field` and
  `aria-invalid={fieldState.invalid}` on the interactive control; for Select,
  put the latter on `SelectTrigger`. Connect labels with stable control IDs.
  Use `FieldError errors={[fieldState.error]}` when invalid, or its supported
  children API for a specific message.
- Bind Select through `value` and `onValueChange`; inspect local types for
  nullable values. Do not copy Radix-only props into Base UI components.
- Use `InputGroupInput`/`InputGroupTextarea` within `InputGroup`, with
  `InputGroupAddon` and the matching button component for embedded actions.
- Use native validation where appropriate. A documentation demo's `noValidate`
  is a demonstration choice, not a production default. Client validation never
  replaces Firebase Security Rules or server authorization.

### shadcn/ui API and accessibility

Read [.agents/rules/shadcn-ui.md](.agents/rules/shadcn-ui.md) before UI work and
use the CLI workflow in [TOOLING.md](TOOLING.md#shadcnui-cli-workflow). Base UI
uses `render` and presence state attributes; Radix `asChild` and
`data-state` examples do not establish the local API. For navigation, apply
`buttonVariants` to a real anchor or Link instead of rendering an anchor
through Base UI Button, which supplies button semantics.

Keep Select items inside `SelectGroup`, menu items in the corresponding group,
and Tabs triggers inside `TabsList`. Dialog, Sheet, and Drawer need an
accessible title; avatars need a fallback. An icon-only action needs a localized
accessible name. Preserve `ref`, applicable element props, keyboard behavior,
and focus management when adapting primitives. Use `ComponentProps` of the
actual primitive, not a prop contract copied from a different base.

Use semantic colors and existing variants. Application classes should primarily
control layout; shared visual changes belong in the primitive or theme. Use
the `cn` package directly or the existing `@/lib/utils` re-export rather than
reintroducing a `clsx`/`tailwind-merge` helper. Preserve intentional registry
exclusions while keeping application extensions subject to normal checks.

### Dependency Inversion and Composition in Screen and Presentation Components

Components throughout the application—regardless of whether they are Server Components, Client Components, or shared isomorphic components (neither explicitly client nor server)—must adhere to the Dependency Inversion Principle (DIP) and React composition patterns:

- **Universal Component Decoupling (Server, Client, and Shared Components)**:
  - Do not hardcode high-level infrastructure, application routing (`useRouter`, `redirect`, `Link`), external API clients, or environment-dependent SDKs inside reusable or presentation components.
  - Presentational and domain UI components must receive their actions, dynamic slots, and data abstractions via props (e.g., explicit callbacks, `children`, or injected interfaces) rather than instantiating or coupling to concrete implementations directly.
- **Zero route coupling in presentation screens**: Screen and auth form components must remain purely presentational and never import Next.js navigation hooks (`useRouter`, `redirect`, `Link`) or hardcode application routes (such as `/register`, `/sign-in`, or `/forgot-password`). Decouple them by defining explicit callback props (e.g., `onSignUpClick?: () => void`, `onForgotPasswordClick?: () => void`, `onSignIn?: (credential: UserCredential) => void`).
- **Route-private composition roots**: Route-level private components (such as `src/app/(public)/sign-in/_components/sign-in-auth-flow.tsx` and `src/app/(public)/register/_components/register-auth-flow.tsx`) act as composition roots. They connect Next.js navigation hooks (`router.push(...)`) to the screen's callback props and assemble feature-specific dependencies.
- **Provider and addon injection via `children` slots**: Presentation screens and shared surfaces must not hardcode third-party identity providers (e.g., Google, GitHub, or SAML) or concrete third-party services. Instead, expose extensible `children` slots so that provider buttons (e.g., `<GoogleSignInButton />`) or custom actions can be injected at the composition root, conditioned on environment variables (such as `NEXT_PUBLIC_FIREBASE_GOOGLE_ENABLED`).
- **Logic abstraction via custom hooks or service interfaces**: Isolate business logic, validation schemas, and lifecycle effects behind specialized hooks or pure service functions (such as `useUI()`, `useSignInAuthFormSchema()`, `useSignInAuthFormAction()`, and `useOnUserAuthenticated()`). This keeps presentation components focused on rendering state, layout, and event propagation without direct coupling to underlying SDK operations.

## Internationalization

- Write source, comments, and project documentation in English by default,
  following `.agents/rules/language.md`. Localized catalogs use their own
  language.
- Follow the implemented cookie-based request resolution. Localized navigation
  helpers alone do not establish locale-prefixed routes.

- Put user-facing application text in the `next-intl` message catalogs under
  `src/messages/`.
- Do not introduce hardcoded JSX text outside the documented UI primitive
  exceptions. Biome enforces this rule for application code.
- When metadata varies by locale, use the `next-intl` metadata pattern from
  ADR 0004.

## Quality gate

- Format only the files you changed, then run the relevant checks from
  [TESTING.md](TESTING.md).
- Do not weaken or disable a lint rule to accommodate new application code
  without recording the rationale in an ADR when the decision is durable.
- Keep changes focused and add or update behavior tests when the change affects
  application behavior. For documentation changes, check Markdown, spelling,
  links, and commands against the current configuration.

## Tests

- Colocate `*.test.ts` and `*.test.tsx` files with the production module under
  `src/`; do not create per-component `__tests__/` folders or global
  `unit/`, `components/`, or `integration/` hierarchies.
- Put only Playwright user-journey specifications in root `tests/`, using
  `*.spec.ts`.
- Test observable behavior with clear arrange-act-assert structure. Prefer
  accessible, semantic React Testing Library queries such as `getByRole`.
- Keep feature-specific mocks, fixtures, and helpers next to their consuming
  test. Promote them to shared infrastructure only after genuine reuse.
- Avoid broad implementation mocks and large snapshots. Do not test an
  external library's internals.
- Cover asynchronous Server Components with Playwright E2E tests rather than
  forcing them through Vitest.
