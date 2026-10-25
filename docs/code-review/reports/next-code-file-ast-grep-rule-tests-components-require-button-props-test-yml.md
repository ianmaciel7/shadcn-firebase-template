# Individual structural fixture review — `next-code-file-ast-grep-rule-tests-components-require-button-props-test-yml`

## Identification

- **Agent identity:** `next-code-file-ast-grep-rule-tests-components-require-button-props-test-yml`
- **Primary file:** `.ast-grep/rule-tests/components/require-button-props-test.yml`
- **Type:** CODE_FILE
- **Source checkpoint:** `3f153caa103076b086888a3106a7de9bf8ab9d63`
- **Framework:** Next.js 16.4.2
- **Review status:** Completed after passing structural and report checks.

## Evidence from fixture assertions

The positive examples cover Button and native button prop inheritance, other typed media controls and unrelated modal types. Negative cases reject standalone ButtonProps type aliases and interfaces.

## Boundaries

This fixture suite cannot identify arbitrary indirect type aliases without extending the structural rule.

The fixture records expected valid and invalid samples for one rule and should be paired with its version-matched scanner. Existence of a fixture does not alone prove that the scanner passes.

## Verification

The review workflow executes `pnpm check:structure` to run the actual rule tests and project scan. Report quality, TypeScript, regression tests, language, spelling and Markdown must also pass before the manifest item is marked Completed.

## Disposition

This is a file-specific fixture assessment, not a substitute for inspecting the corresponding scanner rule or generated snapshot.
