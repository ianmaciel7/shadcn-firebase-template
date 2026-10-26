# Post-audit remediation status

<!-- cspell:ignore FILETREE OPENIN NONSEEK NXLAYOUT DOCSTART DOCUPGRADE unkeyed -->

The Review Validation workflow inspected the **1,211 individual reports**
(2,253,517 bytes). The candidate-finding sweep highlighted 45 report files,
including duplicates, historical findings and source-specific observations.
A completed review file does not mean every defect was corrected.

## Implementation reconciliation

The code changes merged from PR #32 cover the following newly recorded findings:

- Firebase authorization and Service Worker navigation:
  `FIREBASE-ROLE-001` and `FIREBASE-SW-001`.
- AI Elements accessibility and interaction:
  `AI-CONVERSATION-A11Y-001`, `AI-FILETREE-KEYBOARD-001`,
  `AI-IMAGE-ALT-001`, `AI-MESSAGE-BRANCH-KEY-001`,
  `AI-MIC-MEDIA-001`, `AI-OPENIN-TRIGGER-001`,
  `AI-PERSONA-THEME-001`, `AI-PROMPT-ACCEPT-001`,
  `AI-QUESTION-RADIO-001`, `AI-QUEUE-ACTION-001`,
  `AI-SPEECH-ACCESSIBLE-001`, `AI-STACK-COPY-001`,
  `AI-TERMINAL-A11Y-001`, `AI-TEST-PROGRESS-001`,
  `AI-TOOL-INPUT-001`, and `AI-TRANSCRIPTION-NONSEEK-001`.
- Clipboard and authentication feedback:
  `AI-ENV-COPY-001`, `FIREBASE-COUNTRY-001`,
  `FIREBASE-REDIRECT-001`, and `FIREBASE-OAUTH-001`.
- Component integrity:
  `UI-CHART-CSS-001` and `UI-FIELD-MEMO-001`.
- Review evaluation reliability:
  `EVAL-RUNNER-CLI-001` and `EVAL-RUNNER-TRACE-001`.
- Installed local skill guidance:
  `FIREBASE-SKILL-LINK-001`.

The original historical finding resolutions are preserved in
[resolutions.md](resolutions.md), including CodeBlock, theme-provider,
tooltip, attachment, audio-player, error retry and context-cost fixes.

The full CI matrix passed for the merged head `09d7cd7` at
[run 40334286929](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40334286929).
This verifies the configured build, unit, browser, emulator and security suites,
not every possible production usage.

## Follow-up corrections in this branch

`AI-JSX-STREAM-001` is addressed more thoroughly: streamed tag scanning
now skips comments and JSX string expressions, respects quoted attributes,
recognizes mismatched closing ancestors and removes incomplete trailing
tags. Unit regressions exercise the recorded cases. This is still a bounded
streaming repair strategy rather than a complete formal JSX parser.

## Remaining external or architecture-dependent work

- **NXLAYOUT-001 — remediated in this branch:** the root
  `IntlDocumentServer` resolves the cookie locale behind an outer Suspense
  boundary with an empty fallback. The original server HTML and browser
  document language are checked for English, Portuguese and Spanish. ADR 0004
  continues to forbid locale route segments and Proxy.
- **DOCSTART-001 / DOCUPGRADE-001 — locally mitigated:** the installed
  Next.js indexes are upstream editorial issues, not application defects.
  [Installed documentation navigation](installed-next-navigation.md) provides
  every immediate guide link, and the inventory guard checks that the links
  remain complete when the installed version changes. An upstream editorial
  correction would still require a contribution to Next.js.
- **AI-MESSAGE-BRANCH-KEY-001 — remediated for keyed children:**
  MessageBranch now reconciles child identities even when counts do not
  change, preserving the selected key across reorders and clearing removed
  selections. Unkeyed dynamic children still need caller-provided stable React
  keys; positional fallback only represents a static list. Regression tests
  verify keyed reorder and same-count replacement.
- Individual audit findings are not proof that separate named reviewer
  agents executed. Production deployments and external agent
  evaluations have not been claimed as successful.

Do not squash-merge this follow-up until its own PR CI is green.
