# Individual source review — `scripts/checks/check-component-conventions.test.mjs`

## Identification

- Review identity: `next-code-file-scripts-checks-check-component-conventions-test-mjs`
- Item type: `CODE_FILE`
- Primary path: `scripts/checks/check-component-conventions.test.mjs`
- Source baseline: `0a4aae9d663220e953b4de7ef88140472c73e5be`
- Next.js / React baseline: 16.4.2 / 19.3.1
- Status: Completed direct static review; CI validation pending

## Scope and evidence

The primary source covers **component and hook conventions regression suite**.
Inspected the named file at the recorded branch checkpoint
and compared its stated obligations against related source, tool
configuration and application boundaries where appropriate.

## Verified source observations

- Defines Node test cases for hook filename/export parity, source placement, JSX exports, owned component names and Client/Server suffix rules.
- Exercises positive and negative cases for compound components, presentation hooks, SDK boundary restrictions and data-module structure.
- Includes data.ts function naming and 150 non-empty-line cap regressions, importing the actual checker under scripts/checks/.

## Findings and verification boundaries

- Static reading verifies the existence and asserted coverage of test cases, not their execution; CI test success must be checked at the head commit.
No separate independent subagent was invoked for this report.
This static source inspection does not replace runtime, security,
emulator, browser or integration tests.

## Disposition

The primary file was inspected and the scope/limitations recorded.
No additional confirmed blocking defect was established within this
source item alone. Outstanding related items and CI verification
remain tracked separately.
