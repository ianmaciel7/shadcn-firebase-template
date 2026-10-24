# ADR 0020: Place cross-route code outside `src/app`

- **Status**: Accepted
- **Date**: 2026-10-24

## Context

The Next.js project-structure guide treats `_folder` as a private folder for
colocating non-routable code and lists "split by feature or route" as a
strategy: globally shared code lives in shared folders, route-specific code
lives in the segment that uses it. Names such as `components`, `lib` and
`hooks` carry no framework meaning.

`src/app/_components`, `_hooks` and `_lib` mixed home-page code with code used
by several route trees: `RouteLoading` (all `loading.tsx` files),
`AuthProviderClient` and `FirebaseAuthSessionBridgeClient` (layouts), their
hooks, and the Firebase UI locale mapping (now in `src/lib/locale.ts`).

## Decision

Keep route- and group-specific code in `_components`, `_hooks` and `_lib`
beside the segment that owns it. Move code consumed by more than one route
tree to the shared folders already defined by ADR 0014 and the architecture
guide:

- components to `src/components/ui/extensions/`;
- hooks to `src/hooks/`;
- non-UI helpers to `src/lib/`.

`check:components` and the `no-module-support-in-hooks` ast-grep rules now
also cover `src/hooks/`, excluding the shadcn-registry `use-mobile.ts`.

## Consequences

Layouts and `loading.tsx` files import shared modules through `@/` aliases
instead of reaching into `src/app/_*`. The home-page modules remain in
`src/app/_components` and `src/app/_hooks`. ADR 0014 still holds; this ADR only
applies its shared-placement rule to the remaining cross-route modules.
