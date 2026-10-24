# Individual review — `src/components/ai-elements/prompt-input.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-prompt-input-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/ai-elements/prompt-input.tsx`
- Relevant documentation: installed Next.js 16.4.2 Client Components and accessibility guidance; repository component policies.
- Source checkpoint: `2a1d988ce5322be0ddeb743eaeb56e86edb128c4`
- Status: Reviewed draft; validation and manifest update pending.

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
