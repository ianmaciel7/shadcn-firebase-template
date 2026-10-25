# Individual agent-rule review — `next-code-file-agents-rules-language-md`

## Identification

- **Unique review identity:** `next-code-file-agents-rules-language-md`
- **Primary file:** `.agents/rules/language.md`
- **Type:** CODE_FILE
- **Source checkpoint:** `79f01dc398cd1798392f09dc16f740ce8f33e0ce`
- **Version baseline:** Next.js 16.4.2 and React 19.3.1
- **Status:** Completed following GitHub Actions run 40198107544.

## Evidence from source

Requires English for source, comments, documentation and commits while allowing intentional localized message catalogs and documented language exceptions. The check:english task is wired to static verification and Git hooks.

## Finding and compatibility boundary

A heuristic language checker cannot certify all prose; reviewers should still inspect ambiguous or mixed-language files.

No additional confirmed defect was established by this static file inspection alone.

## Verification

The named source file was inspected, including its local contracts and stated scope. A completed review does not prove that external links, MCP servers, Git hooks or the whole application have been exercised. The branch workflow passed formatting, spelling and inventory checks in [run 40198107544](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40198107544).

## Disposition

This rule or configuration was reviewed individually. Pending code and official documentation retain their distinct review identities.
