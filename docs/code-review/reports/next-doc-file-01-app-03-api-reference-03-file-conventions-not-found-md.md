# Version-matched Next.js file convention review — `not-found.md`

## Identity and source

- Unique review identity: `next-doc-file-01-app-03-api-reference-03-file-conventions-not-found-md`
- Installed source: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md`
- Official Next.js 16.4.2 source: [immutable MDX](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/03-file-conventions/not-found.mdx)
- Application baseline: `f81db8ea5491eca44b043ee6d9d703d79c8d6a8c`
- Status: Completed direct inspection; independent subagent not executed

## Observed documented contract

- Source title: not-found.js.
- Reviewed subject: Not-found and global-not-found behavior.
- Source body length: 8,518 characters.
- Explicitly present API terms: `Error`, `Client Component`, `Server Component`, `Suspense`, `notFound`.

Section index:

<!-- cspell:disable -->
- `'not-found.js'`
- `'global-not-found.js' (experimental)`
- `Reference`
- `Props`
- `Examples`
- `Data Fetching`
- `Metadata`
- `Version History`

<!-- cspell:enable -->

## Application reconciliation

Existing src/app/not-found.tsx provides route-level fallback; global-not-found has a separate support contract.

## Finding or caution

The global-not-found convention is experimental in this Next.js source.

## Verification boundaries

The version-matched file and its relevant source claims were
inspected separately from sibling documentation. The source
review does not prove integration behavior, security or CI success.
No independent review agent, browser run or production request
was executed solely for this item.

## Disposition

Primary source inspected with its adoption requirements and
limitations recorded.
