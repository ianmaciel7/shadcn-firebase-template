# Quality rule ownership

This project favors the native capabilities of its installed tools over custom
TypeScript AST scanners. Every policy should have one primary enforcement tool
and a regression test.

| Responsibility | Primary tool | Notes |
| --- | --- | --- |
| Formatting, imports, React and Next.js lint | Biome | Prefer native rules over Grit plugins. |
| Filename/export matching preview | Biome 2.6.2 plugin (CI-only) | Developer Preview, scoped to TSX; component AST guard remains authoritative until parity is demonstrated. |
| Route-only Firebase SDK import boundaries | Biome `noRestrictedImports` | Specific to `page.tsx`, `layout.tsx`, and `template.tsx`. |
| Route client directives, hook calls, JSX handlers | ast-grep | Structural rules with YAML regression tests. |
| Other route logic and mutation restrictions | `scripts/check-route-files.mjs` | Kept until equivalent structural rules are tested. |
| Component naming and runtime conventions | `scripts/check-component-conventions.mjs` | Cross-file analysis cannot be replaced by a single syntax pattern. |
| shadcn component composition contracts | `scripts/check-component-composition.mjs` | Includes JSX and TypeScript props forwarding checks. |
| Static responsive class heuristics | `scripts/check-responsiveness.mjs` | Supplemental; cannot prove actual rendered accessibility. |
| Rendered reflow and touch target behavior | Playwright | `tests/responsive.spec.ts` measures real element bounds. |
| Accessibility semantics and violations | axe-core with Playwright | Complements, rather than replaces, interaction tests. |
| Firebase authentication flows | Playwright + Firebase Emulator | The default E2E suite excludes `firebase-auth.spec.ts`; full emulator coverage requires a dedicated CI job. |
| Module dependency boundaries and cycles | dependency-cruiser | Owns dependency graph checks. |
| Security patterns and tainted sinks | Semgrep | Avoid duplicating these in new lint scripts. |
| Unused application code | Knip | Fallow supplies independent health and coverage signals. |
| Duplicate code | jscpd | Keep its thresholds in its own configuration. |
| Firebase emulator setup and seed data | Operational Node scripts | These are automation tasks, not custom linters. |

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
