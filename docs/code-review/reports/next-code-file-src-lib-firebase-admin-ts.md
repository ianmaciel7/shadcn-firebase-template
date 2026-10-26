# Individual report - `next-code-file-src-lib-firebase-admin-ts`

## Identification

- Full subagent name: `next-code-file-src-lib-firebase-admin-ts`
- Type: `CODE_FILE`
- Primary path: `src/lib/firebase/admin.ts`
- Associated documentation: installed Next.js 16.4.2 `01-app/01-getting-started/05-server-and-client-components.md; ARCHITECTURE.md; SECURITY.md; ADR 0009`
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: individual review of `src/lib/firebase/admin.ts` against installed Next.js 16.4.2 documentation and repository architecture, React, hook, and security conventions.
- Files consulted: `src/lib/firebase/admin.ts`, related route/component/hook callers and unit tests, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, and installed Next.js 16.4.2 references.
- Dependencies analyzed: module imports, runtime boundary directives (`"use client"` / `"server-only"`), and Next.js navigation/header APIs where applicable.

## Code Review

Correct implementations:

- Enforces `import "server-only"` on line 1, reuses an existing `firebase-admin/app` instance via `getApps()[0]` before calling `initializeApp({ credential: applicationDefault(), projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID })`, and returns `getAuth(app)` for server-side ID token verification.
- Complies with the repository's Biome complexity, line-count, callback-depth, and hook-module-scope rules (`pnpm lint:ci`, `pnpm check:structure`, `pnpm check:routes`, and `pnpm check:components`).

## Findings

No proven finding in this file.

## Conclusion

- Classification: Compliant.
- Explanation: `src/lib/firebase/admin.ts` satisfies the installed Next.js 16.4.2 contracts and the repository's architectural, runtime-boundary, and hook-composition policies.
