# shadcn/ui documentation reference

## Reviewed source and coverage

Retrieved on **2026-10-21** from the official
[shadcn-ui/ui repository](https://github.com/shadcn-ui/ui), revision
`ba1503c64472b82256d9de95e2e62c5901a38e8b`. The
[source inventory](shadcn-sources.json) identifies all **387 Markdown/MDX
documents** under `apps/v4/content/docs` at that revision, each with an
immutable source URL and Git blob SHA. All 387 source bodies were retrieved;
the inventory excludes component implementation files and documents elsewhere
in the upstream repository.

The review maps these documents to this project's configuration, separates the
three primitive families, and applies the relevant operational guidance to the
canonical guides below. Retrieval is not proof that every upstream recipe is
installed, compatible, or exercised in this application. Historical changelog
entries describe their release context; some overview/form examples retain
older styles and APIs. Verify local source, installed types, and the matching
component variant before adopting a recipe.

| Source group | Files | Applicability |
| --- | ---: | --- |
| Root guides | 19 | Introduction, CLI, configuration, themes, typeset, skills, MCP, package imports, monorepos, legacy and supporting guides |
| Components | 199 | 66 Base UI, 67 Radix, 65 React Aria, and one index; Base UI matches this project |
| AI Elements | 64 | 21 patterns per primitive family plus one introduction; evaluate existing local wrappers before migration |
| Changelog | 58 | Historical context through October 2026; changes do not automatically migrate copied source |
| Installation | 11 | Next.js applies; other frameworks and manual setup are references |
| Dark mode | 6 | Next.js and the overview apply; other framework guides are references |
| Forms | 5 | Field and React Hook Form apply; alternative libraries and Server Actions are references |
| Registry | 15 | Consumption and trust apply; publishing, schemas, programmatic APIs, and monitoring remain references |
| RTL | 4 | Reviewed as a migration option; the project currently sets `rtl: false` |
| React primitives | 2 | Headless Message Scroller and Questionnaire APIs; use when the installed component requires them |
| Helpers | 2 | AI SDK and TanStack AI fixture/transport recipes; neither helper is configured by this review |
| Utilities | 2 | Scroll-fade and shimmer recipes; shared CSS availability comes from the installed package |

## Canonical project documents

| Knowledge | Owner |
| --- | --- |
| Tokens, fonts, radius, theme provider, component composition | [DESIGN.md](../../DESIGN.md) |
| Component APIs, semantics, props, forms, and localization | [CODING_STANDARDS.md](../../CODING_STANDARDS.md) |
| CLI commands, versions, configuration, and limitations | [TOOLING.md](../../TOOLING.md#shadcnui-cli-workflow) |
| Source distribution, application layers, client boundaries | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Behavior, browser, accessibility, and visual verification | [TESTING.md](../../TESTING.md#shadcnui-update-verification) |
| Registry trust, dependencies, credentials, authorization | [SECURITY.md](../../SECURITY.md#component-registry-updates) |
| Branches, commits, review evidence | [CONTRIBUTING.md](../../CONTRIBUTING.md) |
| Agent constraints and preservation workflow | [shadcn/ui rule](../../.agents/rules/shadcn-ui.md), [save skill](../../.agents/skills/save/SKILL.md) |

Keep these as separate sources of truth instead of copying the same rule into
each guide. The inventory is an evidence index, not another application config.

## Current project context

`components.json` selects `base-nova`, neutral CSS-variable colors, Lucide,
TypeScript, RSC support, LTR, and `@/*` import aliases. Tailwind v4 reads
`src/app/globals.css`; `tailwind.config` is intentionally empty. Base UI is
confirmed by the installed primitive imports. `src/lib/utils.ts` re-exports
`cn` from the `cn` package. The root layout mounts the Base UI `Toaster`.

The project consumes the built-in registry and explicitly configures
`@firebase`. It does not configure a registry publisher, shadcn MCP server,
package-import aliases, or a shared UI workspace. Installed skills and
configured MCP servers are indexed in [.agents/README.md](../../.agents/README.md).

## How to consult and refresh upstream

1. Read the target's local source and current `components.json`. Use the
   package runner and inspection commands in `TOOLING.md`; do not infer an API
   from a component name or a dependency's presence alone.
2. Obtain the component's docs/API URLs with the CLI and read the correct Base
   UI page. Use Context7 for current library questions, resolving the library
   ID first. Use official source pages when CLI network access is unavailable
   and report that limitation.
3. For source comparisons and updates, use the CLI's project-aware dry run and
   diff. Reading upstream MDX for documentation research does not replace this
   workflow for component implementation updates.
4. For a complete documentation refresh, resolve the upstream revision and list
   every `.md`/`.mdx` file under `apps/v4/content/docs`. Require a non-truncated
   tree response; retrieve each file at that revision, checking for failures.
   Update the inventory's revision, retrieval date, counts, URLs, and blob SHAs
   together. Compare the returned bodies and family-specific guidance with
   local code before changing project rules.
5. Apply verified findings to the canonical owners, preserving accepted ADRs,
   external skill provenance, and unrelated working-tree changes. A new
   architectural choice needs its own ADR; an upstream refresh alone does not.
6. Run the documentation checks in `TESTING.md`, verify local links and CLI
   command names, and follow the Agents CLI synchronization workflow when
   available. Report actual outcomes and unavailable checks separately.

The [official llms.txt index](https://ui.shadcn.com/llms.txt) is a useful entry
point, but it is not evidence of complete current coverage. It may omit newer
families, components, and guides. The inventory at the recorded revision is the scope record
for this review; it must be refreshed when upstream changes are adopted.

## Component-family and update findings

- The [Base UI Button guide](https://ui.shadcn.com/docs/components/base/button)
  distinguishes button actions from links. Use `buttonVariants` on a real link
  to preserve navigation semantics; `render` does not turn button behavior into
  link behavior.
- [Card](https://ui.shadcn.com/docs/components/base/card) exposes composable
  parts, a small size, and shared `--card-spacing`. Keep application wrappers
  composable; upstream does not require our filename or export-count guards.
- [Field](https://ui.shadcn.com/docs/components/base/field) and
  [React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form) describe
  labels, grouped controls, validation state, and error display. The form guide
  contains older styled examples; use local Base UI control types instead of
  copying variant-specific props. Our compound `FormProvider` policy is local.
- [Base UI Toast](https://ui.shadcn.com/docs/components/base/toast) uses its
  own manager and `Toaster`. Deprecation notices for the Radix/React Aria toast
  pages do not deprecate this project's Base UI implementation.
- The [September cn change](https://ui.shadcn.com/docs/changelog/2026-09-cn)
  is already represented in local code. The old `twMerge(clsx(...))` helper
  is not the current default. No migration was needed for this review.
- The [October AI Elements release](https://ui.shadcn.com/docs/changelog/2026-10-ai-elements)
  introduces patterns on Trace, Code Block, and chat primitives, with guidance
  for earlier AI SDK Elements wrappers. Existing copied components continue
  to work; a documentation review does not replace their implementation.

## Reference areas outside the current implementation

Installation and dark-mode recipes for Vite, Astro, Remix, Gatsby, Laravel,
React Router, and TanStack projects do not change this Next.js application.
JavaScript, Tailwind v3, package imports, monorepos, React Aria, Radix,
TanStack Form, Formisch, and Next.js Server Action examples remain comparison
material until deliberately adopted.

Registry documentation covers schema-driven items and dependencies, namespaces,
GitHub refs, private authentication, dynamic search, health/ranking, includes,
publishing, MCP, and programmatic APIs. These capabilities do not imply that
this repository operates a registry. Validate trust and actual configuration
before applying an example. A schema-valid item or good health score does not
establish source security.

Headless chat primitives, AI fixture helpers, scroll effects, typeset, and RTL
examples each have their own behavior and dependencies. Read their documented
fallbacks and accessibility requirements before using them. Avoid recreating
scroll anchoring or questionnaire behavior already supplied by a suitable
installed primitive; do not add packages solely because they appear in this
inventory.
