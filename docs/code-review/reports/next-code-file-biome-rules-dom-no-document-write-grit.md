# Individual Biome review — `next-code-file-biome-rules-dom-no-document-write-grit`

## Identification

- **Agent:** `next-code-file-biome-rules-dom-no-document-write-grit`
- **Primary file:** `.biome/rules/dom/no-document-write.grit`
- **Type:** CODE_FILE
- **Next.js baseline:** 16.4.2
- **Source checkpoint:** `eaf6acad93f92332cfb73787f9655febae53b4b6`
- **Status:** Reviewed from source; validation pending.

## Implementation evidence

The rule registers an error for document.write and document.writeln on direct, window-qualified and globalThis-qualified document objects.

## Finding and coverage limits

The rule intentionally handles listed syntax forms only; custom aliases require a separate security review.

No additional confirmed defect was demonstrated solely by this source review. Project rules can be stricter than the framework.

## Verification

The dedicated review workflow now runs the native Biome policy fixtures as well as structural scanner fixtures, focused regressions, TypeScript, spelling and Markdown. Do not mark this file completed unless the updated workflow passes.

## Disposition

The file-specific policy or test contract has been inspected and recorded.
