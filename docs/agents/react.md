# React documentation reference

<!-- cspell:words preinit Pipeable unobserve Rects -->

## Scope and evidence

Reviewed on 2026-10-21 against the complete official React documentation
content tree at
[`ae5e48074d4f73f1e349eda2a66841f9a959023e`](https://github.com/reactjs/react.dev/tree/ae5e48074d4f73f1e349eda2a66841f9a959023e/src/content).
The recursive tree response was non-truncated. Every Markdown/MDX body under
`src/content` was retrieved and verified with Git's blob SHA-1 algorithm:
**226 files**, 226 distinct blobs, and 4,028,398 source bytes.

The [machine-readable inventory](react-sources.json) records paths, blob hashes,
immutable revisions, installed versions, and the separate runtime error catalog.
The review combines a complete inventory and full-text scan with focused
applicability checks against local code and installed runtime exports. Retrieval
is not evidence that every example is implemented or behaviorally tested here.
Historical blog posts, experimental badges, sandbox material, and optional
tooling remain source context rather than automatic project policy.

The installed **React and React DOM 19.3.1** match the latest stable runtime
release checked during this review. Its source revision is
[`61aa00df822d0eb76d0362eb8b6fdd3527693efe`](https://github.com/react/react/tree/61aa00df822d0eb76d0362eb8b6fdd3527693efe).
React Compiler is independently pinned at **1.0.0**; a current documentation
page does not establish that a newer compiler option works in that version.

React documentation is updated within a major version rather than published
for every minor/patch. Verify installed runtime, types, compiler, and framework
support before copying a live example. Upstream references can redirect from a historical repository namespace; use
the canonical `react/react` repository and immutable refs for reproducible lookups.

| Source group | Files | Applicability |
| --- | ---: | --- |
| Learn | 52 | Components, state, Effects, refs, context, custom hooks, installation, and Compiler guides |
| React API | 49 | Components, hooks, Actions, resource APIs, and optional newer/experimental sections |
| React DOM | 41 | DOM props, forms, resources, rendering/hydration, and legacy migration APIs |
| Rules of React | 4 | Purity, immutability, hook usage, and React-owned invocation |
| Compiler API | 10 | Configuration/directives; verify against installed Compiler 1.0.0 |
| ESLint hook/Compiler reference | 18 | Rule semantics; not a claim that this project installs ESLint |
| React DevTools reference | 2 | Runtime inspection and performance tooling |
| Server Components/Functions | 5 | Framework integration, directives, serialization, and server boundaries |
| Blog | 25 | Historical releases, migration, research, foundation, and security context |
| Community | 9 | Versioning, contribution, and ecosystem guidance |
| Warnings | 6 | Hook, prop, accessibility, and deprecated-test-tool diagnostics |
| Narrative errors | 3 | Specific and generic error guidance |
| Root and versions | 2 | Current entry point and major-version archive policy |
| **Total** | **226** | Complete recorded content scope |

## Runtime error catalog

The site generates minified-error pages from a separate JSON catalog, as shown
in its [error decoder implementation](https://github.com/reactjs/react.dev/blob/ae5e48074d4f73f1e349eda2a66841f9a959023e/src/pages/errors/%5BerrorCode%5D.tsx).
The three narrative error documents are not the entire decoder catalog.

Retrieved and verified `scripts/error-codes/codes.json` from the stable release
and current React source revision
[`9ffcb463b0ab01a42e781d4dc2e00f3a1b97a188`](https://github.com/react/react/blob/9ffcb463b0ab01a42e781d4dc2e00f3a1b97a188/scripts/error-codes/codes.json).
Both revisions contain **599 messages** with the same blob hash
`653e4ec972d54976b497bd81e0532b720a3df2b0`.
Decode production errors against the actual runtime version and reproduce with
development diagnostics where possible; do not invent one permanent guard for
each catalog entry. A catalog snapshot is not a current vulnerability audit.

## Current project applicability

Next.js owns the application's React roots, RSC transport, streaming, and
hydration. Compiler is enabled through `next.config.ts`. Ladle and Vitest use
their own Vite pipeline; package installation does not prove that pipeline
transforms every component with Compiler. Existing browser Firebase workflows
use focused custom hooks and React Hook Form providers.

The current avatar hook synchronizes an object URL in an Effect with cleanup.
The viewport hook uses `useSyncExternalStore` with a `false` initial server
snapshot. Those are concrete external-system contracts; blanket removal of
Effects or copying a browser-only render example would be inappropriate.

Runtime export inspection confirmed `Activity`, `ViewTransition`,
`addTransitionType`, `use`, `useEffectEvent`, `useActionState`, and `useOptimistic`
in the installed React 19.3.1 package. The 2026-10-23 verification corrects the
earlier `browser` statement: `browser` is exported by **React DOM**, not React.
The installed React DOM types also declare its opaque usable return value.
Experimental Suspense and other optional examples need their own support checks. Available
APIs do not become required app features merely because they appear in docs.

## User-supplied React 19.3.1 reference

This section preserves all 20 topics supplied on 2026-10-23, with explanations,
API tables, examples, selection guidance, and the checklist. The matching
[agent rules](../../.agents/rules/react.md) (along with `react-dom.md` and `react-quality.md`) turn each topic into implementation
and review requirements. Documentation is in English under the repository's
language convention. Examples are independent teaching snippets; supporting
components, modules, and services must be supplied by their application.

The input is a user-provided reference, not an official React publication.
Local package exports, installed types, and renderer source were checked.
The earlier upstream inventory keeps its 2026-10-21 retrieval date; the release
summary below distinguishes the input's historical claims from local evidence.
Existing architecture and stricter repository policies continue to apply.

### 1. Overview

| Category | Count in the supplied catalog | Scope |
| --- | ---: | --- |
| Ordinary stable hooks in `react` | 18 | Named `useX` hooks below |
| Current form hook in `react-dom` | 1 | `useFormStatus` |
| Total ordinary hooks | 19 | Excludes the resource API `use`, unstable hooks, and deprecated aliases |
| Built-in React components | 6 | Excludes HTML/SVG elements |
| Other modern React APIs | 10 | The ten entries in section 4 |
| Legacy React APIs | 8 | The eight entries in section 13 |

These counts describe the catalog, not every public or internal package export.
They exclude custom hooks, renderer entry points, experimental features, and
native HTML/SVG elements. React and React DOM are installed at 19.3.1; Compiler
has its own version, pinned at 1.0.0. Check the owning package before importing.

### 2. Official hooks

Hooks let function components use state, context, refs, external synchronization,
transitions, and integrations. Ordinary hooks belong at the top level of React
components or custom hooks. Keep the distinct `use` exception in section 4.

#### 2.1 State and data management

| Hook | Purpose | When to use it |
| --- | --- | --- |
| `useState` | Holds local state and its updater. | Inputs, selections, toggles, counters. |
| `useReducer` | Applies actions to state through a pure reducer. | Related state with several transitions. |
| `useContext` | Reads the nearest provider's shared value. | Theme, language, session. |
| `useActionState` | Holds an Action result and pending state. | Form results and asynchronous Actions. |
| `useOptimistic` | Presents temporary state during an Action. | Comments, likes, and optimistic updates. |

Use functional updaters when the next value depends on previous state:

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount((value) => value + 1)}>{count}</button>
  );
}
```

A reducer makes related transitions explicit without mutating the prior state:

```tsx
import { useReducer } from "react";

type State = { count: number };
type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
    </>
  );
}
```

Prefer `useState` for simple independent values and `useReducer` for related
transitions. Calculate values already derivable from props/state during render.
Keep local state local rather than placing every value in Context. Optimistic
feedback needs a pending operation, a confirmed base value, and failure handling;
it does not confirm that a write succeeded or that access is authorized.

#### 2.2 Effects and synchronization

| Hook | Purpose | When to use it |
| --- | --- | --- |
| `useEffect` | Synchronizes with external systems after commit; usually after paint for non-interaction work. | Listeners, subscriptions, connections. |
| `useLayoutEffect` | Runs layout synchronization before browser repaint. | Measuring and positioning visible content. |
| `useInsertionEffect` | Provides an insertion phase for library-managed styles. | CSS-in-JS implementation. |
| `useEffectEvent` | Reads current values in non-reactive logic called from an Effect. | Effect logic that must see fresh values without reacting to them. |

Avoid storing a derived name and synchronizing it through an Effect:

```tsx
import { useEffect, useState } from "react";

