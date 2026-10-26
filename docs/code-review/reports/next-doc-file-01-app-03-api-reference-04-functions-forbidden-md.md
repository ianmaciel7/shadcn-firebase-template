# Installed Next.js function review — `forbidden.md`

## Source identification

<!-- cspell:disable -->
- Assigned review identity: `next-doc-file-01-app-03-api-reference-04-functions-forbidden-md`
- Installed path: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/forbidden.md`
- Immutable official documentation: [Next.js 16.4.2](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/04-functions/forbidden.mdx)

<!-- cspell:enable -->
- Framework revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Application source checkpoint: `8163a8f16ba3bf3900bc0ef1014fecce0e14bc22`
- Review state: Completed direct documentation inspection; no independent subagent

## Source facts

The page identifies the **forbidden** API.
The source contains 8,972 characters.
Content classification: Forbidden response function.
Versioned terms seen: `async`, `Suspense`, `error`, `forbidden`.

Section headings read:

<!-- cspell:disable -->
- `Good to know`
- `Examples`
- `Calling 'forbidden()' after streaming has started`
- `Role-based route protection`
- `Mutations with Server Actions`
- `Version History`

<!-- cspell:enable -->

## Application applicability

Displaying a forbidden page is distinct from performing server role checks and applying Firebase resource rules.

## Assessment and verification limitations

The API's documented behavior and local applicability were compared
without assuming framework examples are implemented. Security and
cache implications depend on the actual request and data boundary.
No runtime request, emulator, browser test, independently launched
subagent or deployment was used for this item.

## Disposition

The primary Next.js function documentation source has an individual
report. Correctness of application code remains subject to tests.
