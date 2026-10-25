# Individual structural fixture review — `next-code-file-ast-grep-rule-tests-forms-require-form-provider-test-yml`

## Identification

- **Agent identity:** `next-code-file-ast-grep-rule-tests-forms-require-form-provider-test-yml`
- **Primary file:** `.ast-grep/rule-tests/forms/require-form-provider-test.yml`
- **Type:** CODE_FILE
- **Source checkpoint:** `3f153caa103076b086888a3106a7de9bf8ab9d63`
- **Framework:** Next.js 16.4.2
- **Review status:** Source inspected; CI pending.

## Evidence from fixture assertions

Valid composite forms nest the native form under FormProvider or shadcn Form. The invalid fixture renders a form with fields but no such context.

## Boundaries

The JSX matcher cannot prove whether an unrelated composition actually provides the appropriate React Hook Form context.

The fixture records expected valid and invalid samples for one rule and should be paired with its version-matched scanner. Existence of a fixture does not alone prove that the scanner passes.

## Verification

The review workflow executes `pnpm check:structure` to run the actual rule tests and project scan. Report quality, TypeScript, regression tests, language, spelling and Markdown must also pass before the manifest item is marked Completed.

## Disposition

This is a file-specific fixture assessment, not a substitute for inspecting the corresponding scanner rule or generated snapshot.
