# Individual agent-rule review — `next-code-file-agents-rules-routes-md`

## Identification

- **Unique review identity:** `next-code-file-agents-rules-routes-md`
- **Primary file:** `.agents/rules/routes.md`
- **Type:** CODE_FILE
- **Source checkpoint:** `79f01dc398cd1798392f09dc16f740ce8f33e0ce`
- **Version baseline:** Next.js 16.4.2 and React 19.3.1
- **Status:** Completed following GitHub Actions run 40198107544.

## Evidence from source

Declares a repository-specific thin route policy for App Router pages, layouts and templates, allowing metadata and server reads while rejecting embedded browser logic, state and complex control flow.

## Finding and compatibility boundary

This is an application design restriction and intentionally prohibits some constructs that Next.js itself supports. The scanner's fixtures are the enforcement evidence.

No additional confirmed defect was established by this static file inspection alone.

## Verification

The named source file was inspected, including its local contracts and stated scope. A completed review does not prove that external links, MCP servers, Git hooks or the whole application have been exercised. The branch workflow passed formatting, spelling and inventory checks in [run 40198107544](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40198107544).

## Disposition

This rule or configuration was reviewed individually. Pending code and official documentation retain their distinct review identities.
