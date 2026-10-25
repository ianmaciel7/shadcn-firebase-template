# Individual structural fixture review — `next-code-file-ast-grep-rule-tests-react-no-manual-memoization-tsx-test-yml`

## Identification

- **Agent identity:** `next-code-file-ast-grep-rule-tests-react-no-manual-memoization-tsx-test-yml`
- **Primary file:** `.ast-grep/rule-tests/react/no-manual-memoization-tsx-test.yml`
- **Type:** CODE_FILE
- **Source checkpoint:** `3f153caa103076b086888a3106a7de9bf8ab9d63`
- **Framework:** Next.js 16.4.2
- **Review status:** Source inspected; CI pending.

## Evidence from fixture assertions

TSX fixtures mirror the TypeScript cases: direct memoization receives a warning, while ordinary calculations and state usage do not.

## Boundaries

Compiler compatibility and identity guarantees depend on the actual hook's semantics, not solely on syntax.

The fixture records expected valid and invalid samples for one rule and should be paired with its version-matched scanner. Existence of a fixture does not alone prove that the scanner passes.

## Verification

The review workflow executes `pnpm check:structure` to run the actual rule tests and project scan. Report quality, TypeScript, regression tests, language, spelling and Markdown must also pass before the manifest item is marked Completed.

## Disposition

This is a file-specific fixture assessment, not a substitute for inspecting the corresponding scanner rule or generated snapshot.
