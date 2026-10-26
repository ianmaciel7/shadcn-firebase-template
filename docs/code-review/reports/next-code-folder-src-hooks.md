# Individual report - `next-code-folder-src-hooks`

## Identification

- Full subagent name: `next-code-folder-src-hooks`
- Type: `CODE_FOLDER`
- Primary path: `src/hooks/`
- Associated documentation: installed Next.js 16.4.2 `01-app/01-getting-started/02-project-structure.md; .agents/rules/react-hooks-core.md; ARCHITECTURE.md; docs/adr/0005-document-project-standards.md`
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: structural and boundary review of `src/hooks/` against installed Next.js 16.4.2 folder conventions and repository architecture rules.
- Files consulted: direct children of `src/hooks/`, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, `.dependency-cruiser.cjs`, and installed Next.js 16.4.2 project-structure guides.
- Dependencies analyzed: route group/segment colocation, `_components` / `_hooks` / `_lib` encapsulation, and server/client import direction.

## Code Review

Correct implementations:

- Houses shared cross-route custom React hooks (`use-auth-provider-client.ts`, `use-firebase-auth-session-bridge-client.ts`, `use-firebase-ui.ts`, `use-firebase-ui-return-navigation.ts`, `use-firebase-ui-translations.ts`, and `use-mobile.ts`) and their unit/browser tests.
- Enforces dependency direction where shared hooks consume `src/lib/` and `src/i18n/` without importing from `src/app/`.

## Findings

No proven structural finding in this folder.

## Conclusion

- Classification: Compliant.
- Explanation: `src/hooks/` satisfies installed Next.js 16.4.2 folder conventions and the repository's module-boundary and colocation rules.
