# Individual configuration and provenance review — `next-code-file-vitest-mutation-config-mts`

## Identification

- **Review identity:** `next-code-file-vitest-mutation-config-mts`
- **Primary file:** `vitest.mutation.config.mts`
- **Item type:** CODE_FILE
- **Inspected source revision:** `d2ac7d0390150b41509046ab2ead5e70c9ae9c66`
- **Framework reference:** Next.js 16.4.2 and React 19.3.1
- **Status:** Source inspected; report validation pending.

## Source evidence

The specialized Vitest configuration runs fast jsdom unit tests with React plugin and path resolution, excluding browser-oriented test files to keep mutation analysis tractable.

## Finding and limitations

This mutation-specific suite deliberately omits Vitest Browser Mode, so passing mutation runs does not cover real Chromium behavior.

No additional confirmed defect is claimed solely from this inspection. External service behavior, supply chain alerts and unrelated runtime components are outside this individual file's scope.

## Validation

The current file was inspected from the branch source and compared with its declared responsibility. The branch CI must check inventory integrity, report spelling, English and Markdown before changing this entry to Completed. Existence of a source index is not evidence of a new upstream verification.

## Disposition

Individual source review recorded. Preserve the limitations above when updating aggregate coverage.
