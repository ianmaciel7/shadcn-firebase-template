# Project source coverage

| Measure | Count |
| --- | ---: |
| Project folders inventoried | 119 |
| Project files inventoried | 578 |
| Total project review items | 697 |
| Folder reports completed | 119 |
| File reports completed | 578 |
| Items reviewed | 697 |
| Coverage | 100.00% |
| Active reports | 0 |
| Pending items | 0 |

## Direct documentation and policy source reviews (2026-10-26)

Eight project documentation/policy files were inspected at commit
`bbb02cee5bb8ec943fb66fdfbde8cc67a1bb0170`, each with a
separate report and linked-source evidence. These inspections did not
run independent subagents or execute runtime, CI, emulator or browser tests.
Project coverage is 597/695 (85.90%); 98 project items remain Pending.

## Firebase basics vendor reference checkpoint (2026-10-26)

Fifteen individual setup and refresh Markdown items were inspected
directly against the installed skill entrypoint, skill lock and project
runtime configuration. See the per-file reports for scope and two
upstream naming observations. No independent subagents or CLI tests
were executed. Current project source coverage is 612/695 (88.06%).

## Final pending project folder boundary inspection (2026-10-26)

Forty-one folder paths were inspected using a non-truncated recursive
Git tree of the branch checkpoint. Each report lists exact immediate
subdirectories, files and descendant counts; no independent subagent
or runtime execution is asserted. All 119 project folder items now
have individual structural reports. The 42 remaining project file
items still require separate inspections.

## Imported engineering skill source checkpoint (2026-10-26)

Twenty-four additional installed skill files were inspected individually.
The reports distinguish vendor examples, CLI-dependent behavior and
application runtime contracts; no independent subagent or execution
was claimed. Current project coverage is 677 of 695 items, with
18 source files still Pending.

## Project source reports completed (2026-10-26)

The 18 remaining project files were directly inspected, including
the four binary PNG assets and the current test fixture source.
All 576 project files and all 119 project folders now have distinct
individual review reports; no project path remains Pending.
This measures recorded static inspection coverage, not compliance
with the original independent subagent execution requirement or
complete behavioral validation. CI results are tracked separately.

Completed folder reviews: repository root (`./`), `src/app/` and all 20 of its route/private subdirectories (`(protected)/` and its `_components/`, `_hooks/`, `_lib/`, and `profile/` subtree; `(public)/` and its `_hooks/`, `forgot-password/`, `register/`, and `sign-in/` subtrees; `_components/` and `_hooks/`), `src/components/`, `src/components/ui/`, `src/components/ui/extensions/`, `src/components/firebase/`, `src/components/ai-elements/`, `src/hooks/`, `src/i18n/`, and `src/lib/` (plus `firebase/`, `firebase/firestore/`, `usage/`, and `user/`).

Completed file reviews: `package.json`, `tsconfig.json`, `next.config.ts`, all 52 non-test runtime files in `src/app/**` (`layout.tsx`, `error.tsx`, `not-found.tsx`, `loading.tsx`, `page.tsx`, `favicon.ico`, `globals.css`, `typeset.css`, and all route/group layouts, pages, loading boundaries, components, hooks, and `_lib` modules under `(protected)/`, `(public)/`, `_components/`, and `_hooks/`), `src/components/ui/button.tsx`, all 5 modules in `src/components/ui/extensions/` (`auth-provider-client.tsx`, `firebase-auth-session-bridge-client.tsx`, `intl-provider-server.tsx`, `route-loading.tsx`, and `theme-provider-client.tsx`), all 6 hooks in `src/hooks/`, all 3 modules in `src/i18n/`, all 16 non-test modules in `src/lib/**`, and 13 `src/components/ai-elements/` modules (`agent.tsx` through `controls.tsx`).

