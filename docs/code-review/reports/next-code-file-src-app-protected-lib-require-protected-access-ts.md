# Individual report - `next-code-file-src-app-protected-lib-require-protected-access-ts`

## Identification

- Full subagent name: `next-code-file-src-app-protected-lib-require-protected-access-ts`
- Type: `CODE_FILE`
- Primary path: `src/app/(protected)/_lib/require-protected-access.ts`
- Associated documentation: installed Next.js 16.4.2 `01-app/03-api-reference/04-functions/redirect.md; ARCHITECTURE.md; ADR 0009`
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: individual review of `src/app/(protected)/_lib/require-protected-access.ts` against installed Next.js 16.4.2 documentation and repository architecture, React, hook, and security conventions.
- Files consulted: `src/app/(protected)/_lib/require-protected-access.ts`, related route/component/hook callers and unit tests, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, and installed Next.js 16.4.2 references.
- Dependencies analyzed: module imports, runtime boundary directives (`"use client"` / `"server-only"`), and Next.js navigation/header APIs where applicable.

## Code Review

Correct implementations:

- Enforces `import "server-only"`, inspects `await getFirebaseServerSession()`, and calls `redirectToSignIn()` when `session.isBridgeActive && !session.userId`, allowing first-load requests without an active Service Worker to fall back to `ProtectedGuardClient`.
- Complies with the repository's Biome complexity, line-count, callback-depth, and hook-module-scope rules (`pnpm lint:ci`, `pnpm check:structure`, `pnpm check:routes`, and `pnpm check:components`).

## Findings

No proven finding in this file.

## Conclusion

- Classification: Compliant.
- Explanation: `src/app/(protected)/_lib/require-protected-access.ts` satisfies the installed Next.js 16.4.2 contracts and the repository's architectural, runtime-boundary, and hook-composition policies.
