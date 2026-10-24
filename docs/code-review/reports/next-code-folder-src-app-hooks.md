# Individual report - `next-code-folder-src-app-hooks`

## Identification

- Full subagent name: `next-code-folder-src-app-hooks`
- Type: `CODE_FOLDER`
- Primary path: `src/app/_hooks/`
- Associated documentation: installed Next.js 16.4.2 `01-app/01-getting-started/02-project-structure.md; .agents/rules/react-hooks-core.md; docs/adr/0005-document-project-standards.md`
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: structural and boundary review of `src/app/_hooks/` against installed Next.js 16.4.2 folder conventions and repository architecture rules.
- Files consulted: direct children of `src/app/_hooks/`, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, `.dependency-cruiser.cjs`, and installed Next.js 16.4.2 project-structure guides.
- Dependencies analyzed: route group/segment colocation, `_components` / `_hooks` / `_lib` encapsulation, and server/client import direction.

## Code Review

Correct implementations:

- Colocates private hooks exclusive to the root `/` home route (`use-home-section-client.ts`, `use-home-session.ts`, and `use-home-sign-out-button-client.ts`) and their tests.
- Per ADR 0005, shared auth provider hooks moved to `src/hooks/`, keeping `src/app/_hooks/` dedicated to `/` home session and sign-out orchestration.

## Findings

No proven structural finding in this folder.

## Conclusion

- Classification: Compliant.
- Explanation: `src/app/_hooks/` satisfies installed Next.js 16.4.2 folder conventions and the repository's module-boundary and colocation rules.
