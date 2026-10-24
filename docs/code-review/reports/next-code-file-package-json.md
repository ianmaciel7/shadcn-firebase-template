# Identification

- **Full name:** `next-code-file-package-json`
- **Type:** CODE_FILE
- **Primary path:** `package.json`
- **Associated documentation:** `node_modules/next/dist/docs/01-app/01-getting-started/01-installation.md`; `docs/agents/nextjs.md`
- **Next.js version:** 16.4.2 (confirmed by `pnpm exec next --version`)
- **Status:** Completed

## Scope

- **Responsibility:** individual review of the package manifest, scripts, runtime versions, and framework compatibility.
- **Files consulted:** `package.json`, `next.config.ts`, `docs/agents/nextjs.md`, installed App Router installation documentation.
- **Dependencies analyzed:** `next`, `react`, `react-dom`, TypeScript, Biome, `next-intl`, Tailwind/Turbopack, and tools invoked by the scripts.

## Code Review

### Correct implementations

- `next`, `react`, and `react-dom` are pinned to the versions verified by the project: Next 16.4.2 and React 19.3.1 (`package.json:83,85,87`). This matches the installed documentation and avoids an indirect framework upgrade.
- The Node range declares compatible modern versions (`package.json:6`), and the package manager is explicitly `pnpm@12.14.0` (`package.json:154`), which makes installs reproducible.
- The build and development scripts use the native entry points `next build`, `next dev`, and `next start` (`package.json:10,12,13`).
- `typecheck` runs `next typegen` before TypeScript (`package.json:17`), compatible with the generated types of the installed version and with the `tsconfig.build.json` selected in `next.config.ts:40-42`.
- The `verify:*` groups keep static, build, and security checks separate (`package.json:27-30,55`), in line with the validation boundaries documented in the repository.

### Issues found

No proven finding within the scope of this file.

### Risks

- Some broad semver ranges are intentional for auxiliary dependencies. The lockfile, excluded from line-by-line review by the manifest, remains the source of concrete resolution and should be part of dependency audits.
- Scripts that use emulators, a browser, or Lighthouse require external services/processes; their presence does not prove that those environments are available on the current machine.

### Recommendations

- Keep the `next`, `react`, and `react-dom` versions coordinated in future updates and rerun `pnpm typecheck` and `pnpm build` after any change.
- Run `pnpm audit` as a complementary lockfile audit, without reinterpreting it as a failure of this manifest.

## Findings

No findings. The review did not identify a proven divergence between `package.json` and the official installed Next.js 16.4.2 documentation.

## Conclusion

**Compliant.** The manifest declares the runtime, framework, and native commands consistently with the installed version. The spot validation confirmed Next 16.4.2, TypeScript 5.9.3, and Biome 2.5.15 available in the workspace.

## Post-checkpoint reconciliation

Subsequent repository updates (`78f4761` and `e5e579d`) added `firebase-admin` for server-side custom-claim authorization ([ADR 0009](../../adr/0009-integrate-firebase-authentication.md)) and the `check:english` script (`node scripts/check-english.mjs`) wired into static verification. Pinned Next.js 16.4.2 and React 19.3.1 versions remain unchanged.
