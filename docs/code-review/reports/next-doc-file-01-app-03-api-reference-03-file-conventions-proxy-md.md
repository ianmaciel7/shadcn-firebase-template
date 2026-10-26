# Next.js 16.4.2 individual file review — `proxy.md`

## Identification

<!-- cspell:disable -->
- Agent inventory name: `next-doc-file-01-app-03-api-reference-03-file-conventions-proxy-md`
- Primary installed path: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`
- Immutable upstream reference: [Next.js official MDX](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/03-file-conventions/proxy.mdx)

<!-- cspell:enable -->
- Source revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- App baseline: `373aa319f882052626222ea4181d68ca84746d00`
- Status: Direct content inspection completed; independent subagent verification not executed

## Specific documentation content

The official page is titled **proxy.js**.
Its description identifies: API reference for the proxy.js file..
Subject of this item: Network boundary Proxy convention.
The official content inspected contains 31,163 characters.
Versioned framework references found: `Proxy`, `NextRequest`, `NextResponse`, `experimental`, `deprecated`.

Document sections:

<!-- cspell:disable -->
- `Exports`
- `Proxy function`
- `Config object (optional)`
- `Matcher`
- `Params`
- `'request'`
- `'event'`
- `'NextProxy' type`
- `NextResponse`
- `Execution order`
- `Runtime`
- `Advanced Proxy flags`

<!-- cspell:enable -->

## Reconciliation and applicability

No proxy.ts is currently configured. Proxy is not a substitute for per-request authorization or Firebase Security Rules.

## Cautions and limits

The official source is a framework API description, not evidence
that this project enables the feature or uses the convention.
Application correctness requires inspecting imports, trust boundaries
and executing the corresponding behavior tests.
No standalone subagent or browser/deployment action was performed.

## Conclusion

This named file was reviewed individually against the pinned
Next.js documentation and assigned a project-specific adoption note.
