# Individual report - `next-code-file-src-app-protected-profile-lib-avatar-ts`

## Identification

- Full subagent name: `next-code-file-src-app-protected-profile-lib-avatar-ts`
- Type: `CODE_FILE`
- Primary path: `src/app/(protected)/profile/_lib/avatar.ts`
- Associated documentation: installed Next.js 16.4.2 `ARCHITECTURE.md; CODING_STANDARDS.md`
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: individual review of `src/app/(protected)/profile/_lib/avatar.ts` against installed Next.js 16.4.2 documentation and repository architecture, React, hook, and security conventions.
- Files consulted: `src/app/(protected)/profile/_lib/avatar.ts`, related route/component/hook callers and unit tests, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, and installed Next.js 16.4.2 references.
- Dependencies analyzed: module imports, runtime boundary directives (`"use client"` / `"server-only"` / `"use server"`), and Next.js navigation/header APIs where applicable.

## Code Review

Correct implementations:

- Provides client-side avatar image validation (MIME type and 2 MB size limit), canvas resizing/compression to WebP/JPEG data URLs, and initial fallback formatting.
- Complies with the repository's Biome complexity, line-count, callback-depth, and hook-module-scope rules (`pnpm lint:ci`, `pnpm check:structure`, `pnpm check:routes`, and `pnpm check:components`).

## Findings

No proven finding in this file.

## Conclusion

- Classification: Compliant.
- Explanation: `src/app/(protected)/profile/_lib/avatar.ts` satisfies the installed Next.js 16.4.2 contracts and the repository's architectural, runtime-boundary, and hook-composition policies.
