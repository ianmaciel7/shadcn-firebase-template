# Individual installed Next.js documentation review — `draft-mode.md`

## Identification

- Review identity: `next-doc-file-01-app-02-guides-draft-mode-md`
- Item type: `DOC_FILE`
- Primary path: `node_modules/next/dist/docs/01-app/02-guides/draft-mode.md`
- Official source: [Next.js version 16.4.2](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/02-guides/draft-mode.mdx)
- Application source checkpoint: `4c68c612b63ed4e28a1a90aa9840c0e22f9021e7`
- Status: Completed direct source inspection; CI pending

## Observed source guidance

The official guide covers **draft mode for preview content**.

- Defines request-scoped draft preview behavior via a Route Handler and CMS callback.
- Shows preview rendering and a user-visible draft indicator.

## Repository applicability

This template does not establish a headless CMS preview workflow.

## Findings and verification limits

If adopted, preview enabling endpoints require authenticated access and unguessable secrets.
No independent reviewer subagent was invoked. This source-focused
review does not replace browser, emulator, build or deployed
verification, and it does not count descendant paths as inspected.

## Disposition

One distinct documentation source was inspected at a pinned
framework revision; its relevance and limits are recorded.
