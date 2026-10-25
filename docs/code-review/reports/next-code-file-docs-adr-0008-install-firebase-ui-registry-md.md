# Individual architecture decision review — `next-code-file-docs-adr-0008-install-firebase-ui-registry-md`

## Identification

- **Assigned agent:** `next-code-file-docs-adr-0008-install-firebase-ui-registry-md`
- **Primary decision record:** `docs/adr/0008-install-firebase-ui-registry.md`
- **Type:** CODE_FILE
- **Source checkpoint:** `03ecdad8670bd192d181a3e53f3f856921918775`
- **Framework baseline:** Next.js 16.4.2
- **Review status:** Completed after successful review CI run 40211467467.

## Recorded decision

Documents discovery and installation of Firebase UI registry components and an amendment that explicitly replaced the initial immutable vendor mirror policy with local source ownership.

## Current applicability and observations

The earlier immutable hash policy is superseded by the amendment within this same accepted record. Generated registry code remains an owned maintenance responsibility after customization.

Accepted architecture records are historical evidence. Their decisions and amendments are not silently rewritten to match current packages, tooling or code paths. The current operational documentation and checked-in implementation should be consulted when these differ.

## Verification

The record and its decision or amendment sections were inspected. The branch review workflow checks report quality and source inventory; this inspection does not claim to execute a historical setup command or hosted service.

## Disposition

Preserve the original record. The report passed quality validation in [GitHub Actions run 40211467467](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40211467467).
