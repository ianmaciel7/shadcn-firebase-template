# Agent rules index

Index of the persistent rules in `rules/`. Each rule file stays under 12,000
characters; use concise `<topic>.md` filenames (or `<topic>-<scope>.md` when a
rule is split to stay within the per-file budget).

| Topic | Rule | Scope |
| --- | --- | --- |
| Language | [language.md](language.md) | Documentation and comments language |
| ADRs | [adr.md](adr.md) | ADR naming and immutability |
| Components | [components.md](components.md) | Dimensions, file contracts, term parity, CI enforcement |
| Components | [composition.md](composition.md) | shadcn/ui composition, orchestration hooks, banned terms, placement |
| Forms | [forms.md](forms.md) | Compound forms and React Hook Form conventions |
| Data layer | [data.md](data.md) | Data modules, DAL, auth, dependency injection |
| Next.js | [nextjs.md](nextjs.md) | Version-matched docs and framework ownership |
| Routes | [routes.md](routes.md) | Thin route entrypoints |
| shadcn/ui | [shadcn.md](shadcn.md) | shadcn/ui maintenance workflow |
| Serena | [serena.md](serena.md) | Cache-first external research and durable memory policy |
| React | [react.md](react.md) | Hooks, built-in components, core APIs, identity |
| React | [react-dom.md](react-dom.md) | React DOM, forms and Actions, Server Components, Fragment refs |
| React | [react-quality.md](react-quality.md) | Compiler, Rules of React, lint, legacy APIs, checklist |

See also [README.md](../README.md) and [AGENTS.md](../../AGENTS.md).
