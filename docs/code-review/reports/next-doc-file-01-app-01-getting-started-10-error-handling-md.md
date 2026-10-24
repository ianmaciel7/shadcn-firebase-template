# Individual report — `next-doc-file-01-app-01-getting-started-10-error-handling-md`

## Identification

- Full subagent name: `next-doc-file-01-app-01-getting-started-10-error-handling-md`
- Type: `DOC_FILE`
- Primary path: `node_modules/next/dist/docs/01-app/01-getting-started/10-error-handling.md`
- Associated documentation: handling of expected errors, `error.tsx`, `not-found.tsx`, and `global-error.tsx` boundaries; installed error API.
- Next.js version: `16.4.2`
- Status: Completed.

## Scope

- Responsibility: read in full and assess the exclusive applicability of the installed error handling guide.
- Files consulted: primary document; `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`; `src/app/error.tsx`; `src/app/not-found.tsx`; `.agents/rules/nextjs-route-files.md`; `CODING_STANDARDS.md`.
- Dependencies analyzed: the App Router `error.tsx` convention, the `retry`/`reset` recovery props, React Error Boundaries, and interface translation.

## Code Review

The guide distinguishes expected errors, which should be presented as an explicit state, from unexpected exceptions, which belong to Error Boundaries. This applies to the project: current persistence uses the Firebase Web SDK, with no Server Functions or Route Handlers of its own; the form flows handle expected failures locally. The `error.tsx` guide applies to the global segment boundary in `src/app/error.tsx`.

Correct implementations observed:

- `src/app/error.tsx:1` declares the boundary as a Client Component, as the guide requires.
- The error is logged in an Effect that depends on `error` (`src/app/error.tsx:16-18`), without exposing its message to the user.
- The fallback uses translated content and keeps an accessible recovery control (`src/app/error.tsx:21-28`).
- `src/app/not-found.tsx:5-17` offers a localized 404 interface of its own. The absence of `global-error.tsx` is not, by itself, a violation: the file is the documented option for replacing the UI when the root layout itself fails.
- The local rule confirms that `error.tsx` and `not-found.tsx` follow their specific contracts and are not subject to the thin-route policy intended for `page.tsx`, `layout.tsx`, and `template.tsx`.

## Findings

### NEXTERR-001

- Identifier: `NEXTERR-001`
- Severity: Low
- Category: Error recovery / Next.js compatibility
- Path and line: `src/app/error.tsx:9-12,26-27`
- Concrete evidence: the fallback presents the translated action `tryAgain`, but calls the `reset` prop. The installed reference explains that `reset()` clears the error state and re-renders the children without refetching the content; it recommends `retry()` in most cases. Next.js 16.4.2 made `retry` stable in version 16.3.0. So a transient failure that depends on a new fetch can keep failing when the user chooses "try again".
- Documentation reference: `node_modules/next/dist/docs/01-app/01-getting-started/10-error-handling.md`, section "Nested error boundaries", recommends recovery through `retry()`; `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`, sections "retry", "reset", and "Version History", distinguishes refetch from rerender and records the stability of `retry` in 16.3.0.
- Impact: the label promises a new attempt, but the operation may only re-render the tree without redoing the fetch that failed.
- Recommended fix: use the `retry` prop for this action, or change the text and document a specific reason to prefer `reset`.
- Suggested test: an integration/browser test in which a fetch fails once and passes on the next attempt; trigger the button and verify that the boundary refetches and replaces the fallback with the content.

## Conclusion

- Classification: Partially compliant.
- Explanation: the error boundaries and the 404 interface follow the relevant contracts of the installed guide; there is a localized mismatch between the "try again" label and the semantics of `reset()` in Next.js 16.4.2. The finding is low and can be resolved by using the stable `retry` prop or adjusting the intent of the action.
