# Individual architecture decision review — `next-code-file-docs-adr-0006-configure-testing-md`

## Identification

- **Assigned agent:** `next-code-file-docs-adr-0006-configure-testing-md`
- **Primary decision record:** `docs/adr/0006-configure-testing.md`
- **Type:** CODE_FILE
- **Source checkpoint:** `03ecdad8670bd192d181a3e53f3f856921918775`
- **Framework baseline:** Next.js 16.4.2
- **Review status:** Source inspected; CI pending.

## Recorded decision

Records separate unit DOM, real browser, Playwright, accessibility, screenshots, property testing and mutation testing, including source colocation rules.

## Current applicability and observations

The current project test configuration and CI commands determine which suites actually run on each event. A recorded testing strategy is not evidence that every suite has passed.

Accepted architecture records are historical evidence. Their decisions and amendments are not silently rewritten to match current packages, tooling or code paths. The current operational documentation and checked-in implementation should be consulted when these differ.

## Verification

The record and its decision or amendment sections were inspected. The branch review workflow checks report quality and source inventory; this inspection does not claim to execute a historical setup command or hosted service.

## Disposition

Preserve the original record. Count its review Completed only after validation accepts this individual report.
