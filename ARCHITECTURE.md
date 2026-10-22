# Architecture

## Overview

This repository is a Next.js 16 application using the App Router, React 19,
TypeScript, Tailwind CSS, shadcn/ui, and `next-intl`. It uses the optional
`src/` directory to keep application source separate from project
configuration and repository documentation.

## Repository layout

```text
.
├── .agents/                 # Agent rules, workflows, and installed skills
├── .biome/                  # Custom Biome GritQL rules and tests
├── .fallow/                 # Fallow complexity and hotspot tracking
├── .github/                 # GitHub Actions CI workflows and configurations
├── .ladle/                  # Ladle component workbench configuration and styling
├── docs/
│   ├── adr/                 # Accepted architecture decisions
│   └── agents/              # Instructions for automated contributors
├── public/                  # Static assets served by Next.js
├── scripts/                 # Operational and developer tooling scripts (e.g. emulator seed/clear)
├── src/
│   ├── app/                 # App Router routes, layouts, and global styles
│   │   ├── (protected)/     # Authenticated route group with client auth guard layout (e.g. /profile)
│   │   ├── (public)/        # Public authentication routes (sign-in, register, forgot-password)
│   │   └── _components/     # Route-private components and auth providers
│   ├── components/          # Reusable application and UI components
│   ├── hooks/               # Reusable React hooks
│   ├── i18n/                # Locale routing, navigation, and request config
│   ├── lib/                 # Framework-independent utilities
│   ├── messages/            # Locale message catalogs
│   └── types/               # Shared TypeScript declarations
├── tests/                   # Playwright E2E tests, visual baselines, and Semgrep rules
├── AGENTS.md
├── ARCHITECTURE.md
├── CODING_STANDARDS.md
├── CONTRIBUTING.md
├── DER.md                   # Pending product ERD and existing technical stores
├── DESIGN.md                # Design system tokens, typography, and UI specs
├── GLOSSARY.md
├── README.md
├── SECURITY.md
├── TESTING.md
└── TOOLING.md
```

`package.json`, Next.js configuration, TypeScript configuration, environment
files, and `public/` remain at the repository root, as required by the Next.js
`src/` directory convention.

## Application boundaries

- `src/app` contains route entrypoints and Next.js special files, plus
  route-private implementation code under underscore-prefixed folders.
- Shared application UI belongs in `src/components/ui/extensions`; shared non-UI helpers belong in
  `src/lib`.
- Route-specific implementation details may be colocated with a route. Use an
  underscore-prefixed folder such as `_components`, `_hooks`, or `_lib` when
  explicitly marking it as non-routable is useful.
- Use App Router route groups to organize related routes or layouts without
  changing their URLs:
  - `(public)` groups unauthenticated identity flows (`/sign-in`, `/register`,
    `/forgot-password`) under a shared layout and redirects authenticated visitors
    to `/profile`.
  - `(protected)` isolates authenticated routes (e.g. `/profile`) behind a
    client-side layout guard that observes `onAuthStateChanged` and redirects
    unauthenticated visitors to `/sign-in`.

## Authentication navigation

When an unauthenticated user requests a protected route, the client guard redirects to `/sign-in?next=<encoded-path-and-query>`. Once authenticated, the public authentication provider sends the user to that destination, or `/profile` if no valid destination was supplied. The return URL validator accepts only application-relative paths and rejects external URLs and authentication-screen loops; query strings are preserved. Route protection in the UI is not a substitute for Firebase Security Rules or authorization at the data source.

## Test boundaries

- Colocate Vitest tests with the `src/` code they verify: use `*.test.ts` for
  non-JSX modules and `*.test.tsx` for React or JSX integrations.
- Colocate Ladle stories (`*.stories.tsx`) next to UI primitives under
  `src/components/ui/` for isolated component development and visual inspection.
- Keep repository tooling guard self-tests beside their scripts, such as
  `scripts/check-component-conventions.test.mjs`. Do not introduce a global
  `tests/unit/` hierarchy for application tests.
- Keep Playwright E2E specifications in root `tests/` with `*.spec.ts`.
  Feature-specific fixtures and helpers stay with their consumer unless shared
  by multiple E2E specifications.
- Keep route-private test subjects under existing `_components`, `_hooks`, and
  `_lib` boundaries; test placement must not alter a route's URL or structure.

See [ADR 0006](docs/adr/0006-configure-testing.md) for the adopted architecture and [TESTING.md](TESTING.md) for
commands and implementation conventions.

## Internationalization

The internationalization architecture is 100% cookie-driven (`NEXT_LOCALE`)
without `middleware.ts` and without a `[locale]` folder segment in the App
Router. The application serves `src/app/page.tsx` directly at `/`; there are no
localized URL route prefixes or proxy scripts.

