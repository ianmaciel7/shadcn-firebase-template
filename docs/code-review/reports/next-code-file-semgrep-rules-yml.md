# Individual configuration and provenance review — `next-code-file-semgrep-rules-yml`

## Identification

- **Review identity:** `next-code-file-semgrep-rules-yml`
- **Primary file:** `.semgrep/rules.yml`
- **Item type:** CODE_FILE
- **Inspected source revision:** `d2ac7d0390150b41509046ab2ead5e70c9ae9c66`
- **Framework reference:** Next.js 16.4.2 and React 19.3.1
- **Status:** Source inspected; report validation pending.

## Source evidence

The security rules prohibit secret server environment access in client files, dynamic code execution, raw HTML sinks, unsafe public environment names, server-only imports in client modules, weak authentication cookies and ignored build errors.

## Finding and limitations

These patterns inspect syntax; escaping of aliases and indirect references is possible. Semgrep rule fixtures and production security controls remain separate evidence.

No additional confirmed defect is claimed solely from this inspection. External service behavior, supply chain alerts and unrelated runtime components are outside this individual file's scope.

## Validation

The current file was inspected from the branch source and compared with its declared responsibility. The branch CI must check inventory integrity, report spelling, English and Markdown before changing this entry to Completed. Existence of a source index is not evidence of a new upstream verification.

## Disposition

Individual source review recorded. Preserve the limitations above when updating aggregate coverage.