function RedundantName() {
  const [firstName] = useState("");
  const [lastName] = useState("");
  const [fullName, setFullName] = useState("");
  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);
  return <p>{fullName}</p>;
}
```

Derive the value directly instead:

```tsx
import { useState } from "react";

function DerivedName() {
  const [firstName] = useState("");
  const [lastName] = useState("");
  const fullName = `${firstName} ${lastName}`;
  return <p>{fullName}</p>;
}
```

Put work caused by a user action in its handler. Pair listeners, subscriptions,
timers, observers, connections, and object URLs with cleanup. Invalidate obsolete
asynchronous results, including resources returned after cleanup. Prefer
`useEffect` when layout blocking is unnecessary. `useEffect` is not a guarantee
that every invocation happens after paint. Do not use `useEffectEvent` to hide
reactive dependencies or as an ordinary click handler.

#### 2.3 Refs and imperative interfaces

| Hook | Purpose | When to use it |
| --- | --- | --- |
| `useRef` | Keeps a mutable reference without scheduling renders. | DOM nodes, timer handles, values not displayed as state. |
| `useImperativeHandle` | Defines the interface exposed through a ref. | A small `focus()`, `clear()`, or `reset()` interface. |

```tsx
import { useRef } from "react";

function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </>
  );
}
```

Function components can receive a ref as a prop in React 19:

```tsx
import type { Ref } from "react";

type InputProps = { ref?: Ref<HTMLInputElement> };

