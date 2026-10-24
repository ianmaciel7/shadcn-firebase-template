# Individual re-review — `src/lib/firebase/server.ts`

## Identification

- Full subagent name: `next-code-file-src-lib-firebase-server-ts`
- Type: `CODE_FILE`
- Primary path: `src/lib/firebase/server.ts`
- Next.js documentation baseline: installed version `16.4.2`
- Inspected source: branch `fix/react-review-findings` at commit `2a1d988ce5322be0ddeb743eaeb56e86edb128c4`
- Status: Re-review draft. Do not count as completed until validation and synchronization of the current manifest.

## Scope

Review of request-scoped bearer token extraction, server-only Firebase Admin verification, and role normalization. This replaces stale observations from earlier code review reports; it does not claim runtime or build validation.

## Source evidence

- Uses the documented asynchronous `await headers()` interface and isolates the module with `import "server-only"`.
- Requires the worker bridge marker and a bearer token before attempting Firebase Admin verification.
- Uses `verifyIdToken(authIdToken, true)` for token signature and revocation/disabled-account checks.
- Failure returns a least-privilege session (`userId: null`, user role), while successful verification maps claims via `readUserRole`.
- `server.test.ts` checks missing bridge/token, successful role verification, and rejected revoked or malformed tokens.

## Findings and limitations

No proven defect in this function. The bridge marker is a routing signal rather than cryptographic proof; security depends on verified tokens and fail-closed callers such as `requireRole`. The historical report cited removed `src/lib/user/` paths and must be corrected.

## Validation follow-up

Run `server.test.ts` and verify integration through actual request headers. Audit all privileged data paths for direct verification/authorization rather than reliance on `requireProtectedAccess`.

## Conclusion

Compliant in reviewed server verification boundary; complete caller coverage remains unverified. No code change or production validation is claimed in this draft.
