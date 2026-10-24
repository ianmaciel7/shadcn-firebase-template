# Individual review: `src/components/ai-elements/queue.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-queue-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/ai-elements/queue.tsx`
- Associated documentation: installed Next.js 16.4.2 Client Component guidance, applicable React/ARIA conventions, and local component ownership rules. Library-specific runtime contracts have not been independently exercised.
- Next.js version: `16.4.2`
- Status: Reviewed draft; repository tracking remains Pending until required validation.

## Scope

- Responsibility: Queue list, status indicator, attachment thumbnail, item actions and collapsible queue groups.
- Evidence basis: individual source inspected at commit `86e65b4` on `fix/react-review-findings`; this is not a production build, browser test, or Next.js documentation item review.

## Code Review

Queue items use list semantics, the section trigger composes one native button through Base UI `render`, and static attachment thumbnails are marked decorative by default.

## Findings

## AI-QUEUE-ACTION-001

- Identifier: `AI-QUEUE-ACTION-001`.
- Severity: Low.
- Category: Keyboard visibility.
- Path and line: `src/components/ai-elements/queue.tsx:105-124`.
- Evidence: `QueueItemAction` uses `opacity-0` with `group-hover:opacity-100` but has no `focus-visible` or `group-focus-within` equivalent. A keyboard user can tab to an action that remains visually hidden until hover.
- Recommended change and regression: Expose the action on focus and on non-hover pointers. Test tabbing from adjacent queue content, button visible state and keyboard activation.
- Boundary: This is a component-level visibility issue; the actual keyboard focus order was not browser-tested.

## Conclusion

- Classification: Partially compliant.
- Context and limits: The exported message/todo interfaces define a possible host data shape, not a stateful queue store.
- Remediation is not claimed; track any finding separately from the review count and validate with the installed dependency versions.
