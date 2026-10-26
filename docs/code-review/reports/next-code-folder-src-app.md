# Review: `src/app/`

## Identification

- **Subagent:** `next-code-folder-src-app`
- **Type:** `CODE_FOLDER`
- **Primary path:** `src/app/`
- **Associated documentation:** installed Next.js 16.4.2: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`, `03-layouts-and-pages.md`, and `05-server-and-client-components.md`; project owners `ARCHITECTURE.md`, `CODING_STANDARDS.md`, `.agents/rules/nextjs-route-files.md`, `.agents/rules/components-contracts.md`
- **Next.js version:** 16.4.2
- **Status:** Completed

## Scope

Primary responsibility: organization, responsibilities, and dependencies of the `src/app/` tree, including route grouping, placement of private code, layout composition, and client/server boundaries. The tree contains 71 files in 20 subdirectories, in addition to the root. The files were consulted only to understand the structure and relationships; each file remains the exclusive responsibility of the agent listed for it in the manifest.

Sources consulted: recursive listing of `src/app/`; the installed documentation cited above; `ARCHITECTURE.md`; `CODING_STANDARDS.md`; `.agents/rules/nextjs-maintenance.md`; `.agents/rules/nextjs-route-files.md`; `.agents/rules/components-contracts.md`; `.dependency-cruiser.cjs`; a query of the existing graph with `graphify query`.

## Code Review

- The tree uses the App Router in `src/app/`, keeps `page`, `layout`, `loading`, `error`, and other special files alongside the routes, and places internal implementations in `_components`, `_hooks`, and `_lib` directories. The `(public)` and `(protected)` groups express navigation areas without adding URL segments, in line with the installed documentation on project structure and route groups.
- The observed dependencies follow outside-in composition: pages import private components of the route; layouts import their providers/gates; private modules consume `src/components`, `src/lib`, `src/i18n`, and necessary hooks. `src/components` and `src/lib` do not need to import the route tree to serve this flow.
- The composition of the public and protected segments is localized: each group keeps its own `layout.tsx` and `loading.tsx`; specific flows have their own route directories. This avoids concentrating the authentication of distinct screens in a single route module.
- Runtime boundaries are distributed between Server Component layouts and interaction implementations in client components/hooks. The local convention documents that name/folder do not prove the runtime; Next.js validates the complete import graph.
- There are executable rules that forbid cycles (`no-circular`) and imports from `src/components` to `src/app`, plus a boundary rule for `src/lib`, in `.dependency-cruiser.cjs:4-25`. Inspecting the configuration confirms that these risks are covered by tooling, but this review did not run the graph analysis, so it does not declare the effective absence of cycles.
- The Graphify query found nodes associated with routes, private modules, shared components, and dependency configuration; the cross-cutting search returned truncated results. It was used as an auxiliary map, not as proof of the absence of cycles or dependencies.

### Findings

No architectural issue in the folder was proven. Implementation findings belonging to individual files must remain in their respective reports and be deduplicated by the coordinator.

## Conclusion

**Compliant.** The observed organization is consistent with the installed App Router and with the repository's documented conventions: groups for route areas, private folders for implementation, local layouts/loading, and dependency direction protected by executable rules. The absence of cycles at runtime remains **unverified** in this task; the existence of the rule was not treated as the result of a run.

## Post-checkpoint reconciliation

- Per [ADR 0005](../../adr/0005-document-project-standards.md) (`a3cd49a`), cross-route providers and loading components (`auth-provider-client.tsx`, `route-loading.tsx`) and their hook (`use-auth-provider-client.ts`) were relocated from `src/app/_components/` and `src/app/_hooks/` to `src/components/ui/extensions/` and `src/hooks/`.
- Protected route gating in `src/app/(protected)/` was updated from `ProtectedGateClient` / `ProfileFallback` to `ProtectedGuardClient`, `ProtectedSessionServer`, and `ProfileGuard`, with pure support modules extracted to `src/app/(protected)/_lib/` and `src/app/(protected)/profile/_lib/`.
