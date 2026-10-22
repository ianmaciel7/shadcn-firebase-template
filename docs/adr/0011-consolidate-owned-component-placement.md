# ADR 0011: Consolidate owned component placement

- **Status**: Accepted
- **Date**: 2026-10-22

## Context

`LoadingIndicator` was the only shared application component in a separate
`src/components/loading/` tree. Both route components and Firebase UI use it;
`Loading` and the shared providers already live in `ui/extensions`.

## Decision

Keep shared application components in `src/components/ui/extensions/` and
route-private components in `src/app/**/_components/`. Move `LoadingIndicator`
and update its consumers without changing its rendering contract.

Extend `check:components` to reject JavaScript and TypeScript files under
`src/components` outside the existing `ui`, `firebase`, and `ai-elements`
registry trees. Include tests and barrel files so they remain colocated.
Registry-source exclusions from application conventions remain unchanged.

This narrows the previous general permission to place shared application
components anywhere in `src/components`; no registry decision is superseded.

## Consequences

Application components share one reusable boundary, while route-specific UI
stays local. The guard runs in the existing fast and static CI checks, with
regressions for invalid placement and allowed registry/private paths.
