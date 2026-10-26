# Version-matched Next.js file convention review — `loading.md`

## Identity and source

- Unique review identity: `next-doc-file-01-app-03-api-reference-03-file-conventions-loading-md`
- Installed source: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/loading.md`
- Official Next.js 16.4.2 source: [immutable MDX](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/03-file-conventions/loading.mdx)
- Application baseline: `f81db8ea5491eca44b043ee6d9d703d79c8d6a8c`
- Status: Completed direct inspection; independent subagent not executed

## Observed documented contract

- Source title: loading.js.
- Reviewed subject: Route loading file and Suspense nesting.
- Source body length: 9,802 characters.
- Explicitly present API terms: `Error`, `Client Component`, `Server Component`, `Suspense`, `notFound`, `forbidden`.

Section index:

<!-- cspell:disable -->
- `Reference`
- `Parameters`
- `Behavior`
- `Navigation`
- `Instant Loading States`
- `SEO`
- `Status codes`
- `Browser limits`
- `Platform Support`
- `Examples`
- `Streaming with Suspense`
- `Version History`

<!-- cspell:enable -->

## Application reconciliation

The project has loading.tsx boundaries, but Cache Components request-time work still needs well-scoped Suspense.

## Finding or caution

Loading UI should not be confused with data authorization.

## Verification boundaries

The version-matched file and its relevant source claims were
inspected separately from sibling documentation. The source
review does not prove integration behavior, security or CI success.
No independent review agent, browser run or production request
was executed solely for this item.

## Disposition

Primary source inspected with its adoption requirements and
limitations recorded.
