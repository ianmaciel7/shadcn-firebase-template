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