`src/i18n/routing.ts` defines `en`, `pt-BR`, and `es`, defaulting to `en`, and
exports `localeCookie = "NEXT_LOCALE"` along with the `isLocale` type guard.
`src/i18n/routing.test.ts` verifies this guard with property-based testing
(`fast-check`). `src/i18n/request.ts` reads the cookie (or explicit request
locale) and imports `src/messages/${locale}.json`, cleanly falling back to `en`
if an invalid locale is received.

Message catalogs (`src/messages/*.json`) adhere to a structural testing
contract in `src/messages/messages.test.ts`, which validates key parity across
`en.json`, `pt-BR.json`, and `es.json`, forbids empty messages, and ensures ICU
placeholders match the reference catalog. Global message type safety is enforced
by augmenting the `IntlMessages` interface in `src/types/global.d.ts`. Spelling
validation integrates `@cspell/dict-pt-br`.

The root layout (`src/app/layout.tsx`) currently declares a static `<html
lang="en">` attribute even when translated content is rendered through
`IntlProvider` via the cookie. A dynamic server-rendered `lang` needs an explicit locale/rendering design:
with Cache Components, awaiting a request cookie at the root above all
`Suspense` boundaries can block prerendering. Moving the existing cookie read
there is not a complete fix. Preserve the current behavior until that design
and its accessibility tests are implemented. See
[ADR 0004](docs/adr/0004-configure-internationalization.md) for the complete
decision.

## Runtime and component boundaries

`next.config.ts` enables Cache Components, partial prefetching, and React
Compiler. It loads Tailwind through the Turbopack CSS loader and wraps the
configuration with the `next-intl` plugin.

The root layout keeps the async `IntlProvider` inside `Suspense`, followed by
`ThemeProvider` and `TooltipProvider`, with `Toaster` inside `ThemeProvider`.
The component libraries under
`src/components/ui` and `src/components/ai-elements` are locally owned source;
custom providers under `ui/extensions` remain subject to application checks.
`src/components/firebase` contains Firebase UI registry source used by the app.
Treat copied components as locally owned shadcn source and review any registry
update as a source diff; see [ADR 0008](docs/adr/0008-install-firebase-ui-registry.md).
TypeScript checks the full directory with the application build config. Bulk
formatting and other broad checks retain targeted exclusions for untouched
registry source.
Ladle (`.ladle/`) isolates and documents UI components without requiring the
Next.js runtime.

`.dependency-cruiser.cjs` rejects cycles, imports from shared components into
`src/app`, and imports from `src/lib` into routes, components, hooks, or i18n.
It does not ban all third-party React dependencies in `src/lib`.

