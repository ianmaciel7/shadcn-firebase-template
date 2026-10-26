# Individual Next.js source review — `01-app/02-guides/migrating/app-router-migration.md`

## Identification

- Assigned identity: `next-doc-file-01-app-02-guides-migrating-app-router-migration-md`
- Installed primary path: `node_modules/next/dist/docs/01-app/02-guides/migrating/app-router-migration.md`
- Upstream version: Next.js 16.4.2 (`2864b1772c37242a9b40ab4d366eb7d368c2a070`)
- Source: [immutable official MDX](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/02-guides/migrating/app-router-migration.mdx)
- GitHub source checkpoint: `fdf106572ae5de790e1a7aac80c15301ebf90c1e`
- State: Completed content inspection; runtime verification separate

## Scope and source evidence

The official page is titled **How to migrate from Pages to the App Router**.
Its frontmatter describes: Learn how to upgrade your existing Next.js application from the Pages Router to the App Router..
The source contains 38,237 characters and 47 fenced-code pairs.

Source section headings (up to twelve):

<!-- cspell:disable -->
- Upgrading
- Node.js Version
- Next.js Version
- ESLint Version
- Next Steps
- Upgrading New Features
- `<Image/>` Component
- `<Link>` Component
- `<Script>` Component
- Font Optimization
- Migrating from `pages` to `app`
- Step 1: Creating the `app` directory
<!-- cspell:enable -->

## Applicability and independent judgment

- Focus: Guidance for migrating from Pages Router to App Router.
- Project check: This app already uses App Router. Migration steps provide compatibility context and must not be applied as if pages directory exists.
- Version-matched terms present in the body: `Server Components`, `Client Components`, `Suspense`, `use client`, `MDX`, `ISR`.
- No framework example was treated as an application requirement solely because it appears in the versioned documentation.

## Cautions and verification boundary

The guide includes these quoted advisory excerpts (truncated to identify their location):

<!-- cspell:disable -->
- > **Good to know**: You may need to restart the ESLint server in VS Code for the ESLi…
- > **Good to know**: This is the easiest migration path because it has the most compar…
- > **Good to know**: If you previously used API routes to call an external API from th…
<!-- cspell:enable -->

This is a direct, per-file documentation/source inspection, not a
separately launched subagent. Build, browser, authorization, caching
and deployment behavior were not executed for this source item.
The report does not substitute for review of other inventory files.

## Disposition

Individual installed-version source reviewed with its section
structure, feature references, and application-specific scope recorded.
