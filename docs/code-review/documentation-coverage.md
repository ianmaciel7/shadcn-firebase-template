# Documentation coverage

Source: installed `node_modules/next/dist/docs/`, Next.js **16.4.2**.

| Measure | Count |
| --- | ---: |
| Documentation folders inventoried | 40 |
| Documentation files inventoried | 474 |
| Total documentary review items | 514 |
| Folder reports completed | 40 |
| File reports completed | 152 |
| Items reviewed | 192 |
| Coverage | 37.35% |
| Active reports | 0 |
| Completed as not applicable to current application | 3 |
| Pending items | 322 |

## Twelve version-matched App Router guides (2026-10-26)

An additional twelve guide files under `01-app/02-guides/` were
read at the pinned Next.js 16.4.2 documentation source revision
and compared with the current project configuration. Individual
reports distinguish applicable cache/auth patterns from optional
framework features; no independent subagents or runtime checks
were executed in this review session. Current documentation
coverage is 36/514 items, with 478 Pending.

## Complete official documentation folder inventory (2026-10-26)

Every installed Next.js 16.4.2 documentation folder has an
individual structural report matched to the immutable upstream Git
tree. These 40 folder items do not confer reviewed status on their
441 still-Pending child files; those require distinct body reviews.
No independent subagents or runtime tests were executed for the
37 newly inspected folders.

## Version 16 rendering and navigation guide batch (2026-10-26)

Twenty more official documentation file bodies were read and
compared with the installed project configuration, including
Cache Components, partial prefetch, streaming, React Activity
and framework testing. Each has a standalone source report.
No independent subagents or runtime tests were executed; 421
documentation files remain Pending.

## App Router operational and optional guide checkpoint (2026-10-26)

Fifteen version-matched Next.js guide bodies were individually
inspected, including an index-only navigation page. Optional
recipes were not interpreted as required architecture.
All project items remain reviewed and 406 documentation files
still require their own source inspections.

Completed folder reports: `next-doc-folder-root`, `next-doc-folder-01-app`, and `next-doc-folder-01-app-01-getting-started`.

Completed file reports:

- `01-app/01-getting-started/01-installation.md`
- `01-app/01-getting-started/02-project-structure.md`
- `01-app/01-getting-started/03-layouts-and-pages.md`
- `01-app/01-getting-started/04-linking-and-navigating.md`
- `01-app/01-getting-started/05-server-and-client-components.md`
- `01-app/01-getting-started/06-fetching-data.md`
- `01-app/01-getting-started/07-mutating-data.md`
- `01-app/01-getting-started/08-caching.md`
- `01-app/01-getting-started/09-revalidating.md`
- `01-app/01-getting-started/10-error-handling.md`
- `01-app/01-getting-started/11-css.md`
- `01-app/01-getting-started/12-images.md`
- `01-app/01-getting-started/13-fonts.md`
- `01-app/01-getting-started/14-metadata-and-og-images.md`
- `01-app/01-getting-started/15-route-handlers.md`
- `01-app/01-getting-started/16-proxy.md`
- `01-app/01-getting-started/17-deploying.md`
- `01-app/01-getting-started/18-upgrading.md`
- `01-app/01-getting-started/index.md`

The index report identified an empty “Next Steps” section; see [findings](findings.md).

`01-app/02-guides/upgrading/index.md` also has an incomplete introductory sentence that omits links to its version-specific guides; this is recorded as a separate low-severity documentation finding.

The revalidating, route-handlers, and proxy document reviews classify their features as not applicable to the current application. The remaining 502 documentation items are pending. Coverage measures inventory items with a completed report, not merely items read as context by another subagent.

## Inventory reconciliation on resumption

The historical manifest includes 12 generated `graphify-out/` paths (four folders and eight files) absent from the current installed package. They remain pending and are not counted as reviewed or not applicable. The 526-item denominator is preserved until their eligibility and any newly discovered paths are reconciled explicitly. The coordinator rechecked every manifest path; all remaining paths exist locally.

## Current official corpus reconciliation

The authoritative Next.js 16.4.2 corpus excludes twelve generated `graphify-out/` paths counted in historical pre-reconciliation notes. The current denominator is 514 items (40 folders and 474 files), with 24 completed and 490 pending.
