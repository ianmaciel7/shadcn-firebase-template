# Individual source review — `CODING_STANDARDS.md`

## Identification

- Review identity: `next-code-file-coding-standards-md`
- Item type: `CODE_FILE`
- Primary path: `CODING_STANDARDS.md`
- Source baseline: `0a4aae9d663220e953b4de7ef88140472c73e5be`
- Next.js / React baseline: 16.4.2 / 19.3.1
- Status: Completed direct static review; CI validation pending

## Scope and evidence

The primary source covers **enforced project development standards**.
Inspected the named file at the recorded branch checkpoint
and compared its stated obligations against related source, tool
configuration and application boundaries where appropriate.

## Verified source observations

- Defines the authority sequence AGENTS.md, accepted ADRs, executable tool configuration, then coding guidance.
- Prescribes React hook and state modeling, compound shadcn form APIs, dependency inversion, owned component naming and cross-boundary behavior.
- Documents renderer/caching/Compiler, async lifecycle and AI SDK integration constraints with distinct lint and test owners.

## Findings and verification boundaries

- Repository-specific policies such as thin route files and filename-coupled hooks are not universal framework requirements; behavior requires executed tests.
No separate independent subagent was invoked for this report.
This static source inspection does not replace runtime, security,
emulator, browser or integration tests.

## Disposition

The primary file was inspected and the scope/limitations recorded.
No additional confirmed blocking defect was established within this
source item alone. Outstanding related items and CI verification
remain tracked separately.
