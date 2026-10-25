# Individual agent-rule review — `next-code-file-agents-rules-components-md`

## Identification

- **Unique review identity:** `next-code-file-agents-rules-components-md`
- **Primary file:** `.agents/rules/components.md`
- **Type:** CODE_FILE
- **Source checkpoint:** `79f01dc398cd1798392f09dc16f740ce8f33e0ce`
- **Version baseline:** Next.js 16.4.2 and React 19.3.1
- **Status:** Source reviewed; CI validation pending.

## Evidence from source

Separates runtime, responsibility and placement dimensions, defines owned file and exported component naming contracts and distinguishes locally maintained copied registry components from app-owned extensions.

## Finding and compatibility boundary

The strict exact-name checks are an application policy rather than an official Next.js filename requirement. Dynamic component API behavior needs tests beyond AST naming rules.

No additional confirmed defect was established by this static file inspection alone.

## Verification

The named source file was inspected, including its local contracts and stated scope. A completed review does not prove that external links, MCP servers, Git hooks or the whole application have been exercised. Mark as Completed only after the branch review workflow passes report formatting, spelling and inventory consistency.

## Disposition

This rule or configuration was reviewed individually. Pending code and official documentation retain their distinct review identities.
