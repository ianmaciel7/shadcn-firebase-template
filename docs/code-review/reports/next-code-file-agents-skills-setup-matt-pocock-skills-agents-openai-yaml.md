<!-- cspell:ignore openai -->

# Individual agent skill review — `next-code-file-agents-skills-setup-matt-pocock-skills-agents-openai-yaml`

## Identification

- **Assigned review identity:** `next-code-file-agents-skills-setup-matt-pocock-skills-agents-openai-yaml`
- **Primary source:** `.agents/skills/setup-matt-pocock-skills/agents/openai.yaml`
- **Item type:** CODE_FILE
- **Inspected source revision:** `00902bf93f1730bbfff7bda2b08f23a5e83cf3c3`
- **Next.js baseline:** 16.4.2
- **Review state:** Completed after successful review workflow.

## Evidence and intended behavior

Exposes the Setup Matt Pocock Skills task as a named agent interface entry and disables implicit invocation.

## Limitations and follow-up

This entry is metadata only; installing the actual external skill set requires the corresponding setup workflow and user authorization.

No separate functional failure is asserted from this documentation review alone. Installed host commands and external services were not executed as part of the source inspection.

## Validation boundary

The file's declared responsibility was inspected in the current repository revision. The review workflow passed inventory integrity, Biome, TypeScript, regressions, English, spelling and Markdown in [run 40234643392](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40234643392).

## Conclusion

This file has a distinct source review. Referenced external skills and sibling support files retain their independent ownership and coverage.
