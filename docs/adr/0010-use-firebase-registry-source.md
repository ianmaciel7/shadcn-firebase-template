# ADR 0010: Use Firebase registry source

- **Status**: Accepted
- **Date**: 2026-10-19
- **Deciders**: ianmaciel7

## Context

The authentication routes need FirebaseUI screens that match this shadcn
project. The official Firebase registry distributes shadcn components as source
files, while `@firebase-oss/ui-react` supplies the shared runtime and hooks.
The installed registry source has upstream type mismatches in sign-in and
sign-up action callbacks. TypeScript includes excluded files again when routes
import them, so the build cannot ignore those errors through `tsconfig.exclude`.

ADR 0008 treated the entire registry directory as an immutable upstream mirror.
That conflicts with shadcn's source-ownership model and prevents the local fixes
needed by the application.

## Decision

Use the copied Firebase registry components directly from
`src/components/firebase` in application routes. Treat registry files as
project source that may be adapted to the app and its installed APIs. Keep
`@firebase-oss/ui-react` as a runtime dependency; registry components use its
hooks, types, and shared UI behavior.

Supersede ADR 0008's immutable/read-only rule and SHA-256 integrity guard for
this directory. Keep the generated registry components grouped under
`src/components/firebase`. Continue excluding untouched registry source from
bulk formatting, lint, spelling, and coverage jobs. Include the full directory
in application typechecking. When changing a component, run the relevant
typecheck and behavior checks.

Sign-in, sign-up, and phone verification forms call success callbacks only when
the action returns a `UserCredential`. A `void` result is a supported FirebaseUI
outcome, so screen-level auth-state handling remains responsible for those
cases. The country selector also handles Base UI's optional selection value.

## Consequences

- Auth routes use the source form of FirebaseUI recommended for shadcn apps.
- Local UI and type compatibility fixes are reviewable in the project source.
- The Firebase registry source is no longer protected by an upstream hash
  manifest; registry updates require reviewing and merging source diffs.
- The package remains required for FirebaseUI runtime APIs even when screens
  are imported from the local registry directory.
- The generated components remain excluded from broad style and coverage jobs;
  typechecking covers them all.
