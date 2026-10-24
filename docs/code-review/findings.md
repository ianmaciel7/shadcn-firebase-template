# Findings

This is a provisional consolidation of the completed individual reports. No code changes have been made.

## Medium

### NXLAYOUT-001 — Root document language does not follow the selected locale

- Location: `src/app/layout.tsx:43`.
- Evidence: the root element uses `lang="en"`, while `IntlProviderServer` and `src/i18n/request.ts` resolve locale from request configuration/cookie. Portuguese and Spanish pages therefore still declare English to assistive technology and language-aware tools.
- Reference: installed layout convention in `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md` (Root Layout); architecture decision and streaming constraint in `ARCHITECTURE.md:115-123`.
- Impact: screen readers may apply English pronunciation rules to localized content; document language metadata is inaccurate.
- Recommendation: when the locale rendering strategy is designed, set the document language to the effective locale without moving a request-time cookie read above the current streaming boundary. Add browser checks for `en`, `pt-BR`, and `es`.
- Status: known architectural debt; the individual review marks the file partially conformant. Do not interpret this finding as authorization for an unreviewed rendering redesign.

No high or critical findings have been reported among the completed items. This does not imply that unreviewed areas are clean.

## Low

### NEXTERR-001 — “Try again” uses `reset()` instead of the documented retry operation

- Location: `src/app/error.tsx:9-12,26-27`.
- Evidence: the localized control says “try again” but calls `reset()`. The installed Next.js 16.4.2 docs distinguish `reset()` (rerender the boundary children) from `retry()` (retry the failed content/read) and recommend `retry()` for most cases.
- Reference: `node_modules/next/dist/docs/01-app/01-getting-started/10-error-handling.md` (Nested error boundaries) and `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md` (retry/reset/version history).
- Impact: a transient failed read may not be repeated when the user asks to try again.
- Recommendation: use `retry` for the control, or change its text and document the reason for a rerender-only reset.
- Test: browser/integration case where a read fails once, then succeeds after invoking the recovery control.

### DOCSTART-001 — Getting Started index has an empty “Next Steps” section

- Location: `node_modules/next/dist/docs/01-app/01-getting-started/index.md:21`.
- Evidence: line 21 is the `## Next Steps` heading, with no following content. The folder contains 18 guides, but the index provides no follow-on links or action under that heading.
- Impact: readers reach an incomplete transition at the end of the index.
- Recommendation: add relevant links to subsequent guidance or remove the empty heading in the upstream source; do not patch vendored `node_modules` as a project fix.
- Test: documentation lint or a simple structural check that headings expected to contain content are followed by text or links.

### DOCUPGRADE-001 — Upgrade guide index ends with an incomplete introduction

- Location: `node_modules/next/dist/docs/01-app/02-guides/upgrading/index.md:7`.
- Evidence: the sentence ends with a colon but provides no links or content, although the folder contains version-specific guides, codemods, and agent-upgrade guidance.
- Impact: the index does not direct readers to the available upgrade references.
- Recommendation: link the available child guides in the upstream documentation or complete/remove the unfinished sentence. Do not modify the installed dependency as a project fix.
- Test: documentation structure check confirming that the index links to its available guide files.

### THEME-001 — Theme provider replaces `console.error` globally

- Location: `src/components/ui/extensions/theme-provider-client.tsx:8-16`.
- Evidence: module initialization replaces the global `console.error` function in development and suppresses any message containing the substring `Encountered a script tag`; it neither checks the source nor restores the original function.
- Impact: unrelated development errors with the same text can be hidden for the lifetime of the page, affecting other components and tooling.
- Recommendation: remove the global monkey patch or scope narrowly to the specific warning source and lifecycle; avoid mutating shared console state at module load.
- Test: verify unrelated console errors remain visible and that any narrowly scoped suppression is restored after use.
- Deduplication: the two folder reports for `src/components/ui/` and `src/components/ui/extensions/` point to the same file and issue; this is one finding, independently confirmed by the file report.

### INTLPROVIDER-001 — Caller props can override request-resolved locale/messages

- Location: `src/components/ui/extensions/intl-provider-server.tsx:9,14`.
- Evidence: the wrapper resolves locale and messages from the request, then spreads caller props afterward, allowing those values to be replaced. The current root-layout call only supplies `children`.
- Impact: a future caller can accidentally render a locale/messages pair inconsistent with the request, producing incorrect translations or cache/render mismatches.
- Recommendation: omit locale/messages from the accepted props or spread caller props before explicitly setting request-derived values.
- Test: a type-level or component test should show callers cannot override request-owned locale/messages and the provider renders the resolved request values.

### AGENT-001 — Lazy tool schema can pass `undefined` into CodeBlock

- Location: `src/components/ai-elements/agent.tsx:92-110`.
- Evidence: a supported lazy `inputSchema` is a function; `JSON.stringify()` returns `undefined` for a function, then the value is passed into `CodeBlock`. Its content renderer calls string methods such as `.slice()` and `.split()`, which can throw when the tool accordion expands.
- Impact: expanding a tool with a lazy schema can crash that UI subtree.
- Recommendation: use the AI SDK's supported schema conversion and supply a text fallback whenever a serializable schema cannot be produced.
- Test: render and expand `AgentTool` with a lazy schema, verifying it displays converted output or a fallback without throwing.

### COMPONENTS-OWNERSHIP-001 — Component ownership terminology conflicts across project docs

- Location: `.agents/rules/components-contracts.md:14-18`; compare `docs/adr/0008-install-firebase-ui-registry.md:477-485` and `ARCHITECTURE.md:133-138`.
- Evidence: the component contract groups `ui/`, `firebase/`, and `ai-elements/` as “vendor-owned,” while current architecture and ADR guidance describes copied source as locally maintained and adaptable. Folder reviews found the conflict relevant for both Firebase and AI Elements.
- Impact: contributors may apply different expectations to modification, naming, and maintenance of these components.
- Recommendation: reconcile the current rule wording with the accepted ADR amendment and architecture guide; preserve the ADR's historical sections and change only current guidance.
- Test: documentation consistency check or a targeted review confirming the three current sources use the same ownership term.
- Deduplication: consolidates `COMPONENTS-OWNERSHIP-001`, `FIREBASE-FOLDER-001`, and `AIELEMENTS-FOLDER-001` from the parent and child folder reports into one policy finding.
