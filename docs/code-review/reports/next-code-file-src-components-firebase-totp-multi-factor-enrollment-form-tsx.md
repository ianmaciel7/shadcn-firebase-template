# Individual review: `src/components/firebase/totp-multi-factor-enrollment-form.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-firebase-totp-multi-factor-enrollment-form-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/firebase/totp-multi-factor-enrollment-form.tsx`
- Associated documentation: Installed Next.js 16.4.2 Client Components guidance, React form semantics, Firebase UI library, and ADR 0008.
- Next.js version: `16.4.2`
- Status: Completed following focused unit tests and checks in GitHub Actions run 40131416018.

## Scope

- Responsibility: Generates an enrollment secret, displays QR and manual secret, and submits a TOTP assertion for the selected user.
- Files consulted: `src/components/firebase/totp-multi-factor-enrollment-form.tsx`, directly related Firebase UI forms/screens, repository architecture and the previously reviewed Firebase folder contract where applicable.
- Verification boundary: source inspection at commit `86e65b4`; no local dependency-backed TypeScript, browser, emulator, or full Next.js build tests executed for this draft.

## Code Review

The generated secret and requested factor display name persist only in the enrollment stage; QR code uses that label.

## Findings

Finding `FIREBASE-TOTP-NAME-001`: line 100 passes `values.verificationCode` as the third argument of `enrollWithMultiFactorAssertion(ui, assertion, ...)`, rather than `props.displayName`. The SMS enrollment form passes the requested displayName in the same API position. The factor may be enrolled with its six-digit OTP as its display name.

### FIREBASE-TOTP-NAME-001

- Severity: Low.
- Category: Data integrity / MFA labeling.
- Location: `src/components/firebase/totp-multi-factor-enrollment-form.tsx:100`.
- Evidence: The verification code is passed as the MFA enrollment display name, unlike the collected props.displayName and the SMS flow.
- Recommendation: Use props.displayName and verify factor profile persistence with a distinct label.

## Regression scope

Create a TOTP factor with a distinct display name, verify stored enrollment displayName is preserved, and confirm the code is never used as factor label.

## Conclusion

- Classification: Partially compliant.
- Explanation: The item's responsibility and boundary were inspected individually. Findings and remaining runtime checks are explicitly distinguished. A clean source inspection is not proof of full component or integration behavior.

## Verified remediation

The source fix was committed and its dedicated unit regression test passed. TypeScript, the inventory guard, English, spelling and scoped Markdown checks passed in [validation run 40131416018](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40131416018). This confirms the component-level regression, not a Firebase emulator end-to-end run or a full framework audit.
