# Official Next.js per-file review — `01-app/03-api-reference/03-file-conventions/02-route-segment-config/prefetch.md`

## Evidence and identification

- Identity: `next-doc-file-01-app-03-api-reference-03-file-conventions-02-route-segment-config-prefetch-md`
- Versioned file: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/prefetch.md`
- Official content: [Next.js 16.4.2](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/prefetch.mdx)
- Pinned revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Template branch baseline: `3e0867d03acd30ff2c277265d88287cda0226050`
- Status: Completed direct source inspection, not independent subagent execution

## Documented API or convention

The source page title is **prefetch**.
The source description is: Configure how a route segment is prefetched during client navigation..
Subject reviewed: Route segment prefetch option.
The versioned source contains 5,010 characters.
Mentioned framework symbols or features: `cacheComponents`, `partialPrefetching`, `instant`, `prefetch`, `runtime`, `metadata`.

Explicit section headings:

<!-- cspell:disable -->
- `Options`
- `''partial''`
- `''force-disabled''`
- `Relationship with the '<Link prefetch>' prop`
- `TypeScript`
- `Version History`

<!-- cspell:enable -->

## Application-specific applicability

The project enables partial prefetching. Route-level prefetch behavior needs browser and authenticated session tests.

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
