# Agent rules index

Index of the persistent rules in `rules/`. Each rule file stays under 12,000
characters; split by context using the `<topic>-<context>.md` naming pattern.

| Topic | Rule | Scope |
| --- | --- | --- |
| Language | [language-conventions.md](language-conventions.md) | Documentation and comments language |
| ADRs | [adr-conventions.md](adr-conventions.md) | ADR naming and immutability |
| Components | [components-contracts.md](components-contracts.md) | Dimensions, file contracts, term parity, CI enforcement |
| Components | [components-composition.md](components-composition.md) | shadcn/ui composition, orchestration hooks, banned terms, placement |
| Forms | [forms-architecture.md](forms-architecture.md) | Compound forms and React Hook Form conventions |
| Data layer | [data-layer.md](data-layer.md) | Data modules, DAL, auth, dependency injection |
| Next.js | [nextjs-maintenance.md](nextjs-maintenance.md) | Version-matched docs and framework ownership |
| Routes | [nextjs-route-files.md](nextjs-route-files.md) | Thin route entrypoints |
| shadcn/ui | [shadcn-ui-maintenance.md](shadcn-ui-maintenance.md) | shadcn/ui maintenance workflow |
| React | [react-hooks-core.md](react-hooks-core.md) | Hooks, built-in components, core APIs, identity |
| React | [react-dom-server.md](react-dom-server.md) | React DOM, forms and Actions, Server Components, Fragment refs |
| React | [react-quality.md](react-quality.md) | Compiler, Rules of React, lint, legacy APIs, checklist |

See also [README.md](../README.md) and [AGENTS.md](../../AGENTS.md).
