# shadcn/ui maintenance

Apply this rule to UI work and shadcn/ui documentation updates. Load
[../skills/shadcn/SKILL.md](../skills/shadcn/SKILL.md) for the upstream workflow. This file adds repository
context; it does not replace or duplicate the upstream rule examples.

## Establish project context

- Inspect `components.json`, `package.json`, the target local source, and the
  CLI's project information. This project uses `base-nova` with Base UI,
  Tailwind v4, Lucide, TypeScript, and the `@/*` aliases.
- Run the installed CLI through pnpm. Obtain and read component docs before
  advising on or changing an API. Follow [TOOLING.md](../../TOOLING.md#shadcnui-cli-workflow).
- Read the Base UI variant. Do not infer `asChild`, Radix state attributes,
  Sonner, or React Aria props from a generic example. Installed component
  source and primitive types define the API available to this project.
- When a lookup fails, report it and use accessible official documentation or
  the installed source. Do not claim an unavailable CLI or network check passed.

## Preserve owned source

- Reuse installed primitives and named parts before creating custom UI.
  Keep application adapters in owned component directories and preserve their
  native props, children, refs, slots, and semantics.
- Preview source updates with `add --dry-run`, `--diff`, or `--view`. Review
  imports, dependency changes, CSS, and each resolved file; preserve local
  adaptations. Do not fetch raw upstream component files to bypass CLI
  transforms or silently use `--overwrite`.
- Treat preset, primitive-family, icon, RTL, and AI Elements migrations as
  separate scoped implementation work. A request to refresh documentation does
  not perform these migrations or install a new MCP server.

## Persist verified knowledge

- `DESIGN.md` owns theme and visual composition; `CODING_STANDARDS.md` owns
  component/API conventions; `TOOLING.md` owns commands; `TESTING.md` and
  `SECURITY.md` own their validation and trust boundaries.
- `docs/agents/shadcn.md` owns the upstream applicability map and source
  inventory. Record a revision and retrieval date when refreshing it.
- Label repository guards as repository policy. Upstream examples do not
  require our filenames, one primary export, profile hook layout, or every
  compound form's Provider boundary.
- Preserve accepted ADRs, upstream skill provenance, and unrelated local work.
  Apply the local `save` skill for `/save`; run documentation checks and agent
  synchronization when available, reporting any missing host tool.
