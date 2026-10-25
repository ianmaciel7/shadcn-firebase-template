# Individual structural fixture review — `next-code-file-ast-grep-rule-tests-nextjs-review-route-test-sdk-mock-test-yml`

## Identification

- **Agent identity:** `next-code-file-ast-grep-rule-tests-nextjs-review-route-test-sdk-mock-test-yml`
- **Primary file:** `.ast-grep/rule-tests/nextjs/review-route-test-sdk-mock-test.yml`
- **Type:** CODE_FILE
- **Source checkpoint:** `3f153caa103076b086888a3106a7de9bf8ab9d63`
- **Framework:** Next.js 16.4.2
- **Review status:** Source inspected; CI pending.

## Evidence from fixture assertions

Valid mocks target Next router or a boundary component. Invalid examples mock firebase/auth and the central Firebase client module from a route test.

## Boundaries

This is a warning-level convention and should not reject justified isolated integration tests.

The fixture records expected valid and invalid samples for one rule and should be paired with its version-matched scanner. Existence of a fixture does not alone prove that the scanner passes.

## Verification

The review workflow executes `pnpm check:structure` to run the actual rule tests and project scan. Report quality, TypeScript, regression tests, language, spelling and Markdown must also pass before the manifest item is marked Completed.

## Disposition

This is a file-specific fixture assessment, not a substitute for inspecting the corresponding scanner rule or generated snapshot.
