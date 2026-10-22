# ADR 0016: Name components by integration responsibility

- **Status**: Accepted
- **Date**: 2026-10-22

## Context

ADR 0015 applied runtime suffixes to all owned client components. The user
clarified that suffixes should identify integrations with an execution
environment, while UI and form-context presentation should keep filenames without suffixes.
Classifying every local hook import as an integration was too broad.

## Decision

Reserve `-client.tsx` for browser integrations and `-server.tsx` for server
integrations, including work delegated to hooks/helpers. Presentation components
keep filenames without suffixes, including UI that uses state, events or form context and
therefore needs a client boundary. Shared presentation is a compatible subset;
a filename without a suffix does not guarantee compatibility with Server Components.

Keep directives and server-only protection independent of names. Fetching alone
does not select the execution environment. Preserve semantic exports, colocated
tests, component placement, framework names and registry-source exclusions.

Replace the hook-name heuristic with conservative integration evidence, tracing
static local TypeScript helper dependencies and stopping at component imports.
Keep existing composition, field, form and framework-boundary checks. Document
unsupported syntax and require review rather than claiming full graph analysis.

This supersedes ADR 0015's classification policy. Preserve ADR 0015 as history.

## Consequences

Profile fields and the save-state button lose unnecessary client suffixes while
retaining client directives. Session, persistence, navigation, browser file and
theme integrations keep their suffixes. Guards now distinguish these cases.

The rule combines [Container/Presentational separation](https://www.patterns.dev/react/presentational-container-pattern/)
with [React module boundaries](https://react.dev/reference/rsc/use-client).
It is a repository naming convention, not a Next.js filename requirement.
