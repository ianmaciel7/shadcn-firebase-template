# Project source coverage

| Measure | Count |
| --- | ---: |
| Project folders inventoried | 115 |
| Project files inventoried | 567 |
| Total project review items | 682 |
| Folder reports completed | 33 |
| File reports completed | 101 |
| Items reviewed | 134 |
| Coverage | 19.65% |
| Active reports | 0 |
| Pending items | 548 |

Completed folder reviews: repository root (`./`), `src/app/` and all 20 of its route/private subdirectories (`(protected)/` and its `_components/`, `_hooks/`, `_lib/`, and `profile/` subtree; `(public)/` and its `_hooks/`, `forgot-password/`, `register/`, and `sign-in/` subtrees; `_components/` and `_hooks/`), `src/components/`, `src/components/ui/`, `src/components/ui/extensions/`, `src/components/firebase/`, `src/components/ai-elements/`, `src/hooks/`, `src/i18n/`, and `src/lib/` (plus `firebase/`, `firebase/firestore/`, `usage/`, and `user/`).

Completed file reviews: `package.json`, `tsconfig.json`, `next.config.ts`, all 52 non-test runtime files in `src/app/**` (`layout.tsx`, `error.tsx`, `not-found.tsx`, `loading.tsx`, `page.tsx`, `favicon.ico`, `globals.css`, `typeset.css`, and all route/group layouts, pages, loading boundaries, components, hooks, and `_lib` modules under `(protected)/`, `(public)/`, `_components/`, and `_hooks/`), `src/components/ui/button.tsx`, all 5 modules in `src/components/ui/extensions/` (`auth-provider-client.tsx`, `firebase-auth-session-bridge-client.tsx`, `intl-provider-server.tsx`, `route-loading.tsx`, and `theme-provider-client.tsx`), all 6 hooks in `src/hooks/`, all 3 modules in `src/i18n/`, all 16 non-test modules in `src/lib/**`, and 13 `src/components/ai-elements/` modules (`agent.tsx` through `controls.tsx`).

The layout review found a known accessibility and localization mismatch: `html lang` remains `en` when the rendered locale is Portuguese or Spanish. The error-boundary review independently confirmed the mismatch between “try again” and `reset()` semantics (subsequently remediated with `retry()`). See the [individual layout report](reports/next-code-file-src-app-layout-tsx.md), [error report](reports/next-code-file-src-app-error-tsx.md), [consolidated findings](findings.md), and [remediation dispositions](resolutions.md).

523 project items have no individual report yet and remain pending in the reconciled inventory. The inventory excludes generated output (`graphify-out/`, `.next/`), caches, dependency binaries, and lock files (`pnpm-lock.yaml`, `functions/package-lock.json`) from line-by-line code review. Lock files remain subject to dependency auditing.

The resumed batch added individual reports for `artifact.tsx`, `attachments.tsx`, `audio-player.tsx`, `canvas.tsx`, `chain-of-thought.tsx`, and `checkpoint.tsx` in `src/components/ai-elements/`. Six distinct real subagents reviewed these six primary files. No application source changed during the audit phase.

The second resumed batch completed `code-block.tsx`, `commit.tsx`, `confirmation.tsx`, `connection.tsx`, `context.tsx`, and `controls.tsx`, again using six distinct item reviewers. The code cache collision was a medium finding, and the commit header and audio controls shared one consolidated native-button configuration finding; all were subsequently fixed during remediation.

## Post-checkpoint inventory reconciliation

Following the remediation phase and architectural updates (`ADR 0004`, `ADR 0005`, and `ADR 0009` updates, server session bridge, centralized `ROUTES`, `ProtectedGuardClient`, hook placement/complexity guards, `check:english`, and Serena research memory relocation), the project manifest was reconciled against `git ls-files`:

- Removed 1 folder (`.serena/memories/external-research/`) and 11 relocated, renamed, or excluded file paths (`src/app/_components/auth-provider-client*`, `src/app/_components/route-loading*`, `src/app/_hooks/use-auth-provider-client.ts`, `src/app/(protected)/_components/protected-gate-client*`, `src/app/(protected)/_hooks/use-protected-gate-client.ts`, `.serena/memories/external-research/*`, and `functions/package-lock.json`).
- Added 8 new tracked folders (`.agents/scripts/`, `.agents/skills/new-component/`, `.agents/skills/verify/`, `.biome/rules/complexity/`, `.serena/memories/research/`, `src/app/(protected)/_lib/`, `src/lib/user/`, and `tests/unit/`) and 64 new tracked files as `Pending` review items.

## Reconciled current-branch coverage

As of commit `44c7bfd`, current tracked paths supersede the older coverage narrative above: 33 folders and 101 files are reviewed out of 682 project items. Retired paths are not active coverage, and seven modified files are pending re-review. Three UI files have current individual reports and have passed the focused validation workflow. See [inventory history](inventory-history.md) for excluded paths and the changed-source list.
