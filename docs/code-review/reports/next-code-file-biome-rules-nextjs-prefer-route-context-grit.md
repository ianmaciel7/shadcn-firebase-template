# Individual Biome review — `next-code-file-biome-rules-nextjs-prefer-route-context-grit`

## Identification

- **Agent:** `next-code-file-biome-rules-nextjs-prefer-route-context-grit`
- **Primary file:** `.biome/rules/nextjs/prefer-route-context.grit`
- **Type:** CODE_FILE
- **Next.js baseline:** 16.4.2
- **Source checkpoint:** `eaf6acad93f92332cfb73787f9655febae53b4b6`
- **Status:** Reviewed from source; validation pending.

## Implementation evidence

The rule covers the standard GET, POST, PUT, PATCH and DELETE route handlers that manually type params rather than use generated RouteContext.

## Finding and coverage limits

Method coverage and parameter syntax are explicit. It does not prove every request handler's authorization correctness.

No additional confirmed defect was demonstrated solely by this source review. Project rules can be stricter than the framework.

## Verification

The dedicated review workflow now runs the native Biome policy fixtures as well as structural scanner fixtures, focused regressions, TypeScript, spelling and Markdown. Do not mark this file completed unless the updated workflow passes.

## Disposition

The file-specific policy or test contract has been inspected and recorded.
