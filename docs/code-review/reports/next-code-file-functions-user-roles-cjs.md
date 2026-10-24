# Individual review: `functions/user-roles.cjs`

> **Completion record:** This individual source inspection is complete. The real project validation workflow passed the inventory guard, Biome, TypeScript, regression tests, English, spelling and Markdown checks in [run 40134059605](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40134059605). Findings and runtime verification requests elsewhere in this historical draft remain open unless explicitly remediated. This record supersedes the earlier Pending/draft status wording below.

## Identification

- Full subagent name: `next-code-file-functions-user-roles-cjs`
- Type: `CODE_FILE`
- Primary path: `functions/user-roles.cjs`
- Associated documentation: `ARCHITECTURE.md` and `docs/adr/0009-integrate-firebase-authentication.md`
- Next.js version: `16.4.2`
- Status: Completed source review; remaining runtime checks are listed below.

## Scope

- Responsibility: administrator-only custom-claim mutation as a distinct inventory item.
- Files consulted: `functions/user-roles.cjs`, `functions/user-roles.test.cjs`, and Firebase Admin session revocation guidance.
- Boundaries: source and related test inspection; no local runtime, emulator, browser, or package-specific checks were executed for this draft.

## Code Review

Validates requests and requires an `admin` role in the decoded callable token, merges the requested role into current user claims, and invokes `revokeRefreshTokens` after updating claims. It does not independently revalidate the calling administrator current role or revoked session state.

## Findings

### FIREBASE-ROLE-001 — Revoked or demoted administrator token can retain privileged claims

- Identifier: `FIREBASE-ROLE-001`
- Severity: Medium
- Category: Authorization / stale ID-token claims
- Location: `functions/user-roles.cjs:19-25,43-47`; callable wiring in `functions/index.js:18-21`.
- Evidence: the authorization gate uses only `request.auth.token.role === "admin"`. After changing a target user's custom claims, it calls `auth.revokeRefreshTokens`, but revocation does not automatically invalidate the already-issued ID token without a revoked-token check. The callable's default auth verification is not evidence that revoked sessions are checked. This permits a previously authorized administrator with a cached token to perform role mutations during the remaining token lifetime after demotion.
- Impact: administrative demotion may not immediately stop privileged role changes, including an attempt to grant the caller the role again.
- Recommendation: authorize against current server-side role state or explicitly verify token revocation/freshness using Firebase Admin before allowing role mutations. Reject disabled or revoked caller sessions, and test role loss immediately after demotion.
- Suggested regression: assign `admin`, issue a token, demote the caller using another administrator, then invoke `setUserRole` with the prior token and assert `permission-denied`.
- Reference: Firebase Authentication Admin SDK session-management documentation (`https://firebase.google.com/docs/auth/admin/manage-sessions`).
- Verification boundary: source-level finding; a deployed callable or emulator reproduction was not executed.

## Conclusion

- Classification: Partially compliant.
- Reason: Finding `FIREBASE-ROLE-001`: a recently demoted administrator can retain an already-issued ID token that still contains `role=admin` until expiration and can invoke this privileged callable during that window.
- Next step: run the prescribed repository validation commands before changing this manifest row from Pending to Completed.
