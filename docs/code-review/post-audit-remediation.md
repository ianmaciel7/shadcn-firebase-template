# Post-audit remediation status

<!-- cspell:ignore FILETREE OPENIN NONSEEK NXLAYOUT DOCSTART DOCUPGRADE unkeyed -->

The active manifest contains **1,212 completed individual reports**.
The earlier automated candidate-finding sweep inspected 1,211 reports
(2,253,517 bytes) before the document-language component gained its
own report, and highlighted 45 candidate files. Those historical numbers
do not describe the current inventory or 45 distinct unresolved bugs.
A completed review file does not mean every potential defect was corrected.

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

The latest completed application-fix CI passed on `main` at commit
`0d6574d` ([run 40344252388](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40344252388)).
This verifies the configured build, unit, browser, emulator and security
suites, not a deployment to a production environment.

## Additional tooltip trigger audit (2026-10-26)

The Base UI tooltip uses an actionable trigger by default. Two previously
unreconciled AI Elements primitives, `MessageAction` and `PromptInputButton`,
rendered a native button inside that trigger instead of composing it through
the supported `render` prop. Both now render exactly one interactive button,
consistent with the earlier `ArtifactAction` remediation. Unit regressions
assert DOM button count, activation and disabled behavior; browser regressions
check keyboard focus ordering and a single Enter activation.

## JSX streaming review corrections (2026-10-26)

The PR reviewer identified two additional streaming parser edge cases:
dangling bare `<` or `</` delimiters, and JavaScript block comments with
apostrophes inside expressions. The repair now removes incomplete bare
delimiters and skips expression comments before interpreting quote characters.
Regression cases cover both behaviors. The reviewed source is not a complete
ECMAScript lexer, but it preserves the confirmed chunk-boundary examples.

## Request-time Firebase verification (2026-10-26)

The protected server session validates ID tokens after `await connection()`,
so Firebase Admin time-sensitive checks do not run during Cache Components
prerendering. The token remains checked with revocation enabled. A unit
regression verifies that the request-time boundary is entered only when a
worker-bridged bearer token exists. The emulator suite continues to check the
real authenticated flow.

## Completed follow-up corrections

`AI-JSX-STREAM-001` is addressed more thoroughly: streamed tag scanning
now skips comments and JSX string expressions, respects quoted attributes,
recognizes mismatched closing ancestors and removes incomplete trailing
tags. Unit regressions exercise the recorded cases. This is still a bounded
streaming repair strategy rather than a complete formal JSX parser.

## Remaining external or architecture-dependent work

- **NXLAYOUT-001 — remediated on main:** the root
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
- **Production smoke — not executed yet:** the CI workflow now accepts an
  HTTPS production URL on a manual run and validates public responses and
  server-rendered locale labels. No target URL was provided for this review,
  so this is a prepared verification, not a successful production check.
  Authenticated production flows still require separate credentials and a
  suitable test account.
- **Live external agent evaluations — not executed:** unit tests validate
  evaluator failure handling and trace scoring. Actual Codex and configured
  MCP calls require a provisioned host and credentials, with receipts
  recorded before declaring success.
- Individual reports do not establish that separate named reviewer
  agents executed. Upstream documentation edits remain outside the repo.

The source remediation PRs (#32, #33 and #34) are already merged. The
report records the current mainline state rather than an open branch.
