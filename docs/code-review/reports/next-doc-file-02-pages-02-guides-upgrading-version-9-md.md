# Individual source audit — `02-pages/02-guides/upgrading/version-9.mdx`

## Identity

<!-- cspell:disable -->
- Review agent identity: `next-doc-file-02-pages-02-guides-upgrading-version-9-md`
- Installed document: `node_modules/next/dist/docs/02-pages/02-guides/upgrading/version-9.md`
- Original source: [Next.js 16.4.2](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/02-pages/02-guides/upgrading/version-9.mdx)
- Title: `How to upgrade to version 9`
- Description: `Upgrade your Next.js Application from Version 8 to Version 9.`

<!-- cspell:enable -->
- Source revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Application baseline: `2a1874ae8720d904718bd1234d59bccac911fcc5`
- Completed direct documentation inspection; independent agent not run

## Evidence

The complete source has 6,124 characters and 14 fenced examples or fragments.

Source headings and keywords:

<!-- cspell:disable -->
- Terms in body: React, deprecated.
- Section: Check your Custom App File ('pages/_app.js')
- Section: Breaking Changes
- Section: '@zeit/next-typescript' is no longer necessary
- Section: The 'config' key is now an export on a page
- Section: 'next/dynamic' no longer renders "loading..." by default while loading
- Section: 'withAmp' has been removed in favor of an exported configuration object
- Section: 'next export' no longer exports pages as 'index.html'
- Section: 'pages/api/' is treated differently
- Section: Deprecated Features
- Section: 'next/dynamic' has deprecated loading multiple modules at once

<!-- cspell:enable -->

## Application applicability

This guide targets Pages Router; the application uses App Router, so the API is relevant only to compatibility or migration review.
Security and data boundaries remain governed by Firebase and
the current App Router implementation.

## Verification limits

This is a source-level review, not verification of runtime
compatibility, deployment, browser tests or separately executed
review agents.

## Disposition

Separate version-matched file report completed.
