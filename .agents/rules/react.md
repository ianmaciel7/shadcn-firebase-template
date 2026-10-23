# React implementation and review rules

<!-- cspell:words preinit Pipeable unobserve Rects -->

Apply this rule to React implementation, review, and reference maintenance.
The 20 sections mirror every topic in the user's supplied React 19.3.1 reference.
Read the [detailed reference and examples](../../docs/agents/react.md#user-supplied-react-1931-reference)
for its full explanations, 15 examples, API tables, and evidence boundaries.
This file states the corresponding implementation and review requirements.

Keep the broader [coding standards](../../CODING_STANDARDS.md#react-rendering-hooks-and-identity),
[component policy](component-naming.md), [route policy](route-special-files.md),
and [form contract](form-architecture.md) in force. Those local conventions can
be stricter than React itself. The user's requested full topic coverage is
intentional; maintain this rule and the detailed reference together.

Model mutually exclusive phases with one discriminated `status` and let
TypeScript narrow branch data. Do not restore `isLoading`/`isError` when
`status` already represents them. Independent flags remain valid.
Presentation-only hooks may be composed directly; do not add single-line
wrappers just to satisfy a naming heuristic. Inject service dependencies at
operation boundaries, as in `src/lib/profile.ts`, to test logic independently
of Firebase; do not pass service containers through presentational fields.
A Firebase Auth Effect subscription does not suspend automatically; retain a
tested loading branch instead of inventing a Promise wrapper.

## 1. Overview and supported versions

Use installed React/React DOM 19.3.1 and Compiler 1.0.0 as the baseline. Verify
the owning package, installed types, framework integration, and build pipeline
before adopting an API from live documentation.

The reference describes 18 ordinary stable hooks from `react` plus
`useFormStatus` from `react-dom`, six built-in components, ten other modern
React APIs, and eight legacy React APIs. Treat those as catalog counts. They
exclude the resource API `use`, deprecated/unstable hooks, custom hooks,
HTML/SVG elements, and renderer entry points. Do not turn the counts into a
claim about every export or an obligation to use every feature.

## 2. Hooks

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

## 3. Built-in components

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

## 4. Other modern React APIs

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
Neither establishes authorization or Next.js cache invalidation policy.

## 5. React DOM and rendering APIs

| API group | APIs | Required guidance |
| --- | --- | --- |
| DOM integration | `createPortal`, `flushSync` | Preserve portal focus/event semantics; use synchronous flushing only for a necessary external integration. |
| Resource hints | `prefetchDNS`, `preconnect`, `preload`, `preloadModule`, `preinit`, `preinitModule` | Match the resource and owning framework; avoid speculative or duplicate loading policies. |
| Browser-only subtree | `browser` | Import from `react-dom`, consume through `use` in a compatible Suspense boundary, and handle browser API failures. |
| Form reset | `requestFormReset` | Reset uncontrolled inputs intentionally; preserve controlled and RHF-owned values. |
| Client roots | `createRoot`, `hydrateRoot` | Import from `react-dom/client`; let Next.js own application roots and hydration. |
| Server streams | `renderToReadableStream`, `renderToPipeableStream` | Respect Web/Node stream contracts and framework ownership. |
| Resuming server rendering | `resume`, `resumeToPipeableStream` | Use compatible postponed render state; these are framework/renderer capabilities. |
| Server strings | `renderToString`, `renderToStaticMarkup` | Understand limited Suspense behavior and that static markup cannot be hydrated. |
| Static rendering | `prerender`, `prerenderToNodeStream`, `resumeAndPrerender`, `resumeAndPrerenderToNodeStream` | Use `react-dom/static` in a supported rendering pipeline; do not replace Next.js partial prerendering with an isolated recipe. |

`browser` is present in installed React DOM 19.3.1, its types, and Next.js's
bundled renderer. Preserve this correction to the earlier local documentation.
`requestFormReset` is also present even though the input omitted it. A
`"use client"` directive alone does not prevent server prerendering.

## 6. HTML and SVG

Keep native elements distinct from built-in React components. Use semantic
structure (`div`, `section`, `main`, `article`), navigation (`nav`, `a`), text
(`p`, `span`, `h1`–`h6`), forms (`form`, `input`, `select`, `textarea`), grouping
and labels (`label`, `fieldset`, `legend`), and native UI (`dialog`, `details`,
`summary`) according to their accessibility and behavior contracts.

Treat `title`, `meta`, and `link` as metadata/resource integrations owned with
the framework. Preserve proper handling of `script`, `style`, and `img` and
SVG elements such as `svg`, `path`, and `circle`. React escaping does not make
arbitrary HTML or URLs safe. Review labels, keyboard behavior, native props,
focus, and controlled-input semantics at the actual usage boundary.

## 7. Forms and Actions

Understand `<form action={fn}>`, submit-button `formAction`, `useActionState`,
`useFormStatus`, and `useOptimistic` as related but distinct tools. An Action
may execute on the client; only a properly marked/integrated Server Function
crosses that server boundary.

Validate input, handle failures/pending state, prevent inappropriate duplicate
submissions, and authenticate/authorize server operations. Choose controlled
or uncontrolled input ownership deliberately. Do not duplicate form state in
local state, nest forms, or lose new edits when an old submission completes.
Successful Actions can reset uncontrolled fields, so review the reset contract.

Preserve the current React Hook Form and Firebase profile architecture; the
reference's form Action example is explanatory, not a request to migrate it.

## 8. Server Components and Server Functions

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

## 9. React Compiler

Compiler can automate eligible `memo`, `useMemo`, and `useCallback` style
optimizations during build. Prefer pure code, measure actual performance,
and keep correctness independent of memoization. Compiler cannot fix invalid
logic, guarantee third-party mutable API compatibility, or manage resources.

Use `"use memo"` to request compilation only under a supported configuration;
use `"use no memo"` for a documented reason rather than hiding a problem.
Resolve React rule violations and inspect actual diagnostics. Check pinned
Compiler 1.0.0 before copying newer options. Next.js enables application
compilation; installing Compiler does not enable it in every Vite/Ladle/Vitest
pipeline or establish that every component was optimized.

## 10. Rules of React

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

## 11. Upstream hook and Compiler lint rules

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

Use [native diagnostic ownership](../../TOOLING.md#react-documentation-and-diagnostic-workflow)
first. Upstream names describe semantics; they do not establish that this
project installs ESLint or implements every check through Biome. Enable
compatible checks at their intended severity and use Compiler, React Doctor,
existing guards, and tests for their actual scopes. Do not install a second
lint stack or add duplicate custom syntax parsers as a documentation side effect.

## 12. Identity, composition, and Error Boundaries

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

## 13. Legacy and removed APIs

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
mechanically rewrite valid boundaries. Next.js owns this application's roots.

## 14. Fragment refs

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

## 15. Experimental APIs

Treat `experimental_taintObjectReference` and `experimental_taintUniqueValue`
as experimental server/client data-boundary tools, not stable default exports.
Check the runtime channel and framework integration before use. Object/value
tainting cannot replace authentication, authorization, input validation, or
control of sensitive derived data. Do not adopt an experimental dependency
simply because a live reference describes it.

## 16. Version history and applicability

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

## 17. Feature selection

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

Choose a feature for the actual need; retain simpler working code and existing
RHF/Firebase ownership when a modern alternative adds no concrete benefit.

## 18. Implementation and review checklist

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

## 19. Documentation, evidence, and tooling

Use the [official documentation directory](../../docs/agents/react.md#19-official-documentation)
for React APIs/hooks/components, React DOM and HTML/SVG, Server Components,
Compiler, Rules of React, hook lint rules, legacy APIs, the React 19.3 release,
and the official source repositories. Resolve the correct topic and installed
version before copying an example. Use immutable revisions for reproducible
source review. Report unavailable Context7/Serena/network tools accurately.

Match [lifecycle verification](../../TESTING.md#react-rules-and-lifecycle-verification)
to real resources, hydration, and hide/reveal behavior. A source lookup,
configuration regression, or lint success is not complete behavior coverage
or profiling. Follow [security guidance](../../SECURITY.md#react-rendering-and-input-boundaries)
at HTML/URL/data boundaries; optimistic UI and context do not authorize access.

Persist verified knowledge through the [save skill](../skills/save/SKILL.md)
and its canonical owners. Do not install recommended skills, change lint
stacks, upgrade dependencies, replace form libraries, or rewrite accepted ADRs
as a side effect of reference maintenance. Preserve unrelated local edits.

## 20. Application principle

Choose the simplest supported abstraction that correctly solves the problem.
The full catalog covers hooks, components, React/DOM rendering, native
elements, Actions, Server Components/Functions, Compiler, lint, identity,
legacy APIs, Fragment refs, experiments, version context, feature selection,
and accessibility/security/testing practices. Apply those explanations to the
concrete code instead of requiring every listed feature in every project.

When refreshing this rule, preserve topic coverage, keep examples and evidence
in the detailed reference, and update both files when a verified capability
or applicability constraint changes.
