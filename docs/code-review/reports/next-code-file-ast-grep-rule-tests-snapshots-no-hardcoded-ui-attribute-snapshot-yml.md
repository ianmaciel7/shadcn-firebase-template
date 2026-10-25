# Individual rule snapshot review — `next-code-file-ast-grep-rule-tests-snapshots-no-hardcoded-ui-attribute-snapshot-yml`

## Identification

- **Unique agent:** `next-code-file-ast-grep-rule-tests-snapshots-no-hardcoded-ui-attribute-snapshot-yml`
- **Primary file:** `.ast-grep/rule-tests/__snapshots__/no-hardcoded-ui-attribute-snapshot.yml`
- **Type:** CODE_FILE
- **Source checkpoint:** `b0dcbc7c6b5045770bcaccc37cbd5ba85e6252cc`
- **Framework baseline:** Next.js 16.4.2
- **Status:** Inspected; validation pending.

## Source inspection

The snapshot labels literal aria-label, image alt and placeholder attributes and includes the offending string and attribute name as secondary spans.

## Relationship to tests

This generated snapshot has a matching rule test and rule definition with the same identifier. It protects the diagnostic source ranges and labeled excerpts against silent changes; it does not prove that other inputs are safe or that warnings are actionable defects.

## Verification boundary

The branch review workflow runs `pnpm check:structure` to verify the rule and its snapshot with the current scanner, followed by the report quality checks. This file is considered complete only when those steps pass.

## Disposition

This report covers the snapshot's diagnostic output, not the implementation of the corresponding rule or every rule-test fixture.
