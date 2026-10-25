# Individual test infrastructure folder review — `next-code-folder-tests-biome-preview-fixtures`

## Identification

- **Review agent:** `next-code-folder-tests-biome-preview-fixtures`
- **Primary folder:** `tests/biome-preview/fixtures/`
- **Type:** CODE_FOLDER
- **Tracked revision:** `d78e695b49df8e89e888359cd7cd98ca0dc420b3`
- **Status:** Organization reviewed; CI pending.

## Folder responsibilities

Groups both the accepted and deliberately rejected component-name examples for the preview naming policy.

## Evidence boundary

The positive and negative groups are intentional; an invalid fixture must not be treated as a production lint failure.

A folder review is not a substitute for its descendant file reviews, and no binary asset not inspected or production run is claimed as complete.

## Verification

The folder membership was read from the tracked Git tree. Mark the folder Completed only after the review workflow passes its report-quality and inventory checks.
