# Agent configuration

Project-local instructions, MCP configuration, and reusable skills.

## Configured integrations

`.agents/agents.json` enables Codex, Claude, Claude Desktop, Gemini, Cursor,
and Antigravity, with `syncMode` set to `source-only`.

| MCP server | Command | Purpose |
| --- | --- | --- |
| Serena | `node .agents/scripts/serena-stdio-guard.mjs serena start-mcp-server --project-from-cwd --context=codex` | Project-local semantic symbol analysis; closes Serena's process tree when the stdio client disconnects |
| Next.js DevTools | `pnpm exec next-devtools-mcp` | Runtime diagnostics and route inspection |
| Playwright | `pnpm dlx @playwright/mcp@0.0.83` | Browser automation for verifying UI changes |

These are configured servers, not a statement that the executables are
installed or that runtime connectivity has been verified. Serena and the
Agents CLI are host tools; `next-devtools-mcp` is a project dependency.

## Installed skills

The repository contains nine skills: `ask-matt`, `context7-cli`,
`firebase-basics`, `firebase-auth-basics`, `project-new-component`, `project-save`,
`setup-matt-pocock-skills`, `shadcn`, and `project-verify`. See the
[skill inventory](skills/README.md) for entrypoints and provenance.

Persistent rules are consolidated in [rules/rules.md](rules/rules.md), covering language,
ADR history, component contracts, component composition, compound forms,
data modules, route entrypoints, Next.js maintenance, React implementation,
shadcn/ui maintenance, and Serena external-research memory. Section 14 of
[rules/rules.md](rules/rules.md#14-shadcnui-maintenance) records upstream coverage and Base UI boundaries.

## Source and local files

- `agents.json`: enabled integrations, MCP servers, and workspace behavior.
- `skills/*/SKILL.md`: reusable skill instructions and supporting references.
- `rules/rules.md`: persistent guidance for coding agents.
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

The [Next.js maintenance rule](rules/rules.md#8-nextjs-maintenance) connects the version-matched
installed docs in `node_modules/next/dist/docs/` to the consolidated rules.
Use that reference for App Router, Cache Components, and framework diagnostic
ownership; existing route and component rules retain their stricter scope.

The [React maintenance rules](rules/rules.md#9-react-core-hooks-component-primitives-and-core-apis) link current official sources to
installed runtime/Compiler support and canonical guidance. The rules contain
implementation and review guidance covering all 20 topics across React Core,
React DOM, and React Quality.
