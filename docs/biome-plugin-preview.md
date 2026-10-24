# Biome plugin preview

This is an **isolated proof of concept**; the application's supported linter
remains Biome 2.5.15. ESLint is neither used nor installed.

Biome 2.6 introduced JavaScript lint plugins, currently labeled **Developer
Preview**. The file-based pilot uses `ctx.filePath` and the semantic
model to reject *exported function components* whose names do not match the
filename's PascalCase root (compound parts like `ProfileCardHeader` are
permitted in `profile-card.tsx`).

To exercise the pilot, run the CI step `Biome 2.6 plugin pilot`. The step
uses a temporary `pnpm dlx @biomejs/biome@2.6.2` executable, a separate
`biome.preview.json`, and valid/invalid fixtures. CI verifies that the
valid fixtures and the owned project components pass, and invalid fixtures fail **for the expected
plugin diagnostic**, not merely due to a parse/config error.

**Production source is now scanned in CI as a preview check.** Keep
`scripts/checks/check-component-conventions.mjs` as the source of truth for the
following cases until corresponding plugin tests exist: missing root export;
aliases and re-exports; all local component declarations; props types,
parameter forwarding, and compound component composition. The experiment only enforces exported function name/filename parity,
alongside the mature checker. It does not cover private hook file names,
named hook exports, missing component roots, props forwarding, or native
React hook semantics. Keep those with their current owners.

If successful, a later change can upgrade the pinned Biome dependency and
regenerate `pnpm-lock.yaml` using pnpm, then run the complete suite before
removing the redundant part of the Node checker.

Documentation: [Biome linter plugins](https://biomejs.dev/linter/plugins/)
