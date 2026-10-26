# Agent rules index

Index of the persistent rules in `.agents/rules/`. Each rule file stays under 12,000
characters; use single-word `<topic>.md` filenames by default, or
`<topic>-<scope>.md` when a rule family is split across multiple files
(`react.md`, `react-dom.md`, `react-quality.md`) to stay within the per-file
budget.

## Architectural boundary: `.agents/rules/` vs `docs/`

- **`.agents/rules/` (Behavioral constraints for agents)**:
  - Contains **prescriptive, enforce-everywhere agent guardrails and constraints**.
  - Dictates *how agents must behave, write, and verify code* across the codebase (e.g. naming, file limits, thin routes, language, framework patterns).
  - Kept concise and machine-actionable to conserve prompt context.
- **`docs/` (Human and domain documentation & system operations)**:
  - Contains **descriptive reference documentation, operational guides, and history**.
  - Maps system architecture ([`docs/README.md`](../../docs/README.md)), verification ownership ([`docs/quality.md`](../../docs/quality.md)), operational services ([`docs/observability.md`](../../docs/observability.md)), immutable decisions ([`docs/adr/`](../../docs/adr/)), upstream inventories ([`docs/agents/`](../../docs/agents/)), and review snapshots ([`docs/reviews/`](../../docs/reviews/)).
  - Intended for human engineers, onboarding, production operations, and authoritative reference.

## Rule catalog

| Topic | Rule | Scope |
| --- | --- | --- |
| ADRs | [adr.md](adr.md) | ADR naming and immutability |
| Components | [components.md](components.md) | Dimensions, file contracts, term parity, CI enforcement |
| Composition | [composition.md](composition.md) | shadcn/ui composition, orchestration hooks, banned terms, placement |
| Data layer | [data.md](data.md) | Data modules, DAL, auth, dependency injection |
| Forms | [forms.md](forms.md) | Compound forms and React Hook Form conventions |
| Language | [language.md](language.md) | Documentation and comments language |
| Next.js | [nextjs.md](nextjs.md) | Version-matched docs and framework ownership |
| React | [react.md](react.md) | Hooks, built-in components, core APIs, identity |
| React DOM | [react-dom.md](react-dom.md) | React DOM, forms and Actions, Server Components, Fragment refs |
| React quality | [react-quality.md](react-quality.md) | Compiler, Rules of React, lint, legacy APIs, checklist |
| Routes | [routes.md](routes.md) | Thin route entrypoints |
| Serena | [serena.md](serena.md) | Cache-first external research and durable memory policy |
| shadcn/ui | [shadcn.md](shadcn.md) | shadcn/ui maintenance workflow |

See also [README.md](../README.md) and [AGENTS.md](../../AGENTS.md).
