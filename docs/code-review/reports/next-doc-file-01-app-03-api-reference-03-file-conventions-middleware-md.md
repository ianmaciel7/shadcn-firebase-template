# Version-matched Next.js file convention review — `middleware.md`

## Identity and source

- Unique review identity: `next-doc-file-01-app-03-api-reference-03-file-conventions-middleware-md`
- Installed source: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/middleware.md`
- Official Next.js 16.4.2 source: [immutable MDX](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/03-file-conventions/middleware.mdx)
- Application baseline: `f81db8ea5491eca44b043ee6d9d703d79c8d6a8c`
- Status: Completed direct inspection; independent subagent not executed

## Observed documented contract

- Source title: middleware.js.
- Reviewed subject: Deprecated middleware file convention.
- Source body length: 812 characters.
- Explicitly present API terms: `proxy.js`, `middleware.js`.

Section index:

<!-- cspell:disable -->
- No section headings; metadata-only convention description.

<!-- cspell:enable -->

## Application reconciliation

Do not introduce middleware.ts for modern App Router behavior; use version-matched proxy.ts if proxying is intentionally needed.

## Finding or caution

The source explicitly states middleware.js is deprecated in Next.js 16.

## Verification boundaries

The version-matched file and its relevant source claims were
inspected separately from sibling documentation. The source
review does not prove integration behavior, security or CI success.
No independent review agent, browser run or production request
was executed solely for this item.

## Disposition

Primary source inspected with its adoption requirements and
limitations recorded.
