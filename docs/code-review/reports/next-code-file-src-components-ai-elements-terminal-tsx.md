# Individual review: `src/components/ai-elements/terminal.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-terminal-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/ai-elements/terminal.tsx`
- Associated documentation: installed Next.js 16.4.2 Client Component guidance, applicable React and ARIA patterns, and repository component composition rules.
- Next.js version: `16.4.2`
- Status: Reviewed draft; repository tracking remains Pending until required validation.

## Scope

- Responsibility: ANSI-styled terminal output with auto-scroll, streaming indicator, copy and clear toolbar actions.
- Evidence basis: file-level source inspection at commit `86e65b4`; runtime tests, deployment reachability and the full dependency source were not established.

## Code Review

Output is rendered through `ansi-to-react` rather than injected as HTML. The content scroll follows output changes when enabled, and copy timeout cleanup is registered on unmount.

## Findings

### AI-TERMINAL-A11Y-001

- Severity: Low.
- Location: `src/components/ai-elements/terminal.tsx:145-182`.
- Evidence: `TerminalCopyButton` and `TerminalClearButton` use only `CopyIcon`/`CheckIcon` and `Trash2Icon` by default, and neither assigns an accessible label. The default `Terminal` composition renders both without caller overrides, so the action buttons are unnamed to assistive technology.
- Recommendation and test: Give each default icon action a localized accessible name; test initial and copied state and keyboard activation.

## Conclusion

- Classification: Partially compliant.
- Boundaries: The formatter is a third-party dependency; terminal command execution is not implemented by this component.
- No remediation or completed production validation is claimed. Use the exact item report and regression for follow-up.
