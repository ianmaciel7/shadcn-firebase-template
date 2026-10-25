# Individual agent skill review — `next-code-file-agents-skills-ask-matt-skill-md`

## Identification

- **Assigned review identity:** `next-code-file-agents-skills-ask-matt-skill-md`
- **Primary source:** `.agents/skills/ask-matt/SKILL.md`
- **Item type:** CODE_FILE
- **Inspected source revision:** `00902bf93f1730bbfff7bda2b08f23a5e83cf3c3`
- **Next.js baseline:** 16.4.2
- **Review state:** Completed after successful review workflow.

## Evidence and intended behavior

Defines a routing guide from engineering ideas and bug diagnosis through specifications, ticketing, implementation and retrospective review. It warns that each recommended skill must be inspected before use.

## Limitations and follow-up

The document mentions many slash-command skills not among the nine installed in this repository. Check host availability before suggesting a flow; references may intentionally rely on external skills.

No separate functional failure is asserted from this documentation review alone. Installed host commands and external services were not executed as part of the source inspection.

## Validation boundary

The file's declared responsibility was inspected in the current repository revision. The review workflow passed inventory integrity, Biome, TypeScript, regressions, English, spelling and Markdown in [run 40234643392](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40234643392).

## Conclusion

This file has a distinct source review. Referenced external skills and sibling support files retain their independent ownership and coverage.
