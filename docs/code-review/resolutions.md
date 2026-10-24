# Finding remediation

The user authorized implementation after the read-only audit checkpoint `d8e5df2`.
Historical individual reports and their line references describe that checkpoint;
they are not assertions that the defects remain in the current source.

## Disposition

| Finding | Change | Validation |
| --- | --- | --- |
| NXLAYOUT-001 | Open. The maintainer rejected the locale-segment migration; ADR 0019 restores direct cookie resolution without Proxy. Static root document language remains English. | Cookie-resolution and unprefixed-navigation regressions cover the restored architecture; they do not establish a fix for document language. |
| CODEBLOCK-001 | Cache and subscriptions identify the complete language/content pair. | Sequential and concurrent regressions with installed Shiki. |
| NEXTERR-001 | Recovery control calls the installed Next.js `retry` API. | Recovery callback regression. |
| THEME-001 | Removed the global console replacement. | Import preserves error logging, including the formerly suppressed text. |
| INTLPROVIDER-001 | Locale/messages omitted from caller props and assigned after all caller props. | Type contract and untyped override regression. |
| AGENT-001 | SDK conversion resolves lazy/async schemas, handles rejection and ignores obsolete results. | Real SDK lazy, asynchronous, rejected and replacement cases. |
| COMPONENTS-OWNERSHIP-001 | Current rule identifies registry copies as locally maintained; naming exclusions are preserved. | Compared current rule with architecture and ADR amendment. |
| ARTIFACT-001 | Tooltip composes the existing button through `render`. | Real primitive single-button and disabled regressions. |
| ATTACHMENTS-001 | Removal is visible on keyboard focus and on devices without hover. | Browser focus/visibility regression. |
| ATTACHMENTS-002 | Root delay settings reach the Trigger; explicit Trigger values take precedence. | Real primitive timing regression. |
| AUDIOPLAYER-001 / COMMIT-001 | Media controls retain one event owner and button styling; commit div uses non-native mode. | Real Chromium single media request per click/Enter/Space, disabled/seek offsets; commit keyboard regression. |
| CHAIN-001 | Header and panel share one Collapsible root. | Multiple instances, controlled state and panel-ID association. |
| CODEBLOCK-002 | Copy action has an overridable default accessible name. | Default, localized and text-content naming regressions. |
| CONTEXT-001 | One adapted token distribution prices uncached input, reads, writes and output consistently. | Real pricing catalog cases for cached, uncached, mixed and write usage. |
| CONTEXT-002 | Default progress has an accessible, localizable label. | Role/name regressions. |
| DOCSTART-001 / DOCUPGRADE-001 | Repository-owned [navigation addendum](installed-next-navigation.md) supplies the missing next steps and upgrade links. | All 25 installed targets checked. Local mitigation only: upstream indexes remain unchanged and open. |

## Verification boundaries

The installed Next.js 16.4.2 native compiler fails before route type generation
because its native addon cannot create a trusted cache in this managed workspace
(`ERR_SWC_NATIVE_CACHE`). Installing the matching binary did not remove that
runtime restriction. This is not a successful build, type generation, or production
browser check. The restored cookie architecture keeps the existing static document shell.
Production integration checks still require a functioning Next.js compiler.

Unit and isolated component-browser checks exercise the actual installed React,
Base UI, Shiki, SDK, pricing and media libraries. They do not replace the full
Next.js production integration checks. Exact final command results are recorded
in the delivery message.

## Audit scope

Implementation does not complete the outstanding 1,087 historical review items.
The manifest remains an inventory of the checkpoint. ADR 0019 restores its
original route paths after reversing the ADR 0018 migration.
No newly added or moved file is automatically counted as reviewed. The 12 absent
generated documentation paths remain pending for eligibility reconciliation.

## Implementation checkpoint results (`b568bb7`)

