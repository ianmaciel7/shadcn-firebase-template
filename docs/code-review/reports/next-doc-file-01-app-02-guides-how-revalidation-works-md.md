# Individual installed Next.js documentation review — `how-revalidation-works.md`

## Identification

- Reviewer identity: `next-doc-file-01-app-02-guides-how-revalidation-works-md`
- Item type: `DOC_FILE`
- Installed path: `node_modules/next/dist/docs/01-app/02-guides/how-revalidation-works.md`
- Upstream source: [Next.js 16.4.2 documentation](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/02-guides/how-revalidation-works.mdx)
- Source revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Application baseline: `b60862b945a5608bc9f24ee49ff4de904288eeaf`
- Status: Completed direct content and applicability inspection; CI pending

## Observed documented scope

The official version-matched guide addresses **cached data invalidation propagation**.

- Defines explicit and implicit tags and which cached surfaces are invalidated.
- Documents `revalidateTag`, `revalidatePath` and multi-instance propagation concerns.
- Differentiates a local invalidation event from cross-instance/CDN consistency.

## Project-specific applicability

The template enables Cache Components but this review did not find evidence that it operates a shared multi-instance cache provider.

## Risks and verification boundary

Do not assume per-instance invalidation provides global production coherence.
No independent reviewer subagent was launched, and no browser,
build, emulator or runtime test was performed for this specific
documentation item. The named file received its own source review;
other documentation paths remain separate Pending items.

## Disposition

Relevant and optional patterns have been distinguished based on the
actual current repository configuration and the pinned Next.js text.
