# Individual structural fixture review — `next-code-file-ast-grep-rule-tests-forms-require-field-data-invalid-test-yml`

## Identification

- **Agent identity:** `next-code-file-ast-grep-rule-tests-forms-require-field-data-invalid-test-yml`
- **Primary file:** `.ast-grep/rule-tests/forms/require-field-data-invalid-test.yml`
- **Type:** CODE_FILE
- **Source checkpoint:** `3f153caa103076b086888a3106a7de9bf8ab9d63`
- **Framework:** Next.js 16.4.2
- **Review status:** Source inspected; CI pending.

## Evidence from fixture assertions

A valid Controller with fieldState passes data-invalid and aria-invalid, and a Controller without fieldState remains valid. The invalid case consumes fieldState yet renders Field without data-invalid.

## Boundaries

The fixture establishes styling marker presence, not full accessible error association or error summary behavior.

The fixture records expected valid and invalid samples for one rule and should be paired with its version-matched scanner. Existence of a fixture does not alone prove that the scanner passes.

## Verification

The review workflow executes `pnpm check:structure` to run the actual rule tests and project scan. Report quality, TypeScript, regression tests, language, spelling and Markdown must also pass before the manifest item is marked Completed.

## Disposition

This is a file-specific fixture assessment, not a substitute for inspecting the corresponding scanner rule or generated snapshot.
