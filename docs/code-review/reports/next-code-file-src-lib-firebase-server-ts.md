# Individual report — `next-code-file-src-lib-firebase-server-ts`

## Identification

- Full subagent name: `next-code-file-src-lib-firebase-server-ts`
- Type: `CODE_FILE`
- Primary path: `src/lib/firebase/server.ts`
- Associated documentation: installed Next.js 16.4.2 `01-app/03-api-reference/04-functions/headers.md` and `01-app/01-getting-started/05-server-and-client-components.md`; `ARCHITECTURE.md`; [ADR 0009](../../adr/0009-integrate-firebase-authentication.md)
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: individual review of server-side Firebase ID token extraction and verification (`getFirebaseServerSession`).
- Files consulted: `src/lib/firebase/server.ts`, `src/lib/firebase/server.test.ts`, `src/lib/firebase/admin.ts`, `src/lib/user/definitions.ts`, `src/lib/user/dal.ts`, `src/app/(protected)/_lib/require-protected-access.ts`, `public/firebase-auth-sw.js`, and installed Next.js `headers()` documentation.
- Dependencies analyzed: `server-only`, `next/headers` (`headers`), `firebase-admin/auth` via `getAdminAuth`, and `@/lib/user/definitions` (`readUserRole`, `UserRole`).

## Code Review

Correct implementations:

- Guards the module with `import "server-only"` on line 1 so `firebase-admin` and request-header inspection can never be bundled into a Client Component.
- Calls `await headers()` asynchronously in accordance with the Next.js 15/16 async Dynamic APIs contract (`01-app/03-api-reference/04-functions/headers.md`).
- Verifies the bearer token with `getAdminAuth().verifyIdToken(authIdToken, true)` (`checkRevoked: true`), ensuring disabled users and revoked refresh tokens lose access immediately.
- Treats missing, malformed, or revoked tokens as an unauthenticated session (`userId: null`, least-privilege `role: "user"`) rather than throwing an unhandled server exception, and documents the distinction between the Service Worker bridge indicator (`isBridgeActive`) and the fail-closed DAL boundary (`@/lib/user/dal`).

## Findings

No proven finding in this file.

## Conclusion

- Classification: Compliant.
- Explanation: `src/lib/firebase/server.ts` correctly uses the async Next.js 16.4.2 `headers()` API, enforces `server-only` isolation, checks token revocation via `firebase-admin`, and normalizes roles safely.
