# Individual report - `next-code-file-src-app-protected-hooks-use-protected-guard-client-ts`

## Identification

- Full subagent name: `next-code-file-src-app-protected-hooks-use-protected-guard-client-ts`
- Type: `CODE_FILE`
- Primary path: `src/app/(protected)/_hooks/use-protected-guard-client.ts`
- Associated documentation: installed Next.js 16.4.2 `01-app/01-getting-started/04-linking-and-navigating.md; .agents/rules/react-hooks-core.md; ADR 0005; ADR 0009`
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: individual review of `src/app/(protected)/_hooks/use-protected-guard-client.ts` against installed Next.js 16.4.2 documentation and repository architecture, React, hook, and security conventions.
- Files consulted: `src/app/(protected)/_hooks/use-protected-guard-client.ts`, related route/component/hook callers and unit tests, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, and installed Next.js 16.4.2 references.
- Dependencies analyzed: module imports, runtime boundary directives (`"use client"` / `"server-only"`), and Next.js navigation/header APIs where applicable.

## Code Review

Correct implementations:

- Orchestrates protected route access in `(protected)` via `subscribeToProtectedAccess`, deriving `isLoading` from `readyPath !== pathname`, redirecting unauthenticated visitors via `router.replace(getSignInUrl(destination))`, and surfacing localized configuration or usage-logging errors.
- Complies with the repository's Biome complexity, line-count, callback-depth, and hook-module-scope rules (`pnpm lint:ci`, `pnpm check:structure`, `pnpm check:routes`, and `pnpm check:components`).

## Findings

No proven finding in this file.

## Conclusion

- Classification: Compliant.
- Explanation: `src/app/(protected)/_hooks/use-protected-guard-client.ts` satisfies the installed Next.js 16.4.2 contracts and the repository's architectural, runtime-boundary, and hook-composition policies.
