# Individual source review — `evals/tool-usage/cases.json`

<!-- cspell:ignore JSONL Codex -->

## Identification

- **Full subagent name:** `next-code-file-evals-tool-usage-cases-json`
- **Type:** `CODE_FILE`
- **Primary path:** `evals/tool-usage/cases.json`
- **Source baseline:** `433ea4585a9fcd5b85b9c3e94c466681d43db7c8`
- **Status:** Reviewed draft; automated validation pending.

## Scope and evidence

Tool-selection case definitions. This report addresses the one named inventory item only, not neighboring files or the entire installed Next.js documentation corpus.

## Correct behavior observed in source

Versioned data defines five unique case IDs with prompt, expectedToolPatterns and expectedReceiptTools fields.

## Findings and limitations

Regular expressions may match mentions or failed attempts without proving a successful tool call. The current runner scoring is a limited selection metric.

## Recommended follow-up

Validate unique IDs, parsable regexes, and negative cases distinguishing tool calls from prose.

## Conclusion

The named source item was inspected individually. No runtime, emulator or external agent tool execution is asserted by this report; findings require separate remediation decisions, and the manifest row remains pending until GitHub Actions report checks have passed.
