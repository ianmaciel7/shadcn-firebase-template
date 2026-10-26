# Individual installed Next.js documentation review — `data-security.md`

## Identification

- Reviewer identity: `next-doc-file-01-app-02-guides-data-security-md`
- Type: `DOC_FILE`
- Primary installed documentation path: `node_modules/next/dist/docs/01-app/02-guides/data-security.md`
- Upstream documentation: [Next.js 16.4.2 source](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/02-guides/data-security.mdx)
- Framework source revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Application checkpoint: `1b220868d1eb53dd06bbfe797bdfa656517b513d`
- Status: Completed direct source and applicability inspection; CI pending

## Document scope and observed contracts

The Next.js source guide covers **react server component and server action security**.

- Compares external HTTP services, a server-only Data Access Layer, and component-level data access.
- Advises keeping sensitive data off Client Component props and using explicit limited return DTOs.
- Requires trusted-session authorization and input validation on server mutations, even when UI is hidden.

## Applicability to the current application

`src/lib/firebase/server.ts` imports `server-only` and verifies tokens with Firebase Admin. Session and role decisions must be enforced where privileged data is actually accessed.

## Findings, cautions and test boundaries

No evidence of a new exploitable leak follows from framework examples; inspect serialized data and actual Firebase rules separately.
No independent named subagent process was launched; this inspection used
the immutable upstream MDX content corresponding to the installed-version
documentation source. No test suite, browser or deployment was executed
solely for this item, and other documentation items remain independently
Pending until inspected.

## Disposition

Source and project applicability inspected as one primary item.
Documented examples were classified by relevance rather than assumed
to be production requirements.
