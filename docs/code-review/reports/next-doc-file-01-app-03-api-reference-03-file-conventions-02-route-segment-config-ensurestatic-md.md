# Official Next.js per-file review — `01-app/03-api-reference/03-file-conventions/02-route-segment-config/ensureStatic.md`

## Evidence and identification

- Identity: `next-doc-file-01-app-03-api-reference-03-file-conventions-02-route-segment-config-ensurestatic-md`
- Versioned file: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/ensureStatic.md`
- Official content: [Next.js 16.4.2](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/ensureStatic.mdx)
- Pinned revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Template branch baseline: `3e0867d03acd30ff2c277265d88287cda0226050`
- Status: Completed direct source inspection, not independent subagent execution

## Documented API or convention

The source page title is **ensureStatic**.
The source description is: Require selected route output to remain static instead of rendering per request with the ensureStatic route segment config..
Subject reviewed: ensureStatic configuration.
The versioned source contains 13,303 characters.
Mentioned framework symbols or features: `cacheComponents`, `partialPrefetching`, `ensureStatic`, `instant`, `prefetch`, `runtime`, `generateMetadata`, `metadata`, `parallel routes`.

Explicit section headings:

<!-- cspell:disable -->
- `Reference`
- `''shell''`
- `''prefetch''`
- `''navigation''`
- `'false'`
- `How 'ensureStatic' differs from 'instant'`
- `Combining levels across layouts and pages`
- `TypeScript`
- `Version History`

<!-- cspell:enable -->

## Application-specific applicability

Verify compatibility with Cache Components and request-time rendering before adopting any static guarantee.

## Verification and findings boundary

File placement and section evidence were examined against the
installed Next.js version. This does not establish that this
application uses the convention, that caching is safe for user data,
or that production runtime and browser behavior meet the examples.
No separate subagent, build, browser run or deployed inspection
was performed for this item.

## Conclusion

The named documentation file was inspected independently of its
siblings and its project adoption status was recorded.
