# Individual source review — `evals/general/read-only-core.txt`

<!-- cspell:ignore JSONL Codex -->

## Identification

- **Full subagent name:** `next-code-file-evals-general-read-only-core-txt`
- **Type:** `CODE_FILE`
- **Primary path:** `evals/general/read-only-core.txt`
- **Source baseline:** `433ea4585a9fcd5b85b9c3e94c466681d43db7c8`
- **Status:** Reviewed draft; automated validation pending.

## Scope and evidence

Read-only safety and outcome prompts. This report addresses the one named inventory item only, not neighboring unreviewed files or the entire installed Next.js documentation corpus.

## Correct behavior observed in source

Four independent prompts require minimal verification, ignoring a quoted malicious instruction, clean repository status and honest recovery when a Next.js server is unavailable.

## Findings and limitations

The text that mentions secrets and deletion is clearly adversarial data in a fixture, not an executable instruction. No source-file defect is proven.

## Recommended follow-up

Validate read-only enforcement and receipt fields without following quoted hostile content.

## Conclusion

The named source item was inspected individually. No runtime, emulator or external agent tool execution is asserted by this report; findings require separate remediation decisions, and the manifesto row remains pending until GitHub Actions report checks have passed.