function Input({ ref }: InputProps) {
  return <input ref={ref} />;
}
```

New React 19 wrappers do not need `forwardRef` just to forward a ref.
`forwardRef` still exists; the preference for ref props is not a removal claim.
Keep imperative handles small, preserve native ref contracts, and release any
registrations owned by callback refs. A ref does not make render-time resource
allocation or arbitrary mutable reads safe.

#### 2.4 Performance and concurrency

| Hook | Purpose | When to use it |
| --- | --- | --- |
| `useMemo` | Reuses a calculation result when its dependencies match. | Expensive calculations or necessary identity contracts. |
| `useCallback` | Reuses a function identity when dependencies match. | Callbacks with a concrete stability requirement. |
| `useTransition` | Marks updates as non-urgent and exposes pending state. | Navigation and expensive interface updates. |
| `useDeferredValue` | Lets part of the UI use a deferred version of a value. | Expensive results driven by an urgent input. |

With `useTransition`, the caller controls the update and can display `isPending`.
With `useDeferredValue`, a consumer defers rendering based on a value without
controlling the original update. Keep the state driving a text input urgent.
Transitions do not implement debounce, throttling, network cancellation, request
ordering, or CPU parallelism through Web Workers.

Compiler can reduce the need for manual memoization in eligible code. Measure
before optimizing; do not add memoization everywhere or rely on it for
correctness or resource lifetime. The current transition API requires another
transition around updates after `await` when they must remain non-urgent.

#### 2.5 Integrations, accessibility, and forms

| Hook | Package | Purpose and use |
| --- | --- | --- |
| `useId` | `react` | Stable accessibility relationships between labels, inputs, and descriptions; not list keys. |
| `useDebugValue` | `react` | A custom hook's diagnostic label in React DevTools. |
| `useSyncExternalStore` | `react` | Consistent subscription/snapshot integration with an external store. |
| `useFormStatus` | `react-dom` | Submission status of an ancestor form, including pending feedback. |

```tsx
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </button>
  );
}
```

The status hook must run in a descendant of the form it observes; calling it in
the component that returns that form does not observe that form. External-store
snapshots must be stable while unchanged and match server/hydration output.
Use `useDebugValue` for useful custom-hook diagnostics, not application state.

### 3. Built-in React components

| Component | Purpose | Use |
| --- | --- | --- |
| `Fragment` | Groups children without an extra DOM element. | Structural composition. |
| `StrictMode` | Adds development checks. | Finding impure render logic and cleanup problems. |
| `Suspense` | Displays a fallback when supported descendants suspend. | Declarative loading. |
| `Profiler` | Reports render timing. | Investigating rendering performance. |
| `Activity` | Hides/reveals UI while preserving state. | Inactive tabs and temporarily hidden interfaces. |
| `ViewTransition` | Coordinates visual transitions. | Animating supported navigation/update transitions. |

#### 3.1 Suspense

```tsx
import { lazy, Suspense } from "react";

const Settings = lazy(() => import("./settings"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Settings />
    </Suspense>
  );
}
```

The example assumes `./settings` has a default component export. Suspense does
not automatically track every request or a fetch started in an Effect. Use
compatible resources and framework integration. A rejected resource needs an
Error Boundary; a loading fallback does not replace error handling.

#### 3.2 Activity

```tsx
import { Activity, type ReactNode } from "react";

function Tabs({
  activeTab,
  profile,
  security,
}: {
  activeTab: string;
  profile: ReactNode;
  security: ReactNode;
}) {
  return (
    <>
      <Activity mode={activeTab === "profile" ? "visible" : "hidden"}>
        {profile}
      </Activity>
      <Activity mode={activeTab === "security" ? "visible" : "hidden"}>
        {security}
      </Activity>
    </>
  );
}
```

Hidden Activity preserves child state and DOM, hides the UI, and tears down
Effects. Showing it restores Effects. Cleanup therefore does not necessarily
mean permanent unmount. Verify subscription, media, focus, and form behavior
when hiding and revealing content.

#### 3.3 ViewTransition

```tsx
import { startTransition, useState, ViewTransition } from "react";

function Panel() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <button
        onClick={() =>
          startTransition(() => setVisible((value) => !value))
        }
      >
        Toggle
      </button>
      <ViewTransition>
        {visible ? <section>Animated content</section> : null}
      </ViewTransition>
    </>
  );
}
```

The `enter`, `exit`, `update`, `share`, and `default` props select transition
classes/behavior for the respective phases. Coordinate updates through a
supported transition and inspect actual browser support and reduced-motion
behavior. The installed React 19.3.1 runtime exports the component; an export
check does not establish that an animation was visually tested.

### 4. Other modern React APIs

| API | Purpose |
| --- | --- |
| `createContext()` | Defines a context read through its nearest provider. |
| `lazy()` | Loads a component on demand. |
| `memo()` | Allows skipping renders when props compare equal; not a correctness guarantee. |
| `startTransition()` | Marks updates as non-urgent without returning a pending flag. |
| `addTransitionType()` | Adds a type identifying a transition's cause or purpose. |
| `act()` | Flushes related React work for tests; prefer the test library's supported integration. |
| `cache()` | Shares results of a function within Server Component rendering. |
| `cacheSignal()` | Exposes cancellation tied to the server cache lifetime. |
| `captureOwnerStack()` | Captures React owner information in development. |
| `use()` | Reads supported resources, including Promises and contexts, during render. |

#### 4.1 The use API

```tsx
import { Suspense, use } from "react";

type ProfileData = { displayName: string };

function Profile({ profilePromise }: { profilePromise: Promise<ProfileData> }) {
  const profile = use(profilePromise);
  return <h1>{profile.displayName}</h1>;
}

