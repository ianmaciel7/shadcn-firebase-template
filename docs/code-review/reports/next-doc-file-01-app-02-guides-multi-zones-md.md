# Individual Next.js source review — `01-app/02-guides/multi-zones.md`

## Identification

- Assigned identity: `next-doc-file-01-app-02-guides-multi-zones-md`
- Installed primary path: `node_modules/next/dist/docs/01-app/02-guides/multi-zones.md`
- Upstream version: Next.js 16.4.2 (`2864b1772c37242a9b40ab4d366eb7d368c2a070`)
- Source: [immutable official MDX](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/02-guides/multi-zones.mdx)
- GitHub source checkpoint: `fdf106572ae5de790e1a7aac80c15301ebf90c1e`
- State: Completed content inspection; runtime verification separate

## Scope and source evidence

The official page is titled **How to build micro-frontends using multi-zones and Next.js**.
Its frontmatter describes: Learn how to build micro-frontends using Next.js Multi-Zones to deploy multiple Next.js apps under a single domain..
The source contains 7,201 characters and 5 fenced-code pairs.

Source section headings (up to twelve):

<!-- cspell:disable -->
- How to define a zone
- How to route requests to the right zone
- Routing requests using proxy
- Linking between zones
- Sharing code
- Server Actions
<!-- cspell:enable -->

## Applicability and independent judgment

- Focus: Multiple independently deployed Next.js zones.
- Project check: The project is configured as one Next.js application; multi-zone deployment is not established.
- Version-matched terms present in the body: `proxy`, `rewrites`.
- No framework example was treated as an application requirement solely because it appears in the versioned documentation.

## Cautions and verification boundary

The guide includes these quoted advisory excerpts (truncated to identify their location):

<!-- cspell:disable -->
- > **Good to know**: URL paths should be unique to a zone. For example, two zones tryi…
<!-- cspell:enable -->

This is a direct, per-file documentation/source inspection, not a
separately launched subagent. Build, browser, authorization, caching
and deployment behavior were not executed for this source item.
The report does not substitute for review of other inventory files.

## Disposition

Individual installed-version source reviewed with its section
structure, feature references, and application-specific scope recorded.
