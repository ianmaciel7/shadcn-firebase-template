# Individual test infrastructure folder review — `next-code-folder-tests-biome-preview`

## Identification

- **Review agent:** `next-code-folder-tests-biome-preview`
- **Primary folder:** `tests/biome-preview/`
- **Type:** CODE_FOLDER
- **Tracked revision:** `d78e695b49df8e89e888359cd7cd98ca0dc420b3`
- **Status:** Organization reviewed; CI pending.

## Folder responsibilities

Contains four source fixtures used by the dedicated preview Biome filename plugin's positive and negative checks.

## Evidence boundary

The preview plugin runs separately from the normal Biome configuration; fixtures are not application components.

A folder review is not a substitute for its descendant file reviews, and no binary asset not inspected or production run is claimed as complete.

## Verification

The folder membership was read from the tracked Git tree. Mark the folder Completed only after the review workflow passes its report-quality and inventory checks.
