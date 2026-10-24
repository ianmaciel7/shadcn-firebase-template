# Quality rule ownership

This project favors the native capabilities of its installed tools over custom
TypeScript AST scanners. Every policy should have one primary enforcement tool
and a regression test.

| Responsibility | Primary tool | Notes |
| --- | --- | --- |
| Formatting, imports, React and Next.js lint | Biome 2.5.15 | Prefer native rules over Grit plugins; `prefer-is-error` was removed. ESLint is not installed. |
| Filename/export matching preview | Biome 2.6.2 plugin (CI-only) | Developer Preview, scoped to TSX; component AST guard remains authoritative until parity is demonstrated. |
| Route-only Firebase SDK import boundaries | Biome `noRestrictedImports` | Specific to `page.tsx`, `layout.tsx`, and `template.tsx`. |
| Route client directives, hook calls, JSX handlers | ast-grep | Structural rules with YAML regression tests. |
| Other route logic and mutation restrictions | `scripts/check-route-files.mjs` | Kept until equivalent structural rules are tested. |
| Private hook module support declarations | ast-grep | Top-level helpers, constants and contexts belong in route `_lib`; hooks retain local state and callbacks. YAML fixtures plus native CLI path-scope tests cover TS/TSX and exclusions. The naming checker remains separate. |
| Component and hook naming contracts | `scripts/check-component-conventions.mjs` | Exact kebab-case/private hook export parity, including Client suffixes; catches aliases and reexports missing from the Biome 2.6 pilot. |
| shadcn component composition contracts | `scripts/check-component-composition.mjs` | Includes JSX and TypeScript props forwarding checks, not arbitrary runtime behavior. |
| Static responsive class heuristics | `scripts/check-responsiveness.mjs` | Supplemental; cannot prove actual rendered accessibility. |
| Rendered reflow and touch target behavior | Playwright | `tests/responsive.spec.ts` measures real element bounds. |
| Accessibility semantics and violations | axe-core with Playwright | Complements, rather than replaces, interaction tests. |
| Firebase authentication flows | Playwright + Firebase Emulator | Required `auth-emulator` job launches Auth, Firestore, and Functions for the `recordUsage` gate. All jobs passed in run 39973720187; retain these dependencies and watch for flaky browser interactions. |
| Module dependency boundaries and cycles | dependency-cruiser | Owns dependency graph checks. |
| Security patterns and tainted sinks | Semgrep | Avoid duplicating these in new lint scripts. |
| Unused application code | Knip | Fallow supplies independent health and coverage signals. |
| Duplicate code | jscpd | Keep its thresholds in its own configuration. |
| Firebase emulator setup and seed data | Operational Node scripts | These are automation tasks, not custom linters. |
| Discriminated status, form submission state | React + TypeScript + React Hook Form | Model mutually exclusive branches using `status`; use `formState.isSubmitting`, not duplicate flags. |
| Persistence and dependency injection | Typed service adapter | `saveProfile` defaults to Firebase implementations but accepts `ProfileDependencies` for unit tests. |
| Complexity, health, and warnings | Fallow + React Doctor | Fallow thresholds can fail CI; React Doctor diagnostics can be advisory. Do not confuse a successful process exit with no warnings. |

## Maintaining the boundary

The thin route entrypoint policy is a project convention; Next.js permits
server-side logic and async data reads in `page.tsx` and `layout.tsx`.
Do not report the policy as a framework constraint.

Avoid introducing an additional custom AST scanner for a rule already supported
by Biome, ast-grep, Semgrep, or dependency-cruiser. Move one category at a time
and preserve valid and invalid fixtures. Run `pnpm verify:static` when
changing enforcement, plus browser and E2E tests for responsive changes.

Do not delete the component or responsiveness scanners solely to reduce file
count. Move their remaining semantics only when a replacement preserves
coverage, documents legitimate exceptions, and passes CI.

Before changing a rule, check four cases: a known invalid example must fail
for that rule's own diagnostic; an equivalent valid pattern must pass;
generated/vendor exclusions must stay intentional; and an actual source scan
must cover the affected directory. Compare the oldest failing example with
the new check instead of replacing a semantic rule with a weaker regex.

The component-named orchestration hook policy is a **repository choice**,
not a React or Next.js requirement. It permits independent native
presentation hooks without custom wrappers, while keeping application
effects and SDK operations behind focused modules. The Biome 2.6
filename/export plugin remains a preview; no AST checker was removed to
claim equivalence.

Current release criterion: the `ci-result` job must pass **all** required
jobs, including `auth-emulator`. The emulator configuration was fixed and
validated in CI run 39973720187. Do not override required checks or hide
failed browser journeys on subsequent revisions.
