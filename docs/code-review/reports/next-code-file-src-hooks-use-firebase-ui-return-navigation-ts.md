# Individual report - `next-code-file-src-hooks-use-firebase-ui-return-navigation-ts`

## Identification

- Full subagent name: `next-code-file-src-hooks-use-firebase-ui-return-navigation-ts`
- Type: `CODE_FILE`
- Primary path: `src/hooks/use-firebase-ui-return-navigation.ts`
- Associated documentation: installed Next.js 16.4.2 `01-app/01-getting-started/04-linking-and-navigating.md; .agents/rules/react-hooks-core.md; ADR 0009`
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: individual review of `src/hooks/use-firebase-ui-return-navigation.ts` against installed Next.js 16.4.2 documentation and repository architecture, React, hook, and security conventions.
- Files consulted: `src/hooks/use-firebase-ui-return-navigation.ts`, related route/component/hook callers and unit tests, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, and installed Next.js 16.4.2 references.
- Dependencies analyzed: module imports, runtime boundary directives (`"use client"` / `"server-only"`), and Next.js navigation/header APIs where applicable.

## Code Review

Correct implementations:

- Subscribes to the client auth session via `subscribeToSession`, guards late callbacks with an `active` cleanup flag, validates the `?next=` return parameter through `getSafeReturnUrl`, and redirects authenticated users with `router.replace(destination)`.
- Complies with the repository's Biome complexity, line-count, callback-depth, and hook-module-scope rules (`pnpm lint:ci`, `pnpm check:structure`, `pnpm check:routes`, and `pnpm check:components`).

## Findings

No proven finding in this file.

## Conclusion

- Classification: Compliant.
- Explanation: `src/hooks/use-firebase-ui-return-navigation.ts` satisfies the installed Next.js 16.4.2 contracts and the repository's architectural, runtime-boundary, and hook-composition policies.