Firebase Authentication provides browser authentication on public auth routes and
client-guarded protected routes (`(protected)/profile`); see [ADR 0009](docs/adr/0009-integrate-firebase-authentication.md).
Firebase Web SDK initialization lives in `src/lib/firebase/client.ts`; Firestore
operations live in descriptive modules under `src/lib/firebase/firestore/`, such
as `user-preferences.ts`. The profile route's `useProfileSubmit` hook coordinates Auth, Storage,
and Firestore persistence. `useProfileForm` owns the React Hook Form lifecycle
and operation lock. `useProfileSection` composes session, status, and translation
hooks; `ProfileSection` renders those states and composes the Card and Form
parts. Shared profile value types live in `src/lib/profile.ts`. The canonical profile
responsibilities live in
[the form rule](.agents/rules/form-architecture.md). Profile preferences use
Firestore at `users/{uid}` with owner and field/value validation rules. Avatar
Storage rules restrict `users/{uid}/avatar` to its owner and enforce accepted
image types and the 2 MiB upload limit. These browser SDK modules are not a
Next.js server-side DAL. Next.js documentation uses `data.ts` for server-side
data access and `actions.ts` for Server Actions; we reserve those patterns for
server code, rather than using those names for Firebase client modules
([Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data),
[Mutating Data](https://nextjs.org/docs/app/getting-started/mutating-data),
[Data Security](https://nextjs.org/docs/app/guides/data-security)). See
[.agents/rules/data-layer-modules.md](.agents/rules/data-layer-modules.md) for the
file taxonomy defining `definitions.ts`, `dto.ts`, `dal.ts`, and `data.ts`. The client
SDK relies on Firebase Security Rules and does not provide server authorization
for protected routes. No deployment integration is configured.
Keep [DER.md](DER.md) and [GLOSSARY.md](GLOSSARY.md) pending until the respective
persistence and product decisions exist.

## Decision records

Architecture decisions that have lasting consequences are recorded in
`docs/adr/`; use its [index](docs/adr/README.md) to distinguish historical
details from current configuration. New ADRs are numbered sequentially and must describe the context,
decision, and consequences before the related implementation is merged.

## UI distribution boundary

`components.json` selects `base-nova`, Base UI primitives, TypeScript, React
Server Component support, Lucide, and the `@/*` aliases. Tailwind v4 uses the
existing CSS entry rather than a separate Tailwind config. The `shadcn` package
provides the CLI and shared CSS; a dependency upgrade does not replace copied
files in `src/components/ui`, `src/components/ai-elements`, or
`src/components/firebase`.

The repository consumes registries; it does not publish a custom registry.
Monorepo, package-import, React Aria, Radix, alternative form-library, and
server-action examples in upstream documentation are available references,
not adopted architecture. See [the upstream applicability map](docs/agents/shadcn.md).

## Compound APIs and runtime graphs

All owned UI follows the general
[compound component contract](CODING_STANDARDS.md#compound-components-and-serverclient-boundaries).
Server/Client graph membership is independent of component anatomy. Shared
modules can be compiled in both graphs; server-rendered children can be passed
into client slots without importing server code into the client graph. Named
part exports preserve an independent reference for each client part across
that boundary. The [composition guard](CODING_STANDARDS.md#composition-guard-coverage)
checks local contracts and leaves complete graph validation to Next.js.

## Next.js rendering and cache model

The installed Next.js 16.4.2 configuration explicitly enables both
`cacheComponents` and `partialPrefetching`. The applicable model combines a
prerendered shell, cached work, and request-time streamed content. Guidance for
caching without Cache Components and Pages Router APIs remains migration
reference material. See [the versioned review](docs/agents/nextjs.md).

`src/i18n/request.ts` awaits `cookies()` to resolve request-specific messages.
The async `IntlProvider` renders within the root layout's `Suspense` boundary;
keep request access beneath a boundary that can cover it. A boundary returned
by a component cannot cover an await already performed by that component.
A same-segment `loading.tsx` covers the page subtree, not an earlier read in
its layout. Metadata and viewport have their own rendering rules.

The browser Firebase cache, React request memoization, Next.js server caches,
and client navigation cache have different lifetimes. No server profile cache,
Server Action persistence layer, Route Handler API, or custom cache handler is
configured. `router.refresh()` does not turn browser SDK mutations into
server cache invalidation. Implement a consistency contract when introducing
server-owned data; its API choices belong in
[Coding standards](CODING_STANDARDS.md#nextjs-request-data-and-caching).

Route groups are URL-neutral, private folders do not create routes, and
`src/app` is the active router. There is no Pages Router, `proxy.ts`, or
`middleware.ts` implementation. A proxy or route-group layout is not a data
access authorization boundary. Hosting adapters, static export, Edge runtime,
remote/private caches, parallel/intercepted routes, and offline support are
reviewed upstream options; this refresh does not adopt them.

## React runtime and lifecycle boundaries

React and React DOM are pinned together at 19.3.1. Next.js owns application root
creation, hydration, RSC transport, and streaming; application features should
not add a second `createRoot`/`hydrateRoot` bootstrap. Ladle and Vitest own their
separate workbench/test roots. React Compiler 1.0.0 is enabled through Next.js;
that flag does not establish compiler transformation in the Vite-based test or
Ladle pipeline.

Browser Firebase subscriptions stay in focused hooks behind the existing
component-named orchestration seams. The profile form uses React Hook Form and
its providers, not React form Actions or a server mutation layer. Avatar object
URLs are created in an Effect with replacement/unmount cleanup. The viewport
hook uses `useSyncExternalStore` with a matching initial server/hydration
snapshot. These are external-system contracts, not redundant derived state.

The current framework can preserve hidden UI state with Activity. Effect
cleanup may occur when content hides or is replaced, not only on permanent
unmount; ownership must tolerate setup/cleanup/setup. Keep this independent of
Server/Client import-graph membership and of compound-component anatomy.
[Coding standards](CODING_STANDARDS.md#react-rendering-hooks-and-identity) own
the behavioral rules; [the React review](docs/agents/react.md) records sources
and stable/experimental boundaries.

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

Owned components use `-client.tsx` for browser integrations, `-server.tsx` for
server integrations, and no suffix for presentation. Presentation may still be
interactive and declare `"use client"`; names do not define React runtime.
Integrations may delegate persistence, session or browser access to hooks.
Presentation can compose an integration child without becoming an integration.
Semantic exports, Next.js special files and registry source retain their names.
See [ADR 0013](docs/adr/0013-name-components-by-integration-responsibility.md)
and [the integration convention](CODING_STANDARDS.md#integration-filename-convention).
