# Version-matched Next.js file convention review — `instrumentation.md`

## Identity and source

- Unique review identity: `next-doc-file-01-app-03-api-reference-03-file-conventions-instrumentation-md`
- Installed source: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation.md`
- Official Next.js 16.4.2 source: [immutable MDX](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/03-file-conventions/instrumentation.mdx)
- Application baseline: `f81db8ea5491eca44b043ee6d9d703d79c8d6a8c`
- Status: Completed direct inspection; independent subagent not executed

## Observed documented contract

- Source title: instrumentation.js.
- Reviewed subject: Server instrumentation contract.
- Source body length: 5,116 characters.
- Explicitly present API terms: `Error`, `Server Component`, `onRequestError`, `register`.

Section index:

<!-- cspell:disable -->
- `Exports`
- `'register' (optional)`
- `'onRequestError' (optional)`
- `Specifying the runtime`
- `Version History`

<!-- cspell:enable -->

## Application reconciliation

The app implements src/instrumentation.ts onRequestError with structured error metadata.

## Finding or caution

Server error callbacks are not equivalent to complete browser analytics.

## Verification boundaries

The version-matched file and its relevant source claims were
inspected separately from sibling documentation. The source
review does not prove integration behavior, security or CI success.
No independent review agent, browser run or production request
was executed solely for this item.

## Disposition

Primary source inspected with its adoption requirements and
limitations recorded.
