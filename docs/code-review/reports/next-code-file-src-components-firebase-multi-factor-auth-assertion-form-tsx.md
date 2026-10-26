# Individual review: `src/components/firebase/multi-factor-auth-assertion-form.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-firebase-multi-factor-auth-assertion-form-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/firebase/multi-factor-auth-assertion-form.tsx`
- Associated documentation: Installed Next.js 16.4.2 Client Components guidance, React Hooks/key conventions, and Firebase MFA contracts.
- Next.js version: `16.4.2`
- Status: Completed following tests and checks in GitHub Actions run 40132646413.

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

## Verified remediation

The React key now uses the enrollment-specific `hint.uid` instead of the factor-family identifier. The focused regression renders two phone factors with distinct IDs, checks that no duplicate-key warning occurs, and verifies that choosing the second item selects its unique enrollment. The targeted unit test, TypeScript, Biome, English, spelling, Markdown and inventory guard passed in [GitHub Actions run 40132646413](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40132646413). Browser and Firebase emulator integration coverage is still outside this item.
