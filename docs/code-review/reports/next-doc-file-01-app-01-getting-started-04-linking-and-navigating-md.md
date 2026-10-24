# Review: Linking and Navigating

## Identification

- Full subagent name: `next-doc-file-01-app-01-getting-started-04-linking-and-navigating-md`
- Type: `DOC_FILE`
- Primary path: `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`
- Associated documentation: `next/link`, `loading.tsx`, prefetching, streaming, App Router navigation hooks
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: full reading of this installed page, assessment of its applicability to the project, and comparison of the pertinent guidance with the current navigation.
- Files consulted: this page; `src/app/_components/home-section-client.tsx`; `src/app/not-found.tsx`; `src/app/(protected)/profile/_components/profile-back-to-home-button.tsx`; `src/app/(protected)/_hooks/use-protected-gate-client.ts`; `src/app/(public)/_hooks/use-auth-navigation.ts`; `src/app/_hooks/use-auth-provider-client.ts`; `src/app/(protected)/profile/_hooks/use-profile-submit.ts`; the `loading.tsx` files of `src/app/`, `src/app/(public)/`, and `src/app/(protected)/`; `CODING_STANDARDS.md`; `docs/agents/nextjs.md`.
- Dependencies analyzed: use of `next/link`, `next/navigation`, the `next-intl` navigation wrapper, and router refresh behavior. The project uses the App Router, Cache Components, and Partial Prefetching per its architecture record.

## Code Review

- Correct implementations: declarative internal navigation uses `next/link` for home, profile, authentication, and the not-found page. Programmatic navigation uses `next/navigation` or the `@/i18n/navigation` wrapper; `router.refresh()` is used after updating the locale cookie, to request a new render that observes the cookie. There are `loading.tsx` boundaries at the root and in the public and protected groups, covering the loading of the respective trees.
- Issues found: no proven deviation from the applicable guidance on this page.
- Risks: the page documents optimization options (`useLinkStatus`, prefetch control, and the History API) as contextual tools, not requirements. There is no evidence in this review that the application needs those options; browser navigation tests were also not run.
- Recommendations: preserve the distinction between `router.refresh()` and server cache invalidation. If routes or link lists grow, measure prefetch and navigation feedback before adopting the page's options. Do not copy the `replaceState` example for locale switching without adapting it to the local cookie and internationalization model.

## Findings

No proven finding.

## Conclusion

**Compliant.** The navigation patterns used in the project match the installed guidance: `Link` for internal links, the App Router's router for programmatic navigation, and loading boundaries present in the relevant segments. Optional features cited in the document are not gaps in themselves. The analysis was static; the visual response and prefetch behavior on a slow network remain unverified in a browser.
