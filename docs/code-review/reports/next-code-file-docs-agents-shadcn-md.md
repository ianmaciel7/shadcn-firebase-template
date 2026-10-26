# Individual source review — `docs/agents/shadcn.md`

## Identification

- Review identity: `next-code-file-docs-agents-shadcn-md`
- Item type: `CODE_FILE`
- Primary path: `docs/agents/shadcn.md`
- Source baseline: `0a4aae9d663220e953b4de7ef88140472c73e5be`
- Next.js / React baseline: 16.4.2 / 19.3.1
- Status: Completed direct static review; CI validation pending

## Scope and evidence

The primary source covers **pinned shadcn documentation applicability**.
Inspected the named file at the recorded branch checkpoint
and compared its stated obligations against related source, tool
configuration and application boundaries where appropriate.

## Verified source observations

- Catalogs 387 upstream shadcn documentation bodies at the recorded source snapshot.
- Compares Base UI, Radix and React Aria variants and marks Base UI as the configured local primitive family.
- Explains local ownership of copied components, registry trust and non-adopted optional recipes.

## Findings and verification boundaries

- External registries or example components should be verified by version and security review before copying; no registry was installed.
No separate independent subagent was invoked for this report.
This static source inspection does not replace runtime, security,
emulator, browser or integration tests.

## Disposition

The primary file was inspected and the scope/limitations recorded.
No additional confirmed blocking defect was established within this
source item alone. Outstanding related items and CI verification
remain tracked separately.
