# Individual source review — `.agents/skills/firebase-basics/references/android_setup.md`

## Identification

- Review identity: `next-code-file-agents-skills-firebase-basics-references-android-setup-md`
- Item: `CODE_FILE`
- Primary path: `.agents/skills/firebase-basics/references/android_setup.md`
- Framework baseline: Next.js 16.4.2
- Source checkpoint: `b366a4a86efa2253cb25c5355998675559bb8b86`
- Status: Completed direct source inspection; CI validation pending

## Primary scope

This item documents **android app registration and gradle integration**.
Cross-checked against the installed
`firebase-basics/SKILL.md`, the repository skill inventory,
`skills-lock.json` and the relevant project runtime configuration.
Imported skill examples are references, not adopted application behavior.

## Observed content

Checks google-services.json before creating an Android app, then covers Gradle plugin setup and App Check debug tokens.

## Findings and applicability

The introductory reference spells its skill path as firebase_basics, whereas the installed directory is firebase-basics. The actual local-env-setup.md exists at references/local-env-setup.md; this shortcut is not a resolvable literal local path.

## Verification boundary

Android/Gradle configuration is outside the current Next.js template; no Android build or Firebase CLI login was run.
No independent subagent, runtime, editor, emulator or device test
is claimed by this direct source inspection.

## Disposition

The named Markdown item was inspected individually. The observed scope
and limitations are recorded for follow-up; other files in this skill
remain separate inventory items.
