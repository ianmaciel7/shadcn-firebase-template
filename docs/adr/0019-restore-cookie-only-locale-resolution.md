# ADR 0019: Restore cookie-only locale resolution

- **Status**: Accepted
- **Date**: 2026-10-24
- **Supersedes**: ADR 0018 in full

## Context

The maintainer explicitly requested that the application keep locale selection
through cookies without an App Router `[locale]` segment. The internal route
migration in ADR 0018 did not preserve that requirement, even though its public
URLs remained unprefixed.

## Decision

Restore the route tree directly under `src/app/`, without Proxy or internal
locale rewrites. Restore `src/i18n/request.ts` to reading `NEXT_LOCALE` through
`cookies()`, validating the value against the supported locales and falling back
to English. Preserve explicit server translation overrides and existing catalogs.

Navigation uses the standard Next.js Link, router and pathname directly. Remove
the internal pathname normalization helper. Keep Cache Components, partial
prefetching and the suspended translation-provider boundary. Retain the unrelated
component, accessibility, error recovery, provider ownership and cost fixes.

## Consequences

Locale selection again depends on the request cookie rather than route parameters.
Cookie-resolution regression tests cover every supported locale, invalid or
missing cookies and explicit overrides without mocking root parameters.

The static root `html lang="en"` mismatch for translated pages remains an open
finding (NXLAYOUT-001). This change does not claim to solve it. Do not introduce
locale route segments, Proxy, a rendering-model change or an unverified root
cookie read to close that finding. Any future document-language solution must
preserve this cookie-only architecture and be verified with Cache Components.

ADR 0018 remains a historical record, not the current implementation contract.
