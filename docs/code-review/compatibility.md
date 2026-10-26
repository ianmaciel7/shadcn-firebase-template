# Next.js compatibility

## Current source baseline

- Installed Next.js version: **16.4.2**, with React **19.3.1**.
- Documentation source: `node_modules/next/dist/docs/` matching that
  installed version, not the evolving canary branch.
- Framework usage: App Router in `src/app/`, Cache Components and Partial
  Prefetching; cookie-selected locale without a route prefix or Proxy.
- The root `IntlDocumentServer` resolves the locale behind a suspense
  boundary and renders the server HTML `lang`. Production-mode browser tests
  also check the first HTML element of the HTTP response.
- Firebase Auth roles and privileged server sessions are validated separately
  from the client navigation gate.

## Audited scope and its meaning

The active manifest contains **514 documentation items**, **697 project
items**, and **one coordinator**, each with a completed individual static
report. The inventory guard checks the manifest and reports against the
tracked project tree and installed documentation.

All configured CI checks passed on `main` at commit `0d6574d`
([run 40344252388](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40344252388)):
type checking, unit/browser/emulator tests, build, security, and accessibility.
This shows the configured surfaces work, not that every optional Next.js
feature or a hosted deployment has been certified.

Pages Router, Proxy, and unused platform features are not required to be
implemented just because their documentation was inspected.
The two upstream Next.js navigation gaps are mitigated by
[installed documentation navigation](installed-next-navigation.md), which
does not modify `node_modules`.

## Remaining evidence boundaries

- Production hosting, production identity flows, deployment credentials,
  operational behavior and availability are not established by static
  reports or the local Firebase emulator. Use the opt-in HTTPS production
  smoke verification and document which environment was checked.
- Real external Codex/MCP evaluation calls require a configured agent host.
  The local deterministic evaluator and its tests cannot substitute for them.
- The per-item reports may refer to historical source checkpoints. Read
  [finding dispositions](resolutions.md) for current fixes and preserve
  archived evidence in [README](README.md).

See [ADR 0004](../adr/0004-configure-internationalization.md) and
[ADR 0009](../adr/0009-integrate-firebase-authentication.md)
for accepted architectural decisions.
