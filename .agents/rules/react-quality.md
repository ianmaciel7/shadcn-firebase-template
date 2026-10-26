# React implementation and review rules: quality, Compiler, and review

Apply this rule to React Compiler optimization, Rules of React, lint diagnostics, legacy migration, feature selection, and verification workflows.
Contextual organization across the 3 React rule files:

- [**Hooks, component primitives, and core APIs**](react.md): Sections 1–4, 12
- [**DOM, forms, and server architecture**](react-dom.md): Sections 5–8, 14, 15
- **Quality, Compiler, and review** (`react-quality.md`): Sections 9–11, 13, 16–20

Read the [detailed reference and examples](../../docs/agents/react.md#user-supplied-react-1931-reference)
for full explanations, 15 examples, API tables, and evidence boundaries.

## 9. React Compiler

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

Use the project's native diagnostic tooling first. Upstream names describe
semantics; they do not establish that every check is implemented in the
project's linter. Enable compatible checks at their intended severity and use
Compiler diagnostics, existing guards, and tests for their actual scopes. Do not
install a second lint stack or add duplicate custom syntax parsers.

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
mechanically rewrite valid boundaries.

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

Choose a feature for the actual need; retain simpler working code when a modern
alternative adds no concrete benefit.

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
source review.

Match [lifecycle verification](../../TESTING.md#react-rules-and-lifecycle-verification)
to real resources, hydration, and hide/reveal behavior. A source lookup,
configuration regression, or lint success is not complete behavior coverage
or profiling. Follow [security guidance](../../SECURITY.md#react-rendering-and-input-boundaries)
at HTML/URL/data boundaries; optimistic UI and context do not authorize access.

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
