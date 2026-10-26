# Individual official documentation review — `01-app/02-guides/self-hosting.md`

## Identity and source

- Assigned review identity: `next-doc-file-01-app-02-guides-self-hosting-md`
- Source path: `node_modules/next/dist/docs/01-app/02-guides/self-hosting.md`
- Official Next.js 16.4.2 source: [versioned MDX](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/02-guides/self-hosting.mdx)
- Source revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Application baseline: `3fedd7612ec03c0d16dc2272543ff890afcc18f0`
- Status: Completed direct content-level audit, without an independent subagent

## Observed content

- Official page title: How to self-host your Next.js application.
- Stated purpose: Learn how to self-host your Next.js application on a Node.js server, Docker image, or static HTML files (static exports)..
- Primary subject: Production server deployment contract.
- Source footprint: 20,705 characters; 9 fenced examples or fragments.
- Relevant terms actually present in the source: `Cache Components`, `Suspense`, `redirect`, `Proxy`, `static export`, `CSS`, `HTML`.

Documented section index:

<!-- cspell:disable -->
- Reverse Proxy
- Image Optimization
- Proxy
- Environment Variables
- Caching and ISR
- Automatic Caching
- Static Assets
- Configuring Caching
- Build Cache
- Multi-Server Deployments
- Server Functions encryption key
- Deployment identifier

<!-- cspell:enable -->

## Current application reconciliation

Do not assume a custom Cloud Run deployment is already operational. Platform cache, asset and version skew tests remain independent.

## Verification boundaries

The source includes caution or contextual advice at the following locations:

<!-- cspell:disable -->
- > **Good to know:**
- > **Good to know:**

<!-- cspell:enable -->

Only this named upstream content item was inspected, using its pinned
versioned body. No independent subagent, browser execution, test
run, or deployment verification was performed by this report.

## Conclusion

The page was checked individually for documented scope, relevant
topics and current template applicability. Unadopted examples
are not treated as implemented features.