The layout review found a known accessibility and localization mismatch: `html lang` remains `en` when the rendered locale is Portuguese or Spanish. The error-boundary review independently confirmed the mismatch between “try again” and `reset()` semantics (subsequently remediated with `retry()`). See the [individual layout report](reports/next-code-file-src-app-layout-tsx.md), [error report](reports/next-code-file-src-app-error-tsx.md), [consolidated findings](findings.md), and [remediation dispositions](resolutions.md).

523 project items have no individual report yet and remain pending in the reconciled inventory. The inventory excludes generated output (`graphify-out/`, `.next/`), caches, dependency binaries, and lock files (`pnpm-lock.yaml`, `functions/package-lock.json`) from line-by-line code review. Lock files remain subject to dependency auditing.

The resumed batch added individual reports for `artifact.tsx`, `attachments.tsx`, `audio-player.tsx`, `canvas.tsx`, `chain-of-thought.tsx`, and `checkpoint.tsx` in `src/components/ai-elements/`. Six distinct real subagents reviewed these six primary files. No application source changed during the audit phase.

The second resumed batch completed `code-block.tsx`, `commit.tsx`, `confirmation.tsx`, `connection.tsx`, `context.tsx`, and `controls.tsx`, again using six distinct item reviewers. The code cache collision was a medium finding, and the commit header and audio controls shared one consolidated native-button configuration finding; all were subsequently fixed during remediation.

## Post-checkpoint inventory reconciliation

Following the remediation phase and architectural updates (`ADR 0004`, `ADR 0005`, and `ADR 0009` updates, server session bridge, centralized `ROUTES`, `ProtectedGuardClient`, hook placement/complexity guards, `check:english`, and Serena research memory relocation), the project manifest was reconciled against `git ls-files`:

- Removed 1 folder (`.serena/memories/external-research/`) and 11 relocated, renamed, or excluded file paths (`src/app/_components/auth-provider-client*`, `src/app/_components/route-loading*`, `src/app/_hooks/use-auth-provider-client.ts`, `src/app/(protected)/_components/protected-gate-client*`, `src/app/(protected)/_hooks/use-protected-gate-client.ts`, `.serena/memories/external-research/*`, and `functions/package-lock.json`).
- Added 8 new tracked folders (`.agents/scripts/`, `.agents/skills/new-component/`, `.agents/skills/verify/`, `.biome/rules/complexity/`, `.serena/memories/research/`, `src/app/(protected)/_lib/`, `src/lib/user/`, and `tests/unit/`) and 64 new tracked files as `Pending` review items.

## Reconciled current-branch coverage

As of commit `44c7bfd`, current tracked paths supersede the older coverage narrative above: 33 folders and 101 files are reviewed out of 685 project items. Retired paths are not active coverage, and seven modified files are pending re-review. Three UI files have current individual reports and have passed the focused validation workflow. See [inventory history](inventory-history.md) for excluded paths and the changed-source list.

## Firebase regression checkpoint

Two additional Firebase UI source files have completed focused reviews with passing unit tests in run 40131416018. Current project coverage is 136 of 682 items, with 546 pending. The underlying Firebase emulator integration suite was not run in this focused workflow.

## Validated preview component

The preview component now has an individually verified report, with three focused tests passing in run 40131931671. Active project coverage is 137 of 683 primary items; 546 are still pending.

## Validated multi-factor chooser

A dedicated duplicate-key regression for multiple phone factors passed in run 40132646413. Current project coverage is 138 of 684 items; 546 remain pending.

## Validated citation source

A dedicated four-case regression covers safe citation URL rendering and passed in run 40133019315. Current project coverage is 139 of 685 items; 546 remain pending.

## Completed source-review import

The current project coverage is **305 / 695 (43.88%)**, comprising 36 folder and 269 file reports. These totals supersede historical prose above. An additional 166 item reviews passed documentation and project quality gates in [run 40134059605](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40134059605); source defects reported by those items are not automatically remediated.

## Evaluation inventory coverage

The ten evaluation items reviewed in [run 40134977622](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40134977622) increased current project coverage to 315/695 (45.32%). Source-level review completion does not establish the execution of the external agent suite.

## Current validated authentication and profile tests

