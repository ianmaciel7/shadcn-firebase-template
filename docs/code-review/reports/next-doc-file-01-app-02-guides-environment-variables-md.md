# Individual installed Next.js documentation review — `environment-variables.md`

## Identification

- Reviewer identity: `next-doc-file-01-app-02-guides-environment-variables-md`
- Type: `DOC_FILE`
- Primary installed documentation path: `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`
- Upstream documentation: [Next.js 16.4.2 source](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/02-guides/environment-variables.mdx)
- Framework source revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Application checkpoint: `1b220868d1eb53dd06bbfe797bdfa656517b513d`
- Status: Completed direct source and applicability inspection; CI pending

## Document scope and observed contracts

The Next.js source guide covers **environment variables and browser bundling**.
- Documents Next.js environment load order and referencing variables in Node and browser contexts.
- `NEXT_PUBLIC_` variables are statically bundled for browser use; private service keys must not use this prefix.
- Discusses runtime values, testing and when `@next/env` is useful outside framework execution.

## Applicability to the current application

`src/lib/firebase/config.ts` reads browser `NEXT_PUBLIC_FIREBASE_*` settings; that public web configuration is not an Admin SDK service-account secret.

## Findings, cautions and test boundaries

A public Firebase API key alone does not provide authorization; rules and privileged credentials remain independent security concerns.
No independent named subagent process was launched; this inspection used
the immutable upstream MDX content corresponding to the installed-version
documentation source. No test suite, browser or deployment was executed
solely for this item, and other documentation items remain independently
Pending until inspected.

## Disposition

Source and project applicability inspected as one primary item.
Documented examples were classified by relevance rather than assumed
to be production requirements.
