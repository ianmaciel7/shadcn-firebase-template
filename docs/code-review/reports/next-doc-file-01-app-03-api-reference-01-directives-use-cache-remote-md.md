# Installed Next.js documentation inspection — `01-app/03-api-reference/01-directives/use-cache-remote.md`

## Item identity

- Assigned identity: `next-doc-file-01-app-03-api-reference-01-directives-use-cache-remote-md`
- Installed file: `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache-remote.md`
- Versioned official reference: [Next.js 16.4.2 MDX](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/01-directives/use-cache-remote.mdx)
- Source revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Project revision: `8fcb3e40351ca17abc1e14c0e964ac07da84e427`
- Status: Completed direct source inspection; independent subagent not run

## Observed documentation

The page is named **'use cache: remote'**. Its description is: 'Learn how to use the "use cache: remote" directive for persistent, shared caching using remote cache handlers.'.
The inspected body has 23,584 characters and 11 fenced examples or fragments.
Recognized topics and API terms: `use cache`, `use cache: remote`, `cacheComponents`, `Suspense`, `prefetch`, `form`.

Source section titles:

<!-- cspell:disable -->
- `Usage`
- `When to avoid remote caching`
- `When remote caching makes sense`
- `How 'use cache: remote' differs from 'use cache' and 'use cache: private'`
- `Persistence across deploys`
- `Caching with runtime data`
- `Cache key considerations`
- `Nesting rules`
- `Examples`
- `With user preferences`
- `Reducing database load`
- `API responses in streaming contexts`

<!-- cspell:enable -->

## Project applicability

- Subject: Remote cache directive.
- Implementation boundary: The app enables Cache Components but no remote cache backing store is confirmed. A remote directive is not authorization.
- A documented API is not evidence that it is enabled or imported in this project.

## Verification limits

This file's content, documented sections, and applicability were
inspected separately. The source reference does not establish
runtime behavior, security properties, browser success or deployed
feature support in the template.
No independent subagent process or application test ran for this item.

## Disposition

One primary version-matched documentation file recorded as
directly inspected, with adoption decisions left to application needs.
