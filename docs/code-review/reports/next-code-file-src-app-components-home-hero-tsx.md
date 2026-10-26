# Individual report - `next-code-file-src-app-components-home-hero-tsx`

## Identification

- Full subagent name: `next-code-file-src-app-components-home-hero-tsx`
- Type: `CODE_FILE`
- Primary path: `src/app/_components/home-hero.tsx`
- Associated documentation: installed Next.js 16.4.2 `.agents/rules/components-contracts.md; DESIGN.md; CODING_STANDARDS.md`
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: individual review of `src/app/_components/home-hero.tsx` against installed Next.js 16.4.2 documentation and repository architecture, React, hook, and security conventions.
- Files consulted: `src/app/_components/home-hero.tsx`, related route/component/hook callers and unit tests, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, and installed Next.js 16.4.2 references.
- Dependencies analyzed: module imports, runtime boundary directives (`"use client"` / `"server-only"` / `"use server"`), and Next.js navigation/header APIs where applicable.

## Code Review

Correct implementations:

- Renders the home page `Card` hero presenting authenticated or guest status and navigation actions (`/profile`, `/sign-in`, `/register`, and `<HomeSignOutButtonClient />`).
- Complies with the repository's Biome complexity, line-count, callback-depth, and hook-module-scope rules (`pnpm lint:ci`, `pnpm check:structure`, `pnpm check:routes`, and `pnpm check:components`).

## Findings

No proven finding in this file.

## Conclusion

- Classification: Compliant.
- Explanation: `src/app/_components/home-hero.tsx` satisfies the installed Next.js 16.4.2 contracts and the repository's architectural, runtime-boundary, and hook-composition policies.
