# Next.js code review

<!-- cspell:ignore NXLAYOUT AUDIOPLAYER TOTP -->

This began as an in-progress, read-only audit against the installed Next.js **16.4.2** documentation in `node_modules/next/dist/docs/`. The full one-agent-per-item inventory was generated and validated before review began.

## Current metrics

| Metric | Count |
| --- | ---: |
| Documentation folders | 40 |
| Documentation files | 474 |
| Project folders | 119 |
| Project files | 576 |
| Coordinator | 1 |
| Expected agents / primary items | 1210 |
| Currently completed review reports | 720 |
| Active report tasks | 0 |
| Completed tasks | 720 |
| Pending tasks (excluding active) | 490 |
| Not applicable | 3 |
| Consolidated findings from completed reports | 5 medium, 22 low, 0 high/critical |
| Documentation coverage | 24 / 514 items (4.67%) |
| Project coverage | 695 / 695 items (100.00%) |

`Individual reports present` includes the coordinator's report. `Completed tasks` counts items with an individual report, including the coordinator. Each report has one primary item. Findings and coverage describe only completed reports and are provisional until all items are reviewed and cross-checked.

## Direct documentation and policy file review checkpoint (2026-10-26)

Eight previously pending repository files were read individually and checked
against their linked local sources: domain guidance, issue tracking,
the Biome preview, quality ownership, documentation navigation, the root
README, contributing conventions and authenticated logging guidance.
Each item now has its own report under `reports/` and is marked Completed.
These are direct source inspections, not executions by independent subagents.
The source checkpoint is `bbb02cee5bb8ec943fb66fdfbde8cc67a1bb0170`.
CI and browser/emulator suites were not executed locally in this session;
their results must be checked on the resulting PR commit.
The overall inventory is 622/1210 completed and 588 pending; documentation
coverage is unchanged at 24/514, with 98 project items still pending.

## Firebase basics reference review checkpoint (2026-10-26)

Fifteen individual vendor reference files were directly inspected:
Android, iOS, Flutter and web onboarding; Antigravity, Gemini CLI,
Cursor, Claude Code, Copilot and generic agent setup/refresh guides.
These are source-only inspections, not independent subagent executions.
Notes distinguish upstream optional recipes from the configured Next.js
application and record two local naming/navigation inconsistencies in
Android and Gemini CLI guidance. Neither vendor document was rewritten.
Project coverage is now 612/695 (88.06%); 83 project items remain Pending.
Documentation coverage remains 24/514 with 490 Pending.
CI for the new commit remains to be verified.

## Remaining project folder boundary review checkpoint (2026-10-26)

All 41 previously Pending project folder items were inspected against
the pinned tracked Git tree. Each folder now has an individual structural
report with its actual immediate files, child directories, ownership scope
and verification limits. These reviews do not count or replace reviews
of descendant files, and they were conducted directly rather than by
separate independent subagent processes.
Project folder coverage is 119/119, while project file coverage is
534/576. The complete project audit still has 42 Pending file items.
Official installed Next.js documentation remains 24/514 completed.
CI for this checkpoint is not yet known.

## Imported engineering skills source checkpoint (2026-10-26)

Twenty-four individual setup and shadcn reference/source items were
inspected directly, covering tracker templates, skill bootstrap,
interface metadata, showcase helpers, evaluation data, registry,
CLI and component conventions. Per-file reports separate observed
source from optional vendor recipes and untested external behavior.
No independent subagents or runtime checks were executed for these
individual source reviews. There are now 18 Pending project files,
zero Pending project folders and 490 Pending Next.js documentation items.
CI status for this commit remains separate from the source inspection.

## Full project source inventory checkpoint (2026-10-26)

All 695 tracked project primary items now have individual static reports
(119 folder boundaries and 576 files). The final 18 items covered
architecture, coding, design, React/Next.js/shadcn references, testing,
security, engineering guard tests, research policy, and four PNG assets
which were decoded and visually inspected.
**Execution caveat:** these new reports are direct source inspections;
the original request for one independent real subagent process per item
has not been executed in this environment. This count is review-report
coverage, not certification that independent agent reviews, browser
journeys or production behavior are complete.
All 490 remaining inventory items are from the installed Next.js
documentation corpus. Project source coverage is 695/695 (100.00%);
overall recorded coverage is 720/1210 (59.50%).
CI validation of this checkpoint is not established until the
associated workflow runs finish.

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

## Validated web-preview checkpoint

The sandbox security boundary and URL editor behavior passed dedicated tests in run 40131931671. Current active coverage is 162 of 1,198 items; 1,036 remain Pending. Additional draft reports stored in the repository are not automatically considered completed reviews.

## Validated multi-factor chooser checkpoint

Unique enrollment identities now distinguish multiple factors from the same provider family. [Review run 40132646413](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40132646413) passed all required checks. Current coverage is 163 of 1,199 primary items; 1,036 remain Pending.

## Validated citation source checkpoint

The citation trigger now tolerates invalid source URLs. Four focused tests and the repository validation checks passed in [run 40133019315](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40133019315). Current active coverage is 164 of 1,200 primary items, with 1,036 Pending.

## Source-review import validated at GitHub Actions

The [import queue](import-queue.md) records 166 individually prepared source reviews. Their English language, spelling and Markdown checks passed in [workflow run 40134059605](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40134059605), alongside TypeScript, Biome, an inventory consistency guard and the existing focused regression tests. These source reviews were marked Completed, with 3 folder items and 163 file items. **This does not mean their source findings have been fixed or that a browser/emulator test exists for each file.** The consolidated findings and remediation records keep that distinction. 880 items remain Pending.

