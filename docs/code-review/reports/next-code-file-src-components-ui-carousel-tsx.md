# Individual code review — `next-code-file-src-components-ui-carousel-tsx`

## Identification

- **Agent name:** `next-code-file-src-components-ui-carousel-tsx`
- **Primary file:** `src/components/ui/carousel.tsx`
- **Framework baseline:** Next.js 16.4.2 and React 19.3.1
- **Source checkpoint:** `098dcd8ba8920277de35a92aad32e5c954983267`
- **Review state:** Static review recorded; automated verification pending.

## Scope and evidence

Inspected the named source file, its exported component contract and relevant state, side effects, composition and accessibility behavior. This is a file-specific review; it does not claim coverage of neighboring files or of the full Next.js documentation corpus.

## Findings and remediation

Two source-confirmed issues: the Embla reInit subscription had no cleanup, and vertical carousels consumed horizontal arrow keys instead of vertical keys. The patch unregisters both listeners and selects arrow keys by orientation. Added regression tests for unmounting and both orientations.

## Verification

Dedicated source regression tests were added to the repository. An independent review-validation workflow checks unit tests, English, spelling and Markdown on the branch. The tests and checks have **not** been claimed as passing at authoring time; inspect the GitHub Actions outcome before marking this inventory item Completed.

## Disposition

Remediation proposed and committed, pending automated validation and project-wide compatibility checks. Do not count this report as fully validated until the corresponding checks pass.
