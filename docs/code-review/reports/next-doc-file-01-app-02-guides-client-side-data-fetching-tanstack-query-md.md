# Individual installed Next.js documentation review — `client-side-data-fetching/tanstack-query.md`

## Identification

- Reviewer identity: `next-doc-file-01-app-02-guides-client-side-data-fetching-tanstack-query-md`
- Type: `DOC_FILE`
- Primary installed documentation path: `node_modules/next/dist/docs/01-app/02-guides/client-side-data-fetching/tanstack-query.md`
- Upstream documentation: [Next.js 16.4.2 source](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/02-guides/client-side-data-fetching/tanstack-query.mdx)
- Framework source revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Application checkpoint: `1b220868d1eb53dd06bbfe797bdfa656517b513d`
- Status: Completed direct source and applicability inspection; CI pending

## Document scope and observed contracts

The Next.js source guide covers **client-side fetching with tanstack query**.

- Describes a QueryClientProvider and distinct per-server-render clients to prevent sharing state across requests.
- Shows browser caching, Suspense, hydration and coordination with Cache Components.
- Separates query invalidation from server cache invalidation after mutations.

## Applicability to the current application

The application does not require TanStack Query merely because its documentation is installed with Next.js. Current Firebase adapters and subscriptions remain separately owned.

## Findings, cautions and test boundaries

Do not install a client cache or provider absent a concrete API use case and explicit cross-session isolation.
No independent named subagent process was launched; this inspection used
the immutable upstream MDX content corresponding to the installed-version
documentation source. No test suite, browser or deployment was executed
solely for this item, and other documentation items remain independently
Pending until inspected.

## Disposition

Source and project applicability inspected as one primary item.
Documented examples were classified by relevance rather than assumed
to be production requirements.
