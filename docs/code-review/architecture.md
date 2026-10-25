# Architecture review status

The completed folder reports for the repository root, the entire `src/app/` folder hierarchy, `src/components/` (`ui/`, `ui/extensions/`, `firebase/`, `ai-elements/`), `src/hooks/`, `src/i18n/`, and `src/lib/` (`firebase/`, `firebase/firestore/`, `usage/`, `user/`) found the organization consistent with the documented App Router, hook-composition, and component placement rules. The registry/component ownership wording was reconciled across current project documentation. The installed Next.js guidance is organized coherently at the root, App Router, and Getting Started levels; two individual indexes have low-severity editorial gaps.

These are observations from 35 completed project folders and three completed documentation folders. They do not establish complete whole-repository coverage across pending tooling/test folders or complete documentation coverage.

Two localized issues were confirmed during the audit: `src/app/layout.tsx` declares English while request-selected content may use Portuguese or Spanish, and `src/app/error.tsx` labeled its action “try again” while calling `reset()` (subsequently remediated to call `retry()`). See [findings](findings.md) and [remediation status](resolutions.md). The repository architecture records the streaming implications of changing the document language.

There are 523 pending project folder/file items in the reconciled inventory.

The 12 resumed file reports identified localized library-level composition, accessibility, and data-presentation issues, including the `CodeBlock` cache identity collision; those component defects were remediated in `b568bb7`. Subsequent architectural updates moved cross-route providers and loading UI out of `src/app/` into `src/components/ui/extensions/` and `src/hooks/` ([ADR 0005](../adr/0005-document-project-standards.md)), introduced server-side session verification and role custom claims ([ADR 0009](../adr/0009-integrate-firebase-authentication.md)), and centralized route constants in `src/lib/navigation.ts`. These file reviews do not increase folder-review coverage or establish application-route reachability; several reviewed components have no current consumer in `src/`.

## Current-branch synchronization

The project inventory now comprises 680 tracked items (115 folders and 565 files); 134 have current completed individual reports. The seven stale source reports have been returned to Pending, and retired paths remain historical rather than active coverage. The three reviewed UI components are validated in workflow run 40130032176. These results do not imply that pending folders or documentation were validated.

## October 2026 inventory extension

Ten previously untracked evaluation items were added: four directories and six files, including the evaluation guides, case corpus and evaluation scripts. They remain Pending until individual evidence-backed reviews are completed. The active project inventory contains 695 items; 139 have completed report status.

## Validated source-report expansion

Current completed project-item reviews: 305/695, including 3 additional directory boundaries and 163 additional source files. The review corpus now covers significant portions of Firebase UI, AI Elements, and shared shadcn UI, but the pending audit has 880 remaining items in total, including many installed Next.js documentation files. Conclusions remain scoped to reviewed paths.

## Evaluation boundary review

The `evals/`, `evals/general/`, `evals/tool-usage/` and `scripts/evals/` directories each have an independently validated folder report. Fixture inputs are kept separate from the runner and from the Next.js application runtime. The runner's two low-severity robustness concerns remain open; the audit did not execute live agent scenarios.

## Profile review boundary

Fourteen additional shared-library and profile test files were inspected individually. Their completion is supported by GitHub Actions run 40192558815, but the tests that mock Firebase and Next.js sessions do not themselves certify browser sign-in, cloud rules or emulator networking.
