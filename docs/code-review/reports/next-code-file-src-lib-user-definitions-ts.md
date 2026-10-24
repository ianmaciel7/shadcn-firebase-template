# Individual report - `next-code-file-src-lib-user-definitions-ts`

## Identification

- Full subagent name: `next-code-file-src-lib-user-definitions-ts`
- Type: `CODE_FILE`
- Primary path: `src/lib/user/definitions.ts`
- Associated documentation: installed Next.js 16.4.2 `01-app/01-getting-started/06-fetching-data.md; ARCHITECTURE.md; SECURITY.md; ADR 0009`
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: individual review of `src/lib/user/definitions.ts` against installed Next.js 16.4.2 documentation and repository architecture, React, hook, and security conventions.
- Files consulted: `src/lib/user/definitions.ts`, related route/component/hook callers and unit tests, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, and installed Next.js 16.4.2 references.
- Dependencies analyzed: module imports, runtime boundary directives (`"use client"` / `"server-only"`), and Next.js navigation/header APIs where applicable.

## Code Review

Correct implementations:

- Defines the ordered `userRoles` tuple (`["user", "admin"] as const`), the `UserRole` union type, `readUserRole(claims)` (which safely falls back to least-privilege `"user"` for unknown, missing, or malformed claims), and `hasRole(actual, required)` for monotonic privilege comparison.
- Complies with the repository's Biome complexity, line-count, callback-depth, and hook-module-scope rules (`pnpm lint:ci`, `pnpm check:structure`, `pnpm check:routes`, and `pnpm check:components`).

## Findings

No proven finding in this file.

## Conclusion

- Classification: Compliant.
- Explanation: `src/lib/user/definitions.ts` satisfies the installed Next.js 16.4.2 contracts and the repository's architectural, runtime-boundary, and hook-composition policies.
