# Version-matched Next.js file convention review — `error.md`

## Identity and source

- Unique review identity: `next-doc-file-01-app-03-api-reference-03-file-conventions-error-md`
- Installed source: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`
- Official Next.js 16.4.2 source: [immutable MDX](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/03-file-conventions/error.mdx)
- Application baseline: `f81db8ea5491eca44b043ee6d9d703d79c8d6a8c`
- Status: Completed direct inspection; independent subagent not executed

## Observed documented contract

- Source title: error.js.
- Reviewed subject: Client error boundary convention.
- Source body length: 11,222 characters.
- Explicitly present API terms: `Error`, `reset`, `Client Component`, `Server Component`.

Section index:

<!-- cspell:disable -->
- `Reference`
- `Props`
- `Examples`
- `Global Error`
- `Graceful error recovery with a custom error boundary`
- `Version History`

<!-- cspell:enable -->

## Application reconciliation

Existing src/app/error.tsx is a Client Component boundary. Reporting must not leak private server exceptions.

## Finding or caution

Server-side error messages are intentionally sanitized before reaching a Client boundary.

## Verification boundaries

The version-matched file and its relevant source claims were
inspected separately from sibling documentation. The source
review does not prove integration behavior, security or CI success.
No independent review agent, browser run or production request
was executed solely for this item.

## Disposition

Primary source inspected with its adoption requirements and
limitations recorded.
