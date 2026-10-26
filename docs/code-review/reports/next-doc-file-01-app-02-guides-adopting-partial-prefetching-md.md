# Individual installed Next.js documentation review — `adopting-partial-prefetching.md`

## Identification

- Reviewer identity: `next-doc-file-01-app-02-guides-adopting-partial-prefetching-md`
- Item type: `DOC_FILE`
- Installed path: `node_modules/next/dist/docs/01-app/02-guides/adopting-partial-prefetching.md`
- Upstream source: [Next.js 16.4.2 documentation](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/02-guides/adopting-partial-prefetching.mdx)
- Source revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Application baseline: `b60862b945a5608bc9f24ee49ff4de904288eeaf`
- Status: Completed direct content and applicability inspection; CI pending

## Observed documented scope

The official version-matched guide addresses **partial prefetching adoption**.

- Explains App Shell prefetch behavior and how URL-specific and request-only content alter navigation.
- Documents `cacheComponents` with `partialPrefetching`, plus migration from full prefetch behavior.
- Calls for testing static, session and URL data separately rather than assuming a prefetched route is fully available.

## Project-specific applicability

Both `cacheComponents` and `partialPrefetching` are enabled in `next.config.ts`. Cross-check protected route shells and signed-in states under these policies.

## Risks and verification boundary

No navigation latency or protected prefetch interaction was measured in a browser.
No independent reviewer subagent was launched, and no browser,
build, emulator or runtime test was performed for this specific
documentation item. The named file received its own source review;
other documentation paths remain separate Pending items.

## Disposition

Relevant and optional patterns have been distinguished based on the
actual current repository configuration and the pinned Next.js text.
