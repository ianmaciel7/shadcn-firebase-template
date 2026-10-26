# Individual source review — `.agents/skills/firebase-basics/references/web_setup.md`

## Identification

- Review identity: `next-code-file-agents-skills-firebase-basics-references-web-setup-md`
- Item: `CODE_FILE`
- Primary path: `.agents/skills/firebase-basics/references/web_setup.md`
- Framework baseline: Next.js 16.4.2
- Source checkpoint: `b366a4a86efa2253cb25c5355998675559bb8b86`
- Status: Completed direct source inspection; CI validation pending

## Primary scope

This item documents **firebase modular web sdk onboarding**.
Cross-checked against the installed
`firebase-basics/SKILL.md`, the repository skill inventory,
`skills-lock.json` and the relevant project runtime configuration.
Imported skill examples are references, not adopted application behavior.

## Observed content

Explains project/app creation, Firebase modular initialization and App Check debug token concerns.

## Findings and applicability

The code uses npm and a standalone firebase.js as an upstream example. This template uses pnpm, typed public environment configuration and src/lib/firebase/client.ts, so the recipe should not be copied wholesale.

## Verification boundary

No new Firebase app was registered, package installed, or production App Check enabled.
No independent subagent, runtime, editor, emulator or device test
is claimed by this direct source inspection.

## Disposition

The named Markdown item was inspected individually. The observed scope
and limitations are recorded for follow-up; other files in this skill
remain separate inventory items.
