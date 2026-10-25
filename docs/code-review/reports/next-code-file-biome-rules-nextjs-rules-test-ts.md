# Individual Biome review — `next-code-file-biome-rules-nextjs-rules-test-ts`

## Identification

- **Agent:** `next-code-file-biome-rules-nextjs-rules-test-ts`
- **Primary file:** `.biome/rules/nextjs/rules.test.ts`
- **Type:** CODE_FILE
- **Next.js baseline:** 16.4.2
- **Source checkpoint:** `eaf6acad93f92332cfb73787f9655febae53b4b6`
- **Status:** Reviewed from source; validation pending.

## Implementation evidence

The test suite passes generated PageProps, LayoutProps and RouteContext signatures and rejects manually declared route params or children on matching Next.js entrypoints.

## Finding and coverage limits

Tests invoke the parser with representative signatures, not all valid framework route shapes.

No additional confirmed defect was demonstrated solely by this source review. Project rules can be stricter than the framework.

## Verification

The dedicated review workflow now runs the native Biome policy fixtures as well as structural scanner fixtures, focused regressions, TypeScript, spelling and Markdown. Do not mark this file completed unless the updated workflow passes.

## Disposition

The file-specific policy or test contract has been inspected and recorded.