## Evaluation fixture and runner review completion

Ten individual evaluations/runner reports passed branch validation at [run 40134977622](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40134977622) and were marked Completed (four directories, six files). They describe read-only scenarios and two low-severity runner concerns; they do not assert that live external agent evaluations were executed.

## Auth and profile review checkpoint

Fourteen additional individual source reviews were checked under Next.js 16.4.2 and validated in [GitHub Actions run 40192558815](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40192558815). Source inspection included session and role logic, profile tests, Firebase client/server mocks, safe return-path regressions and shared type definitions. Inventory integrity, Biome, TypeScript, regression tests, the English guard, spelling and Markdown passed. Mocked source tests do not establish emulator or production behavior.

## Validated route and quality test checkpoint

Twenty more file-specific reviews were completed for home and profile composition, access guards, App Router errors and loading, locale routing, responsive viewport behavior, and source quality guard tests. Branch run [40192955670](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40192955670) passed all configured checks before these entries were marked Completed. Project coverage is now 349/695 (50.22%); the documentation corpus remains 24/514.

## Verified configuration review checkpoint

Twenty primary configuration files covering Firebase rules and emulators, TypeScript tooling, Biome, shadcn registry configuration, security and documentation quality tooling, Vitest and Playwright were inspected individually. [Review CI run 40193275075](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40193275075) passed inventory integrity, Biome, TypeScript, regressions, English, spelling and Markdown before these reports were counted complete. Rule-emulator and deployment tests remain separate obligations; documentation corpus completion is unchanged.

## Validated source quality guards

Seven additional file-specific reviews covered component composition, naming and runtime boundaries, route purity, responsive checks, language policy and the review inventory guard. [Validation run 40193670924](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40193670924) passed inventory integrity, lint, TypeScript, regression tests, English, spelling and Markdown. These static guards remain repository-specific policies and do not replace the official Next.js contract or browser integration tests.

## Validated infrastructure and agent rules checkpoint

Thirty-nine source files and thirteen folder ownership boundaries were individually inspected, including GitHub Actions, branch policy, development hooks, Ladle, Firebase emulator scripts, project agent instructions and framework rules. All fifty-two reports passed [review validation run 40198107544](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40198107544) after spelling fixes. A folder report records its directory design; it does not imply that all its descendant files are complete. The project inventory now has 428 completed and 267 pending items. The 514-item installed Next.js documentation corpus still has 24 completed reviews.

## Structural scanner rule checkpoint

Twenty additional per-file reviews of grouped structural scanning rules and their hook scope test were inspected and validated in [review CI run 40198684005](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40198684005). Error-level project policies were distinguished from heuristic warning rules. The project now has 448 reviewed items of 695 (64.46%). The installed Next.js documentation corpus remains at 24 reviewed of 514; its separate audit is not implied by these rule reviews.

## Verified structural scanner fixtures

The current inventory includes 19 scanner fixture reviews, 19 diagnostic snapshot reviews and 18 structural scanner folder reviews completed after [GitHub Actions run 40209883877](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40209883877). The dedicated workflow now executes `pnpm check:structure` and focused hook module scope tests. Folder-level completion does not imply any pending child file is complete.

## Native Biome policy fixture review

Eleven file-specific reviews of pinned Biome configuration plugins, generated Next.js type rules, complexity checks and React and DOM fixtures were completed after [CI run 40210742964](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40210742964). The dedicated review workflow now executes all five native Biome rule test suites rather than relying only on the repository lint command.

## Completed browser and test infrastructure checkpoint

Ten Playwright and naming-fixture sources, eight focused regression tests and seven test infrastructure folders were inspected separately. [Review validation run 40210742964](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40210742964) passed the branch report checks, structural rule fixtures, TypeScript and focused regressions. The full Playwright, Firebase emulator and visual screenshot matrix is not claimed as executed by this review workflow. Project review coverage is now 540/695 (77.70%), with 155 project items pending.

## Historical architecture record review

Ten architecture decision records and the decision index were inspected as separate source items. Accepted records were preserved as historical evidence. Current implementation differences concerning framework versions, theme error handling and emulator CI are documented in individual reports instead of overwriting accepted decisions. Their report checks passed in [review validation run 40211467467](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40211467467). Project coverage is now 550/695 (79.14%).

## Configuration and upstream source manifest review

Seventeen additional primary source files were individually inspected for dependency policy, security rules, mutation testing, repository metadata, Serena configuration and recorded documentation provenance. [Review CI run 40234107521](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40234107521) passed before completion status changed. Documentation source manifests only record prior upstream retrieval checkpoints; their review does not replace the 490 outstanding installed Next.js documentation reviews.

## Agent skill review checkpoint

Twelve additional agent skill source files and references were inspected under the current branch. After fixing a report dictionary exception for an interface filename, [review validation run 40234643392](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40234643392) passed. The source review distinguishes host-installed commands from upstream skill examples and does not certify external tool availability. The project review count is now 579 out of 695 items.

## Firebase skill reference checkpoint

Ten additional Firebase setup and Auth skill files received distinct source reviews and passed [review validation run 40235002079](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40235002079). The local reference audit confirmed a broken Markdown link in an upstream skill; the finding is open, without silently changing its external source. Mobile reference examples are not proof of a production Next.js web test.
