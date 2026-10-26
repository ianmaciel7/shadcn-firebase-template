# Individual installed Next.js documentation review — `internationalization.md`

## Identification

- Reviewer identity: `next-doc-file-01-app-02-guides-internationalization-md`
- Type: `DOC_FILE`
- Primary installed documentation path: `node_modules/next/dist/docs/01-app/02-guides/internationalization.md`
- Upstream documentation: [Next.js 16.4.2 source](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/02-guides/internationalization.mdx)
- Framework source revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Application checkpoint: `1b220868d1eb53dd06bbfe797bdfa656517b513d`
- Status: Completed direct source and applicability inspection; CI pending

## Document scope and observed contracts

The Next.js source guide covers **localized content and locale-aware routing**.
- Defines locale negotiation and translated content.
- Examples demonstrate locale-prefixed or locale-specific route selection and dictionary loading.
- Dynamic language selection interacts with rendering and metadata ownership.

## Applicability to the current application

This project intentionally uses cookie-only locale selection in `src/i18n/request.ts` under ADR 0004, not a `[lang]` route. The root layout still declares `lang="en"`, a known accessibility mismatch.

## Findings, cautions and test boundaries

The guide's routing examples are not compulsory. Fixing HTML lang must respect the accepted cookie-only rendering/streaming decision.
No independent named subagent process was launched; this inspection used
the immutable upstream MDX content corresponding to the installed-version
documentation source. No test suite, browser or deployment was executed
solely for this item, and other documentation items remain independently
Pending until inspected.

## Disposition

Source and project applicability inspected as one primary item.
Documented examples were classified by relevance rather than assumed
to be production requirements.
