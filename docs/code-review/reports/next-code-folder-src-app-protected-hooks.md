# Individual report - `next-code-folder-src-app-protected-hooks`

## Identification

- Full subagent name: `next-code-folder-src-app-protected-hooks`
- Type: `CODE_FOLDER`
- Primary path: `src/app/(protected)/_hooks/`
- Associated documentation: installed Next.js 16.4.2 `01-app/01-getting-started/02-project-structure.md; .agents/rules/react-hooks-core.md; CODING_STANDARDS.md`
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: structural and boundary review of `src/app/(protected)/_hooks/` against installed Next.js 16.4.2 folder conventions and repository architecture rules.
- Files consulted: direct children of `src/app/(protected)/_hooks/`, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, `.dependency-cruiser.cjs`, and installed Next.js 16.4.2 project-structure guides.
- Dependencies analyzed: route group/segment colocation, `_components` / `_hooks` / `_lib` encapsulation, and server/client import direction.

## Code Review

Correct implementations:

- Colocates private hooks exclusive to the `(protected)` route group (`use-protected-guard-client.ts`).
- Encapsulates client-side auth subscription and redirect orchestration away from `ProtectedGuardClient` JSX.

## Findings

No proven structural finding in this folder.

## Conclusion

- Classification: Compliant.
- Explanation: `src/app/(protected)/_hooks/` satisfies installed Next.js 16.4.2 folder conventions and the repository's module-boundary and colocation rules.
