# Individual configuration and provenance review — `next-code-file-stryker-config-json`

## Identification

- **Review identity:** `next-code-file-stryker-config-json`
- **Primary file:** `stryker.config.json`
- **Item type:** CODE_FILE
- **Inspected source revision:** `d2ac7d0390150b41509046ab2ead5e70c9ae9c66`
- **Framework reference:** Next.js 16.4.2 and React 19.3.1
- **Status:** Source inspected; report validation pending.

## Source evidence

Stryker mutates the locale routing and mobile breakpoint sources, uses the command test runner, limits concurrency and rejects mutation coverage below the configured break threshold.

## Finding and limitations

The mutation target list is intentionally narrow and the mutation job is manual-only; it does not certify mutation quality throughout the app.

No additional confirmed defect is claimed solely from this inspection. External service behavior, supply chain alerts and unrelated runtime components are outside this individual file's scope.

## Validation

The current file was inspected from the branch source and compared with its declared responsibility. The branch CI must check inventory integrity, report spelling, English and Markdown before changing this entry to Completed. Existence of a source index is not evidence of a new upstream verification.

## Disposition

Individual source review recorded. Preserve the limitations above when updating aggregate coverage.
