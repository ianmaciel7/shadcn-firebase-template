# Individual report — `next-doc-folder-root`

## Identification

- **Full name:** `next-doc-folder-root`
- **Type:** DOC_FOLDER
- **Primary path:** `node_modules/next/dist/docs/`
- **Associated documentation:** index of the official Next.js documentation
- **Next.js version:** 16.4.2
- **Status:** completed

## Scope

- **Responsibility:** audit only the organization, coverage, and cross-references of the documentation root.
- **Files consulted:** `node_modules/next/dist/docs/index.md`, immediate listing of `node_modules/next/dist/docs/`, `node_modules/next/package.json`.
- **Dependencies analyzed:** the four official documentation trees immediately below the root: `01-app/`, `02-pages/`, `03-architecture/`, and `04-community/`.

## Code Review

### Correct implementations

- `index.md` provides an entry point, differentiates the App Router and Pages Router, and directs to Getting Started, Guides, and API Reference.
- The four official top-level areas are present and match the structure expected by the 16.4.2 installation.
- The separation between the App Router and Pages Router documentation is explicit, preventing legacy router guidance from being presented as an App Router rule.

### Issues found

- The root also contains `graphify-out/`, which does not belong to the official documentation taxonomy (`01-app` to `04-community`). Its presence alters recursive discovery and can cause an audit to treat analysis artifacts as framework guidance.

### Risks

- Without an explicit exclusion of the artifact, folder/file agents can produce false findings against generated content and inflate the coverage metrics of the official documentation.

### Recommendations

- Keep `graphify-out/` explicitly classified as a generated artifact, outside the normative interpretation of the Next.js documentation, but preserve it in the discovery manifest while it exists, per the requested scope.
- Use `01-app/` as the primary reference for this App Router project; treat `02-pages/` as a comparative/migration source, in line with the index's own distinction.

## Findings

### NEXT-DOC-FOLDER-ROOT-001

- **Severity:** low
- **Category:** organization / generated artifact
- **Path and line:** `node_modules/next/dist/docs/graphify-out/` (directory entry; line not applicable)
- **Concrete evidence:** the immediate listing of the root contains `01-app`, `02-pages`, `03-architecture`, `04-community`, and `graphify-out`; the index in `index.md` describes the documentation by its sections, not by this additional directory.
- **Documentation reference:** `node_modules/next/dist/docs/index.md`, sections "How to use the docs" and "App Router and Pages Router".
- **Impact:** mixing audit/generated material with the normative source can produce incorrect coverage and recommendations.
- **Recommended fix:** record the semantic exclusion of `graphify-out/` in the consolidated reports; do not use it as a basis for Next.js recommendations.
- **Suggested test:** validate that the "applicable official documentation" metrics count only the four official branches and their documents, keeping the artifact only in the physical inventory when required.

## Conclusion

**Partially compliant.** The official root is correctly organized, has the expected index, and presents the App Router/Pages Router branches clearly. The presence of an additional generated directory requires explicit delimitation in the consolidation so that the official scope is not contaminated.
