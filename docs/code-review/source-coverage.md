# Project source coverage

| Measure | Count |
| --- | ---: |
| Project folders inventoried | 96 |
| Project files inventoried | 519 |
| Total project review items | 615 |
| Folder reports completed | 7 |
| File reports completed | 11 |
| Items reviewed | 18 |
| Coverage | 2.93% |
| Active reports | 0 |
| Pending items | 600 |

Completed folder reviews: repository root (`./`), `src/app/`, `src/components/`, `src/components/ui/`, `src/components/ui/extensions/`, `src/components/firebase/`, and `src/components/ai-elements/`.

Completed file reviews: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/error.tsx`, `src/app/not-found.tsx`, `src/app/page.tsx`, `src/components/ui/button.tsx`, `src/components/ui/extensions/theme-provider-client.tsx`, `src/components/ui/extensions/intl-provider-server.tsx`, and `src/components/ai-elements/agent.tsx`.

The layout review found a known accessibility and localization mismatch: `html lang` remains `en` when the rendered locale is Portuguese or Spanish. The error-boundary review independently confirmed the mismatch between “try again” and `reset()` semantics. See the [individual layout report](reports/next-code-file-src-app-layout-tsx.md), [error report](reports/next-code-file-src-app-error-tsx.md), and [consolidated findings](findings.md).

597 project items have no individual report yet and remain pending. The inventory excludes generated output, caches, dependency binaries, and lockfiles from line-by-line code review. Lockfiles remain subject to dependency auditing.