function ProfileSection({
  profilePromise,
}: {
  profilePromise: Promise<ProfileData>;
}) {
  return (
    <Suspense fallback={<p>Loading profile...</p>}>
      <Profile profilePromise={profilePromise} />
    </Suspense>
  );
}
```

Unlike ordinary hooks, `use` can appear in conditions and loops. It still belongs
in a React component or custom hook during render, not an event handler. Do not
wrap it in a local `try/catch`. Provide a stable resource from a compatible
source rather than creating an uncached Promise on each client render. Handle
rejection through an appropriate Error Boundary or resource strategy.

#### 4.2 cache versus useMemo

| Aspect | `cache()` | `useMemo()` |
| --- | --- | --- |
| Main environment | Server Components | A component/custom hook render |
| Goal | Share/deduplicate calls to a cached function. | Reuse a calculation result. |
| Scope | The server render/request's cache scope. | The component instance's memoized dependencies. |
| Typical work | Server queries and calculations. | Expensive render-time calculations. |

Reuse the same cached function to share work. Neither API defines authorization
or automatically provides durable cross-request caching. Next.js data caching
has its own ownership and invalidation contracts.

### 5. React DOM APIs

#### 5.1 DOM integration and resource hints

| API in `react-dom` | Purpose |
| --- | --- |
| `createPortal()` | Renders children in another DOM node while retaining React tree relationships. |
| `flushSync()` | Forces updates to flush synchronously for a necessary integration; use sparingly. |
| `prefetchDNS()` | Hints that DNS resolution will be needed. |
| `preconnect()` | Hints that a connection should be established early. |
| `preload()` | Starts loading a resource early. |
| `preloadModule()` | Starts loading a JavaScript module early. |
| `preinit()` | Prepares a stylesheet or script for use. |
| `preinitModule()` | Prepares a module for execution. |
| `browser()` | Produces a renderer usable that defers a subtree to browser rendering. |
| `requestFormReset()` | Requests reset of a form's uncontrolled inputs. |

The final entry corrects an omission in the input's DOM catalog. Resource hints
must correspond to real resources and framework ownership. Portals still need
accessible focus and event behavior; `flushSync` can hurt performance and reveal
fallbacks, so it is not a general state-update strategy.

```tsx
"use client";

import { Suspense, use } from "react";
import { browser } from "react-dom";

function BrowserOnlyContent() {
  use(browser("Requires browser APIs"));
  return <p>{window.localStorage.getItem("theme")}</p>;
}

export function Content() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <BrowserOnlyContent />
    </Suspense>
  );
}
```

`browser` belongs to React DOM, is present in the installed package and Next.js
bundled renderer, and has an installed TypeScript declaration for its opaque
usable. The earlier local statement that it was absent was incorrect. This is
a capability example: storage access may fail in a browser and still needs an
error strategy. A client directive alone does not exclude server prerendering.

#### 5.2 Browser rendering

| API in `react-dom/client` | Purpose |
| --- | --- |
| `createRoot()` | Creates a root to render into a browser container. |
| `hydrateRoot()` | Attaches React to compatible server-rendered HTML. |

Next.js creates and hydrates application roots. Do not add a second root inside
an ordinary route just because these entry points exist. Initial markup and
accessibility semantics must agree across server rendering and hydration.

#### 5.3 Server-side rendering

| API in `react-dom/server` | Purpose |
| --- | --- |
| `renderToReadableStream()` | Streams HTML through Web Streams. |
| `renderToPipeableStream()` | Streams HTML through Node streams. |
| `resume()` | Resumes postponed HTML rendering through Web Streams. |
| `resumeToPipeableStream()` | Resumes postponed HTML rendering through Node streams. |
| `renderToString()` | Returns HTML as a string; has limited Suspense behavior. |
| `renderToStaticMarkup()` | Returns static HTML that cannot be hydrated. |

#### 5.4 Static rendering

| API in `react-dom/static` | Purpose |
| --- | --- |
| `prerender()` | Produces prerendered HTML through Web Streams. |
| `prerenderToNodeStream()` | Produces prerendered HTML through Node streams. |
| `resumeAndPrerender()` | Resumes prerendering through Web Streams. |
| `resumeAndPrerenderToNodeStream()` | Resumes prerendering through Node streams. |

These APIs support renderer/framework implementations and partial prerendering.
All named entries above were found in the installed entry points. Presence does
not authorize replacing Next.js's rendering, streaming, caching, or hydration.

### 6. HTML and SVG elements

| Category | Examples |
| --- | --- |
| Structure | `div`, `section`, `main`, `article` |
| Navigation | `nav`, `a` |
| Text | `p`, `span`, `h1` through `h6` |
| Forms | `form`, `input`, `select`, `textarea` |
| Accessible grouping and labels | `label`, `fieldset`, `legend` |
| Native interface | `dialog`, `details`, `summary` |
| Metadata | `title`, `meta`, `link` |
| Resources | `script`, `style`, `img` |
| Graphics | `svg`, `path`, `circle` |

React supports native HTML/SVG elements in addition to the six built-in React
components. Preserve semantic markup, labels, keyboard operation, native props,
and controlled-input contracts. Metadata/resource integration must respect
Next.js ownership; arbitrary HTML and URL input still requires trust checks.

### 7. Modern forms and Actions

| Feature | Purpose |
| --- | --- |
| `<form action={fn}>` | Runs a function as the form's submission Action. |
| `<button formAction={fn}>` | Chooses the Action for a particular submit button. |
| `useActionState` | Tracks an Action result and pending state. |
| `useFormStatus` | Reads the surrounding form's status. |
| `useOptimistic` | Presents temporary feedback during an Action. |

```tsx
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

