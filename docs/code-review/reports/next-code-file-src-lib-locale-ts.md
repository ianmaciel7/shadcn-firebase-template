# Individual report - `next-code-file-src-lib-locale-ts`

## Identification

- Full subagent name: `next-code-file-src-lib-locale-ts`
- Type: `CODE_FILE`
- Primary path: `src/lib/locale.ts`
- Associated documentation: installed Next.js 16.4.2 `01-app/03-api-reference/01-directives/use-server.md; 01-app/03-api-reference/04-functions/cookies.md; docs/adr/0004-configure-internationalization.md`
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: individual review of `src/lib/locale.ts` against installed Next.js 16.4.2 documentation and repository architecture, React, hook, and security conventions.
- Files consulted: `src/lib/locale.ts`, related route/component/hook callers and unit tests, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, and installed Next.js 16.4.2 references.
- Dependencies analyzed: module imports, runtime boundary directives (`"use client"` / `"server-only"` / `"use server"`), and Next.js navigation/header APIs where applicable.

## Code Review

Correct implementations:

- Declares `'use server'` and implements `setLocaleCookie` with `hasLocale` validation and secure cookie attributes (`httpOnly: false`, `sameSite: 'lax'`, `secure` in production).
- Complies with the repository's Biome complexity, line-count, callback-depth, and hook-module-scope rules (`pnpm lint:ci`, `pnpm check:structure`, `pnpm check:routes`, and `pnpm check:components`).

## Findings

No proven finding in this file.

## Conclusion

- Classification: Compliant.
- Explanation: `src/lib/locale.ts` satisfies the installed Next.js 16.4.2 contracts and the repository's architectural, runtime-boundary, and hook-composition policies.
