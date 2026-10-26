# Individual infrastructure review — `next-code-file-github-workflows-scheduled-quality-yml`

## Identification

- **Review identity:** `next-code-file-github-workflows-scheduled-quality-yml`
- **Primary source:** `.github/workflows/scheduled-quality.yml`
- **Item type:** CODE_FILE
- **Source checkpoint:** `087772f6896e08989a04a340c060a32daf4a5a58`
- **Next.js baseline:** 16.4.2
- **State:** Completed following GitHub Actions run 40198107544.

## Observed implementation

Schedules weekly Lighthouse checks, starts the server after a build and uploads its report. Mutation testing is available only on manual workflow dispatch, with explicit timeouts and artifact retention.

## Finding and verification boundary

The scheduled Lighthouse job collects measurements but has no required score threshold. Mutation scores are not checked on its weekly schedule.

This is a scope-specific source review. No additional confirmed exploitable vulnerability was established from this file alone. The review does not claim that local hooks that were not executed, production deployments or the complete CI matrix were executed.

## Disposition

Static evidence is recorded for this individual primary file. The branch review workflow passed language, spelling, Markdown, TypeScript, regressions and inventory checks in [run 40198107544](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40198107544).
