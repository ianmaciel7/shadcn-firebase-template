# React documentation reference

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
in the installed React 19.3.1 package. `browser` is not an installed export,
even though the current `use` reference discusses `use(browser())`. Experimental
Suspense and other optional examples need their own support checks. Available
APIs do not become required app features merely because they appear in docs.

## Findings and canonical owners

| Topic | Consequence for this project | Owner |
| --- | --- | --- |
| Pure rendering and immutable inputs | Keep side effects out of render and do not assign to received props; direct assignments have a native guard, not a deep immutability proof. | [Coding standards](../../CODING_STANDARDS.md#react-rendering-hooks-and-identity) |
| State and component identity | Use data keys, module-scope component types, pure reducers/updaters, and intentional reset boundaries. | [Coding standards](../../CODING_STANDARDS.md#pure-render-and-immutable-inputs) |
| Effects and lifecycle | Distinguish derived values, user-event work, and external synchronization; pair setup with cleanup, including hidden/revealed content. | [Hook standards](../../CODING_STANDARDS.md#hook-dependencies-and-external-synchronization) |
| Hook composition | React allows focused hooks; the component-named orchestration seam is a stricter repository convention. | [Component rule](../../.agents/rules/component-naming.md#component-named-orchestration-hooks) |
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
