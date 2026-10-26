# Individual test review — `next-code-file-tests-biome-preview-fixtures-invalid-profile-card-tsx`

## Identification

- **Review agent:** `next-code-file-tests-biome-preview-fixtures-invalid-profile-card-tsx`
- **Primary file:** `tests/biome-preview/fixtures/invalid/profile-card.tsx`
- **Type:** CODE_FILE
- **Source checkpoint:** `47630f9b2ac767abe4fcdff56fa0d7a230c9845b`
- **Framework baseline:** Next.js 16.4.2
- **Status:** Completed; report validation passed in GitHub Actions run 40210742964.

## Evidence

Intentionally exports a component named ProfilePanel from profile-card to test naming rejection.

## Findings and scope

A deliberately invalid fixture must remain separate from ordinary application lint.

No separately confirmed application defect is established by this test or fixture alone.

## Verification

The test source was read from GitHub. The branch review workflow checks report quality, TypeScript and focused regressions; full Playwright, Firebase emulator and visual baseline tests belong to the separate main CI matrix. The complete browser suite was not executed for this review.

## Disposition

Mark this item Completed only when the review report checks pass.
