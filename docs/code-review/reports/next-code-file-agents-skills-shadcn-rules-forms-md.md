# Individual source review — `.agents/skills/shadcn/rules/forms.md`

## Identification

- Identity: `next-code-file-agents-skills-shadcn-rules-forms-md`
- Item type: `CODE_FILE`
- Primary source: `.agents/skills/shadcn/rules/forms.md`
- Branch checkpoint: `48f47bcc83d23a9c517bb66c8cf96281af11ea83`
- Reference baseline: Next.js 16.4.2, React 19.3.1
- Status: Completed static review; CI revalidation pending

## Scope

This review covers **field-based form composition**.
Compared with the installed skill inventory and relevant repository
configuration. The file is treated as one standalone review item;
its neighboring files retain independent review status.

## Observations

Uses FieldGroup, Field, InputGroup and aria-invalid or data-invalid attributes for validation.

## Findings and applicability limits

Examples do not validate application-specific React Hook Form integration or error handling by themselves.

No additional confirmed application defect was established by this
file-level source inspection. A successful source inspection does
not certify command availability, runtime correctness, accessibility
or the complete behavior of the bundled skill.

## Evidence boundary and disposition

Read directly from the pinned GitHub source. No independent
subagent was launched; no CLI, browser, emulator, model evaluation
or application build was performed for this report.
Count this item as an individual static source review; remediation
and integration verification are tracked separately.
