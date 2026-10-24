# Individual review: `src/components/firebase/country-selector.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-firebase-country-selector-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/firebase/country-selector.tsx`
- Associated documentation: Installed Next.js 16.4.2 Client Components guidance, React form semantics, Firebase UI library, and ADR 0008.
- Next.js version: `16.4.2`
- Status: Reviewed draft; repository tracking remains Pending until required validation.

## Scope

- Responsibility: Provides a controlled-looking country Select backed by internal state and an imperative ref exposing `getCountry` and `setCountry`. Uses Firebase UI country/default-country hooks.
- Files consulted: `src/components/firebase/country-selector.tsx`, directly related Firebase UI forms/screens, repository architecture and the previously reviewed Firebase folder contract where applicable.
- Verification boundary: source inspection at commit `86e65b4`; no local dependency-backed TypeScript, browser, emulator, or full Next.js build tests executed for this draft.

## Code Review

The ref handle updates with selected country and is consumed by phone flows before formatting numbers; available country options are identified by country code.

## Findings

Finding `FIREBASE-COUNTRY-001`: the SelectTrigger has no explicit accessible name; the adjacent phone-number label targets a different control. Also note that internal selection is initialized from defaultCountry only once; changes to that hook value require a scoped behavior test, not an assumed failure.

### FIREBASE-COUNTRY-001

- Severity: Low.
- Category: Accessibility / input naming.
- Location: `src/components/firebase/country-selector.tsx:44-49`.
- Evidence: The dial-code SelectTrigger has no label or aria-label, while adjacent phone number labels point only to the telephone input.
- Recommendation: Add a localized accessible name to the country selector or associate an appropriate label, with a browser accessibility-name regression.

## Regression scope

Screen-reader accessible name for country dial-code control, keyboard selection, and provider default changes.

## Conclusion

- Classification: Partially compliant.
- Explanation: The item's responsibility and boundary were inspected individually. Findings and remaining runtime checks are explicitly distinguished. A clean source inspection is not proof of full component or integration behavior.
