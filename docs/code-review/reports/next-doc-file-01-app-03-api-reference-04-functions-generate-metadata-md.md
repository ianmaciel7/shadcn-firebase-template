# Installed Next.js function review — `generate-metadata.md`

## Source identification

<!-- cspell:disable -->
- Assigned review identity: `next-doc-file-01-app-03-api-reference-04-functions-generate-metadata-md`
- Installed path: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`
- Immutable official documentation: [Next.js 16.4.2](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/04-functions/generate-metadata.mdx)

<!-- cspell:enable -->
- Framework revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Application source checkpoint: `8163a8f16ba3bf3900bc0ef1014fecce0e14bc22`
- Review state: Completed direct documentation inspection; no independent subagent

## Source facts

The page identifies the **generateMetadata** API.
The source contains 49,177 characters.
Content classification: Server metadata generation.
Versioned terms seen: `async`, `cookies`, `headers`, `searchParams`, `connection()`, `Metadata`, `Viewport`, `fetch(`, `generateStaticParams`, `Suspense`, `error`.

Section headings read:

<!-- cspell:disable -->
- `The 'metadata' object`
- `'generateMetadata' function`
- `Why 'generateMetadata' is Server Component only`
- `Reference`
- `Parameters`
- `Returns`
- `Metadata Fields`
- `'description'`
- `Other fields`
- `'openGraph'`
- `'robots'`
- `'icons'`

<!-- cspell:enable -->

## Application applicability

src/app/layout.tsx already exports generateMetadata with translations. The rendered locale must stay consistent with the document language.

## Assessment and verification limitations

The API's documented behavior and local applicability were compared
without assuming framework examples are implemented. Security and
cache implications depend on the actual request and data boundary.
No runtime request, emulator, browser test, independently launched
subagent or deployment was used for this item.

## Disposition

The primary Next.js function documentation source has an individual
report. Correctness of application code remains subject to tests.
