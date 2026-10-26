# Evaluation item review queue

Ten new evaluation inventory items were inspected individually at source baseline `433ea4585a9fcd5b85b9c3e94c466681d43db7c8`. Their status is Completed following Markdown, English, spelling, integrity, TypeScript and regression validation in [run 40134977622](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40134977622). The evaluation scripts were read, not executed against an external agent. Missing runtime verification and identified low-severity runner risks remain documented per item.

- `evals/`
- `evals/general/`
- `evals/tool-usage/`
- `scripts/evals/`
- `docs/agents/evals.md`
- `evals/general/read-only-core.txt`
- `evals/tool-usage/cases.json`
- `evals/tool-usage/receipt.schema.json`
- `scripts/evals/run-tool-usage-evals.mjs`
- `scripts/evals/run-tool-usage-evals.test.mjs`

## Current verification status (2026-10-26)

The evaluation runner's negative cases now have regression coverage, and
`pnpm test:evals` is part of the repository's focused verification suite.
That validates trace scoring and missing-CLI behavior, not real tool usage.
The original ten item reports remain historical static inspections.

A live `pnpm eval:tool-usage` run requires a host with an authenticated
Codex CLI, the expected MCP servers (Context7, browser/Playwright,
Next.js DevTools, Serena or Graphify), and access to the application
needed by each scenario. Preserve actual JSONL traces and per-case receipts,
including failed or unavailable tools; do not record success without them.
