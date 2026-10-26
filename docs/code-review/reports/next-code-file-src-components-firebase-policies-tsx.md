# Individual review: `src/components/firebase/policies.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-firebase-policies-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/firebase/policies.tsx`
- Associated documentation: Installed Next.js 16.4.2 Client Components guidance, React form semantics, Firebase UI library, and ADR 0008.
- Next.js version: `16.4.2`
- Status: Completed following focused unit tests and checks in GitHub Actions run 40131416018.

## Scope

- Responsibility: Renders localized terms/privacy text with link substitutions and a navigation-callback alternative using cloned anchor or button elements.
- Files consulted: `src/components/firebase/policies.tsx`, directly related Firebase UI forms/screens, repository architecture and the previously reviewed Firebase folder contract where applicable.
- Verification boundary: source inspection at commit `86e65b4`; no local dependency-backed TypeScript, browser, emulator, or full Next.js build tests executed for this draft.

## Code Review

Escapes translation text by rendering strings as React text nodes rather than injecting HTML. Uses external links with noopener/noreferrer when no navigation callback exists.

## Findings

Finding `FIREBASE-POLICIES-001`: the onNavigate case constructs a native `<button>` without `type="button"`. Because Policies renders inside sign-in, sign-up, reset, and phone forms, a terms/privacy click can submit the parent form unexpectedly.

### FIREBASE-POLICIES-001

- Severity: Low.
- Category: HTML form semantics.
- Location: `src/components/firebase/policies.tsx:19-20`.
- Evidence: The onNavigate variant uses a native button without a type attribute; the default type inside a form is submit.
- Recommendation: Set type="button" and verify a policy click never invokes a parent form submit handler.

## Regression scope

onNavigate inside a <form> must not submit; external links preserve URL/rel and keyboard activation.

## Conclusion

- Classification: Partially compliant.
- Explanation: The item's responsibility and boundary were inspected individually. Findings and remaining runtime checks are explicitly distinguished. A clean source inspection is not proof of full component or integration behavior.

## Verified remediation

The source fix was committed and its dedicated unit regression test passed. TypeScript, the inventory guard, English, spelling and scoped Markdown checks passed in [validation run 40131416018](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40131416018). This confirms the component-level regression, not a Firebase emulator end-to-end run or a full framework audit.
