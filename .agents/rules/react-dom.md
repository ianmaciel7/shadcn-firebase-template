# React implementation and review rules: DOM, forms, and server architecture

<!-- cspell:words preinit Pipeable unobserve Rects -->

Apply this rule to React rendering boundaries, DOM integration, form workflows, and Server Component contracts.
Contextual organization across the 3 React rule files:

- [**Hooks, component primitives, and core APIs**](react.md): Sections 1–4, 12
- **DOM, forms, and server architecture** (`react-dom.md`): Sections 5–8, 14, 15
- [**Quality, Compiler, and review**](react-quality.md): Sections 9–11, 13, 16–20

Read the [detailed reference and examples](../../docs/agents/react.md#user-supplied-react-1931-reference)
for full explanations, 15 examples, API tables, and evidence boundaries.

## 5. React DOM and rendering APIs

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

## 6. HTML and SVG

Keep native elements distinct from built-in React components. Use semantic
structure (`div`, `section`, `main`, `article`), navigation (`nav`, `a`), text
(`p`, `span`, `h1`â€“`h6`), forms (`form`, `input`, `select`, `textarea`), grouping
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
