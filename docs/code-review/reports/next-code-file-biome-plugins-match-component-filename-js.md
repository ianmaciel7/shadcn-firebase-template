# Individual Biome review — `next-code-file-biome-plugins-match-component-filename-js`

## Identification

- **Agent:** `next-code-file-biome-plugins-match-component-filename-js`
- **Primary file:** `.biome/plugins/match-component-filename.js`
- **Type:** CODE_FILE
- **Next.js baseline:** 16.4.2
- **Source checkpoint:** `eaf6acad93f92332cfb73787f9655febae53b4b6`
- **Status:** Reviewed from source; validation pending.

## Implementation evidence

The developer-preview plugin registers a semantic binding visitor and checks exported function components against the owning kebab-case module stem. Matching compound-part prefixes are allowed.

## Finding and coverage limits

This experimental rule only handles exported function declarations. The separate TypeScript convention guard remains responsible for export aliases, props forwarding and unsupported re-export patterns.

No additional confirmed defect was demonstrated solely by this source review. Project rules can be stricter than the framework.

## Verification

The dedicated review workflow now runs the native Biome policy fixtures as well as structural scanner fixtures, focused regressions, TypeScript, spelling and Markdown. Do not mark this file completed unless the updated workflow passes.

## Disposition

The file-specific policy or test contract has been inspected and recorded.
