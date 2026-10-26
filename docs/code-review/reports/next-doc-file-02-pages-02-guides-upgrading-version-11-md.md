# Individual source audit — `02-pages/02-guides/upgrading/version-11.mdx`

## Identity

<!-- cspell:disable -->
- Review agent identity: `next-doc-file-02-pages-02-guides-upgrading-version-11-md`
- Installed document: `node_modules/next/dist/docs/02-pages/02-guides/upgrading/version-11.md`
- Original source: [Next.js 16.4.2](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/02-pages/02-guides/upgrading/version-11.mdx)
- Title: `How to upgrade to version 11`
- Description: `Upgrade your Next.js Application from Version 10 to Version 11.`

<!-- cspell:enable -->
- Source revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Application baseline: `2a1874ae8720d904718bd1234d59bccac911fcc5`
- Completed direct documentation inspection; independent agent not run

## Evidence

The complete source has 6,561 characters and 10 fenced examples or fragments.

Source headings and keywords:

<!-- cspell:disable -->
- Terms in body: React, deprecated, cache.
- Section: Webpack 5
- Section: Cleaning the 'distDir' is now a default
- Section: 'PORT' is now supported for 'next dev' and 'next start'
- Section: 'next.config.js' customization to import images
- Section: Remove 'super.componentDidCatch()' from 'pages/_app.js'
- Section: Remove 'Container' from 'pages/_app.js'
- Section: Remove 'props.url' usage from page components
- Section: Remove 'unsized' property on 'next/image'
- Section: Remove 'modules' property on 'next/dynamic'
- Section: Remove 'Head.rewind'

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
