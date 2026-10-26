# Version-matched Next.js file convention review — `instrumentation-client.md`

## Identity and source

- Unique review identity: `next-doc-file-01-app-03-api-reference-03-file-conventions-instrumentation-client-md`
- Installed source: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation-client.md`
- Official Next.js 16.4.2 source: [immutable MDX](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/03-file-conventions/instrumentation-client.mdx)
- Application baseline: `f81db8ea5491eca44b043ee6d9d703d79c8d6a8c`
- Status: Completed direct inspection; independent subagent not executed

## Observed documented contract

- Source title: instrumentation-client.js.
- Reviewed subject: Client instrumentation and navigation tracking.
- Source body length: 9,821 characters.
- Explicitly present API terms: `Error`, `register`, `onRouterTransitionStart`.

Section index:

<!-- cspell:disable -->
- `Usage`
- `Router navigation tracking`
- `Performance considerations`
- `Execution timing`
- `See also`
- `Examples`
- `Error tracking`
- `Analytics tracking`
- `Performance monitoring`
- `Polyfills`
- `Version history`

<!-- cspell:enable -->

## Application reconciliation

The template does not currently establish instrumentation-client.ts. Adding one needs frontend telemetry and privacy review.

## Finding or caution

Additional transition event argument is experimental in the documented version.

## Verification boundaries

The version-matched file and its relevant source claims were
inspected separately from sibling documentation. The source
review does not prove integration behavior, security or CI success.
No independent review agent, browser run or production request
was executed solely for this item.

## Disposition

Primary source inspected with its adoption requirements and
limitations recorded.
