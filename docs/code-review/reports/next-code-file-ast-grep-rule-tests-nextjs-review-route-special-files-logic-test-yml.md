# Individual structural fixture review — `next-code-file-ast-grep-rule-tests-nextjs-review-route-special-files-logic-test-yml`

## Identification

- **Agent identity:** `next-code-file-ast-grep-rule-tests-nextjs-review-route-special-files-logic-test-yml`
- **Primary file:** `.ast-grep/rule-tests/nextjs/review-route-special-files-logic-test.yml`
- **Type:** CODE_FILE
- **Source checkpoint:** `3f153caa103076b086888a3106a7de9bf8ab9d63`
- **Framework:** Next.js 16.4.2
- **Review status:** Source inspected; CI pending.

## Evidence from fixture assertions

Valid examples load server data in a page and generate translated metadata. Invalid examples call useState, useTranslations, React.useEffect and useRouter directly in route entrypoints.

## Boundaries

The matcher targets hook calls, while other repository checks enforce additional route logic restrictions.

The fixture records expected valid and invalid samples for one rule and should be paired with its version-matched scanner. Existence of a fixture does not alone prove that the scanner passes.

## Verification

The review workflow executes `pnpm check:structure` to run the actual rule tests and project scan. Report quality, TypeScript, regression tests, language, spelling and Markdown must also pass before the manifest item is marked Completed.

## Disposition

This is a file-specific fixture assessment, not a substitute for inspecting the corresponding scanner rule or generated snapshot.
