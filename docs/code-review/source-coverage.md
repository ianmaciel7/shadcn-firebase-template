# Project source coverage

| Measure | Count |
| --- | ---: |
| Project folders inventoried | 103 |
| Project files inventoried | 564 |
| Total project review items | 667 |
| Folder reports completed | 7 |
| File reports completed | 23 |
| Items reviewed | 30 |
| Coverage | 4.50% |
| Active reports | 0 |
| Pending items | 637 |

Completed folder reviews: repository root (`./`), `src/app/`, `src/components/`, `src/components/ui/`, `src/components/ui/extensions/`, `src/components/firebase/`, and `src/components/ai-elements/`.

Completed file reviews: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/error.tsx`, `src/app/not-found.tsx`, `src/app/page.tsx`, `src/components/ui/button.tsx`, `src/components/ui/extensions/theme-provider-client.tsx`, `src/components/ui/extensions/intl-provider-server.tsx`, and `src/components/ai-elements/agent.tsx`.

The layout review found a known accessibility and localization mismatch: `html lang` remains `en` when the rendered locale is Portuguese or Spanish. The error-boundary review independently confirmed the mismatch between “try again” and `reset()` semantics (subsequently remediated with `retry()`). See the [individual layout report](reports/next-code-file-src-app-layout-tsx.md), [error report](reports/next-code-file-src-app-error-tsx.md), [consolidated findings](findings.md), and [remediation dispositions](resolutions.md).

637 project items have no individual report yet and remain pending in the reconciled inventory. The inventory excludes generated output (`graphify-out/`, `.next/`), caches, dependency binaries, and lock files (`pnpm-lock.yaml`, `functions/package-lock.json`) from line-by-line code review. Lock files remain subject to dependency auditing.

The resumed batch added individual reports for `artifact.tsx`, `attachments.tsx`, `audio-player.tsx`, `canvas.tsx`, `chain-of-thought.tsx`, and `checkpoint.tsx` in `src/components/ai-elements/`. Six distinct real subagents reviewed these six primary files. No application source changed during the audit phase.

The second resumed batch completed `code-block.tsx`, `commit.tsx`, `confirmation.tsx`, `connection.tsx`, `context.tsx`, and `controls.tsx`, again using six distinct item reviewers. The code cache collision was a medium finding, and the commit header and audio controls shared one consolidated native-button configuration finding; all were subsequently fixed during remediation.

## Post-checkpoint inventory reconciliation

Following the remediation phase and architectural updates (`ADR 0004`, `ADR 0005`, and `ADR 0009` updates, server session bridge, centralized `ROUTES`, `ProtectedGuardClient`, hook placement/complexity guards, `check:english`, and Serena research memory relocation), the project manifest was reconciled against `git ls-files`:

- Removed 1 folder (`.serena/memories/external-research/`) and 11 relocated, renamed, or excluded file paths (`src/app/_components/auth-provider-client*`, `src/app/_components/route-loading*`, `src/app/_hooks/use-auth-provider-client.ts`, `src/app/(protected)/_components/protected-gate-client*`, `src/app/(protected)/_hooks/use-protected-gate-client.ts`, `.serena/memories/external-research/*`, and `functions/package-lock.json`).
- Added 8 new tracked folders (`.agents/scripts/`, `.agents/skills/new-component/`, `.agents/skills/verify/`, `.biome/rules/complexity/`, `.serena/memories/research/`, `src/app/(protected)/_lib/`, `src/lib/user/`, and `tests/unit/`) and 64 new tracked files as `Pending` review items.
