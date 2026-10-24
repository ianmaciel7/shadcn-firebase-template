# Individual test review — `src/components/ai-elements/prompt-input.test.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-prompt-input-test-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/ai-elements/prompt-input.test.tsx`
- Associated documentation: installed Next.js 16.4.2 testing and Client Components guidance; project Vitest and browser-testing conventions.
- Source checkpoint: `2a1d988ce5322be0ddeb743eaeb56e86edb128c4`
- Status: Reviewed draft; mandatory validation and manifest reconciliation pending.

## Scope

Prompt draft retention and attachment cleanup across asynchronous submissions. This is a source audit of the test, not a test execution.

## Evidence

Includes provider and uncontrolled editors, intervening edits, successful submit clearing and attachment/source ownership.

## Findings and limitations

The suite does not test HTML file `accept` extension matching. Add a focused regression for `.pdf` and mixed extension/MIME filters identified in the PromptInput source review. No new blocking source-level defect is proven by this individual inspection.

## Validation follow-up

Run Vitest and add a file picker regression demonstrating expected extension matching.

## Conclusion

The test has a focused, identifiable responsibility. Runtime validity, observed pass count and integration coverage are unverified until project test tooling executes it.
