# Individual report - `next-code-folder-src-app-components`

## Identification

- Full subagent name: `next-code-folder-src-app-components`
- Type: `CODE_FOLDER`
- Primary path: `src/app/_components/`
- Associated documentation: installed Next.js 16.4.2 `01-app/01-getting-started/02-project-structure.md; .agents/rules/components-contracts.md; docs/adr/0005-document-project-standards.md`
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: structural and boundary review of `src/app/_components/` against installed Next.js 16.4.2 folder conventions and repository architecture rules.
- Files consulted: direct children of `src/app/_components/`, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, `.dependency-cruiser.cjs`, and installed Next.js 16.4.2 project-structure guides.
- Dependencies analyzed: route group/segment colocation, `_components` / `_hooks` / `_lib` encapsulation, and server/client import direction.

## Code Review

Correct implementations:

- Colocates private components exclusive to the root `/` home route (`home-hero.tsx`, `home-section-client.tsx`, and `home-sign-out-button-client.tsx`) and their tests.
- Per ADR 0005, cross-route providers (`auth-provider-client.tsx`, `route-loading.tsx`) were moved to `src/components/ui/extensions/`, leaving `src/app/_components/` strictly scoped to `/`.

## Findings

No proven structural finding in this folder.

## Conclusion

- Classification: Compliant.
- Explanation: `src/app/_components/` satisfies installed Next.js 16.4.2 folder conventions and the repository's module-boundary and colocation rules.
