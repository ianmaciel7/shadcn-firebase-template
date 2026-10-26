# Agent rules index

Index of the persistent rules in `rules/`. Each rule file stays under 12,000
characters; use single-word `<topic>.md` filenames by default, or
`<topic>-<scope>.md` when a rule family is split across multiple files
(`react.md`, `react-dom.md`, `react-quality.md`) to stay within the per-file
budget.

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