- Unit suite: 40 files, 251 tests passed.
- Component Chromium checks: four audio tests and three UI tests passed using the system Chromium executable; temporary launch configuration was not committed.
- Biome CI: passed across 306 files; staged-file checks and commit message validation passed.
- Markdown: zero issues.
- Route/component/responsiveness regression tests and source scans passed.
- Next.js production build and route type generation: blocked before compilation by the native SWC environment error above.

The two upstream documentation defects are locally mitigated, not upstream fixes.
The other application fixes are retained. NXLAYOUT-001 remains open under the
restored cookie-only architecture; the rejected migration is not counted as a fix.

## Cookie-only correction

ADR 0019 removes `[locale]`, Proxy and root-parameter lookup. Cookie resolution
and original route placement are restored; the other fixes and their regressions
remain. The prior checkpoint results above describe the earlier revision.

Correction verification: 40 unit files / 232 tests passed, including seven
cookie-resolution regressions. The lower total removes the rejected Proxy and
internal-route tests. Biome CI, Markdown, route/component/responsiveness guards
and diff checks passed. No production-build success is claimed.

## Private hook placement follow-up

The maintainer clarified that helper functions and support values declared outside
a hook belong in the route's `_lib`, including constants and context objects.
The new blocking ast-grep rules are registered in Tooling and the rule-ownership
guide. This is a new repository placement contract, not a React requirement or
additional completed audit coverage.

The initial native scan found four declarations: avatar URL selection, two avatar
validation constants and the profile session context. All four were extracted to
`profile/_lib/avatar.ts` and `profile/_lib/profile-session-context.ts`. Imports were
updated without changing hook-local callbacks or introducing another context
instance. The new rule's source scan now reports zero violations.

Verification: 239 unit tests passed across 42 files; both new rule fixtures pass
(19 cases per language) and the complete ast-grep suite passes all 18 rule groups.
Native CLI tests verify real TS/TSX path scopes and exclusions. Biome, dependency
boundaries, Markdown, scoped spelling and diff checks passed. The native CLI
subprocess tests required the environment permission grant after an initial
`EPERM`; no tests were skipped to avoid that failure.

The full component checker reports 14 existing UI-phase diagnostics. Running the
same checker against an archived copy of the pre-change HEAD produced exactly
the same 14 messages, with no added or removed diagnostics. The pnpm static entry
point still fails in package-manager setup, and direct TypeScript reports the
three existing missing `LayoutProps` declarations due to unavailable Next.js type
generation. These are not successful full static/type checks. Agent synchronization
also remains unavailable because its host CLI is not installed.

## Hook responsibility and complexity follow-up

The maintainer requested main orchestration hooks composed from focused sub-hooks,
including simplifying `useAuthProviderClient`. Native Biome policies now enforce
cognitive complexity 8, function bodies of at most 40 lines excluding blanks, and
callback depth 2 in owned runtime source. The existing copied registry and
fixture exclusions remain; no additional linter was installed and no existing
Fallow threshold was relaxed.

The configured scan initially found eight violations in six files. Refactoring
separates Firebase UI initialization, session navigation and locale synchronization;
profile preference loading and successful save feedback have focused sub-hooks.
Pure normalization and protected-access subscription lifecycle support live in
route `_lib` modules. Home header/logo composition preserves the rendered contract.
The same configured Biome source scan now has zero diagnostics.

Verification: 44 unit files / 262 tests passed. Seventeen native-rule regression
cases cover inclusive limits, the immediately failing value, an IIFE, blank lines,
TS/TSX scope and registry/fixture exclusions. Auth regressions cover locale updates
without resubscription and late callbacks after cleanup; profile defaults cover
cancellation and switched users. Biome CI, all 18 ast-grep rule groups, structural
scan, dependency boundaries, Markdown, scoped spelling and diff checks passed.

The component checker still reports the same 14 pre-existing diagnostics; direct
TypeScript still reports only the three pre-existing missing `LayoutProps`
declarations. The pnpm static entry point fails before checks during package-manager
setup. These results are not a passing full static check or a production build.
Responsibility cohesion remains a review obligation; numeric budgets alone cannot
prove that a hook has one purpose.
