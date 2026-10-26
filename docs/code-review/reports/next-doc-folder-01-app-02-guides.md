# Individual installed Next.js documentation folder review — `01-app/02-guides/`

## Identification

- Review identity: `next-doc-folder-01-app-02-guides`
- Item type: `DOC_FOLDER`
- Primary installed path: `node_modules/next/dist/docs/01-app/02-guides/`
- Next.js 16.4.2 source tree: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Exact upstream Git tree SHA: `913a2b0d496ee4dd3be7a1122ddf1c5dd07b0217`
- Status: Completed structural source inspection; no independent subagent or runtime test

## Version-matched directory inventory

This directory represents **app router version-matched route, api and guide organization**.
The immutable official tree contains 4 immediate subdirectories,
63 immediate documentation files and 81
descendant files in this specific directory.

## Architectural implications

- The exact path and child counts were compared against the non-truncated
  upstream Next.js 16.4.2 `docs/` Git tree.
- The project's active routing model is App Router; Pages Router guides
  remain independent references and do not indicate their APIs are used.
- A folder inspection validates grouping and navigation scope only.
  None of its child file bodies are counted as individually reviewed
  merely because the folder is now structurally inspected.

## Findings and limits

No omitted folder name was inferred from naming patterns. Actual
version-matched source membership was checked. This inspection
did not inspect every descendant body, run a separate named subagent,
verify runtime behavior or test documentation examples.

## Disposition

One documentation folder primary item has an individual structural
report; all remaining child files require their own source review.
