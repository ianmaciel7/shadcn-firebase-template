# Individual Biome review — `next-code-file-biome-rules-dom-rules-test-ts`

## Identification

- **Agent:** `next-code-file-biome-rules-dom-rules-test-ts`
- **Primary file:** `.biome/rules/dom/rules.test.ts`
- **Type:** CODE_FILE
- **Next.js baseline:** 16.4.2
- **Source checkpoint:** `eaf6acad93f92332cfb73787f9655febae53b4b6`
- **Status:** Reviewed from source; validation pending.

## Implementation evidence

Positive cases allow document.createElement, appendChild and React JSX. Negative cases cover all six direct, window and globalThis variants of document.write and writeln.

## Finding and coverage limits

These parser fixtures test source diagnosis, not live DOM injection or every possible alias.

No additional confirmed defect was demonstrated solely by this source review. Project rules can be stricter than the framework.

## Verification

The dedicated review workflow now runs the native Biome policy fixtures as well as structural scanner fixtures, focused regressions, TypeScript, spelling and Markdown. Do not mark this file completed unless the updated workflow passes.

## Disposition

The file-specific policy or test contract has been inspected and recorded.
