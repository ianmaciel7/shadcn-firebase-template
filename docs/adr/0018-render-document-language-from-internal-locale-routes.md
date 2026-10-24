# ADR 0018: Render document language from internal locale routes

- **Status**: Accepted
- **Date**: 2026-10-24
- **Supersedes**: ADR 0004's render-time cookie lookup and root route placement only

## Context

The application selects `en`, `pt-BR`, or `es` through the `NEXT_LOCALE` cookie
and exposes unprefixed public URLs. The previous root layout always emitted
`html lang="en"`, including when its content used another language.

With installed Next.js 16.4.2 Cache Components, awaiting a cookie above the
root Suspense boundary is not a complete fix: runtime request data cannot
produce the prerendered document shell. A client-only attribute update would
also leave server HTML and JavaScript-disabled clients with the wrong language.

The installed root-parameter reference supports a dynamic segment above the
root layout, with generated locale values. The installed Proxy reference
supports an internal rewrite and preserves RSC rewrite headers when using
`NextResponse.rewrite()`.

## Decision

Use `src/proxy.ts` to validate the locale cookie and rewrite public page URLs
internally to `src/app/[locale]/`. Generate all three supported locale values
at the root. Read `locale` through `next/root-params` in the server translation
configuration, and use that same resolved locale in the root `html lang`.

Keep Cache Components, partial prefetching, unprefixed Link/router hrefs, the
locale cookie name, catalogs, provider boundaries and Firebase authorization.
Move route-private public/protected modules under the locale root while keeping
shared `src/app/_components/` and `_hooks/` in their existing locations.

Proxy excludes framework assets, APIs and Firebase emulator endpoints. Visible
supported locale prefixes redirect to the unprefixed public URL; they are not
a second locale selection mechanism. Unknown public routes pass through the
selected locale root and its not-found presentation. Missing or unsupported
locale cookies select English. Query strings are preserved for navigation and
RSC requests. Rewrite responses vary on Cookie; shared cache deployments must
preserve that variation and the distinct internal locale destinations.

The public pathname helper strips an internal supported locale prefix if Next
exposes the rewritten pathname. Authentication continues to use the browser's
public return URL and server authorization boundaries remain independent of Proxy.

## Consequences

Document language is selected before rendering and does not depend on a
hydration effect. Locale root parameters separate the static document variants
without reading request cookies inside the root render. Public URLs remain
stable, but internal route paths and generated route types change.

Production validation must inspect raw HTML for each locale, JavaScript-enabled
navigation/back behavior, same-URL cookie changes, invalid-cookie fallback,
localized unknown routes, RSC rewrites and unaffected assets. Unit tests of the
Proxy and pathname helper establish local routing decisions, not deployed CDN
cache behavior. A deployment that ignores cookie variation must configure its
cache or bypass shared caching for these public responses.

## Installed references

- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/next-root-params.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`, including RSC requests and rewrites