function ProfileForm({
  save,
}: {
  save: (data: FormData) => void | Promise<void>;
}) {
  return (
    <form action={save}>
      <label htmlFor="displayName">Name</label>
      <input id="displayName" name="displayName" />
      <SubmitButton />
    </form>
  );
}
```

Validate inputs and handle failures, pending states, and duplicate submissions.
Authenticate and authorize server operations. Choose controlled/uncontrolled
inputs intentionally and avoid mirrored state. A successful form Action can
reset uncontrolled inputs; decide whether that reset is appropriate and protect
new edits from an older submission's completion. Client Actions are not
automatically Server Functions. The current profile keeps React Hook Form and
Firebase; this example is not a migration instruction.

### 8. React Server Components

#### 8.1 Server and Client Component capabilities

| Capability | Server Component | Client Component |
| --- | --- | --- |
| Read private server resources | Yes, within server authorization. | Through an authorized server interface. |
| `useState` and interactive event handlers | No. | Yes. |
| `useEffect` | No. | Yes, on the client. |
| Async component for data reading | Supported. | Not an equivalent general async component model. |
| Render Client Components | Yes. | Yes. |
| Access browser APIs | No. | When executing in the browser. |
| Contribute to initial HTML | Yes. | Yes, through framework server rendering. |

Client Components can be prerendered on the server. Their directive defines a
module-graph boundary, not an instruction to skip SSR. Pass server-rendered
content through props/slots rather than importing a server implementation into
a client graph. Keep private resources and credentials on the server.

#### 8.2 Directives and Server Functions

| Directive | Meaning |
| --- | --- |
| `"use client"` | Establishes a client module boundary and its transitive client imports. |
| `"use server"` | Marks asynchronous Server Functions, at module or supported function scope. |

```tsx
"use server";

