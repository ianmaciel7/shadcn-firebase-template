# Code review: `src/app/error.tsx`

## Identification

- Full subagent name: `next-code-file-src-app-error-tsx`
- Type: `CODE_FILE`
- Primary path: `src/app/error.tsx`
- Associated documentation: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`; `01-app/01-getting-started/10-error-handling.md`; `.agents/rules/nextjs-route-files.md`
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: individual review of the App Router error boundary, its props, logging, text, and recovery action.
- Files consulted: `src/app/error.tsx`, `src/components/ui/button.tsx`, installed documentation `error.md` and `10-error-handling.md`, `src/app/not-found.tsx`, `.agents/rules/nextjs-route-files.md`.
- Dependencies analyzed: React `useEffect`, `next-intl` `useTranslations`, the application Button, and props managed by Next.js.

## Code Review

Correct implementations:

- The file declares `"use client"`, which the special `error.tsx` component requires.
- The logging effect depends on `error`; the text shown to the user does not expose technical details of the exception.
- The message and the recovery control use translations and a semantic button.
- The error UI must not replace the root layout. The absence of `global-error.tsx` is not a failure in itself: that file covers failures in the root layout itself and has a different contract.

## Findings

### NXERRFILE-001

- Identifier: `NXERRFILE-001`
- Severity: Low
- Category: Error recovery / behavior promised by the interface
- Path and line: `src/app/error.tsx:9-12,26-27`
- Concrete evidence: the button presents `t("tryAgain")` but calls `reset()`. In the installed documentation, `retry()` refetches and re-renders the boundary's children; `reset()` only clears the error state and re-renders without refetching the content. The `reset` section recommends `retry()` in most cases. The project gives no specific reason to prefer the re-render without a new fetch.
- Documentation reference: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md:117-157` (`retry` and `reset` sections); installed version 16.4.2, with `retry` stable since 16.3.0 in the history table.
- Impact: for transient errors that depend on a new fetch, the action labeled "try again" can keep the fallback without redoing that fetch.
- Recommended fix: receive and call the `retry` prop for this action; if the desired behavior is re-rendering only, adjust the label and record why that is sufficient for this boundary.
- Suggested test: an integration/browser test in which a fetch fails once and succeeds on the next attempt; trigger the button and verify that the new fetch replaces the fallback with the content.

I found no other proven issue in this file. The type of `error` is narrower than the `unknown` used in the reference examples, but the implementation only passes it to `console.error` and does not read properties; there is no proven functional impact here.

## Conclusion

- Classification: partially compliant.
- Explanation: the Client Component boundary, the logging, and the localized presentation follow the applicable contracts. The semantics of `reset()` diverge from the behavior the "try again" label usually implies; the installed reference provides `retry()` to refetch.

## Post-checkpoint reconciliation

Remediated in `b568bb7` (and retained after `2d103cc`): `src/app/error.tsx` now invokes the installed Next.js `unstable_retry` / `retry` recovery API with unit regression coverage in `src/app/error.test.tsx`. See [remediation status](../resolutions.md).
