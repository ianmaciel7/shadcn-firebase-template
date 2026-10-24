# Individual source review — `evals/`

<!-- cspell:ignore JSONL Codex -->

## Identification

- **Full subagent name:** `next-code-folder-evals`
- **Type:** `CODE_FOLDER`
- **Primary path:** `evals/`
- **Source baseline:** `433ea4585a9fcd5b85b9c3e94c466681d43db7c8`
- **Status:** Reviewed draft; automated validation pending.

## Scope and evidence

Evaluation fixture root. This report addresses the one named inventory item only, not neighboring files or the entire installed Next.js documentation corpus.

## Correct behavior observed in source

Separates general read-only prompts from tool-selection fixtures and keeps evaluation inputs outside application runtime code.

## Findings and limitations

The quoted attack content in a descendant fixture is untrusted test data rather than an instruction. No folder-boundary defect was established.

## Recommended follow-up

Confirm subfolder file ownership and do not import fixture content into user-facing production routes.

## Conclusion

The named source item was inspected individually. No runtime, emulator or external agent tool execution is asserted by this report; findings require separate remediation decisions, and the manifest row remains pending until GitHub Actions report checks have passed.
