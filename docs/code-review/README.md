# Next.js code review

<!-- cspell:ignore NXLAYOUT AUDIOPLAYER TOTP -->

This began as an in-progress, read-only audit against the installed Next.js **16.4.2** documentation in `node_modules/next/dist/docs/`. The full one-agent-per-item inventory was generated and validated before review began.

## Current metrics

| Metric | Count |
| --- | ---: |
| Documentation folders | 40 |
| Documentation files | 474 |
| Project folders | 115 |
| Project files | 568 |
| Coordinator | 1 |
| Expected agents / primary items | 1198 |
| Currently completed review reports | 161 |
| Active report tasks | 0 |
| Completed tasks | 161 |
| Pending tasks (excluding active) | 1037 |
| Not applicable | 3 |
| Consolidated findings from completed reports | 4 medium, 19 low, 0 high/critical |
| Documentation coverage | 24 / 514 items (4.67%) |
| Project coverage | 136 / 683 items (19.91%) |

`Individual reports present` includes the coordinator's report. `Completed tasks` counts items with an individual report, including the coordinator. Each report has one primary item. Findings and coverage describe only completed reports and are provisional until all items are reviewed and cross-checked.

## Execution

This session supports seven concurrent agents, including the coordinator, so up to six item reviewers run at once. Work therefore proceeds in individual batches. Required display names and complete paths are in [the manifest](agents-manifest.md); each row maps to its own report under [`reports/`](reports/). Runtime task identifiers use underscores because the agent tool rejects hyphens; the mandated display names remain intact in the manifest and reports.

The audit itself changed no project code. Subsequent user-authorized corrections are tracked in [remediation status](resolutions.md), separately from historical review coverage. Failed or active agent tasks remain pending until a report exists. The full audit is not complete.

## Scope and exclusions

The project inventory covers relevant versioned repository files, including code, tests, scripts, configuration, workflows, and architecture documentation. `node_modules/next/dist/docs/` is included only as the official installed documentation corpus. `.git/`, `.next/`, caches, generated artifacts, dependency binaries, and `docs/code-review/` outputs are excluded. Lock files are excluded from line-by-line review and remain an input to a separate dependency audit.

See [documentation coverage](documentation-coverage.md), [source coverage](source-coverage.md), [findings](findings.md), [architecture](architecture.md), [recommendations](recommendations.md), and [compatibility](compatibility.md) for the current partial consolidation.

## Resumption checkpoint

Resumed from branch `fix/react-review-findings` at `f7b7221`, containing audit checkpoint `a9244b6`. Installed Next.js remains 16.4.2. Existing individual reports were preserved. Two resumed batches completed 12 new reports, each by a distinct real subagent. No reviewer remains active; 12 new item reviewers were executed in this session. Historical execution counts are inherited from the existing reports rather than reasserted as new runs.

The historical inventory contained 12 generated `graphify-out/` documentation paths that are not part of the official Next.js documentation corpus; they have been reconciled and excluded under [documentation coverage](documentation-coverage.md). The project inventory in [the manifest](agents-manifest.md) has also been reconciled against the current tracked repository tree after the cookie-only locale restoration, cross-route code placement outside `src/app/`, role custom-claim authorization, server session verification, centralized route navigation, the English language guard, and Serena research memory relocation.

Validation: the installed Markdown CLI (`markdownlint-cli2`), the English language guard (`check:english`), and the configured spelling check (`cspell`) pass with zero issues across `docs/code-review/`. No build or browser suite was run for these documentation-only changes.

## Remediation phase

After checkpoint `d8e5df2`, the user authorized fixes and parallel implementation. See [resolutions](resolutions.md) for every consolidated finding, local mitigations for upstream documentation, and validation boundaries. [ADR 0004](../adr/0004-configure-internationalization.md) preserves direct cookie-only locale selection after reversing the temporary locale-route migration; NXLAYOUT-001 is open. Subsequent repository refactors ([ADR 0005](../adr/0005-document-project-standards.md) cross-route placement outside `src/app/`, [ADR 0009](../adr/0009-integrate-firebase-authentication.md) role custom claims, server session bridge, centralized `ROUTES`, `ProtectedGuardClient`, and `check:english`) are reconciled in the manifest and affected reports.

