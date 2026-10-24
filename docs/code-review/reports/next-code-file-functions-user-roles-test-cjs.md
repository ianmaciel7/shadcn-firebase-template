# Individual review: `functions/user-roles.test.cjs`

## Identification

- Full subagent name: `next-code-file-functions-user-roles-test-cjs`
- Type: `CODE_FILE`
- Primary path: `functions/user-roles.test.cjs`
- Associated documentation: `ARCHITECTURE.md` and `docs/adr/0009-integrate-firebase-authentication.md`
- Next.js version: `16.4.2`
- Status: Reviewed draft; repository tracking remains Pending until required validation.

## Scope

- Responsibility: role-handler unit contract as a distinct inventory item.
- Files consulted: `functions/user-roles.test.cjs` and `functions/user-roles.cjs`.
- Boundaries: source and related test inspection; no local runtime, emulator, browser, or package-specific checks were executed for this draft.

## Code Review

Covers unauthenticated requests, unauthorized roles, invalid payloads, prevention of self-demotion, preservation of existing custom claims, and revocation invocation. The test harness supplies decoded token claims directly.

## Findings

No independently proven issue in this primary item during the scoped source inspection.

Do not count the missing regression as a separate finding; it supports `FIREBASE-ROLE-001`.

## Conclusion

- Classification: Partially compliant.
- Reason: Coverage gap linked to `FIREBASE-ROLE-001`: no test simulates an administrator demoted in Auth whose cached token still asserts the previous role.
- Next step: run the prescribed repository validation commands before changing this manifest row from Pending to Completed.
