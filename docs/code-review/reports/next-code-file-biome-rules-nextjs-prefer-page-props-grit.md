# Individual Biome review — `next-code-file-biome-rules-nextjs-prefer-page-props-grit`

## Identification

- **Agent:** `next-code-file-biome-rules-nextjs-prefer-page-props-grit`
- **Primary file:** `.biome/rules/nextjs/prefer-page-props.grit`
- **Type:** CODE_FILE
- **Next.js baseline:** 16.4.2
- **Source checkpoint:** `eaf6acad93f92332cfb73787f9655febae53b4b6`
- **Status:** Reviewed from source; validation pending.

## Implementation evidence

The source plugin flags an async default page function whose params parameter is typed inline rather than using the generated PageProps helper.

## Finding and coverage limits

Only a specific function signature is matched, so semantic equivalents and wrappers may need a manual review.

No additional confirmed defect was demonstrated solely by this source review. Project rules can be stricter than the framework.

## Verification

The dedicated review workflow now runs the native Biome policy fixtures as well as structural scanner fixtures, focused regressions, TypeScript, spelling and Markdown. Do not mark this file completed unless the updated workflow passes.

## Disposition

The file-specific policy or test contract has been inspected and recorded.
