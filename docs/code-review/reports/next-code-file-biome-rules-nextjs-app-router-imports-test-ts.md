# Individual Biome review — `next-code-file-biome-rules-nextjs-app-router-imports-test-ts`

## Identification

- **Agent:** `next-code-file-biome-rules-nextjs-app-router-imports-test-ts`
- **Primary file:** `.biome/rules/nextjs/app-router-imports.test.ts`
- **Type:** CODE_FILE
- **Next.js baseline:** 16.4.2
- **Source checkpoint:** `eaf6acad93f92332cfb73787f9655febae53b4b6`
- **Status:** Reviewed from source; validation pending.

## Implementation evidence

The tests reject legacy next/router, next/head, next/document and next/app imports in owned code, while accepting App Router modules. They verify vendor exclusions and route-only Firebase SDK import restrictions.

## Finding and coverage limits

This repository rule controls imports and placement; it does not replace Next.js runtime or Firebase authorization tests.

No additional confirmed defect was demonstrated solely by this source review. Project rules can be stricter than the framework.

## Verification

The dedicated review workflow now runs the native Biome policy fixtures as well as structural scanner fixtures, focused regressions, TypeScript, spelling and Markdown. Do not mark this file completed unless the updated workflow passes.

## Disposition

The file-specific policy or test contract has been inspected and recorded.
