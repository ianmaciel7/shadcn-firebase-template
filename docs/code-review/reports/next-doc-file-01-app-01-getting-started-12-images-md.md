# Individual report — `next-doc-file-01-app-01-getting-started-12-images-md`

## Identification

- Full subagent name: `next-doc-file-01-app-01-getting-started-12-images-md`
- Type: `DOC_FILE`
- Primary path: `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`
- Associated documentation: use of `next/image`, local images, intrinsic dimensions, and configuration of remote sources.
- Next.js version: `16.4.2`
- Status: completed.

## Scope

- Responsibility: read the installed images guide in full and assess its applicability to the project.
- Files consulted: the primary guide; `src/app/_components/home-section-client.tsx`; `next.config.ts`; `public/next.svg`; occurrences of `<img>` in `src/components/`.
- Dependencies analyzed: `next/image`, the App Router, and the `images.remotePatterns` configuration.

## Code Review

Correct implementations observed:

- The only identified use of `next/image` in the App Router code is the static logo in `src/app/_components/home-section-client.tsx:48-55`. It references `/next.svg`, an existing file at `public/next.svg`, and sets `width={100}` and `height={20}`. This preserves the known proportion and avoids layout shift during loading, per the guide.
- The image is decorative: `alt=""` and `role="presentation"` avoid announcing the logo with no informational content.
- The logo is at the top of the page and receives `priority`, consistent with its visible use on the first screen. No evidence found indicates misuse on below-the-fold images.
- `next.config.ts` does not define `images.remotePatterns`, but the observed use of `next/image` points to a local resource. Therefore the remote configuration is not needed for that use.

Applicability of other examples in the guide:

- The `remotePatterns` recommendation applies when a remote URL is used with the `next/image` optimizer; no such remote use was identified in the project.
- There are `<img>` elements in attachment/base64 image previews, a QR code generated as a data URL, and small provider logos. The guide explains the features of `next/image`, but does not establish that every `<img>` element in the project must be converted. The observed contexts do not, by themselves, demonstrate a violation of this document; the data/preview elements have a different flow and sources than the static logo.

Issues found: no proven deviation from this document.

## Findings

No findings. No evidence was identified that requires additional configuration or a change to the current use of images.

## Conclusion

- Classification: compliant.
- Explanation: the case directly covered by the guide uses `next/image` for a local asset with explicit dimensions, appropriate decorative alternative text, and a priority compatible with the visible position. The absence of a remote allowlist is not applicable to the use examined. The other `<img>` elements found are not converted into findings without evidence that the guide's requirement applies to their preview or data flows.
