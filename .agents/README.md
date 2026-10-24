# Agent configuration

Project-local instructions, MCP configuration, and reusable skills.

## Configured integrations

`.agents/agents.json` enables Codex, Claude, Claude Desktop, Gemini, Cursor,
and Antigravity, with `syncMode` set to `source-only`.

| MCP server | Command | Purpose |
| --- | --- | --- |
| Serena | `node .agents/scripts/serena-stdio-guard.mjs serena start-mcp-server --project-from-cwd --context=codex` | Project-local semantic symbol analysis; closes Serena's process tree when the stdio client disconnects |
| Next.js DevTools | `pnpm exec next-devtools-mcp` | Runtime diagnostics and route inspection |

These are configured servers, not a statement that the executables are
installed or that runtime connectivity has been verified. Serena and the
Agents CLI are host tools; `next-devtools-mcp` is a project dependency.

## Installed skills

The repository contains seven skills: `ask-matt`, `context7-cli`,
`firebase-basics`, `firebase-auth-basics`, `save`, `setup-matt-pocock-skills`,
and `shadcn`. See the
[skill inventory](skills/README.md) for entrypoints and provenance.

Persistent rules cover [language](rules/language-conventions.md),
[ADR history](rules/adr-conventions.md), [component contracts](rules/components-contracts.md),
[component composition](rules/components-composition.md),
[compound forms](rules/forms-architecture.md),
[data modules](rules/data-layer.md),
[route entrypoints](rules/nextjs-route-files.md), and
[shadcn/ui maintenance](rules/shadcn-ui-maintenance.md), and
[Serena external-research memory](rules/serena-external-research-memory.md). The
[shadcn/ui reference](../docs/agents/shadcn.md) records upstream coverage.

## Source and local files

- `agents.json`: enabled integrations, MCP servers, and workspace behavior.
- `skills/*/SKILL.md`: reusable skill instructions and supporting references.
- `rules/*.md`: persistent guidance for coding agents.
- [AGENTS.md](../AGENTS.md): canonical repository instructions.
- `local.json`: private machine-specific overrides and secrets; do not commit.

## Maintenance workflow

Use the externally provided Agents CLI when changing configuration or reusable
skill instructions:

```bash
agents status
agents sync
agents sync --check
```

When introducing a server, also run `agents mcp test --runtime`. Do not add
unrequested servers or approve package-provided agent skills (ADR 0007).

Generated tool configuration and local state must remain untracked. The
selected integrations and sync mode determine the materialized outputs; use
`agents status` instead of assuming every supported output exists.

The [Next.js maintenance rule](rules/nextjs-maintenance.md) connects the version-matched
installed docs to the [complete source review](../docs/agents/nextjs.md).
Use that reference for App Router, Cache Components, and framework diagnostic
ownership; existing route and component rules retain their stricter scope.

The [React maintenance rules](rules/react-hooks-core.md) (`react-hooks-and-apis`, `react-dom-and-server`, `react-quality-and-review`) link current official sources to
installed runtime/Compiler support and canonical guidance. The
[React review](../docs/agents/react.md) records complete content coverage and
the separate versioned error catalog. Its detailed reference preserves all
20 user-supplied topics and 15 examples; the rule contains matching
implementation/review guidance for each topic.
