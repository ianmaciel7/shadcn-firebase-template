# Individual review — `src/components/ai-elements/prompt-input.tsx`

> **Completion record:** This individual source inspection is complete. The real project validation workflow passed the inventory guard, Biome, TypeScript, regression tests, English, spelling and Markdown checks in [run 40134059605](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40134059605). Findings and runtime verification requests elsewhere in this historical draft remain open unless explicitly remediated. This record supersedes the earlier Pending/draft status wording below.

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-prompt-input-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/ai-elements/prompt-input.tsx`
- Relevant documentation: installed Next.js 16.4.2 Client Components and accessibility guidance; repository component policies.
- Source checkpoint: `2a1d988ce5322be0ddeb743eaeb56e86edb128c4`
- Status: Completed source review; remaining runtime checks are listed below.

## Scope

Local and provider-based prompt drafts, file selection, input method composition, and asynchronous attachment submission. The review is limited to source code and related component contracts; no runtime execution is claimed.

## Code Review

The provider keeps text and an edit revision together; attachment object URLs are revoked on removal and unmount; asynchronous submit only clears captured items after a successful callback.

## Findings

AI-PROMPT-ACCEPT-001 (Low): `matchesAccept` at lines 589-615 compares only MIME equality and `type/*` prefixes. Standard HTML `accept` filename extensions (such as `.pdf`) will not match `f.type`, even though the native file chooser accepts them. Empty `accept` remains allowed. No browser reproduction was performed.

## Tests and recommendations

Test `.pdf`, `.txt`, exact MIME and `image/*`, mixed multi-file uploads, retry after failed submit and concurrent edits during asynchronous conversion.

## Conclusion

Classification: source-inspected with the above findings and runtime limitations. Do not mark Completed before the required repository validators run.
