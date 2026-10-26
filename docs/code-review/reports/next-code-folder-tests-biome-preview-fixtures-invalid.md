# Individual test infrastructure folder review — `next-code-folder-tests-biome-preview-fixtures-invalid`

## Identification

- **Review agent:** `next-code-folder-tests-biome-preview-fixtures-invalid`
- **Primary folder:** `tests/biome-preview/fixtures/invalid/`
- **Type:** CODE_FOLDER
- **Tracked revision:** `d78e695b49df8e89e888359cd7cd98ca0dc420b3`
- **Status:** Completed; report validation passed in GitHub Actions run 40210742964.

## Folder responsibilities

Contains two intentionally mismatched filename/export samples for ProfileCard and ProfileFormClient family naming.

## Evidence boundary

The sources deliberately violate the rule and are correct only when the preview lint step rejects them.

A folder review is not a substitute for its descendant file reviews, and no binary asset not inspected or production run is claimed as complete.

## Verification

The folder membership was read from the tracked Git tree. The report quality and inventory checks passed in [run 40210742964](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40210742964).
