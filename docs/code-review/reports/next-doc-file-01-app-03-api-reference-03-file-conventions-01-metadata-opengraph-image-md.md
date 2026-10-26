# Official Next.js per-file review — `01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md`

## Evidence and identification

- Identity: `next-doc-file-01-app-03-api-reference-03-file-conventions-01-metadata-opengraph-image-md`
- Versioned file: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md`
- Official content: [Next.js 16.4.2](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.mdx)
- Pinned revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Template branch baseline: `3e0867d03acd30ff2c277265d88287cda0226050`
- Status: Completed direct source inspection, not independent subagent execution

## Documented API or convention

The source page title is **opengraph-image and twitter-image**.
The source description is: API Reference for the Open Graph Image and Twitter Image file conventions..
Subject reviewed: Open Graph image metadata.
The versioned source contains 16,658 characters.
Mentioned framework symbols or features: `runtime`, `metadata`, `ImageResponse`.

Explicit section headings:

<!-- cspell:disable -->
- `Image files (.jpg, .png, .gif)`
- `'opengraph-image'`
- `'twitter-image'`
- `'opengraph-image.alt.txt'`
- `'twitter-image.alt.txt'`
- `Generate images using code (.js, .ts, .tsx)`
- `Props`
- `Returns`
- `Config exports`
- `Examples`

<!-- cspell:enable -->

## Application-specific applicability

A dynamic image endpoint is optional; do not infer that it exists from the root metadata object.

## Verification and findings boundary

File placement and section evidence were examined against the
installed Next.js version. This does not establish that this
application uses the convention, that caching is safe for user data,
or that production runtime and browser behavior meet the examples.
No separate subagent, build, browser run or deployed inspection
was performed for this item.

## Conclusion

The named documentation file was inspected independently of its
siblings and its project adoption status was recorded.
