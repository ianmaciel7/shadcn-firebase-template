# Individual Next.js source review — `01-app/02-guides/mdx.md`

## Identification

- Assigned identity: `next-doc-file-01-app-02-guides-mdx-md`
- Installed primary path: `node_modules/next/dist/docs/01-app/02-guides/mdx.md`
- Upstream version: Next.js 16.4.2 (`2864b1772c37242a9b40ab4d366eb7d368c2a070`)
- Source: [immutable official MDX](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/02-guides/mdx.mdx)
- GitHub source checkpoint: `fdf106572ae5de790e1a7aac80c15301ebf90c1e`
- State: Completed content inspection; runtime verification separate

## Scope and source evidence

The official page is titled **How to use markdown and MDX in Next.js**.
Its frontmatter describes: Learn how to configure MDX and use it in your Next.js apps..
The source contains 23,497 characters and 50 fenced-code pairs.

Source section headings (up to twelve):

<!-- cspell:disable -->
- Install dependencies
- Configure `next.config.mjs`
- Handling `.md` files
- Add an `mdx-components.tsx` file
- Rendering MDX
- Using file based routing
- Using imports
- Using dynamic imports
- Using custom styles and components
- This is a heading
- Global styles and components
- Local styles and components
<!-- cspell:enable -->

## Applicability and independent judgment

- Focus: MDX integrates Markdown-authored content into React-rendered routes.
- Project check: The application currently uses TypeScript route components; no MDX route dependency should be introduced without a content requirement.
- Version-matched terms present in the body: `Server Components`, `Turbopack`, `MDX`.
- No framework example was treated as an application requirement solely because it appears in the versioned documentation.

## Cautions and verification boundary

The guide includes these quoted advisory excerpts (truncated to identify their location):

<!-- cspell:disable -->
- > **Good to know**: View the [Portfolio Starter Kit](https://vercel.com/templates/nex…
- > **Good to know**:
- > **Good to know**: Ensure you specify the '.mdx' file extension in your import. Whil…
<!-- cspell:enable -->

This is a direct, per-file documentation/source inspection, not a
separately launched subagent. Build, browser, authorization, caching
and deployment behavior were not executed for this source item.
The report does not substitute for review of other inventory files.

## Disposition

Individual installed-version source reviewed with its section
structure, feature references, and application-specific scope recorded.
