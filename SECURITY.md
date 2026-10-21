# Security Policy

## Supported versions

Security fixes are applied to the current default branch of this template.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability. Report it
through the repository's private vulnerability-reporting channel when one is
published. This repository does not currently publish a dedicated private
reporting channel. Until one is configured, contact the repository maintainers
through an established private channel before sharing vulnerability details.

Maintainers must enable GitHub private vulnerability reporting or add a direct
private contact here before inviting public security reports.

Include a clear description, affected files or versions, reproduction steps,
impact, and any suggested mitigation. Do not include credentials, access
tokens, or personal data in the report.

Maintainers will acknowledge a valid report, investigate it privately, and
coordinate disclosure and remediation with the reporter.

## Contributor expectations

- Keep secrets in local environment files; never commit `.env*` files or
  credentials.
- Validate and authorize all untrusted input at the server boundary.
- Firebase Web SDK access is still untrusted client input: enforce ownership and
  permitted fields, values, and upload constraints in Firestore and Storage
  Security Rules, not only in UI validation. Current profile rules scope
  `users/{uid}` documents and `users/{uid}/avatar` objects to the matching
  authenticated UID.
- Prefer server-side handling for sensitive operations and minimize data sent
  to Client Components.
- Keep dependencies current and review security advisories before upgrades.
  Dependabot proposes weekly updates; CI runs Semgrep, Gitleaks, `pnpm audit`,
  actionlint, and zizmor. Document any audit exception with its justification,
  scope, and review condition rather than inheriting one you cannot justify.
- **Template-specific accepted risk:** `pnpm-workspace.yaml` suppresses
  `GHSA-vfj7-8cjw-p6xm` for `braces` based on the **template's current,
  development-only and trusted-glob use**. The advisory has no patched release
  in the dependency chain documented here. Before adopting this configuration
  in a derived project, inspect `pnpm why braces`, the full dependency tree
  and any production/runtime exposure; remove the exception as soon as the
  vulnerable dependency is gone. Never assume this acceptance covers new uses.
  Removing the suppression without remediating the dependency will make
  `pnpm audit` fail; do not hide that failure with broad audit exclusions.
- Workflows use least-privilege permissions, full-SHA-pinned actions, and no
  deployment credentials. Keep it that way.
- Treat generated and third-party code as untrusted until reviewed. Vendored
  UI and AI Elements have scoped lint and analysis exceptions; those exceptions
  do not establish security or accessibility correctness. Review changes to
  HTML rendering, executable content, external links, and browser integrations
  at their usage boundaries.
- AI interface components do not configure an AI service, server-side
  authorization, or credentials. A derived application owns those decisions.

The template currently uses Firebase Authentication, Firestore preferences, and
Storage avatars. Projects derived from it must document their own access-control,
data-retention, and incident-response requirements, including changes to these
services or their Security Rules.

## Component registry updates

Registry items become executable application source and may introduce package
dependencies, styles, environment variable placeholders, and additional files.
Schema validation confirms the payload's shape; it does not establish that the
source or its dependencies are safe. Review the resolved project changes with
`shadcn add --dry-run`, `--diff`, or `--view` before installation, following
[TOOLING.md](TOOLING.md#shadcnui-cli-workflow).

Review the explicit registry or repository, requested version/ref, dependencies,
file destinations, and any configuration changes. Prefer an immutable commit
ref for a reviewed GitHub registry update. Keep private registry credentials in
environment variables and reference placeholders in configuration. Never store
live credentials in source inventories, examples, or command output. A public
registry health score is not a security audit.

Client form validation, disabled actions, and route guards do not authorize
Firebase data access. Preserve the existing Firestore and Storage ownership,
field/value, MIME type, and upload-size checks when updating UI source.

## Next.js server and environment boundaries

Server Components do not make all imported modules or returned props private.
Keep privileged server data access in a `server-only` boundary and project only
the fields the client needs. Client Components can render initial HTML on the
server and must still be treated as browser code. `"use server"` identifies
callable Server Functions; it does not establish user or resource permissions.

If a Server Function or Route Handler is introduced, validate untrusted inputs
and authenticate and authorize the operation at its data-access boundary.
Page redirects, client guards, Proxy matchers, hidden buttons, encrypted action
identifiers, and closed-over values do not replace those checks. Review response
serialization, upload limits, error disclosure, and cookie options with the
new endpoint. The current Firebase Web SDK continues to rely on its Security
Rules; Firebase Admin would require a separate server authorization design.

`NEXT_PUBLIC_*` values are public and inlined at build time. Also treat every
entry in `next.config.ts`'s `env` object as public bundle configuration,
regardless of its prefix. This project lists Auth and Firestore emulator host
addresses there; never add credentials, Admin service-account data, private
keys, or session secrets. A prefix-free name in that object is not secret.
Changing a deployment environment does not rewrite already-built public values.

Shared caching must preserve tenant/user isolation and permission changes.
Do not put cookie stores, request headers, tokens, or privileged results into
a shared cache through closures or unresolved promises. Resolve request inputs
outside the cache, authorize access, and deliberately choose cache keys,
returned fields, lifetime, and invalidation. Cache invalidation is not access
control. Private/remote cache examples and taint APIs are optional tools, not
proof that cached data is safe.

For new external image sources, use narrow `remotePatterns`; validate external
URLs and proxy destinations to prevent unintended server requests. A dynamic
nonce-based CSP, instrumentation exporter, or hosting adapter needs a deployment
and rendering review. None is enabled by this documentation update. See the
[official data-security and environment sources](docs/agents/nextjs.md).
