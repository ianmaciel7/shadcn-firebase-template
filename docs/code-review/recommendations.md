# Recommendations

Provisional recommendations based only on completed reports:

1. Keep the root `html lang` issue tracked as known accessibility/localization debt. Decide how locale reaches the root document within the existing streaming model, then add browser coverage for English, Brazilian Portuguese, and Spanish before changing it.
2. Continue the one-item-per-agent queue. Mark a row complete only after its individually named report exists; keep active, failed, and unstarted items distinguishable.
3. Maintain the existing distinction between Next.js documentation requirements and repository-specific policies. Several installed guides are optional or describe features not present in this application.
4. Audit lockfiles through dependency/security tooling rather than treating their generated contents as line-by-line application code.
5. Reconcile copied component ownership wording across the component contracts, ADR 0008's current amendment, and `ARCHITECTURE.md` before changing UI, Firebase, or AI Elements maintenance rules.

No broad migration, dependency upgrade, or architecture change is recommended by the reviewed subset.