export async function updateProfile(formData: FormData) {
  const displayName = String(formData.get("displayName") ?? "");
  // Validate displayName, authenticate, authorize, and persist on the server.
}
```

The example intentionally does not implement persistence. `"use server"` is
not a generic Server Component declaration and does not secure a function.
Every remotely invoked operation must validate inputs and permissions and
respect the framework's serialization and transport contracts.

### 9. React Compiler

Compiler optimizes eligible components and hooks during build. It can reduce
manual `memo`, `useMemo`, and `useCallback` work by reusing values/functions and
component output where safe. It cannot repair incorrect logic, provide resource
lifetime guarantees, or optimize every third-party mutable integration.

| Directive | Meaning |
| --- | --- |
| `"use memo"` | Opts a supported function into compilation under the configured mode. |
| `"use no memo"` | Opts a function out of compilation. |

```tsx
function LegacyWidget() {
  "use no memo";
  return <div>Legacy widget</div>;
}
```

Prefer pure code, measure performance, and use directives for a concrete reason.
Resolve React rule violations before attributing a problem to Compiler. Next.js
enables Compiler 1.0.0 here; Ladle/Vitest have separate Vite pipelines. Package
installation does not establish that every pipeline or component is compiled.

### 10. Rules of React

| Rule/concept | Implementation and review requirement |
| --- | --- |
| Purity | Render has no externally visible side effects. |
| Idempotence | Equivalent inputs yield equivalent render results. |
| Immutability | Do not mutate received props, state, context, or hook values. |
| Side effects outside render | Use handlers for user actions and Effects for external synchronization. |
| Hooks at the top level | Keep ordinary hooks out of loops, conditions, nested callbacks, and early-return branches. |
| Hooks in React functions | Call them in components/custom hooks, not ordinary utilities or event handlers. |
| Components through JSX | Let React call components via `<Component />`, not ordinary function invocation. |
| Composition | Share interfaces and behavior through explicit composition where appropriate. |

Composition is an architectural recommendation; the repository's orchestration
and thin-route policies are stricter local conventions, not extra universal
Rules of React. The documented `use` exception does not relax ordinary-hook
ordering or render purity.

### 11. eslint-plugin-react-hooks reference

| Upstream rule | Concern |
| --- | --- |
| `rules-of-hooks` | Invalid hook ordering/call sites. |
| `exhaustive-deps` | Missing or incorrect reactive dependencies. |
| `component-hook-factories` | Factories creating unstable component/hook definitions. |
| `config` | Invalid Compiler configuration. |
| `error-boundaries` | Incorrect render error-handling patterns. |
| `gating` | Invalid conditional Compiler activation. |
| `globals` | Global mutation during render. |
| `immutability` | Mutation of immutable React snapshots. |
| `incompatible-library` | Library APIs incompatible with relevant optimizations. |
| `preserve-manual-memoization` | Loss of existing memoization guarantees. |
| `purity` | Impure calls during render. |
| `refs` | Invalid ref use during render. |
| `set-state-in-effect` | Unnecessary synchronous state changes inside Effects. |
| `set-state-in-render` | Problematic render-time state updates. |
| `static-components` | Recreated component definitions. |
| `unsupported-syntax` | Syntax unsupported by Compiler. |
| `use-memo` | Incorrect `useMemo` usage. |

For CI, enable diagnostics compatible with the project's actual configuration
and treat relevant violations at their intended severity. These 17 names are
reference material, not a claim that ESLint is installed here. Biome, Compiler,
React Doctor, existing guards, and behavior tests have distinct scopes. Consult
the native diagnostic ownership below before adding another lint stack.

### 12. Additional concepts and Error Boundaries

| Concept | Explanation |
| --- | --- |
| Error Boundary | Isolates descendant rendering failures and shows recovery UI. |
| `key` | Identifies siblings for reconciliation and intentional state resets. |
| `children` | Passes nested content for composition. |
| Props | The inputs received by a component. |
| Controlled components | Inputs whose displayed value/checked state React controls. |
| Uncontrolled components | Inputs whose current value is primarily maintained by the DOM. |
| Callback refs | Set up and clean up DOM/reference integrations. |
| Hydration | Attaches React behavior to server-rendered HTML. |
| Custom hooks | Share stateful behavior without sharing a particular state instance. |

There is no stable built-in hook implementing a full Error Boundary. A class
can use `static getDerivedStateFromError()` and `componentDidCatch()`; framework
boundaries can provide the integration. Async event-handler/Effect callback
failures need their own handling and do not automatically reach a render
boundary. Keep these responsibilities distinct:

| Mechanism | Responsibility |
| --- | --- |
| `Suspense` | Supported suspension and loading fallbacks. |
| Error Boundary | Rendering failures and recovery. |
| `Activity` | Visibility and preserved state. |
| `ViewTransition` | Visual change animation. |

### 13. Legacy and removed APIs

| Legacy API still available in React | Preferred direction for new code |
| --- | --- |
| `Children` | Explicit composition instead of child inspection when practical. |
| `cloneElement()` | Composition and explicit props. |
| `Component` | Function components ordinarily; classes remain valid for Error Boundaries. |
| `PureComponent` | Function components and suitable optimization. |
| `createElement()` | JSX. |
| `createRef()` | `useRef` inside a function component. |
| `forwardRef()` | Ref props in React 19 function components. |
| `isValidElement()` | Avoid inspecting elements without an actual integration need. |

| Removed API | Replacement |
| --- | --- |
| `ReactDOM.render()` | `createRoot()` from `react-dom/client`. |
| `ReactDOM.hydrate()` | `hydrateRoot()` from `react-dom/client`. |
| `findDOMNode()` | An explicit DOM ref. |
| `unmountComponentAtNode()` | `root.unmount()`. |
| `createFactory()` | JSX. |

Legacy availability is different from removal. Do not mechanically rewrite
working code or delete a class Error Boundary solely to remove a legacy name.
Next.js still owns root initialization and migration in this application.

### 14. Fragment refs

An explicitly named `Fragment` can receive a ref and expose a `FragmentInstance`
for interacting with several children without adding a DOM wrapper solely to
hold a ref. Shorthand `<>...</>` does not accept that ref. The supplied method
catalog is preserved below, with a local type-support distinction:

| Method | Purpose | Installed support checked |
| --- | --- | --- |
| `addEventListener()` | Register a listener on the group. | Renderer and React DOM type augmentation. |
| `removeEventListener()` | Remove a registered listener. | Renderer and types. |
| `dispatchEvent()` | Dispatch an event through the Fragment integration. | Renderer and types. |
| `focus()` | Focus the first eligible descendant. | Renderer and types. |
| `focusLast()` | Focus the last eligible descendant. | Renderer and types. |
| `blur()` | Remove focus from the relevant descendant. | Renderer and types. |
| `observeUsing()` | Observe child elements with a supported observer. | Renderer and types. |
| `unobserveUsing()` | End that observation. | Renderer and types. |
| `getClientRects()` | Get child DOM rectangles. | Renderer and types. |
| `getRootNode()` | Find the root according to Fragment semantics. | Renderer and types. |
| `compareDocumentPosition()` | Compare document positions. | Present in renderer source; absent from the installed `FragmentInstance` type augmentation. |
| `scrollIntoView()` | Bring grouped content into view. | Renderer and types; the installed signature takes an optional boolean. |

Respect the actual method signatures, clean up listeners/observers, and test
focus/layout behavior. The runtime/type mismatch for `compareDocumentPosition`
must be resolved before adopting it in typed application code; do not hide it
with an unchecked cast. Runtime/type presence does not constitute a browser
test or require replacing semantic HTML wrappers.

### 15. Experimental features

| Experimental API | Intended use |
| --- | --- |
| `experimental_taintObjectReference()` | Helps prevent a marked object reference from crossing a server/client boundary. |
| `experimental_taintUniqueValue()` | Helps prevent a marked value from being transmitted to a client. |

These names are not stable exports of the installed default React entry point.
An experimental channel, compatible framework, and separate support checks
would be needed. Taint APIs do not replace authentication, authorization,
validation, serialization rules, or control of all derived sensitive values.
Do not treat experimental documentation as a stable dependency requirement.

### 16. Features by version

| Version | Summary supplied in the input | Evidence/applicability boundary |
| --- | --- | --- |
| React 19.0 | Actions, `useActionState`, `useOptimistic`, `use`, form improvements, metadata, and ref props. | The current installed APIs and ref types support these capabilities; the earlier inventory includes release material. |
| React 19.2 | `Activity`, `useEffectEvent`, `cacheSignal`, Performance Tracks, and partial-rendering features. | Named APIs exist locally; Performance Tracks require actual supported tooling/profiling. |
| React 19.3 | Stable `ViewTransition`, `addTransitionType`, Fragment refs, `browser`, Trusted Types, and Context improvements in Server Components. | Named transition/browser exports and Fragment renderer methods were checked. Trusted Types and the scope of server Context changes are retained as input release claims, not independently reverified compatibility guidance. |
| React 19.3.1 | Improvements to React Server Component transport. | Installed version is confirmed; the transport-change summary is an input claim, not a separately verified patch changelog. |

The inventory includes the React 19.3 release document dated 2026-09-09.
Consult the release and security notes for exact behavior and affected ranges
before upgrades. A release table alone does not authorize moving client context
or browser APIs into Server Components, adopting a security policy, or upgrading
React independently of Next.js.

### 17. Choosing the appropriate feature

| Situation | Starting point |
| --- | --- |
| Simple local state | `useState` |
| Complex related transitions | `useReducer` |
| Shared contextual state | `createContext` with `useContext` |
| Compatible asynchronous resource reading | `use` with `Suspense` |
| Dynamic component loading | `lazy` with `Suspense` |
| Action submission result/pending state | `useActionState` |
| Submit-button status | `useFormStatus` |
| Temporary optimistic feedback | `useOptimistic` |
| External synchronization | `useEffect` |
| Non-reactive logic inside an Effect | `useEffectEvent` |
| External store | `useSyncExternalStore` |
| Controlled non-urgent update | `useTransition` |
| Deferred rendering based on an incoming value | `useDeferredValue` |
| Hidden UI whose state must survive | `Activity` |
| Visual transition animation | `ViewTransition` |
| DOM access | `useRef` |
| DOM interaction across grouped children | Fragment refs, subject to local signatures |
| Modals and overlays | `createPortal`, with accessible focus behavior |
| Rendering measurements | `Profiler` |
| Development diagnostics | `StrictMode` and the configured lint/Compiler tools |
| Rendering failure isolation | Error Boundary |
| Rendering optimization | Profiling and eligible Compiler optimization |

This table chooses a starting point, not a mandatory rewrite. Preserve existing
React Hook Form ownership and use the least complex supported abstraction.

### 18. Best-practice checklist

- [ ] Keep components and render calculations pure.
- [ ] Do not mutate props or state directly.
- [ ] Avoid duplicated derived state.
- [ ] Remove unnecessary Effects while preserving external synchronization.
- [ ] Implement cleanup for subscriptions and other external resources.
- [ ] Follow the Rules of Hooks and the specific `use` exception.
- [ ] Create custom hooks only for useful behavior abstractions.
- [ ] Prefer composition over inheritance where appropriate.
- [ ] Use React 19 ref props for new function-component wrappers.
- [ ] Use Actions when they fit the actual operation.
- [ ] Avoid local state that duplicates form-owned state.
- [ ] Respect Server/Client Component module boundaries.
- [ ] Validate and authorize every Server Function.
- [ ] Connect Suspense only to supported resources.
- [ ] Handle render failures with Error Boundaries.
- [ ] Evaluate Compiler support in the actual build pipeline.
- [ ] Enable and run the project's supported lint diagnostics.
- [ ] Measure performance before optimizing.
- [ ] Avoid manual memoization without a concrete reason.
- [ ] Consider Activity and ViewTransition when their behavior is needed.
- [ ] Preserve accessibility, including labels, focus, and motion preferences.
- [ ] Test critical behavior, asynchronous ordering, and cleanup.
- [ ] Prefer modern APIs for new code without needless legacy rewrites.

### 19. Official documentation

| Topic | Reference |
| --- | --- |
| React reference | <https://react.dev/reference/react> |
| Hooks | <https://react.dev/reference/react/hooks> |
| Built-in components | <https://react.dev/reference/react/components> |
| Modern APIs | <https://react.dev/reference/react/apis> |
| React DOM | <https://react.dev/reference/react-dom> |
| HTML and SVG components | <https://react.dev/reference/react-dom/components> |
| Server Components | <https://react.dev/reference/rsc/server-components> |
| Compiler | <https://react.dev/reference/react-compiler> |
| Rules of React | <https://react.dev/reference/rules> |
| ESLint hook rules | <https://react.dev/reference/eslint-plugin-react-hooks> |
| Legacy APIs | <https://react.dev/reference/react/legacy> |
| React 19.3 release | <https://react.dev/blog/2026/09/09/react-19-3> |
| React source | <https://github.com/react/react> |
| Documentation source | <https://github.com/reactjs/react.dev> |

The input's original React source URL uses a historical repository namespace;
the canonical source URL above matches the existing evidence inventory. Live
documentation may include newer or experimental material. Check installed
packages and immutable source revisions rather than claiming a current lookup
when a network or CLI tool is unavailable.

### 20. Summary and project application

The supplied catalog covers 19 ordinary hooks, six built-in components, ten
other React APIs, browser/server/static rendering, HTML/SVG support, Server
Components and Functions, Actions, Compiler, Fragment refs, visual transitions,
accessibility, security, lint, and legacy migration. Sections 1–19 preserve each
topic and its implementation limits instead of reducing the input to a list
of links. The matching persistent rule covers the same numbered topics.

Choose the simplest supported abstraction that correctly solves the actual
problem. Adopt a modern feature when it provides a concrete benefit. Preserve
the existing framework, form, Firebase authorization, component, and route
contracts; use the canonical owners below for their full project policies.

## Findings and canonical owners

| Topic | Consequence for this project | Owner |
| --- | --- | --- |
| Pure rendering and immutable inputs | Keep side effects out of render and do not assign to received props; direct assignments have a native guard, not a deep immutability proof. | [Coding standards](../../CODING_STANDARDS.md#react-rendering-hooks-and-identity) |
| State and component identity | Use data keys, module-scope component types, pure reducers/updaters, and intentional reset boundaries. | [Coding standards](../../CODING_STANDARDS.md#pure-render-and-immutable-inputs) |
| Effects and lifecycle | Distinguish derived values, user-event work, and external synchronization; pair setup with cleanup, including hidden/revealed content. | [Hook standards](../../CODING_STANDARDS.md#hook-dependencies-and-external-synchronization) |
| Hook composition | React allows focused hooks; the component-named orchestration seam is a stricter repository convention. | [Component rule](../../.agents/rules/composition.md#component-named-orchestration-hooks) |
| Refs, context, and inputs | Prefer React 19 ref props; preserve controlled-input and RHF ownership and context boundaries. | [Coding standards](../../CODING_STANDARDS.md#react-19-refs-context-and-controlled-inputs) |
| Suspense, Actions, and Activity | Effect fetches do not automatically suspend, client Actions are not Server Functions, and cleanup need not mean permanent unmount. | [Coding standards](../../CODING_STANDARDS.md#suspense-actions-and-preserved-state) |
| Compiler | Automatic memoization is an optimization for eligible React code, not correctness, resource lifetime, or a guarantee every library API is compatible. | [Compiler standards](../../CODING_STANDARDS.md#compiler-and-performance-boundaries) |
| DOM/hydration and rendering APIs | Next.js owns root rendering; preserve matching server/hydration output and accessible fallback/focus behavior. | [Architecture](../../ARCHITECTURE.md#react-runtime-and-lifecycle-boundaries), [Design](../../DESIGN.md#react-identity-refs-and-lifecycle-presentation) |
| Testing and diagnostics | Use RTL and supported act integration, production/browser tests for framework behavior, and lifecycle assertions for owned resources. | [Testing](../../TESTING.md#react-rules-and-lifecycle-verification) |
| Security | Escaped text does not sanitize arbitrary HTML/URLs, and React UI/optimistic state does not authorize network operations. | [Security](../../SECURITY.md#react-rendering-and-input-boundaries) |
| Maintenance | Save verified findings in canonical guides and preserve accepted ADRs, dependencies, external skills, and local edits. | [Contributing](../../CONTRIBUTING.md#react-documentation-and-runtime-changes), [save skill](../../.agents/skills/save/SKILL.md) |

The blog includes React 19/19.2/19.3 releases, Compiler 1.0, Create React App
deprecation, and historical RSC security reports. Review release dates and
affected ranges during an authorized upgrade; do not apply an old migration
mechanically to an already configured Next.js app or treat a historical
security post as proof of present vulnerability status.

## Native guards and coverage limits

Behavior probes against Biome 2.5.15 confirmed the existing blocking hook-order,
Effect-dependency, and ref-convention checks. Nested component definitions and
direct prop assignments were not blocking in the prior configuration despite
broader tooling language. They are now explicit native errors in owned code,
including UI extensions, with existing registry exclusions preserved.

The 12-case configuration suite checks actual diagnostics without CLI flags
that force rules on. It exercises five invalid patterns across owned app,
component, hook, and extension areas; six valid counterparts; and registry
exclusion for the newly configured policies. Conditional React `use` and React
19 ref props are valid cases. The native props rule does not establish deep
immutability, and no source rule proves resource cleanup or request ordering.

Upstream `eslint-plugin-react-hooks` documents more diagnostics than this
project claims to implement. Keep Compiler, Biome, React Doctor, TypeScript,
existing AST policies, and behavior tests separate. No ESLint dependency,
duplicate custom parser, or extra runner was introduced by this review.

## Lookup, save, and refresh workflow

1. Read local source and the guide that owns the topic. Confirm installed React,
   React DOM, types, framework, and Compiler configuration. Preserve stricter
   project conventions without presenting them as React requirements.
2. Resolve a Context7 library ID before a focused current query. Prefer the
   official topic and installed exports/types for implementation details;
   search snippets alone do not establish complete reference coverage.
3. For a full refresh, resolve the official documentation branch to an immutable
   revision, list every Markdown/MDX source beneath `src/content` with a
   non-truncated response, retrieve every body, and verify each blob hash.
   Also retrieve the versioned error catalog, since decoder pages are generated.
4. Distinguish current runtime support, experimental/draft material, historical
   releases, and optional integrations. Update the source inventory and review
   together. A filename in the source tree does not guarantee a published page.
5. Execute the project's `/save` classification: behavior goes in coding
   standards, runtime boundaries in architecture, diagnostics in tooling,
   verification in testing, and trust boundaries in security. Use persistent
   rules as links to those owners. Preserve accepted ADRs and external skills.
6. Run documentation/link checks, native configuration regressions, and relevant
   existing guards. Rendering or lifecycle changes need the behavior/browser
   strategy in `TESTING.md`; a lookup or successful lint is not profiling or
   complete runtime verification. Report unavailable host/MCP tools accurately.
