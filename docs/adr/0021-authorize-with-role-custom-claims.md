# ADR 0021: Authorize with role custom claims

- **Status**: Accepted
- **Date**: 2026-10-24

## Context

Authorization was limited to document ownership (`request.auth.uid == uid`) in
Security Rules and an authenticated-only check in the `recordUsage` callable.
The server read only a `uid` from the worker-bridge token, using the Firebase
Web SDK, with no role, no revocation check and no protected data-access layer.
`SECURITY.md` stated that Firebase Admin required a separate server
authorization design.

## Decision

- A single `role` custom claim (`user` or `admin`, `src/lib/user/definitions.ts`)
  is the source of truth. Missing or unknown values resolve to `user`.
- Claims are written only by the `setUserRole` callable Cloud Function, which
  requires the caller's own `role == 'admin'` claim, merges existing claims,
  refuses self-demotion and revokes refresh tokens so the change takes effect.
- The Next.js server verifies the bridge-injected ID token with
  `firebase-admin` (`verifyIdToken(token, true)`) in `src/lib/firebase/admin.ts`
  and `server.ts`, exposing `role` next to `userId`.
- `src/lib/user/dal.ts` provides `requireRole`, the fail-closed authorization
  boundary: no server-verified session redirects to sign-in even when the
  worker bridge is absent; an insufficient role yields `notFound()`.
- Firestore rules gain an `isAdmin()` helper (admin may read `/users/{uid}`).
  Storage and `/usageLogs` rules are unchanged.
- The emulator seed assigns `admin` to `admin@example.test`.

## Consequences

Production needs Application Default Credentials for the Next.js server (the
Auth emulator needs none). Claims propagate when the client refreshes its ID
token; revocation makes that happen on the next verified request.

`requireProtectedAccess` keeps its documented first-load fallback for ordinary
protected pages. Any page or Server Function that exposes role-restricted data
must call `requireRole` itself; Proxy, route guards and hidden UI are not
authorization. No route uses `requireRole` yet because the template defines no
admin-only feature.
