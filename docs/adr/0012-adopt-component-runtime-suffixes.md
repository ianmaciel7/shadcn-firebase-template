# ADR 0012: Adopt component runtime suffixes

- **Status**: Accepted
- **Date**: 2026-10-22

## Context

The project prohibited runtime suffixes in owned component filenames. The user
requested explicit client, server-only, and shared naming to communicate runtime
intent while preserving Next.js boundaries and the shared UI placement rule.

## Decision

Use `-client.tsx` for owned client components, `-server.tsx` for server-only
components, and no runtime suffix for shared presentation. Client files declare
`"use client"`; server-only files import `"server-only"`. Exports, prop types,
and orchestration hooks retain semantic names without runtime suffixes.
Colocated tests and stories use the component filename stem.

Apply this to application-owned UI extensions and route-private components.
Preserve framework-mandated route filenames and existing registry source names.
Keep hooks and non-component naming outside this convention.

Update `check:components` to understand runtime suffixes without weakening
semantic export, prop, field, form, or composition contracts. Add syntax checks
for boundary directives, recognized client dependencies and server-only imports.
Next.js still validates the full graph; indirect dependencies need review.
Fetching external data alone does not determine runtime.

This supersedes the prohibition in the previous component naming rule; earlier
accepted registry and placement decisions remain in force.

## Consequences

Runtime intent becomes visible in filenames. Existing owned components and
consumers are migrated, including transitive client hook consumers. Shared
components such as `LoadingIndicator` keep semantic filenames without suffixes.
The suffix has no compiler effect and does not replace directives or markers.
