# React implementation and review rules: Hooks, Component Primitives, and Core APIs

<!-- cspell:words preinit Pipeable unobserve Rects -->

Apply this rule to React implementation, review, and reference maintenance.
The 20 topics from the React 19.3.1 reference are organized contextually across 3 rules:
- **Hooks, Primitives, and Core APIs** (`react-hooks-core.md`): Sections 1â€“4, 12
- [**DOM, Forms, and Server Architecture**](react-dom-server.md): Sections 5â€“8, 14, 15
- [**Quality, Compiler, and Review**](react-quality.md): Sections 9â€“11, 13, 16â€“20

Read the [detailed reference and examples](../../docs/agents/react.md#user-supplied-react-1931-reference)
for full explanations, 15 examples, API tables, and evidence boundaries.

Keep the broader [coding standards](../../CODING_STANDARDS.md#react-rendering-hooks-and-identity),
[component policy](components-contracts.md), [route policy](nextjs-route-files.md),
and [form contract](forms-architecture.md) in force. Those local conventions can
be stricter than React itself.

Model mutually exclusive phases with one discriminated `status` and let
TypeScript narrow branch data. Do not restore `isLoading`/`isError` when
`status` already represents them. Independent flags remain valid.
Presentation-only hooks may be composed directly; do not add single-line
wrappers just to satisfy a naming heuristic. An asynchronous subscription Effect
does not suspend automatically; retain a tested loading branch instead of
inventing an ad-hoc Promise wrapper.

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
Neither establishes authorization or durable server-side cache invalidation policy.

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


