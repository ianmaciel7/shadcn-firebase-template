# Next.js code review

This began as an in-progress, read-only audit against the installed Next.js **16.4.2** documentation in `node_modules/next/dist/docs/`. The full one-agent-per-item inventory was generated and validated before review began.

## Current metrics

| Metric | Count |
| --- | ---: |
| Documentation folders | 44 |
| Documentation files | 482 |
| Project folders | 96 |
| Project files | 519 |
| Coordinator | 1 |
| Expected agents / primary items | 1,142 |
| Individual reports present | 55 |
| Active report tasks | 0 |
| Completed tasks | 55 |
| Pending tasks (excluding active) | 1,087 |
| Not applicable | 3 |
| Consolidated findings from completed reports | 2 medium, 15 low, 0 high/critical |
| Documentation coverage | 24 / 526 items (4.56%) |
| Project coverage | 30 / 615 items (4.88%) |

`Individual reports present` includes the coordinator's report. `Completed tasks` counts items with an individual report, including the coordinator. Each report has one primary item. Findings and coverage describe only completed reports and are provisional until all items are reviewed and cross-checked.

## Execution

This session supports seven concurrent agents, including the coordinator, so up to six item reviewers run at once. Work therefore proceeds in individual batches. Required display names and complete paths are in [the manifest](agents-manifest.md); each row maps to its own report under [`reports/`](reports/). Runtime task identifiers use underscores because the agent tool rejects hyphens; the mandated display names remain intact in the manifest and reports.

The audit itself changed no project code. Subsequent user-authorized corrections are tracked in [remediation status](resolutions.md), separately from historical review coverage. Failed or active agent tasks remain pending until a report exists. The full audit is not complete.

## Scope and exclusions

The project inventory covers relevant versioned repository files, including code, tests, scripts, configuration, workflows, and architecture documentation. `node_modules/next/dist/docs/` is included only as the official installed documentation corpus. `.git/`, `.next/`, caches, generated artifacts, dependency binaries, and `docs/code-review/` outputs are excluded. Lockfiles are excluded from line-by-line review and remain an input to a separate dependency audit.

See [documentation coverage](documentation-coverage.md), [source coverage](source-coverage.md), [findings](findings.md), [architecture](architecture.md), [recommendations](recommendations.md), and [compatibility](compatibility.md) for the current partial consolidation.

## Resumption checkpoint

Resumed from branch `fix/react-review-findings` at `f7b7221`, containing audit checkpoint `a9244b6`. Installed Next.js remains 16.4.2. Existing individual reports were preserved. Two resumed batches completed 12 new reports, each by a distinct real subagent. No reviewer remains active; 12 new item reviewers were executed in this session. Historical execution counts are inherited from the existing reports rather than reasserted as new runs.

The historical inventory contains 12 generated documentation paths absent from this installation. They remain pending, as explained in [documentation coverage](documentation-coverage.md). The project pending count was corrected from an inconsistent 600 to the count derived from the manifest and completed reports.

Validation: the installed Markdown CLI reports 48 pre-existing issues in the manifest and the historical `tsconfig.json` report, with no issues in the 12 new reports. The configured spelling scan reports 308 issues in 14 files; individual reports are excluded by the existing configuration and were reviewed manually. The pnpm wrappers failed during environment setup, so the installed tool executables were used directly. No build or browser suite was run for these documentation-only changes.

## Remediation phase

After checkpoint `d8e5df2`, the user authorized fixes and parallel implementation. See [resolutions](resolutions.md) for every consolidated finding, local mitigations for upstream documentation, validation boundaries and the internal locale-route migration. Coverage counts above remain historical; route moves and new files require inventory reconciliation before the audit resumes.
