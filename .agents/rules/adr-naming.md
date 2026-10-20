# ADR naming

Apply this rule when creating an Architecture Decision Record in `docs/adr/`.

- Name each new record `NNNN-<imperative-verb-phrase>.md`.
- Use the next unused four-digit decimal number for `NNNN`. Because this
  repository is a template, maintainers may renumber or consolidate its ADRs
  while evolving the template; update every affected reference in the same
  change.
- Use lowercase ASCII kebab case for the phrase. Make it a concise,
  present-tense imperative that describes the implementation stage, for example
  `0006-configure-database-migrations.md` or
  `0007-document-api-versioning.md`.
- Use the heading `# ADR NNNN: <Sentence-case imperative phrase>` inside the
  record.
- Treat ADRs as documentation of the template's current architecture. When a
  decision changes, revise or consolidate the relevant record when that keeps
  the template clearer; downstream projects should establish and follow their
  own ADR-history policy.

This convention applies to every current and future ADR. The original five ADR
filenames were migrated to this convention on 2026-10-16 at the repository
maintainer's direction.
