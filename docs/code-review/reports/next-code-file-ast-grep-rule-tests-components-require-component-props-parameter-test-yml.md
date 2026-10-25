# Individual structural fixture review — `next-code-file-ast-grep-rule-tests-components-require-component-props-parameter-test-yml`

## Identification

- **Agent identity:** `next-code-file-ast-grep-rule-tests-components-require-component-props-parameter-test-yml`
- **Primary file:** `.ast-grep/rule-tests/components/require-component-props-parameter-test.yml`
- **Type:** CODE_FILE
- **Source checkpoint:** `3f153caa103076b086888a3106a7de9bf8ab9d63`
- **Framework:** Next.js 16.4.2
- **Review status:** Source inspected; CI pending.

## Evidence from fixture assertions

Positive functions declare props or children parameters and noncomponent helpers lack a required prop parameter. Three negative named component functions include both asynchronous and ordinary declarations with empty parameter lists.

## Boundaries

A parameter's existence is syntactic; the valid cases do not prove component props actually reach the DOM.

The fixture records expected valid and invalid samples for one rule and should be paired with its version-matched scanner. Existence of a fixture does not alone prove that the scanner passes.

## Verification

The review workflow executes `pnpm check:structure` to run the actual rule tests and project scan. Report quality, TypeScript, regression tests, language, spelling and Markdown must also pass before the manifest item is marked Completed.

## Disposition

This is a file-specific fixture assessment, not a substitute for inspecting the corresponding scanner rule or generated snapshot.
