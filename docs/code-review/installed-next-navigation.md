# Installed Next.js documentation navigation

<!-- cspell:ignore DOCSTART DOCUPGRADE -->

This repository-owned navigation addendum fills the local navigation gaps recorded as `DOCSTART-001` and `DOCUPGRADE-001`. It links the complete immediate guide inventories installed with Next.js **16.4.2**. It does not change the dependency, recommend an upgrade, or establish that every linked guide applies to this application.

The installed Getting Started index ends with an empty “Next Steps” heading, and the Upgrading index ends with an introduction without links. Those upstream indexes remain unchanged. The local reader impact is mitigated by the complete links below; the upstream editorial findings remain open.

## Getting Started

| Guide | Installed source |
| --- | --- |
| Installation | [01-installation.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/01-installation.md>) |
| Project structure and organization | [02-project-structure.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md>) |
| Layouts and Pages | [03-layouts-and-pages.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md>) |
| Linking and Navigating | [04-linking-and-navigating.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md>) |
| Server and Client Components | [05-server-and-client-components.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md>) |
| Fetching Data | [06-fetching-data.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md>) |
| Mutating Data | [07-mutating-data.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md>) |
| Caching | [08-caching.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md>) |
| Revalidating | [09-revalidating.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/09-revalidating.md>) |
| Error Handling | [10-error-handling.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/10-error-handling.md>) |
| CSS | [11-css.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/11-css.md>) |
| Image Optimization | [12-images.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/12-images.md>) |
| Font Optimization | [13-fonts.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md>) |
| Metadata and OG images | [14-metadata-and-og-images.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md>) |
| Route Handlers | [15-route-handlers.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md>) |
| Proxy | [16-proxy.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md>) |
| Deploying | [17-deploying.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/17-deploying.md>) |
| Upgrading | [18-upgrading.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/18-upgrading.md>) |
| Section index | [index.md](<../../node_modules/next/dist/docs/01-app/01-getting-started/index.md>) |

## Upgrading

| Guide | Installed source |
| --- | --- |
| Upgrade with a coding agent | [agent-upgrade.md](<../../node_modules/next/dist/docs/01-app/02-guides/upgrading/agent-upgrade.md>) |
| Codemods | [codemods.md](<../../node_modules/next/dist/docs/01-app/02-guides/upgrading/codemods.md>) |
| Section index | [index.md](<../../node_modules/next/dist/docs/01-app/02-guides/upgrading/index.md>) |
| How to upgrade to version 14 | [version-14.md](<../../node_modules/next/dist/docs/01-app/02-guides/upgrading/version-14.md>) |
| How to upgrade to version 15 | [version-15.md](<../../node_modules/next/dist/docs/01-app/02-guides/upgrading/version-15.md>) |
| How to upgrade to version 16 | [version-16.md](<../../node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md>) |

## Version and verification

- Installed version was read from `node_modules/next/package.json`.
- Every immediate Markdown file in the two sections appears exactly once, including each original index.
- Every relative link resolves from this addendum when the recorded Next.js dependency is installed.
- Recheck this inventory after changing the Next.js dependency. The coding-agent upgrade guide labels itself experimental; its presence is not authorization to run an upgrade.
