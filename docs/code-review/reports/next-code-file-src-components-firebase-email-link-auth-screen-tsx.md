# Individual review: `src/components/firebase/email-link-auth-screen.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-firebase-email-link-auth-screen-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/firebase/email-link-auth-screen.tsx`
- Associated documentation: Installed Next.js 16.4.2 Client Components guidance, React form semantics, Firebase UI library, and ADR 0008.
- Next.js version: `16.4.2`
- Status: Reviewed draft; repository tracking remains Pending until required validation.

## Scope

- Responsibility: Wraps the email-link form in a card and routes authenticated users to caller callback, with MFA screen substitution.
- Files consulted: `src/components/firebase/email-link-auth-screen.tsx`, directly related Firebase UI forms/screens, repository architecture and the previously reviewed Firebase folder contract where applicable.
- Verification boundary: source inspection at commit `86e65b4`; no local dependency-backed TypeScript, browser, emulator, or full Next.js build tests executed for this draft.

## Code Review

The form receives remaining props, while children provide optional secondary actions.

## Findings

Finding `FIREBASE-REDIRECT-001`: RedirectError appears only inside the `children` branch, hiding redirect errors when no children were passed. The same pattern appears in PhoneAuthScreen.

### FIREBASE-REDIRECT-001

- Severity: Low.
- Category: Error visibility.
- Location: `src/components/firebase/email-link-auth-screen.tsx:35-42`.
- Evidence: RedirectError is nested under the truthiness of children and is omitted when there are no children.
- Recommendation: Render RedirectError independent of optional children and exercise both screen states.

## Regression scope

Redirect rejection with and without children; MFA resolver switching and authenticated callback.

## Conclusion

- Classification: Partially compliant.
- Explanation: The item's responsibility and boundary were inspected individually. Findings and remaining runtime checks are explicitly distinguished. A clean source inspection is not proof of full component or integration behavior.
