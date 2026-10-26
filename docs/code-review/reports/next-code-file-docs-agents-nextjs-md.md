# Individual source review — `docs/agents/nextjs.md`

## Identification

- Review identity: `next-code-file-docs-agents-nextjs-md`
- Item type: `CODE_FILE`
- Primary path: `docs/agents/nextjs.md`
- Source baseline: `0a4aae9d663220e953b4de7ef88140472c73e5be`
- Next.js / React baseline: 16.4.2 / 19.3.1
- Status: Completed direct static review; CI validation pending

## Scope and evidence

The primary source covers **pinned next.js reference inventory and applicability**.
Inspected the named file at the recorded branch checkpoint
and compared its stated obligations against related source, tool
configuration and application boundaries where appropriate.

## Verified source observations

- Records Next.js 16.4.2 stable source snapshot with 742 Markdown/MDX files and a canary comparison with 745 files.
- Separates official App Router, Pages Router, errors, caching and configuration topics from optional features and migration examples.
- Explains how to compare installed exports and framework docs before adopting newer or experimental recipes.

## Findings and verification boundaries

- This broad official-document inventory does not satisfy the distinct 490 remaining per-document and folder reports for installed node_modules/next/dist/docs/.
No separate independent subagent was invoked for this report.
This static source inspection does not replace runtime, security,
emulator, browser or integration tests.

## Disposition

The primary file was inspected and the scope/limitations recorded.
No additional confirmed blocking defect was established within this
source item alone. Outstanding related items and CI verification
remain tracked separately.
