# 490 |ntation coverage

Source: installed `node_modules/next/dist/docs/`, Next.js **16.4.2**.

| Measure | Count |
| --- | ---: |
| Documentation folders inventoried | 44 |
| Documentation files inventoried | 482 |
| Total documentary review items | 526 |
| Folder reports completed | 3 |
| File reports completed | 21 |
| Items reviewed | 24 |
| Coverage | 4.56% |
| Active reports | 0 |
| Completed as not applicable to current application | 3 |
| Pending items | 502 |

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
