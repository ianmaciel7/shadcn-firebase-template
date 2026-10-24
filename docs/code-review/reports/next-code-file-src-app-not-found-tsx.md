# Review: `src/app/not-found.tsx`

## Identification

- Full subagent name: `next-code-file-src-app-not-found-tsx`
- Type: `CODE_FILE`
- Primary path: `src/app/not-found.tsx`
- Associated documentation: installed Next.js 16.4.2 `01-app/03-api-reference/03-file-conventions/not-found.md` and `01-app/01-getting-started/10-error-handling.md`; project localization and routing conventions.
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: individually review the App Router root 404 UI, its special-file contract, React composition, accessibility, and localization.
- Files consulted: `src/app/not-found.tsx`, `src/app/layout.tsx`, `src/components/ui/extensions/intl-provider-server.tsx`, `src/i18n/request.ts`, `src/messages/en.json`, `src/messages/pt-BR.json`, `src/messages/es.json`, installed `not-found.md`, installed `10-error-handling.md`, `CODING_STANDARDS.md`, `.agents/rules/nextjs-route-files.md`, and `ARCHITECTURE.md`.
- Dependencies analyzed: Next.js `Link`, `buttonVariants`, `next-intl` `useTranslations` server export, root `IntlProviderServer`, locale message catalogs.

## Code Review

Correct implementations:

- The component is a default export with no props at lines 5-6, matching the installed `not-found.tsx` convention. It returns UI for the root not-found boundary and lets Next.js own status/noindex handling.
- It has no `use client` directive and introduces no browser APIs or event handlers (lines 1-19). `useTranslations` resolves through the installed `next-intl` React Server entry (`node_modules/next-intl/dist/esm/development/react-server/useTranslations.js`); the root layout places the locale provider under `Suspense` (`src/app/layout.tsx:31-40`).
- The translated title, explanation, and navigation label are called at lines 11, 13, and 15; those keys exist in all three catalogs (`src/messages/en.json`, `src/messages/pt-BR.json`, and `src/messages/es.json`).
- The home navigation is a semantic Next.js `Link` rendered with the repository's button style helper (`src/app/not-found.tsx:14-16`). The page uses a single `<main>`, heading, and explanatory text (lines 9-13), and a visible text label; no additional role or ARIA override is needed.
- The local route-file rule explicitly excludes `not-found.tsx` from the stricter thin-page/layout/template entrypoint policy, preserving its framework convention.
- No `global-not-found.tsx` is required. The installed reference presents it as an experimental, opt-in alternative for applications whose routing/layout structure requires bypassing the regular root layout.

Risks and scope notes:

- The component is rendered within the root document, whose `<html lang="en">` remains static while the locale provider can render Portuguese or Spanish. That is a known root-layout issue recorded in `ARCHITECTURE.md` and reviewed under the separate primary item `src/app/layout.tsx`; it is not attributed as a duplicate file finding here.
- A browser assertion for the rendered 404 locale and keyboard navigation would improve regression coverage, but this individual review did not verify an existing end-to-end 404 journey.

## Findings

No proven finding in this file.

## Conclusion

- Classification: Compliant.
- Explanation: the file follows the installed App Router not-found contract, composes a localized server-rendered 404 with the existing root provider, and uses accessible semantic navigation. The inherited static document language is tracked against the root layout separately; no independent issue in this file was established.
