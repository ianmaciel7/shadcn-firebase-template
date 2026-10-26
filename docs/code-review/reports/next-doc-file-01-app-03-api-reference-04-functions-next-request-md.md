# Individual Next.js function review — `next-request.md`

## Identity and pinned source

<!-- cspell:disable -->
- Review identity: `next-doc-file-01-app-03-api-reference-04-functions-next-request-md`
- Primary installed file: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/next-request.md`
- Official file: [version-matched source](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/04-functions/next-request.mdx)
- Official heading: `NextRequest`

<!-- cspell:enable -->
- Source revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Template revision: `d7446565f590ec8f67aa3974aadcd16a1073a0d6`
- Status: Completed direct source inspection; independent subagent not run

## Documented contracts and evidence

The primary topic is **nextrequest object**.
The full file contains 6,210 characters and 7 fenced examples or fragments.

Versioned API names and section index:

<!-- cspell:disable -->
- Source API vocabulary: NextRequest, headers, cookies.
- Section: 'cookies'
- Section: 'set(name, value)'
- Section: 'get(name)'
- Section: 'getAll()'
- Section: 'delete(name)'
- Section: 'has(name)'
- Section: 'clear()'
- Section: 'nextUrl'
- Section: Version History

<!-- cspell:enable -->

## Project applicability

Headers, cookies and URL data from a request must be validated when used for privileged actions.

## Risk or follow-up boundary

Documentation examples were not assumed to be active project
configuration. An integration claim requires the actual imported
module, correct runtime context and observable behavior.
No browser, emulator, production or separate subagent execution
was performed for this specific source review.

## Disposition

The named version-matched file was inspected and an individual
project relevance assessment was recorded.
