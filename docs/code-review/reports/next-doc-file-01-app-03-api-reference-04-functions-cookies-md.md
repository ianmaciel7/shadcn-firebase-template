# Installed Next.js function review — `cookies.md`

## Source identification

<!-- cspell:disable -->
- Assigned review identity: `next-doc-file-01-app-03-api-reference-04-functions-cookies-md`
- Installed path: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md`
- Immutable official documentation: [Next.js 16.4.2](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/04-functions/cookies.mdx)

<!-- cspell:enable -->
- Framework revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Application source checkpoint: `8163a8f16ba3bf3900bc0ef1014fecce0e14bc22`
- Review state: Completed direct documentation inspection; no independent subagent

## Source facts

The page identifies the **cookies** API.
The source contains 12,359 characters.
Content classification: Async request cookie access.
Versioned terms seen: `async`, `cookies`, `headers`, `Suspense`, `revalidatePath`.

Section headings read:

<!-- cspell:disable -->
- `Reference`
- `Methods`
- `Options`
- `Good to know`
- `Understanding Cookie Behavior in Server Components`
- `Understanding Cookie Behavior in Server Functions`
- `Examples`
- `Getting a cookie`
- `Getting all cookies`
- `Setting a cookie`
- `Checking if a cookie exists`
- `Deleting cookies`

<!-- cspell:enable -->

## Application applicability

src/i18n/request.ts already awaits cookies(); cookie-derived locale belongs to request data and must match HTML language semantics.

## Assessment and verification limitations

The API's documented behavior and local applicability were compared
without assuming framework examples are implemented. Security and
cache implications depend on the actual request and data boundary.
No runtime request, emulator, browser test, independently launched
subagent or deployment was used for this item.

## Disposition

The primary Next.js function documentation source has an individual
report. Correctness of application code remains subject to tests.
