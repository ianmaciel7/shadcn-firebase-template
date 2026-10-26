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

- **NXLAYOUT-001:** root document `html lang` remains static while the
  selected locale comes from request cookies. ADR 0004 forbids the
  locale-segment/Proxy redesign. Correct server-rendered language requires
  a separately validated solution respecting root streaming behavior and
  browser tests for all three configured locales. This is open.
- **DOCSTART-001 / DOCUPGRADE-001:** these defects belong to the installed
  Next.js upstream documentation, which must not be edited in `node_modules`.
  Local navigation mitigation is in
  [installed-next-navigation.md](installed-next-navigation.md).
- **AI-MESSAGE-BRANCH-KEY-001:** unkeyed branches have an index fallback.
  Dynamic branch reordering still requires stable caller-provided keys;
  this should be explicitly documented by consumers rather than treating
  indices as stable identities.
- Individual audit findings are not proof that separate named reviewer
  agents executed. Production deployments and external agent
  evaluations have not been claimed as successful.

Do not squash-merge this follow-up until its own PR CI is green.
