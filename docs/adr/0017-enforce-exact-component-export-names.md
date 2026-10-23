# ADR 0017: Enforce exact component export names

- **Status**: Accepted
- **Date**: 2026-10-23

## Context

ADR 0016 separated the filename suffix for browser and server integrations
from presentation components. It also preserved suffix-free semantic exports.
Later, the owned component checker began enforcing exact filename term parity:
`home-section-client.tsx` exports `HomeSectionClient`, not `HomeSection`.
The old guidance and the executable rule no longer agreed.

An exact match makes components, props types, imported orchestration hooks,
and file names easier to trace without guessing which suffix is omitted.
This is a repository convention rather than a Next.js or React requirement.

## Decision

Owned component names and their props types must match the complete filename
stem, including `Client` or `Server` for integration modules. For example,
`home-section-client.tsx` exports `HomeSectionClient`, has
`HomeSectionClientProps`, and uses `useHomeSectionClient` when an application
orchestration hook is necessary. Compound exports retain the component root.

Private hook modules under `src/app/**/_hooks/` also enforce exact file and
export name parity. Native presentation hooks such as `useId`,
`useTranslations`, and `useFormContext` may be composed directly; do not
add custom wrappers solely to satisfy naming rules.

This supersedes only ADR 0016's suffix-free semantic export naming policy.
ADR 0016's classification of integration and presentation components, Client
and Server module boundaries, and private folder placement remain accepted.
Framework special files and registry output retain their exclusions.

## Consequences

Update naming guidance and regression tests alongside the AST guard.
Avoid introducing compatibility aliases or exempting owned modules merely to
bypass the naming contract. New files use the same deterministic convention.
Run `pnpm check:components` and the required CI jobs for naming changes.
