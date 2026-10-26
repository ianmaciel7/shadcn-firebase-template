# Per-item Next.js function review — `unauthorized.md`

## Source and identity

<!-- cspell:disable -->
- Unique agent identity: `next-doc-file-01-app-03-api-reference-04-functions-unauthorized-md`
- Installed path: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/unauthorized.md`
- Official source: [Next.js 16.4.2 MDX](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/04-functions/unauthorized.mdx)
- Official title: `unauthorized`

<!-- cspell:enable -->
- Framework revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Repository baseline: `146b13ec4cb93586d46bc200582f848309cc187b`
- Status: Completed direct inspection; independent subagent execution not claimed

## Inspected source contents

The subject is **unauthorized response helper**.
This reference contains 10,270 characters.

Exact source terminology and section headings:

<!-- cspell:disable -->
- Recognized framework terms: unstable_rethrow, error, NextResponse, React.
- Section: Good to know
- Section: Examples
- Section: Calling 'unauthorized()' after streaming has started
- Section: Displaying login UI to unauthenticated users
- Section: Mutations with Server Actions
- Section: Fetching data with Route Handlers
- Section: Version History

<!-- cspell:enable -->

## Project applicability

Permission checks must happen at the trusted data boundary; showing an unauthorized page is not role validation.

## Risks and scope limitations

Source presence alone does not establish local import, safe cache
configuration, correct runtime environment or successful behavior.
No independent subagent, browser, emulator or production run
was executed for this item.

## Conclusion

The official version-matched file was separately inspected and
its project-specific usage limits were recorded.
