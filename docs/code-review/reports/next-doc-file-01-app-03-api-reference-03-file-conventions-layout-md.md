# Individual review — `next-doc-file-01-app-03-api-reference-03-file-conventions-layout-md`

## Identification

- Full subagent name: `next-doc-file-01-app-03-api-reference-03-file-conventions-layout-md`
- Type: `DOC_FILE`
- Primary path: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md`
- Associated documentation: App Router `layout.tsx` convention, `children`/`params` props, the `LayoutProps` helper, root layouts, metadata, request APIs, navigation, data, and `Suspense` with Cache Components.
- Next.js version: `16.4.2` (installed)
- Status: Completed

## Scope

- Responsibility: read this installed document in full and compare the applicable layout contracts with the project's implementations.
- Files consulted: primary document; `src/app/layout.tsx`; `src/app/(public)/layout.tsx`; `src/app/(protected)/layout.tsx`; `src/components/ui/extensions/intl-provider-server.tsx`; `src/i18n/request.ts`; `.agents/rules/nextjs-route-files.md`; `CODING_STANDARDS.md`; `ARCHITECTURE.md`.
- Dependencies analyzed: Next.js 16.4.2 App Router, `LayoutProps`, `Metadata`/`Viewport`, `next-intl`, asynchronous cookie APIs, React `Suspense`, and Cache Components.

## Code Review

### Compatible implementations

- The document requires the root layout to declare `<html>` and `<body>` (lines 112–141). `src/app/layout.tsx:40-71` defines both and forwards `children`; the public and protected group layouts receive and forward `children` (`src/app/(public)/layout.tsx:3-11`, `src/app/(protected)/layout.tsx:3-5`).
- The root layout uses the generated helper `LayoutProps<"/">` (`src/app/layout.tsx:40`), offered by the guide on lines 91–110. It does not read `params`, so the requirement to await asynchronous `params` (lines 60–89) is not triggered on this route.
- The guide forbids manually creating `<head>`, `<title>`, or `<meta>` in the root layout and directs to the Metadata API (lines 140–141). The project exports typed `generateMetadata` and `viewport` in `src/app/layout.tsx:22-38`, with no manual `<head>`.
- Request reads need a streaming boundary when Cache Components is enabled (lines 316–328). The `cookies()` read happens indirectly in the `next-intl` configuration (`src/i18n/request.ts:6-12`), under `IntlProviderServer` (`src/components/ui/extensions/intl-provider-server.tsx:6-16`), which is composed inside `Suspense` in the root layout (`src/app/layout.tsx:48-69`). The read was not moved before that boundary.
- The guide explains that layouts should not depend on `searchParams` or pathname because they can be reused; navigation hooks belong in Client Components (lines 178–182 and 238–246 in the document). The layout implementations examined do not read these values directly; the client gate encapsulates navigation.
- There is no dynamic layout with `params`, nor use of data that the layout tries to pass as arbitrary props to child segments; those examples in the guide require no changes in this project.

## Findings

### DOCLAYOUT-001

- Identifier: `DOCLAYOUT-001`
- Severity: Medium
- Category: Accessibility / internationalization
- Path and line: `src/app/layout.tsx:43`
- Concrete evidence: the root layout declares `lang="en"`, while `IntlProviderServer` resolves the request locale in `src/components/ui/extensions/intl-provider-server.tsx:10-11` and `src/i18n/request.ts:7-12` selects the language via cookie/configuration. For content in Portuguese or Spanish, the language declared on the `<html>` element remains English. The architecture itself records this mismatch in `ARCHITECTURE.md:114-123` and documents that the solution must preserve streaming.
- Documentation reference: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md:112-141` defines the root layout as the owner of `<html>` and shows the language on the root element; the section on root-segment internationalization is on lines 142–147. The page does not mandate reading a cookie in every layout and must be applied together with the project's existing locale model.
- Impact: assistive technologies and tools that use the language attribute may treat localized text as English.
- Recommended fix: keep it as known architectural debt until the locale strategy at the root preserves the `Suspense` boundary; then emit the `lang` of the effective locale and validate the supported languages in the browser. Do not place the dynamic cookie read above the current boundary without evaluating the prerendering impact.
- Suggested test: a browser test that selects `en`, `pt-BR`, and `es`, validates the localized text, and checks `document.documentElement.lang` in the initial response.

## Conclusion

- Classification: Partially compliant.
- Explanation: the composition, root layout, Metadata API, and streaming contracts examined are compatible with the installed document. The only proven mismatch is the static language of the root element in light of cookie-based internationalization, already recorded by the project's architecture. The recommendations for dynamic layouts, `params`, query/pathname, and page data are conditional and do not apply to the implementations examined.
