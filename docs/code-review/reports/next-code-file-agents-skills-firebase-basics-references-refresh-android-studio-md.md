# Individual source review — `.agents/skills/firebase-basics/references/refresh/android_studio.md`

## Identification

- Review identity: `next-code-file-agents-skills-firebase-basics-references-refresh-android-studio-md`
- Item: `CODE_FILE`
- Primary path: `.agents/skills/firebase-basics/references/refresh/android_studio.md`
- Framework baseline: Next.js 16.4.2
- Source checkpoint: `b366a4a86efa2253cb25c5355998675559bb8b86`
- Status: Completed direct source inspection; CI validation pending

## Primary scope

This item documents **android studio skill refresh procedure**.
Cross-checked against the installed
`firebase-basics/SKILL.md`, the repository skill inventory,
`skills-lock.json` and the relevant project runtime configuration.
Imported skill examples are references, not adopted application behavior.

## Observed content

Documents skills CLI listing, inspection of the agent skill directory and conditional manual fallback when an agent identifier is unsupported.

## Findings and applicability

Agent-specific CLI flags are conditional; they require validation against the installed skills CLI before a real update.

## Verification boundary

No global or user skill installation was modified.
No independent subagent, runtime, editor, emulator or device test
is claimed by this direct source inspection.

## Disposition

The named Markdown item was inspected individually. The observed scope
and limitations are recorded for follow-up; other files in this skill
remain separate inventory items.
