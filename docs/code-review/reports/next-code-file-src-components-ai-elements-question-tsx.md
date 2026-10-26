# Individual review: `src/components/ai-elements/question.tsx`

> **Completion record:** This individual source inspection is complete. The real project validation workflow passed the inventory guard, Biome, TypeScript, regression tests, English, spelling and Markdown checks in [run 40134059605](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40134059605). Findings and runtime verification requests elsewhere in this historical draft remain open unless explicitly remediated. This record supersedes the earlier Pending/draft status wording below.

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-question-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/ai-elements/question.tsx`
- Associated documentation: installed Next.js 16.4.2 Client Component guidance, applicable React/ARIA conventions, and local component ownership rules. Library-specific runtime contracts have not been independently exercised.
- Next.js version: `16.4.2`
- Status: Completed source review; remaining runtime checks are listed below.

## Scope

- Responsibility: Controlled or uncontrolled questionnaire form with single/multiple answer options, optional free-text response and submit callback.
- Evidence basis: individual source inspected at commit `86e65b4` on `fix/react-review-findings`; this is not a production build, browser test, or Next.js documentation item review.

## Code Review

Option selection constructs fresh arrays, preventing mutation of controlled values. The submit handler prevents default browser submission, ignores empty answers, and calls the supplied callback with trimmed text. Form state remains local to the question root.

## Findings

## AI-QUESTION-RADIO-001

- Identifier: `AI-QUESTION-RADIO-001`.
- Severity: Low.
- Category: Keyboard and ARIA semantics.
- Path and line: `src/components/ai-elements/question.tsx:175-231`.
- Evidence: `QuestionOptions` assigns `role="radiogroup"` for single selection, and `QuestionOption` assigns `role="radio"` to Button elements with `aria-checked`. There is no roving tab-index or arrow-key behavior in this component. Native buttons still accept Tab and click, but the exposed radio-group semantics imply conventional arrow-key handling.
- Recommended change and regression: Use semantic native radio inputs or implement the keyboard/roving-focus radio pattern. Test arrow keys, Space, focus retention, Tab and screen-reader checked state for both selection modes.
- Boundary: The missing interaction is based on code inspection; installed Button behavior was not exercised.

## Conclusion

- Classification: Partially compliant.
- Context and limits: Controlled state correctly avoids setting the internal value when `value` is supplied; an async submit can be invoked again until the caller externally disables the form.
- Remediation is not claimed; track any finding separately from the review count and validate with the installed dependency versions.
