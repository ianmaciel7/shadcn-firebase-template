# Review: `src/app/layout.tsx`

## Identification

- Full subagent name: `next-code-file-src-app-layout-tsx`
- Type: `CODE_FILE`
- Primary path: `src/app/layout.tsx`
- Associated documentation: Next.js 16.4.2, `01-app/03-api-reference/03-file-conventions/layout.md`, `01-app/01-getting-started/05-server-and-client-components.md`, `01-app/01-getting-started/14-metadata-and-og-images.md`; React server/client and project architecture rules.
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: individual review of the root layout, its metadata/viewport exports, rendering, and provider composition.
- Files consulted: `src/app/layout.tsx`, `src/components/ui/extensions/intl-provider-server.tsx`, `src/i18n/request.ts`, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, `.agents/rules/nextjs-maintenance.md`, `.agents/rules/react-dom-server.md`, `.agents/rules/react-quality.md`, `.agents/rules/react-hooks-core.md`.
- Dependencies analyzed: `next/font/google`, `next-intl/server`, React `Suspense`, the client theme provider, the server locale provider, the tooltip provider, and the toaster.

## Code Review

Correct implementations:

- The root layout keeps the Server Component shape, declares `<html>` and `<body>`, and uses the global `LayoutProps<"/">` type, per the installed Next.js contract.
- `generateMetadata` and `viewport` are appropriate server-side exports; the code does not add `<head>` tags manually.
- The asynchronous internationalization provider is inside `Suspense`, and the theme/client providers are composed below the server/client boundary.
- Fonts are configured with `next/font/google`, and the shared providers live in the root layout.

## Findings

### NXLAYOUT-001

- Identifier: `NXLAYOUT-001`
- Severity: Medium
- Category: Accessibility / internationalization
- Path and line: `src/app/layout.tsx:43`
- Concrete evidence: the HTML document declares `lang="en"`, while `IntlProviderServer` resolves the locale from the request/cookie configuration in `src/components/ui/extensions/intl-provider-server.tsx:7-8` and `src/i18n/request.ts:5-16`. So when the interface is in Portuguese or Spanish, the language declared to the browser and to assistive technologies remains English.
- Documentation reference: the installed official documentation requires the root layout and shows the language on the `<html>` element (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md`, "Root Layout" section). The project architecture explicitly records this mismatch and notes that reading a dynamic cookie above `Suspense` boundaries can block prerendering (`ARCHITECTURE.md:115-123`).
- Impact: screen readers and language tools may pronounce localized content with English rules; indexers also receive an inaccurate document language.
- Recommended fix: keep the current behavior per the recorded architectural decision, but treat it as known debt. When defining the locale strategy at the root, emit a `lang` attribute that matches the effective locale without moving a dynamic cookie read outside the streaming boundary; add accessibility coverage for `en`, `pt-BR`, and `es` before changing the implementation.
- Suggested test: a browser test that selects each locale through the supported mechanism, confirms the localized text, and verifies the matching `document.documentElement.lang` attribute, including the initial render.

## Conclusion

- Classification: Partially compliant.
- Explanation: the layout follows the Next.js 16.4.2 contracts and respects the documented Server/Client composition and streaming model. There is a known mismatch between the content locale and `html lang`; the architecture itself records the impact and states that a fix depends on a rendering strategy and accessibility tests. No other proven issue was identified in this file.
