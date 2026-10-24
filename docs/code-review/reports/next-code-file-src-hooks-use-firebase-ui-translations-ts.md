# Individual report - `next-code-file-src-hooks-use-firebase-ui-translations-ts`

## Identification

- Full subagent name: `next-code-file-src-hooks-use-firebase-ui-translations-ts`
- Type: `CODE_FILE`
- Primary path: `src/hooks/use-firebase-ui-translations.ts`
- Associated documentation: installed Next.js 16.4.2 `01-app/01-getting-started/05-server-and-client-components.md; .agents/rules/react-hooks-core.md; ADR 0004`
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: individual review of `src/hooks/use-firebase-ui-translations.ts` against installed Next.js 16.4.2 documentation and repository architecture, React, hook, and security conventions.
- Files consulted: `src/hooks/use-firebase-ui-translations.ts`, related route/component/hook callers and unit tests, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, and installed Next.js 16.4.2 references.
- Dependencies analyzed: module imports, runtime boundary directives (`"use client"` / `"server-only"`), and Next.js navigation/header APIs where applicable.

## Code Review

Correct implementations:

- Synchronizes the active `next-intl` locale with the FirebaseUI instance via `ui.get().setLocale(parseLocale(locale))` in a dedicated Effect without resubscribing the authentication listener.
- Complies with the repository's Biome complexity, line-count, callback-depth, and hook-module-scope rules (`pnpm lint:ci`, `pnpm check:structure`, `pnpm check:routes`, and `pnpm check:components`).

## Findings

No proven finding in this file.

## Conclusion

- Classification: Compliant.
- Explanation: `src/hooks/use-firebase-ui-translations.ts` satisfies the installed Next.js 16.4.2 contracts and the repository's architectural, runtime-boundary, and hook-composition policies.
