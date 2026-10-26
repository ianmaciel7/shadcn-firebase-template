# Documentation guide

This guide maps the repository's Markdown documentation to its source of truth.
Project documentation is written in English; locale catalogs use their own
language, as defined in `.agents/rules/language.md`.

## Current guides

| Document | Responsibility | Verify against |
| --- | --- | --- |
| [README](../README.md) | Setup and template adoption | `package.json`, routes, workflows |
| [Architecture](../ARCHITECTURE.md) | Layout, boundaries, and locale behavior | `src/`, `next.config.ts`, `.dependency-cruiser.cjs` |
| [Design](../DESIGN.md) | Implemented tokens, typography, providers, components | CSS, layout, `components.json`, `.ladle/` |
| [Coding standards](../CODING_STANDARDS.md) | Source and test conventions | Biome, TypeScript, accepted decisions |
| [Tooling](../TOOLING.md) | Tools, commands, configuration ownership | `package.json`, configuration, workflows |
| [Testing](../TESTING.md) | Test layers, required Firebase Emulator E2E, CI limitations | Vitest, Playwright, Firebase, Stryker, workflows |
| [Quality enforcement](quality-enforcement.md) | Which tool owns each rule, coverage limits, regressions | Biome, ast-grep, TypeScript AST, Playwright, CI |
| [Biome plugin preview](biome-plugin-preview.md) | Isolated 2.6 preview and migration guard | `biome.preview.json`, pilot fixtures, CI |
| [Contributing](../CONTRIBUTING.md) | Branch, commit, and PR conventions | Commitlint, hooks, CI |
| [Security](../SECURITY.md) | Reporting policy and accepted dependency risk | Audit configuration and security workflow |
| [Glossary](../GLOSSARY.md) | Agreed product vocabulary; currently pending | Adopted product terminology |
| [Entity-relationship diagram](../DER.md) | Pending product model and existing technical Firebase stores | Current SDK modules, Security Rules, and adopted domain constraints |
| [Agent instructions](../AGENTS.md) | Repository-wide contributor guidance | Current guides and agent configuration |
| [React reference](agents/react.md) | Official content inventory, runtime error catalog, applicability review, and all 20 supplied topics with 15 examples | Installed React/DOM/Compiler, official source revision, and lint config |
| [Next.js reference](agents/nextjs.md) | Complete stable/current docs and error-message inventory, compatibility, and lookup workflow | Official source revisions, installed Next.js, current config |
| [shadcn/ui reference](agents/shadcn.md) | Official documentation coverage, source inventory, and lookup workflow | Official source revision and current local configuration |

## Application operations

- [Logging](logging.md): Next.js server errors, authenticated Firebase usage
  events, Cloud Logging queries, and deployment requirements.

## Review snapshots

- [2026-10-23 code review](reviews/2026-10-23-code-review.md): findings,
  reproductions, validation results, and environment limitations for the reviewed
  revision. This is a dated assessment, not a replacement for the current guides.

- [Installed Next.js audit](code-review/README.md): the per-item manifest,
  historical coverage and resumable queue. [Remediation status](code-review/resolutions.md)
  records implemented corrections, remaining findings and revision-specific checks.
  These records do not replace current architecture or coding standards.

## Decisions and agent references

- [ADR index](adr/README.md): accepted template architecture decisions.
  Accepted records preserve their original context; current versions and
  commands belong in the guides above.
- [Agent configuration](../.agents/README.md): three configured MCP servers,
  persistent rules, and enabled integrations.
- [Skill inventory](../.agents/skills/README.md): nine installed skills and
  their provenance. Supporting skill documents remain reusable references
  rather than application configuration.
- [Domain workflow](agents/domain.md) and
  [issue tracker](agents/issue-tracker.md): repository-specific skill context.
- [Agent evaluations](agents/evals.md): scenarios and scoring rubric for
  outcome, scope, safety, evidence, efficiency, and tool selection.

## Updating documentation

Update the guide that owns a changed practice in the same change as its
implementation. When changing an architectural rule, update
[quality enforcement](quality-enforcement.md), the executable fixtures, the
[tool inventory](../TOOLING.md), and the relevant agent rule in the same PR.
Never document planned behavior as a passing CI check. Check cross-references when renaming paths, adding scripts,
changing locale behavior, or upgrading tools. Preserve accepted ADRs without
rewriting or renumbering them. Record a changed architectural decision in a new
ADR and update the ADR index with its supersession scope. Documentation
clarifications and upstream reference refreshes alone do not require an ADR.

For documentation changes, run:

```bash
pnpm check:markdown
pnpm check:spelling
```

Also verify relative links, referenced files, and command names. The configured
Markdown check excludes `.agents/`, `AGENTS.md`, and ADRs 0001–0005; exclusions
do not remove the need for manual review. Broader CI remains configured on
pull requests even when only Markdown changes.
