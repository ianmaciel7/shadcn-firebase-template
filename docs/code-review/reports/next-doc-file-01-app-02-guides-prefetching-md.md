# Individual installed Next.js documentation review — `prefetching.md`

## Identification

- Reviewer identity: `next-doc-file-01-app-02-guides-prefetching-md`
- Item type: `DOC_FILE`
- Installed path: `node_modules/next/dist/docs/01-app/02-guides/prefetching.md`
- Upstream source: [Next.js 16.4.2 documentation](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/02-guides/prefetching.mdx)
- Source revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Application baseline: `b60862b945a5608bc9f24ee49ff4de904288eeaf`
- Status: Completed direct content and applicability inspection; CI pending

## Observed documented scope

The official version-matched guide addresses **next.js link automatic and manual prefetch**.

- Explains automatic Link prefetch scheduling and client cache use.
- Distinguishes static versus dynamic content and partial prefetch behavior.
- Warns against triggering side effects during prefetch render.

## Project-specific applicability

`next.config.ts` enables partial prefetch; route links and Firebase state updates must remain free of render-time side effects.

## Risks and verification boundary

Link render behavior alone cannot establish that a protected route is authorized.
No independent reviewer subagent was launched, and no browser,
build, emulator or runtime test was performed for this specific
documentation item. The named file received its own source review;
other documentation paths remain separate Pending items.

## Disposition

Relevant and optional patterns have been distinguished based on the
actual current repository configuration and the pinned Next.js text.
