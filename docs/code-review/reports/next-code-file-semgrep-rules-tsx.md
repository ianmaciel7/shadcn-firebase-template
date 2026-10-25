# Individual configuration and provenance review — `next-code-file-semgrep-rules-tsx`

## Identification

- **Review identity:** `next-code-file-semgrep-rules-tsx`
- **Primary file:** `.semgrep/rules.tsx`
- **Item type:** CODE_FILE
- **Inspected source revision:** `d2ac7d0390150b41509046ab2ead5e70c9ae9c66`
- **Framework reference:** Next.js 16.4.2 and React 19.3.1
- **Status:** Source inspected; report validation pending.

## Source evidence

The fixture pairs intentional violations with accepted control cases for environment access, dynamic execution, raw HTML, session cookies and build configuration checks.

## Finding and limitations

This is intentionally unsafe-looking test source: marked examples are evidence for scanner self-tests, not code that should be rendered or executed as application features.

No additional confirmed defect is claimed solely from this inspection. External service behavior, supply chain alerts and unrelated runtime components are outside this individual file's scope.

## Validation

The current file was inspected from the branch source and compared with its declared responsibility. The branch CI must check inventory integrity, report spelling, English and Markdown before changing this entry to Completed. Existence of a source index is not evidence of a new upstream verification.

## Disposition

Individual source review recorded. Preserve the limitations above when updating aggregate coverage.