Fourteen file-specific reviews completed at revision `db0f8dd`. The project now has 329 completed primary items of 695; 366 remain pending. Reviews were reconciled only after the dedicated branch workflow passed in run 40192558815.

## Test review checkpoint

Twenty unit and browser test files received individual reviewed reports in the current branch. The [successful validation run 40192955670](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40192955670) supports their current completion status; app, browser and Firebase integration gaps listed in each report remain outside this review scope.

## Configuration review coverage

Twenty additional configuration files were reviewed and validated through run 40193275075. The project inventory has 369 reviewed items of 695, with 326 project items still pending. Static examination of Firebase rules does not replace emulator authorization tests.

## Source quality guard reviews

Seven completed reviews of local checkers and their test fixtures were reconciled after the successful branch validation workflow run 40193670924. The current project item coverage is 376 of 695 items, with 319 pending source and folder reviews.

## Infrastructure and repository instruction coverage

The latest checkpoint validated thirty-nine unique source files and thirteen distinct folders from the current Git tree. GitHub workflow, development tooling and agent instruction boundaries have dedicated reports. Nested skill and other source files remain Pending until reviewed separately. Review workflow run 40198107544 passed for the related reports.

## Grouped scanner rules

Twenty additional rules or rule-specific tests were reviewed individually under `.ast-grep/rules/`. Rules for route ownership, component props, form composition, Firebase sessions, localization, React state and Tailwind class detection now have completed, distinct primary reports. Review CI run 40198684005 passed on the reports.

## Structural scanner verification checkpoint

An additional 56 structural scanner inventory items were inspected and reconciled from the current Git tree, covering accepted and rejected rule cases, diagnostic snapshots and source folder boundaries. The current project coverage is 504 of 695 items (72.52%). The independent review workflow passed in run 40209883877.

## Native rule review coverage

Eleven additional Biome primary source files have completed file-specific reviews and passing rule fixture evidence. Project coverage is 515 of 695 items (74.10%).

## Tested source review checkpoint

Eighteen new test and fixture reports and seven folder ownership reviews were completed after [branch validation run 40210742964](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40210742964). All reports retain independent primary file or folder identities. The project currently has 540 completed reviews of 695 source items (77.70%), including 78 folders and 462 files. The two visual baseline images remain outside any claim of pixel-level inspection.

## Architecture decision record coverage

Nine accepted numbered decisions and the ADR index were individually inspected, respecting their historical context, amendments and immutability. This adds ten validated file reports after run 40211467467. The active project inventory now has 550 of 695 items reviewed, leaving 145 project items pending.

## Configuration and provenance checkpoint

Seventeen further source file reports were validated under review workflow run 40234107521, including separate boundaries for dependency audit exceptions, static security patterns and version-specific upstream source indexes. Project review coverage is now 567/695 items; 128 project primary items remain pending. Recorded upstream document hashes were not independently re-retrieved in this batch.

## Installed skill review checkpoint

Twelve additional skill and reference file reviews are complete. The review focuses on available paths, expected workflows and the difference between local agent policies and upstream references. Review CI run 40234643392 passed; remaining skill files retain their own Pending entries.

## Firebase skill reference checkpoint

Ten additional skills and references were inspected for Firebase Auth flows, native platform boundaries, CLI discovery and local setup. One missing local reference is recorded in the findings register. Review run 40235002079 passed. Project review coverage is 589/695 primary items.

## Post-audit Firebase regression file (2026-10-26)

`src/lib/firebase/auth-service-worker.test.ts` was added after the original
1,210-item source inspection. Its VM harness is reviewed separately under
`reports/next-code-file-src-lib-firebase-auth-service-worker-test-ts.md`.
The current project inventory has 119 folders and 577 files, all with reports.
This does not imply that the service worker was tested in a deployed browser.

## Dynamic document-language file (2026-10-26)

`src/components/ui/extensions/intl-document-server.tsx` has a separate
static review report for the proposed request-locale HTML root. As with all
review reports, behavioral certification depends on the recorded CI tests.
