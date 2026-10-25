# Individual Biome review — `next-code-file-biome-rules-complexity-native-rules-test-ts`

## Identification

- **Agent:** `next-code-file-biome-rules-complexity-native-rules-test-ts`
- **Primary file:** `.biome/rules/complexity/native-rules.test.ts`
- **Type:** CODE_FILE
- **Next.js baseline:** 16.4.2
- **Source checkpoint:** `eaf6acad93f92332cfb73787f9655febae53b4b6`
- **Status:** Reviewed from source; validation pending.

## Implementation evidence

The native complexity tests create tracked project-specific temporary fixture paths and assert exact boundaries for cognitive complexity, function line count and nested callbacks. They separately exercise TSX hooks, vendor exclusions and immediately invoked functions.

## Finding and coverage limits

Fixture execution invokes the real pinned Biome binary. The project policy tests do not prove equivalent complexity semantics across unrelated compilers.

No additional confirmed defect was demonstrated solely by this source review. Project rules can be stricter than the framework.

## Verification

The dedicated review workflow now runs the native Biome policy fixtures as well as structural scanner fixtures, focused regressions, TypeScript, spelling and Markdown. Do not mark this file completed unless the updated workflow passes.

## Disposition

The file-specific policy or test contract has been inspected and recorded.
