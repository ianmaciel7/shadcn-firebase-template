# Individual Biome rule or test review — `next-code-file-biome-rules-complexity-native-rules-test-ts`

## Identification

- **Agent identity:** `next-code-file-biome-rules-complexity-native-rules-test-ts`
- **Primary file:** `.biome/rules/complexity/native-rules.test.ts`
- **Type:** CODE_FILE
- **Framework:** Next.js 16.4.2
- **Reviewed checkpoint:** `e5f84f00c293be80be70396aaf61afd17c06a61d`
- **Status:** Completed after successful rule and report checks.

## Source-specific evidence

Actual Biome tests verify the exact limits for cognitive complexity, function lines and callback nesting. They include TSX hooks, vendor exclusions and immediate function invocation.

## Limits and findings

These fixture diagnostics are project quality gates rather than direct measurements of user experience.

No additional confirmed source defect was established solely by this file inspection.

## Verification

[Branch validation run 40210742964](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40210742964) successfully executed five native Biome fixture suites, `pnpm check:structure`, hook scope fixtures, TypeScript, focused regressions, language, spelling, Markdown and inventory checks.

## Conclusion

This primary file was inspected and validated. Application runtime and remaining framework reference documents have independent review status.
