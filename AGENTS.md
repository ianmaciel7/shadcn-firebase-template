# Agent instructions

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Mission

Deliver correct, maintainable changes with minimal risk.

## Scope

- Respect repository architecture and conventions.
- Keep edits focused; avoid unrelated refactors.
- Never commit secrets.

## Engineering Rules

- Validate changes with relevant checks before final delivery.
- Surface assumptions and edge cases explicitly.
- Prefer reversible changes and deterministic outputs.

## MCP & Skills

- MCP server definitions: `.agents/agents.json`
- Local MCP overrides/secrets: `.agents/local.json`
- Project skills: `.agents/skills/*/SKILL.md`

## MCP & Skills workflow

1. Add or update MCP entries in `.agents/agents.json`.
2. Keep reusable instructions in `.agents/skills/*/SKILL.md`.
3. Run `agents sync` after changes.
4. Use `agents sync --check` in CI or before opening a PR.
5. Use `agents mcp test --runtime` when introducing new servers.

## Workflow

1. Plan briefly.
2. Implement minimal viable change.
3. Validate (lint/tests/build/smoke as needed).
4. Report results and residual risks.

## Project documentation

- `docs/README.md`: documentation ownership and maintenance guide.
- `DESIGN.md`: implemented tokens, typography, and component design reference.
- `ARCHITECTURE.md`: repository layout and application boundaries.
- `CODING_STANDARDS.md`: conventions for TypeScript, React, Next.js, UI, and i18n.
- `TOOLING.md`: package manager, commands, and configuration ownership.
- `TESTING.md`: required validation and test strategy.
- `SECURITY.md`: vulnerability reporting and secure contribution practices.
- `CONTRIBUTING.md`: branch, commit, release, and pull-request conventions.
- `GLOSSARY.md`: agreed domain terminology; preserve its pending status until
  product-specific terms are resolved.
- `DER.md`: pending product entity-relationship diagram and the existing
  technical Firebase persistence boundary.
- `.agents/rules/adr-naming.md`: naming and immutability policy for future
  architecture decision records.

Accepted ADRs are historical records; use `docs/adr/README.md` and current
configuration to identify later operational changes. The seven installed skills
and two configured MCP servers are indexed in `.agents/README.md`.

Read the documentation relevant to the change before editing it. Keep these
documents and the relevant ADR current when a durable project practice changes.

## Agent skills

### Issue tracker

GitHub issues via `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context (`GLOSSARY.md` + `docs/adr/`). See `docs/agents/domain.md`.

## shadcn/ui documentation workflow

Before UI work, read `.agents/rules/shadcn-ui.md` and load the installed
`.agents/skills/shadcn/SKILL.md`. The project uses Base UI (`base-nova`), not
the API of another primitive family. Current CLI commands belong in
`TOOLING.md`; component contracts belong in `CODING_STANDARDS.md`; theme and
composition details belong in `DESIGN.md`.

`docs/agents/shadcn.md` records the official documentation review, complete
source inventory, and applicability boundaries. Use the installed CLI and
current component documentation before changing copied source. Report
unavailable network lookups or host tools without claiming they passed.

When `/save` is requested, use `.agents/skills/save/SKILL.md` to persist verified
knowledge in its canonical document. Preserve accepted ADRs and local changes;
document a new architectural decision in a new ADR when one is actually made.

## Composition applies across runtime boundaries

Apply the [compound component contract](CODING_STANDARDS.md#compound-components-and-serverclient-boundaries) to all
owned components, both Server and Client. Composition and runtime are separate
axes; a missing `"use client"` directive does not classify a shared module's
complete import graph. `pnpm check:components` enforces the documented subset
with regression cases for both boundary and directive-free modules.

## Next.js documentation workflow

Before Next.js changes, read [.agents/rules/nextjs.md](.agents/rules/nextjs.md)
and the relevant installed `node_modules/next/dist/docs/` guide. The complete
[Next.js source review](docs/agents/nextjs.md) records the stable and current
upstream revisions, including error guides. Match guidance to installed
Next.js 16.4.2, App Router, Cache Components, and Partial Prefetching.

Use native Next.js, TypeScript, and Biome diagnostics before adding custom
rules. Keep the existing thin-route and component policies distinct from
framework requirements. Save verified findings in the canonical guides;
upstream documentation does not authorize dependency upgrades, new agent
skills, hosting configuration, or migration to another rendering model.

## React documentation workflow

For React changes, read [.agents/rules/react.md](.agents/rules/react.md) and
[the complete official-source review](docs/agents/react.md). Verify installed
React/React DOM 19.3.1 and Compiler 1.0.0 support before adopting live examples.
Keep React's rules distinct from stricter repository orchestration conventions.
Use native Biome diagnostics, the existing guards, and appropriate lifecycle /
browser tests; do not claim coverage of every upstream ESLint or Compiler rule.
Persist verified findings with the [save skill](.agents/skills/save/SKILL.md)
in their canonical guide, preserving accepted ADRs and local changes.