## Durable handoff after inventory reconciliation

- The current maintainer requirement is owned by
  [Architecture](../../ARCHITECTURE.md#internationalization) and [ADR 0004](../adr/0004-configure-internationalization.md).
  Internal locale route rewrites are rejected; do not reintroduce a route rewrite as a presumed fix.
- The original 43 reports were inherited, not rerun. Twelve distinct item agents
  produced the resumed reports from `artifact.tsx` through `controls.tsx`, and
  post-checkpoint reviews completed 114 additional folder and runtime file reports
  across `src/app/`, `src/components/ui/extensions/`, `src/hooks/`, `src/i18n/`,
  and `src/lib/`. Reconciled inventory: 1,182 items, 169 reports, zero active and
  1,013 pending; documentary coverage is 24/514 (4.67%) and project coverage is
  144/667 (21.59%). Remaining unit/browser test files and pending items are
  included as `Pending` rows in the reconciled manifest rather than automatically
  counted as reviewed.
- Of 17 deduplicated historical findings, 14 project corrections are implemented,
  the root document-language finding remains open, and two upstream indexes have
  local navigation mitigations. The `AUDIOPLAYER-001` and `COMMIT-001` reports
  share one consolidated cause; preserve both evidence references.
- The 12 generated `node_modules/next/dist/docs/graphify-out/` paths and 11
  relocated/renamed project paths (`src/app/_components/auth-provider-client*`,
  `src/app/_components/route-loading*`, `src/app/_hooks/use-auth-provider-client.ts`,
  `protected-gate-client*`, `.serena/memories/external-research/*`, and
  `functions/package-lock.json`) were reconciled out of the active manifest, and
  current tracked project folders/files were added.
- The next pending AI Elements file is `conversation.tsx`, followed by the
  remaining entries in the manifest. Each folder and file needs its own primary
  reviewer and report. Folder architecture reviews do not cover child files.
  Discover the actual concurrency limit each session rather than reusing the
  historical four-agent limit or this session's seven total slots.
- Implementation checkpoints: `d8e5df2` saved the 12 resumed reports; `b568bb7`
  implemented fixes and the subsequently rejected route migration; `2d103cc`
  restored cookie-only routing and retained the other fixes; `40ca16a` clarified
  the remaining language finding; `78f4761` through `673ce18` introduced custom
  claims, server session verification, cross-route code placement outside
  `src/app/`, `ProtectedGuardClient`, `check:english`, and English report
  translations. Preserve this distinction when interpreting old line numbers,
  applicability statements, and test counts.

Tool limitations belong in [Tooling](../../TOOLING.md#managed-environment-observations-2026-10-24),
regression strategy in [Testing](../../TESTING.md#review-finding-regressions),
and implementation contracts in [Coding standards](../../CODING_STANDARDS.md).

## Current validated UI checkpoint

The source fixes and regression checks for `carousel.tsx`, `sidebar.tsx` and `code-block.tsx` passed TypeScript, unit tests, the English guard, spelling and scoped Markdown in [GitHub Actions run 40130032176](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40130032176). The live project inventory was regenerated from tracked paths; 63 old paths were excluded and 76 newly tracked items were added. Seven historically reviewed files modified since the original checkpoint were reset to Pending for re-review. Unapplied external review drafts do not count toward these metrics.

## Validated Firebase checkpoint

The navigation-policy button and TOTP factor display name were corrected and regression-tested in [run 40131416018](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40131416018). The reconciled manifest now has 161 completed primary items and 1,036 pending. The previously prepared source-only draft reports remain Pending until their individual review requirements are satisfied.
