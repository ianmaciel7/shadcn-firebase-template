# Post-audit recommendations

<!-- cspell:ignore DOCSTART DOCUPGRADE -->

The active inventory has **1,214 completed individual source/documentation
reports** (514 installed Next.js documentation items, 699 project items,
and one coordinator). Completion means a static report exists and passed
inventory checks; it is not proof that 1,212 independent agents ran.
See [README](README.md), [findings](findings.md), and
[remediation status](post-audit-remediation.md).

## Implemented and verified in repository CI

- The root document language follows the cookie-selected locale. Raw server
  response checks and browser tests cover English, Portuguese, and Spanish.
  ADR 0004 continues to prohibit locale route segments and Proxy rewrites.
- Firebase role mutation rechecks revoked ID tokens and current administrator
  claims. Server-side verification occurs at request time.
- Service Worker navigation degrades safely when token refresh fails.
- React, accessibility, tooltip composition, code caching, context pricing,
  JSX stream repair and component guard fixes have regression coverage.
- The external evaluation runner's deterministic unit tests reject missing
  executables and unsupported success evidence.
- Local documentation navigation mitigates two upstream Next.js index gaps;
  its link completeness is checked against the installed version.

The exact source changes, limitations, and linked verification belong in
[resolutions.md](resolutions.md) and
[post-audit-remediation.md](post-audit-remediation.md).
The full CI passed for commit `0d6574d`
([run 40344252388](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40344252388)).
That is not evidence of a deployed production system.

## External verification still needed

- **Production deployment:** use the opt-in production smoke job on the CI
  workflow with an explicitly supplied HTTPS deployment URL. Confirm the
  environment under test is the intended release and separately exercise
  authenticated flows with appropriate test accounts. A successful local
  browser/emulator run does not prove production auth or hosting.
- **Actual agent/tool execution:** the repository's `pnpm eval:tool-usage`
  needs an explicitly provisioned Codex CLI, credentials and configured MCP
  tools. Unit tests validate the runner, not live agent behavior. Record
  trace receipts before claiming real external evaluations passed.
- **Upstream documentation:** `DOCSTART-001` and `DOCUPGRADE-001` belong to
  installed Next.js editorial indexes. The repository has complete local
  links; a change to the upstream Next.js package requires an upstream
  contribution or dependency release.

No application-code change should be made solely to turn an external
limitation into a false green status. Follow
[agent evaluation guidance](../agents/evals.md) for real runs.
