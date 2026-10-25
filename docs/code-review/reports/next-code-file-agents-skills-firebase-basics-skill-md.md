# Individual Firebase skill review — `next-code-file-agents-skills-firebase-basics-skill-md`

## Identification

- **Assigned reviewer identity:** `next-code-file-agents-skills-firebase-basics-skill-md`
- **Primary source:** `.agents/skills/firebase-basics/SKILL.md`
- **Item type:** CODE_FILE
- **Source revision:** `203d55d4752758ade11d7105ef6fe19f1dadf914`
- **Framework baseline:** Next.js 16.4.2
- **Status:** Source inspected; validation pending.

## Source evidence

Defines a narrow Firebase CLI setup workflow for project selection, CLI login and app configuration downloads. It links to local environment, provider setup and refresh instructions.

## Findings and scope

Confirmed low-severity documentation defect: the Claude refresh link points to references/refresh/claude.md, which is absent from the tracked project tree. Resolve the reference during an upstream-aligned skill update rather than silently mutating a locked external copy.

This document is an upstream skill or reference. It cannot be used as proof that a separate operating system, Firebase project or identity provider was tested.

## Verification

The source and reference relationships were inspected in the current tracked tree. The report must pass the branch's language, spelling, Markdown and inventory quality checks before the corresponding item is marked Completed.

## Disposition

Individual source review is recorded; unrelated skill references keep their own pending identities.
