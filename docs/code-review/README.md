# Next.js code review

This is an in-progress, read-only audit against the installed Next.js **16.4.2** documentation in `node_modules/next/dist/docs/`. The full one-agent-per-item inventory was generated and validated before review began.

## Current metrics

| Metric | Count |
| --- | ---: |
| Documentation folders | 44 |
| Documentation files | 482 |
| Project folders | 96 |
| Project files | 519 |
| Coordinator | 1 |
| Expected agents / primary items | 1,142 |
| Individual reports present | 43 |
| Active report tasks | 0 |
| Completed tasks | 43 |
| Pending tasks (excluding active) | 1,099 |
| Not applicable | 3 |
| Findings in completed item reports | 1 medium, 7 low, 0 high/critical |
| Documentation coverage | 24 / 526 items (4.56%) |
| Project coverage | 18 / 615 items (2.93%) |

`Individual reports present` includes the coordinator's report. `Completed tasks` counts items with an individual report, including the coordinator. Each report has one primary item. Findings and coverage describe only completed reports and are provisional until all items are reviewed and cross-checked.

## Execution

The platform supports at most four concurrent agents. Work therefore proceeds in individual batches. Required display names and complete paths are in [the manifest](agents-manifest.md); each row maps to its own report under [`reports/`](reports/). Runtime task identifiers use underscores because the agent tool rejects hyphens; the mandated display names remain intact in the manifest and reports.

No project code has been changed as part of this review. Failed or active agent tasks remain pending until a report exists. The full audit is not complete.

## Scope and exclusions

The project inventory covers relevant versioned repository files, including code, tests, scripts, configuration, workflows, and architecture documentation. `node_modules/next/dist/docs/` is included only as the official installed documentation corpus. `.git/`, `.next/`, caches, generated artifacts, dependency binaries, and `docs/code-review/` outputs are excluded. Lockfiles are excluded from line-by-line review and remain an input to a separate dependency audit.

See [documentation coverage](documentation-coverage.md), [source coverage](source-coverage.md), [findings](findings.md), [architecture](architecture.md), [recommendations](recommendations.md), and [compatibility](compatibility.md) for the current partial consolidation.
