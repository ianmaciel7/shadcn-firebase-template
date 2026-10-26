# Individual source check review — `next-code-file-scripts-checks-check-component-conventions-mjs`

## Identification

- **Review identity:** `next-code-file-scripts-checks-check-component-conventions-mjs`
- **Primary file:** `scripts/checks/check-component-conventions.mjs`
- **Type:** CODE_FILE
- **Source revision:** `99b9b1c0959ac9a949970265d64e91307dc54339`
- **Next.js baseline:** 16.4.2
- **Status:** Completed following validated review CI.

## Evidence

Scans owned components and hooks using TypeScript syntax trees, checking export naming, file placement, Client and Server boundaries, property forwarding, UI status representations and data module conventions. The checker excludes registry vendor sources while enforcing application contracts.

## Findings and limitations

No independently confirmed new defect was established from the inspected source in this review. The extensive repository-specific rule set is not official Next.js syntax, and its fixture suite is essential to avoid false positive warnings.

## Test and quality boundary

The file was inspected in the GitHub source tree. The existing test fixtures and independent branch validation passed in [GitHub Actions run 40193670924](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40193670924). This review does not claim that static checks replace runtime integration or official framework behavior.

## Conclusion

The source has a documented individual review, with its project-specific contracts and blind spots recorded.
