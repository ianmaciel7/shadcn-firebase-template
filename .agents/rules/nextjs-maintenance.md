# Next.js maintenance

This project uses Next.js 16.4.2 App Router with Cache Components and Partial
Prefetching. Read the relevant installed `node_modules/next/dist/docs/` guide
before implementation, then consult the immutable
[complete source review](../../docs/agents/nextjs.md). Current canary documents
are references until the installed version supports their APIs.

- Keep rendering and cache rules in
  [CODING_STANDARDS.md](../../CODING_STANDARDS.md#nextjs-request-data-and-caching),
  implemented boundaries in [ARCHITECTURE.md](../../ARCHITECTURE.md#nextjs-rendering-and-cache-model),
  and diagnostic/command ownership in
  [TOOLING.md](../../TOOLING.md#nextjs-documentation-and-cli-workflow).
- Use native Next.js, TypeScript, and Biome diagnostics first. Check the
  existing rule registry before adding custom guards; document scope and test
  invalid and valid cases for a new project policy.
- Preserve the stricter [thin-route policy](nextjs-route-files.md),
  [component contracts](components-contracts.md), cookie-driven unprefixed locale
  architecture, Firebase authorization boundary, and generated-source exclusions.
  Read [the current locale decision](../../ARCHITECTURE.md#internationalization)
  before i18n changes: [ADR 0004](../../docs/adr/0004-configure-internationalization.md)
  requires direct cookie-only locale resolution. Internal locale rewrites
  do not satisfy the maintainer's cookie-only requirement.
- Apply [security guidance](../../SECURITY.md#nextjs-server-and-environment-boundaries)
  when introducing server data, cache scopes, environment values, or endpoints.
  Syntax guards are not authorization or complete import-graph proofs.
- Do not turn an upstream recipe into an automatic dependency, runtime,
  provider, agent-skill, or hosting migration. Preserve accepted ADRs and local
  changes. Follow the [verification strategy](../../TESTING.md#nextjs-documentation-and-framework-verification)
  and report unavailable tools accurately.

- Next.js owns application roots, hydration, compilation and partial prerendering; do not replace them with isolated React DOM recipes. React `cache()` does not establish Next.js cache invalidation policy.
