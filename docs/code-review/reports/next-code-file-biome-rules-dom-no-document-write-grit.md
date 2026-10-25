# Individual Biome rule or test review — `next-code-file-biome-rules-dom-no-document-write-grit`

## Identification

- **Agent identity:** `next-code-file-biome-rules-dom-no-document-write-grit`
- **Primary file:** `.biome/rules/dom/no-document-write.grit`
- **Type:** CODE_FILE
- **Framework:** Next.js 16.4.2
- **Reviewed checkpoint:** `e5f84f00c293be80be70396aaf61afd17c06a61d`
- **Status:** Completed after successful rule and report checks.

## Source-specific evidence

The source rule rejects direct, window-qualified and globalThis-qualified document.write or writeln expressions.

## Limits and findings

Aliased document references are outside this specific syntax pattern.

No additional confirmed source defect was established solely by this file inspection.

## Verification

[Branch validation run 40210742964](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40210742964) successfully executed five native Biome fixture suites, `pnpm check:structure`, hook scope fixtures, TypeScript, focused regressions, language, spelling, Markdown and inventory checks.

## Conclusion

This primary file was inspected and validated. Application runtime and remaining framework reference documents have independent review status.
