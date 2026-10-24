# Individual report - `next-code-file-src-app-protected-profile-hooks-use-profile-auth-ts`

## Identification

- Full subagent name: `next-code-file-src-app-protected-profile-hooks-use-profile-auth-ts`
- Type: `CODE_FILE`
- Primary path: `src/app/(protected)/profile/_hooks/use-profile-auth.ts`
- Associated documentation: installed Next.js 16.4.2 `01-app/01-getting-started/04-linking-and-navigating.md; .agents/rules/react-hooks-core.md; CODING_STANDARDS.md`
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: individual review of `src/app/(protected)/profile/_hooks/use-profile-auth.ts` against installed Next.js 16.4.2 documentation and repository architecture, React, hook, and security conventions.
- Files consulted: `src/app/(protected)/profile/_hooks/use-profile-auth.ts`, related route/component/hook callers and unit tests, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, and installed Next.js 16.4.2 references.
- Dependencies analyzed: module imports, runtime boundary directives (`"use client"` / `"server-only"` / `"use server"`), and Next.js navigation/header APIs where applicable.

## Code Review

Correct implementations:

- Subscribes to Firebase `onAuthStateChanged`, redirects unauthenticated sessions to `/sign-in?returnUrl=/profile`, and exposes user and loading state.
- Complies with the repository's Biome complexity, line-count, callback-depth, and hook-module-scope rules (`pnpm lint:ci`, `pnpm check:structure`, `pnpm check:routes`, and `pnpm check:components`).

## Findings

No proven finding in this file.

## Conclusion

- Classification: Compliant.
- Explanation: `src/app/(protected)/profile/_hooks/use-profile-auth.ts` satisfies the installed Next.js 16.4.2 contracts and the repository's architectural, runtime-boundary, and hook-composition policies.
