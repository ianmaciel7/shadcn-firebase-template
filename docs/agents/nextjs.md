# Next.js documentation reference

## Scope and evidence

Reviewed on 2026-10-21 against the official `vercel/next.js` repository:

- Installed and latest stable release: **16.4.2**, source revision
  [`2864b1772c37242a9b40ab4d366eb7d368c2a070`](https://github.com/vercel/next.js/tree/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs).
- Current documentation snapshot: `canary` at
  [`9ff8ba95440dc43b0f275b1caffd953074e0f75b`](https://github.com/vercel/next.js/tree/9ff8ba95440dc43b0f275b1caffd953074e0f75b/docs).
- Complete inventories include every Markdown/MDX body under both `docs/` and
  `errors/`. Error sources become the site's `/docs/messages/` pages.
  Both recursive tree responses were non-truncated at both revisions.

The [machine-readable inventory](nextjs-sources.json) records **742 stable
files** and **745 current files**, covering 745 distinct paths and 762 unique
source blobs. Every recorded body was retrieved at its immutable revision and
verified with Git's blob SHA-1 algorithm. Shared content was fetched once.
Three transient retrieval failures were retried successfully; no body remains
missing. The inventory stores paths and hashes rather than copying upstream
documentation into this repository.

The review combines a complete source inventory and full-text scan, a stable
versus current comparison, and an applicability review against local code.
Retrieval and integrity verification do not establish that every upstream
recipe is installed, appropriate, or behaviorally tested in this application.
Examples can contain experimental APIs, obsolete migration inputs, alternate
routers, or an optional hosting model. Match each to the installed version and
the actual configuration before implementation.

| Source group | Stable | Current | Applicability |
| --- | ---: | ---: | --- |
| App Router getting started | 19 | 19 | Current application router and rendering model |
| App Router guides | 81 | 82 | Apply by topic; deployment, migrations, and integrations can be optional |
| App Router API reference | 196 | 197 | Verify installed exports and configuration before adoption |
| App Router index and glossary | 2 | 2 | Framework vocabulary and navigation |
| Pages Router | 167 | 168 | Comparison/migration reference; not the application router |
| Architecture | 5 | 5 | Accessibility, compiler, refresh, and browser support |
| Community | 3 | 3 | Contribution and alternative bundler reference |
| Root index | 1 | 1 | Entry point |
| Error messages | 268 | 268 | Diagnose the installed compiler/runtime; not blanket project rules |
| **Total** | **742** | **745** | Full recorded source scope |

## Current project applicability

`package.json` pins Next.js 16.4.2. `next.config.ts` enables Cache Components,
Partial Prefetching, and React Compiler, configures the Turbopack Tailwind
loader, uses `tsconfig.build.json`, and wraps configuration with `next-intl`.
The App Router lives under `src/app`; route groups and private folders preserve
unprefixed public URLs. There is no Pages Router, Proxy, or Middleware file.

Locale resolution awaits the request cookie in `src/i18n/request.ts`.
The root layout renders the async `IntlProvider` under `Suspense`, then theme
and tooltip providers. It has localized metadata, a static viewport, and a
currently static `html lang="en"`. A language-attribute redesign must account
for request-time rendering and accessibility; adding an await above every
boundary is not a complete solution.

Authentication navigation and profile persistence use browser Firebase SDKs.
Firestore and Storage Security Rules own data access authorization. There is
no server profile DAL, Server Action persistence workflow, custom server cache,
Route Handler API, selected hosting adapter, or deployment integration. Keep
the existing browser and server responsibilities explicit when reading examples.

## Findings by topic

| Topic | Reviewed guidance and project consequence | Canonical owner |
| --- | --- | --- |
| Routing and organization | Pages/layouts, private folders, groups, templates, loading/error/not-found, parallel/intercepted routes, and migration APIs have distinct contracts. The thin-route guard is stricter than Next.js. | [Architecture](../../ARCHITECTURE.md), [route rule](../../.agents/rules/nextjs-route-files.md) |
| Server and Client graphs | Directives define boundaries, Client Components can initially render on the server, shared modules can belong to both graphs, and server-rendered children can cross client slots. | [Component boundaries](../../CODING_STANDARDS.md#compound-components-and-serverclient-boundaries) |
| Cache Components and streaming | Request data needs an appropriate boundary; reusable cache scopes need explicit freshness and invalidation. Previous-model route flags do not apply unchanged. | [Request and cache standards](../../CODING_STANDARDS.md#nextjs-request-data-and-caching) |
| Async request APIs | Cookies, headers, Draft Mode, promised params and search params need the installed async contracts. Page loading boundaries do not cover earlier layout reads. | [Request and cache standards](../../CODING_STANDARDS.md#nextjs-request-data-and-caching) |
| Navigation and retained state | Prefetch, router refresh, Activity, back/forward, and browser cache are not interchangeable with server invalidation or guaranteed unmounts. | [Coding standards](../../CODING_STANDARDS.md#navigation-state-and-optional-features), [Testing](../../TESTING.md#nextjs-documentation-and-framework-verification) |
| Mutation and public server surfaces | Server Functions and Route Handlers need operation-level input validation and authorization; Proxy and client guards do not replace a data boundary. | [Security](../../SECURITY.md#nextjs-server-and-environment-boundaries) |
| Metadata, images, fonts, scripts, CSS | Use current framework APIs, scoped image sources, layout-preserving loading states, and hydration-safe rendering. | [Design](../../DESIGN.md#nextjs-streaming-and-navigation-presentation), [Coding standards](../../CODING_STANDARDS.md#routing-metadata-and-errors) |
| Environment variables | Public values are fixed at build time; `next.config.env` is public regardless of a variable's prefix. | [Security](../../SECURITY.md#nextjs-server-and-environment-boundaries) |
| Build, types, lint, and diagnostics | Type generation loads configuration; Next.js validates its own framework constraints, Biome owns lint, and the native import rule enforces this project's App Router policy. | [Tooling](../../TOOLING.md#nextjs-documentation-and-cli-workflow) |
| Testing and accessibility | Async Server Components need supported production/browser tests; configuration and syntax tests do not prove navigation, isolation, or authorization. | [Testing](../../TESTING.md#nextjs-documentation-and-framework-verification) |
| Deployment and optional integrations | Static export, self-hosting, Edge runtime, adapters, observability, custom webpack/Rspack, CSP, offline support, and remote/private caches require separate applicability decisions. | [Architecture](../../ARCHITECTURE.md#nextjs-rendering-and-cache-model), [Contributing](../../CONTRIBUTING.md#nextjs-documentation-and-framework-changes) |

The corpus also includes migration, localization, forms, redirects/rewrites,
instrumentation, performance, package optimization, monorepo, debugging, and
AI-agent material. These remain indexed reference sources when no corresponding
application feature exists. The `docs/` contribution guide describes upstream
MDX authoring, not this repository's Markdown conventions.

### Server and Client Components reference refresh

The supplied Serena capture of the official **Server and Client Components**
page (last updated 2026-10-05) matches the installed 16.4.2 guide. It confirms
the following project-relevant details:

- Route layouts and pages are Server Components by default. Use Client
  Components only for browser APIs, state, Effects, event handlers, or custom
  hooks, and place the `'use client'` boundary at the smallest interactive
  seam.
- A client boundary pulls its runtime imports into the client module graph; it
  does not pull in Server Components supplied as rendered props or `children`.
  Values that cross from server to client must be React-serializable.
- Initial rendering combines server-generated HTML, the RSC Payload, and
  client-side hydration. Later client transitions use prefetched/cached RSC
  Payloads while Client Components render in the browser.
- Context providers require a Client Component boundary and should wrap only
  the deepest subtree they need. A Server Component can render such a provider
  and pass server-rendered UI into its slots.
- Server-only integrations that access secrets must import `server-only` so
  accidental Client Component imports fail at build time. `client-only` is the
  corresponding marker for browser-only modules; both markers are optional
  dependencies that Next.js recognizes internally.

These findings reinforce existing rules in
[Coding standards](../../CODING_STANDARDS.md#nextjs-app-router),
[component boundaries](../../CODING_STANDARDS.md#compound-components-and-serverclient-boundaries),
and [Security](../../SECURITY.md#nextjs-server-and-environment-boundaries).
They do not introduce a dependency, runtime, or architecture change.

### Cache Components reference refresh

The supplied Serena capture of the official **Caching** page (last updated
2026-10-06) matches the installed 16.4.2 guide and the active
`next.config.ts` configuration. It confirms these project-relevant details:

- Cache Components and Partial Prefetching must be explicitly enabled together;
  the existing configuration does this. This model supersedes previous-model
  caching recipes for new work.
- Use `'use cache'` for data or UI that can be safely reused, pair it with an
  explicit `cacheLife`, and use cache tags only when a mutation needs deliberate
  invalidation. Arguments and values captured from parent scopes form the cache
  key.
- Request-time or uncached asynchronous work belongs below an accessible
  `Suspense` boundary. The fallback joins the static shell while the work
  streams at request time; a boundary cannot cover work already awaited by its
  parent.
- Request APIs (`cookies`, `headers`, `params`, and `searchParams`) are runtime
  data. Extract the minimum authorized value before invoking a shared cache
  scope, or use the applicable private-cache mechanism only after reviewing its
  session and browser-cache implications.
- `connection()` marks truly per-request reads, including random values and
  timestamps, which must also sit behind `Suspense`. Predictable values can
  remain at module scope or be cached according to their intended lifetime.
- Cache entries may live in the prerendered shell, a per-instance in-memory
  store, a configured shared remote store, or the browser. They are scoped to a
  deployment, so a deployment replaces existing cache entries; durable remote
  caching is an infrastructure decision, not an automatic optimization.

These findings reinforce the existing
[request and cache standards](../../CODING_STANDARDS.md#nextjs-request-data-and-caching),
[rendering model](../../ARCHITECTURE.md#nextjs-rendering-and-cache-model), and
[production verification requirements](../../TESTING.md#nextjs-documentation-and-framework-verification).
They do not select a remote cache, change a route, or authorize a caching
rewrite.

### Mutating Data reference refresh

The supplied Serena capture of the official **Mutating Data** page (last
updated 2026-10-15) matches the installed 16.4.2 guide and the current official
reference lookup. It establishes the following project-relevant details:

- A Server Function is asynchronous and runs on the server. A Server Action is
  a Server Function used for a mutation, conventionally through a transition;
  form `action` and button `formAction` establish that transition
  automatically. Invocations use `POST` and can return updated UI and data in
  one roundtrip.
- Define Server Functions with `'use server'` either in an asynchronous
  function or at the top of a module. A Client Component cannot define one,
  but may import it from a module-level `'use server'` file or receive it as a
  prop. Forms receive `FormData`; Server Component forms progressively enhance,
  while Client Component submissions queue until hydration.
- Every Server Function is directly reachable through a `POST` request. It
  must validate its input, authenticate the caller, and authorize the specific
  operation and resource before mutating data. Client-side guards and Proxy do
  not replace this boundary.
- After a mutation, use `refresh()` only to refresh the client router;
  revalidate cache data with `revalidatePath`, `revalidateTag`, or `updateTag`
  as appropriate. When redirecting, perform any required revalidation first:
  `redirect()` throws a framework-managed control-flow exception, so later code
  does not run.
- `cookies()` is asynchronous. Setting or deleting a cookie in a Server Action
  triggers a server re-render of the current page and layouts while preserving
  eligible client state. Pending feedback can use `useActionState`; client
  event-handler or Effect invocations should run in a transition.

The template currently has no Server Action persistence workflow or server-side
profile data-access layer. This is retained as a verified implementation
reference only; introducing one requires a separate design that preserves the
existing Firebase Security Rules authorization boundary and adds relevant
validation coverage.

## Stable versus current documentation

At the recorded revisions, three document paths were added and 19 existing
bodies changed: 18 documentation pages and one error guide. No path was removed.
The inventory records each exact change by blob SHA.

New documents describe custom webpack in both routers and
`next/image-optimizer-transform`. They do not establish that a new API is
available in the pinned release or that Turbopack should be replaced.

Notable current-source clarifications include:

- `usePathname()` reads the browser's visible URL when rewrites differ from the
  source route. Hydration and rewrite tests must account for that distinction.
- `useSearchParams()` under `Suspense` is not a browser-only-rendering guarantee
  when a route also reads request data. Client render code still needs to avoid
  unguarded browser APIs.
- The preserving-state and navigation guides refine Activity lifecycle,
  prefetching, and refresh behavior. Test intentional resets instead of relying
  on navigation to unmount a component.
- Proxy experimental-test helper examples change names between these snapshots.
  Check the installed `next/experimental/testing/server` exports before using
  either spelling; the application currently has no Proxy to test.
- The current `agentUpgrade` guide describes a separate generated upgrade block.
  The existing managed documentation block and user authorization remain
  separate. Do not upgrade dependencies or install recommended skills merely
  because an upstream guide contains an agent command.

## Lookup and refresh workflow

1. Read the target's local source, `package.json`, `next.config.ts`, and relevant
   canonical guide. Start with the installed `node_modules/next/dist/docs/`
   topic. The package contains generated `.md` documentation, while the GitHub
   inventory records original `.mdx` sources; their bytes need not match.
2. Use the official topic and installed types for API details. Resolve a
   Context7 library ID before a targeted current query; use the full source
   inventory to establish completeness rather than treating search snippets as
   the entire documentation.
3. For a full refresh, resolve the installed release tag and current source
   branch to immutable revisions. List **both** `docs/` and `errors/`
   recursively with non-truncated responses. Retrieve every Markdown/MDX body,
   deduplicate matching blobs, and verify each Git blob hash. Fail the coverage
   claim if a body is missing or corrupt.
4. Compare source revisions and local configuration. Keep App Router versus
   Pages Router, Cache Components versus the previous model, stable versus
   experimental features, and browser Firebase versus server access distinct.
5. Update verified findings in their canonical owner, then refresh this review
   and the inventory together. Preserve accepted ADRs, external skill provenance,
   generated managed blocks, and unrelated local edits. This review itself does
   not select a new architecture or require an ADR.
6. Run documentation, link, configuration, and relevant regression checks.
   A changed rendering or cache behavior also needs the production verification
   in `TESTING.md`. Report unavailable runtime tools and unsuccessful checks.

## Validation boundaries

The official source snapshots and local code establish this review's scope.
Next.js DevTools is configured but requires a running server and a connected
client for runtime inspection. Source retrieval does not prove such a session
occurred. Installed-version type generation and production build remain
separate checks from documentation, Biome policy, and source integrity.

The generated inventory includes upstream historical error names and APIs.
Those strings are evidence, not new project dependencies or recommendations.
Accepted ADRs preserve their original decisions; current operational details
belong in the root guides linked above.
