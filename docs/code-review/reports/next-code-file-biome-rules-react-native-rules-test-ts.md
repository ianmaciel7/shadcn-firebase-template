# Individual Biome review — `next-code-file-biome-rules-react-native-rules-test-ts`

## Identification

- **Agent:** `next-code-file-biome-rules-react-native-rules-test-ts`
- **Primary file:** `.biome/rules/react/native-rules.test.ts`
- **Type:** CODE_FILE
- **Next.js baseline:** 16.4.2
- **Source checkpoint:** `eaf6acad93f92332cfb73787f9655febae53b4b6`
- **Status:** Reviewed from source; validation pending.

## Implementation evidence

The native React tests verify invalid conditional hooks, missing effect dependencies, nested components, prop mutation and forwardRef usage across owned folders, plus valid usage and vendor exclusions.

## Finding and coverage limits

The forwardRef policy is project-specific and version-dependent; native rule diagnostics cannot prove every renderer compatibility concern.

No additional confirmed defect was demonstrated solely by this source review. Project rules can be stricter than the framework.

## Verification

The dedicated review workflow now runs the native Biome policy fixtures as well as structural scanner fixtures, focused regressions, TypeScript, spelling and Markdown. Do not mark this file completed unless the updated workflow passes.

## Disposition

The file-specific policy or test contract has been inspected and recorded.
