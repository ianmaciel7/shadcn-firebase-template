# Recommendations

Provisional recommendations based only on completed reports:

1. Keep the root `html lang` issue tracked as known accessibility/localization debt. Decide how locale reaches the root document within the existing streaming model, then add browser coverage for English, Brazilian Portuguese, and Spanish before changing it.
2. Continue the one-item-per-agent queue. Mark a row complete only after its individually named report exists; keep active, failed, and pending items distinguishable.
3. Maintain the existing distinction between Next.js documentation requirements and repository-specific policies. Several installed guides are optional or describe features not present in this application.
4. Audit lock files through dependency/security tooling rather than treating their generated contents as line-by-line application code.
5. Reconcile copied component ownership wording across the component contracts, ADR 0008's current amendment, and `ARCHITECTURE.md` before changing UI, Firebase, or AI Elements maintenance rules.

6. Correct full-content cache identity in CodeBlock before relying on changing tool/code output, with sequential and concurrent collision regressions.
7. Address the individually evidenced Base UI composition and naming issues with focused browser checks; keep the commit/audio native-button mismatch deduplicated and distinct from nested-button composition.
8. Adapt cache token pricing once and derive context totals and detail rows consistently.

These are recommendations for future implementation. This audit changed no application source. No broad migration, dependency upgrade, or architecture change is recommended by the reviewed subset.

## Current follow-up priorities

- Keep the focused UI regression tests and the independent review-validation workflow running on this branch; avoid disabling quality gates when generated documentation outside `docs/code-review/` has lint violations.
- Review the seven modified historical source files again and complete the remaining per-item reports. Treat existing external drafts as unverified until they are applied to the current inventory and validated.

## New source-review batch follow-up

Use the 166 individual reviews as a scoped triage queue. Reproduce higher-impact authentication, authorization, navigation and accessibility findings before patching. Add dedicated unit or browser regressions for issues with measurable behavior. Do not expand completion counts for the 880 remaining items without individual source or documentation evidence.

## External evaluation runner next steps

Add negative tests for an unavailable external executable and for trace events that contain matching tool names without a successful connector invocation. Keep the general read-only fixture as untrusted test data, not instructions for the evaluator to follow. Maintain evidence-backed status before deciding a runner issue is fixed.
