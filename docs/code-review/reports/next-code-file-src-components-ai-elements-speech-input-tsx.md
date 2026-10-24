# Individual review: `src/components/ai-elements/speech-input.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-speech-input-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/ai-elements/speech-input.tsx`
- Associated documentation: installed Next.js 16.4.2 Client Component guidance, applicable React and ARIA patterns, and repository component composition rules.
- Next.js version: `16.4.2`
- Status: Reviewed draft; repository tracking remains Pending until required validation.

## Scope

- Responsibility: Web Speech API or MediaRecorder microphone input, transcription callbacks and cleanup of capture resources.
- Evidence basis: file-level source inspection at commit `86e65b4`; runtime tests, deployment reachability and the full dependency source were not established.

## Code Review

An explicit `recordingRevisionRef` prevents asynchronous transcription from continuing after cleanup; temporary microphone tracks are stopped and event listeners removed. The code checks media support before selecting a capture mode.

## Findings

### AI-SPEECH-ACCESSIBLE-001

- Severity: Low.
- Location: `src/components/ai-elements/speech-input.tsx:326-343`.
- Evidence: The default record button renders only a microphone/square icon (and possibly a spinner), without `aria-label`, visible text or an explicitly named control. Icon shape changes as recording state changes but the accessible name remains missing unless a caller adds one.
- Recommendation and test: Provide localized action/state names such as Start recording and Stop recording and expose processing state. Test role/name and state transitions.

## Conclusion

- Classification: Partially compliant.
- Boundaries: Permission failure feedback is currently delegated to callbacks and browser API behavior; no media capture was executed in this review.
- No remediation or completed production validation is claimed. Use the exact item report and regression for follow-up.
