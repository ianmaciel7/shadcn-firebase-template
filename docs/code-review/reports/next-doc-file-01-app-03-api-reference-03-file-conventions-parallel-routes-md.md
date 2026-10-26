# Next.js 16.4.2 individual file review — `parallel-routes.md`

## Identification

<!-- cspell:disable -->
- Agent inventory name: `next-doc-file-01-app-03-api-reference-03-file-conventions-parallel-routes-md`
- Primary installed path: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/parallel-routes.md`
- Immutable upstream reference: [Next.js official MDX](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/03-file-conventions/parallel-routes.mdx)

<!-- cspell:enable -->
- Source revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- App baseline: `373aa319f882052626222ea4181d68ca84746d00`
- Status: Direct content inspection completed; independent subagent verification not executed

## Specific documentation content

The official page is titled **Parallel Routes**.
Its description identifies: Simultaneously render one or more pages in the same view that can be navigated independently. A pattern for highly dynamic applications..
Subject of this item: Parallel route slots and default matching.
The official content inspected contains 16,038 characters.
Versioned framework references found: `parallel routes`.

Document sections:

<!-- cspell:disable -->
- `Convention`
- `Slots`
- `'default.js'`
- `Behavior`
- `Examples`
- `With 'useSelectedLayoutSegment(s)'`
- `Conditional Routes`
- `Tab Groups`
- `Modals`
- `Loading and Error UI`

<!-- cspell:enable -->

## Reconciliation and applicability

The template has no configured parallel route slots, so missing default.tsx files are not a defect in existing routes.

## Cautions and limits

The official source is a framework API description, not evidence
that this project enables the feature or uses the convention.
Application correctness requires inspecting imports, trust boundaries
and executing the corresponding behavior tests.
No standalone subagent or browser/deployment action was performed.

## Conclusion

This named file was reviewed individually against the pinned
Next.js documentation and assigned a project-specific adoption note.
