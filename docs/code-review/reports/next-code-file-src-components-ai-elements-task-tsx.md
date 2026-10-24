# Individual review — `src/components/ai-elements/task.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-task-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/ai-elements/task.tsx`
- Relevant documentation: installed Next.js 16.4.2 Client Components and accessibility guidance; repository component policies.
- Source checkpoint: `2a1d988ce5322be0ddeb743eaeb56e86edb128c4`
- Status: Reviewed draft; validation and manifest update pending.

## Scope

Task detail collapse/expand compound components. The review is limited to source code and related component contracts; no runtime execution is claimed.

## Code Review

Uses the shared Collapsible root, trigger and content wrappers without duplicating state; accepts caller props.

## Findings

No proven individual defect. Browser semantics depend on the installed Base UI primitive.

## Tests and recommendations

Test trigger focus and Enter/Space toggle with and without custom children.

## Conclusion

Classification: source-inspected with the above findings and runtime limitations. Do not mark Completed before the required repository validators run.
