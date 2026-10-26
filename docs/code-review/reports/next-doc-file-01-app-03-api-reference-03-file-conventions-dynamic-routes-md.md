# Version-matched Next.js file convention review — `dynamic-routes.md`

## Identity and source

- Unique review identity: `next-doc-file-01-app-03-api-reference-03-file-conventions-dynamic-routes-md`
- Installed source: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`
- Official Next.js 16.4.2 source: [immutable MDX](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.mdx)
- Application baseline: `f81db8ea5491eca44b043ee6d9d703d79c8d6a8c`
- Status: Completed direct inspection; independent subagent not executed

## Observed documented contract

- Source title: Dynamic Route Segments.
- Reviewed subject: Dynamic path segment and parameter semantics.
- Source body length: 15,336 characters.
- Explicitly present API terms: `params`, `Error`, `Client Component`, `Server Component`, `Suspense`, `notFound`.

Section index:

<!-- cspell:disable -->
- `Convention`
- `In Client Components`
- `Catch-all Segments`
- `Optional Catch-all Segments`
- `TypeScript`
- `Behavior`
- `With Cache Components`
- `Examples`
- `With 'generateStaticParams'`
- `Dynamic GET Route Handlers with 'generateStaticParams'`

<!-- cspell:enable -->

## Application reconciliation

The project primarily uses fixed auth and profile routes. New slug routes should use async params and explicit validation.

## Finding or caution

Next.js 15 and later request parameter APIs differ from older synchronous examples.

## Verification boundaries

The version-matched file and its relevant source claims were
inspected separately from sibling documentation. The source
review does not prove integration behavior, security or CI success.
No independent review agent, browser run or production request
was executed solely for this item.

## Disposition

Primary source inspected with its adoption requirements and
limitations recorded.
