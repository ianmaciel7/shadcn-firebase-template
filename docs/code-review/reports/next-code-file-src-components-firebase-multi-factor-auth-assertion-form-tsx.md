# Individual review: `src/components/firebase/multi-factor-auth-assertion-form.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-firebase-multi-factor-auth-assertion-form-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/firebase/multi-factor-auth-assertion-form.tsx`
- Associated documentation: Installed Next.js 16.4.2 Client Components guidance, React Hooks/key conventions, and Firebase MFA contracts.
- Next.js version: `16.4.2`
- Status: Reviewed draft; repository tracking remains Pending until required validation.

## Scope

- Responsibility: Chooses SMS or TOTP assertion workflow from resolver hints, with automatic selection for one available hint and an explicit choice otherwise.
- Files consulted: `src/components/firebase/multi-factor-auth-assertion-form.tsx`, directly related Firebase UI forms/screens, repository architecture and the previously reviewed Firebase folder contract where applicable.
- Verification boundary: source inspection at commit `86e65b4`; no local dependency-backed TypeScript, browser, emulator, or full Next.js build tests executed for this draft.

## Code Review

The cleanup hook is called before the resolver guard; the selected factor is stored as MultiFactorInfo rather than an unnecessary family of booleans.

## Findings

Finding `FIREBASE-MFA-KEYS-001`: the chooser uses the shared `factorId` as a React list key for every hint, so two SMS factors or two TOTP factors get duplicate keys. Reconciliation and focus behavior are then unstable.

### FIREBASE-MFA-KEYS-001

- Severity: Low.
- Category: React reconciliation.
- Location: `src/components/firebase/multi-factor-auth-assertion-form.tsx:53,57`.
- Evidence: `hint.factorId` is reused as the key for multiple hints of the same factor family, producing duplicate React list keys.
- Recommendation: Use a stable per-enrollment identity (such as hint.uid where available); test multiple hints per factor type.

## Regression scope

Two enrolled phone factors, two TOTP factors, switching the selected hint, and removal of a resolver.

## Conclusion

- Classification: Partially compliant.
- Explanation: The item's responsibility and boundary were inspected individually. Findings and remaining runtime checks are explicitly distinguished. A clean source inspection is not proof of full component or integration behavior.
