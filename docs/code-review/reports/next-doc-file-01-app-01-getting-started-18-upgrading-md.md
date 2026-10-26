# Individual report — `next-doc-file-01-app-01-getting-started-18-upgrading-md`

## Identification

- Full subagent name: `next-doc-file-01-app-01-getting-started-18-upgrading-md`
- Type: `DOC_FILE`
- Primary path: `node_modules/next/dist/docs/01-app/01-getting-started/18-upgrading.md`
- Associated documentation: Next.js upgrade instructions and the canary version.
- Next.js version: `16.4.2` installed.
- Status: Completed.

## Scope

- Responsibility: read the installed `Upgrading` guide in full and assess each piece of guidance against the demonstrable state of this project.
- Files consulted: primary document; `package.json`; `next.config.ts`; `.agents/rules/nextjs-maintenance.md`; `docs/agents/nextjs.md`.
- Dependencies analyzed: Next.js, React, React DOM, and pnpm, only to verify versions and the documented command flow.

## Code Review

Correct implementations and decisions:

- `package.json:95` pins Next.js to `16.4.2`, while `:98` and `:100` pin React and React DOM to `19.3.1`; `:153` identifies pnpm as the project's manager.
- The guide is applicable as a conditional procedure for future upgrades: it documents `next upgrade` from Next.js 16.1.0 (`18-upgrading.md:15-33`) and the manual sequence in case that flow is not used.
- There is no evidence in this document or in the version files consulted that this project is behind or needs an upgrade. Therefore, the upgrade instructions are not a non-compliance of the pinned version.
- The canary section (`18-upgrading.md:65-85`) is informational and not applicable to the current state: the project pins the stable version `16.4.2`, and `.agents/rules/nextjs-maintenance.md:6-7,23-24` states that canary APIs depend on installed support and that upstream recipes do not authorize automatic migrations.
- The guide also offers the command for agents to run upgrades (`18-upgrading.md:39-43`); this is an optional flow, not a step the repository must run automatically.

Issues found: no applicable deviation was proven.

Risks: running the upgrade to "latest" or "canary" changes dependencies and can change API contracts; any adoption requires a compatibility review for the target version and the verification prescribed by the project. This risk is conditional and is not a finding about the current state.

## Findings

No findings. The document describes optional upgrade procedures; the project pins Next.js `16.4.2` and shows no evidence of an outdated or incompatible version.

## Conclusion

- Classification: Compliant.
- Explanation: the guide was read in full and its applicability was separated between the upgrade procedure (a reference for a future decision) and the canary-specific instructions (not applicable to the pinned stable version). There is no proven upgrade recommendation for this project.
