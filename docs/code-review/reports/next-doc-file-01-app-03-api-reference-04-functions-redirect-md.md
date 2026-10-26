# Individual Next.js function review — `redirect.md`

## Identity and pinned source

<!-- cspell:disable -->
- Review identity: `next-doc-file-01-app-03-api-reference-04-functions-redirect-md`
- Primary installed file: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/redirect.md`
- Official file: [version-matched source](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/04-functions/redirect.mdx)
- Official heading: `redirect`

<!-- cspell:enable -->
- Source revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Template revision: `d7446565f590ec8f67aa3974aadcd16a1073a0d6`
- Status: Completed direct source inspection; independent subagent not run

## Documented contracts and evidence

The primary topic is **server redirect function**.
The full file contains 8,252 characters and 10 fenced examples or fragments.

Versioned API names and section index:

<!-- cspell:disable -->
- Source API vocabulary: NextResponse, redirect, permanentRedirect, notFound, server action, Client Component, Server Component, navigation.
- Section: Reference
- Section: Parameters
- Section: Returns
- Section: Behavior
- Section: Example
- Section: Server Component
- Section: Client Component
- Section: FAQ
- Section: Why does 'redirect' use 307 and 308?
- Section: Version History

<!-- cspell:enable -->

## Project applicability

The project builds sign-in return destinations in src/lib/navigation.ts; validate redirect targets at security boundaries.

## Risk or follow-up boundary

Documentation examples were not assumed to be active project
configuration. An integration claim requires the actual imported
module, correct runtime context and observable behavior.
No browser, emulator, production or separate subagent execution
was performed for this specific source review.

## Disposition

The named version-matched file was inspected and an individual
project relevance assessment was recorded.
