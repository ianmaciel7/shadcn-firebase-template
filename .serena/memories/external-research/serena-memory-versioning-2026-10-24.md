# Serena project-memory versioning

- Source: Serena documentation via Context7, retrieved 2026-10-24.
- Freshness boundary: applies to the current Serena documentation indexed by Context7.

Project-specific memories are Markdown files in `.serena/memories/` by default. Serena explicitly designs project memories to be versionable with the project so they can be committed, reviewed, and reverted. Global memories are separate and live outside the project by default.

Repository implication: do not blanket-ignore `.serena/` if agents must share project research memories through Git. Prefer tracking `.serena/memories/` while ignoring non-memory local state/caches, subject to confirming the directory contents.