# Individual report — `next-code-file-src-app-protected-components-protected-session-server-tsx`

## Identification

- Full subagent name: `next-code-file-src-app-protected-components-protected-session-server-tsx`
- Type: `CODE_FILE`
- Primary path: `src/app/(protected)/_components/protected-session-server.tsx`
- Associated documentation: installed Next.js 16.4.2 `01-app/01-getting-started/05-server-and-client-components.md` and `01-app/03-api-reference/03-file-conventions/layout.md`; `ARCHITECTURE.md`; `CODING_STANDARDS.md`; [ADR 0005](../../adr/0005-document-project-standards.md); [ADR 0009](../../adr/0009-integrate-firebase-authentication.md)
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: individual review of the server-side session verification wrapper composed by `src/app/(protected)/layout.tsx`.
- Files consulted: `src/app/(protected)/_components/protected-session-server.tsx`, `src/app/(protected)/_lib/require-protected-access.ts`, `src/app/(protected)/_components/protected-guard-client.tsx`, `src/app/(protected)/layout.tsx`, `src/lib/firebase/server.ts`, `CODING_STANDARDS.md`, and installed Next.js Server/Client composition documentation.
- Dependencies analyzed: `server-only`, React `PropsWithChildren`, `requireProtectedAccess`, and `ProtectedGuardClient`.

## Code Review

Correct implementations:

- Imports `"server-only"` on line 1 and uses the `-server.tsx` / `Server` integration suffix required for server-only components.
- Awaits `requireProtectedAccess()` on the server before returning `<ProtectedGuardClient>{children}</ProtectedGuardClient>`, ensuring that requests carrying an invalid or revoked Service Worker bearer token are redirected on the server while first-load requests without an active worker fall back cleanly to `ProtectedGuardClient`.
- Keeps `src/app/(protected)/layout.tsx` a thin synchronous route entrypoint while placing async request-header inspection inside the `Suspense` boundary provided by the root layout.

## Findings

No proven finding in this file.

## Conclusion

- Classification: Compliant.
- Explanation: `ProtectedSessionServer` properly enforces the server-only module boundary, integrates server token verification with the client fallback guard, and adheres to all repository naming and composition rules.
