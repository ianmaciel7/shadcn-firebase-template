# Individual infrastructure review — `next-code-file-scripts-emulator-clear-mjs`

## Identification

- **Review identity:** `next-code-file-scripts-emulator-clear-mjs`
- **Primary source:** `scripts/emulator/clear.mjs`
- **Item type:** CODE_FILE
- **Source checkpoint:** `087772f6896e08989a04a340c060a32daf4a5a58`
- **Next.js baseline:** 16.4.2
- **State:** Source reviewed; CI validation pending.

## Observed implementation

Loads environment files, requires an explicit Auth emulator host and project ID, sends a DELETE to the emulator account endpoint, distinguishes connection errors from HTTP failures and sets a nonzero exit code.

## Finding and verification boundary

This command deliberately clears local test accounts; it should not be run with untrusted endpoint values or real production credentials. No network request was made during review.

This is a scope-specific source review. No additional confirmed exploitable vulnerability was established from this file alone. The review does not claim that local hooks that were not executed, production deployments or the complete CI matrix were executed.

## Disposition

Static evidence is recorded for this individual primary file. Move the manifest entry to Completed only after the branch review workflow passes the new report's language, spelling, Markdown and inventory checks.
