# Tooling

## Tool inventory

This is the operational inventory of tools installed or configured by this
repository. It is not a catalog of every runtime library; `package.json` and
`pnpm-lock.yaml` remain the source of truth for those dependencies.

| Category | Tool | Version or status | Purpose | Source of truth |
| --- | --- | --- | --- | --- |
| Package management | pnpm | 12.14.0 | Installs dependencies and runs project commands. Do not use npm or Yarn to modify dependencies. | `package.json`, `pnpm-lock.yaml` |
| Application build | Next.js | 16.4.2 | App Router framework, development server, production build, and server runtime. | `package.json`, `next.config.ts` |
| Bundler | Turbopack | Included with Next.js | Bundles development and production builds; loads Tailwind CSS through `@tailwindcss/turbopack`. | `next.config.ts` |
| Language | TypeScript | `^5`; inspect the installed version and lockfile | Provides type checking and the `@/*` import alias. | `package.json`, `tsconfig.json`, `pnpm-lock.yaml` |
| Compiler | React Compiler | 1.0.0 | Optimizes React components through Next.js configuration. | `package.json`, `next.config.ts` |
| Styling | Tailwind CSS | `^4` | Generates utility CSS and is loaded by Turbopack (and by Vite for Ladle). | `package.json`, `next.config.ts`, `.ladle/vite.config.mjs`, `src/app/globals.css` |
| Code quality | Biome | 2.5.15 | Formats code, runs lint checks, and organizes imports. | `package.json`, `biome.json` |
| Experimental file/export rule | Biome 2.6.2 JavaScript plugin (CI only) | Developer Preview | Checks owned TSX function exports against filename roots and regression fixtures; `pnpm dlx` is isolated from the pinned production linter. Does not replace the TypeScript AST guard. | `biome.preview.json`, `.biome/plugins/match-component-filename.js`, `docs/biome-javascript-plugin-pilot.md`, `.github/workflows/ci.yml` |
| Custom code quality rules | GritQL | Executed by Biome; no standalone CLI | Supplies project-specific rules for Next.js props/context and banning deprecated DOM APIs (`document.write`). Regression-tested in `.biome/rules/nextjs/rules.test.ts` and `.biome/rules/dom/rules.test.ts`. | `.biome/rules/nextjs/*.grit`, `.biome/rules/dom/*.grit`, `biome.json` |
| UI scaffolding | shadcn/ui CLI | 4.22.0 | Adds and maintains locally owned UI components using the configured aliases and style. | `package.json`, `components.json` |
| Component workbench | Ladle | 5.1.1 | Develops and reviews components in isolation through colocated `*.stories.tsx` files. | `.ladle/`, `package.json` |
| Unit and component testing | Vitest + React Testing Library | Vitest 5.0.5 | Runs colocated unit, hook, and component tests in `jsdom` (`unit` project). | `vitest.config.mts`, `package.json` |
| Property-based testing | fast-check | 4.10.2 | Generates inputs for pure logic such as `isLocale`. | `package.json`, `src/i18n/routing.test.ts` |
| Browser component testing | Vitest Browser Mode + `vitest-browser-react` | Chromium through Playwright | Runs `*.browser.test.tsx` files in a real browser (`browser` project). | `vitest.config.mts`, `package.json` |
| End-to-end testing | Playwright | `^1.64.1` | Runs `tests/*.spec.ts` against a production build. | `playwright.config.ts`, `tests/` |
| Accessibility testing | `@axe-core/playwright` | 4.14.0 | Scans pages for WCAG 2.x A/AA violations in Playwright (`@a11y`). | `tests/a11y.spec.ts` |
| Firebase Emulator E2E (CI) | Firebase CLI 15.34.1 (pinned via pnpm dlx) | CI on demo-test only | Starts Auth, Firestore and Functions emulators; the profile gate and saves require the `recordUsage` callable. Installs the separate `functions/package-lock.json` package with npm ci and uses no production Firebase secrets. | `.github/workflows/ci.yml`, `tests/firebase-auth.spec.ts`, `firebase.json` |
| Visual regression | Playwright screenshots | Linux baselines generated and compared in CI | Compares full-page screenshots against baselines (`@visual`). | `tests/visual.spec.ts`, `tests/visual.spec.ts-snapshots/` |
| Mutation testing | Stryker with the `command` runner | 10.0.0 (see [Known limitations](#known-limitations)) | On-demand mutation analysis of selected logic; runs the unit tests once per mutant. | `stryker.config.json`, `vitest.mutation.config.mts` |
| Unused code | Knip | 6.41.0 | Finds unused files, exports, and dependencies. | `knip.jsonc` |
| Architecture boundaries | dependency-cruiser | 18.6.0 | Enforces layering rules and forbids dependency cycles. | `.dependency-cruiser.cjs` |
| Structural rules | ast-grep | 0.51.0 | Enforces form, prop, Tailwind, and route conventions, with warning-level React review hints. Rules have snapshot tests. | `sgconfig.yml`, `.ast-grep/` |
| Route entrypoint contracts | TypeScript compiler API | Uses the existing TypeScript dependency | Enforces thin `page.tsx`, `layout.tsx`, and `template.tsx` entrypoints through `pnpm check:routes`. | `scripts/check-route-files.mjs`, `scripts/check-route-files.test.mjs`, `package.json` |
| Hook naming contracts | TypeScript compiler API | Uses the existing TypeScript dependency | Enforces exact file/export parity for every owned `src/app/**/_hooks/use-*.ts` hook, including `Client`/`Server` suffixes; verifies real exports and rejects aliased/re-exported hook names. `src/hooks/use-mobile.ts` is a shadcn-provided convention and stays out of this app-private policy. | `scripts/check-component-conventions.mjs`, `scripts/check-component-conventions.test.mjs` |
| React state ownership | React state + React Hook Form | React 19 / RHF 7 | Groups authentication and preference phases as discriminated states and uses RHF's native `formState.isSubmitting`, avoiding duplicated flags. `Suspense` is reserved for data sources that actually suspend. | `src/app/(protected)/profile/_hooks/` |
| Presentational field hooks | React + React Hook Form | Native hooks | Calls `useId`, `useTranslations`, and `useFormContext` directly in the four profile fields, avoiding one-line orchestration hooks. The component AST guard still requires dedicated custom hooks for business coordination. | `src/app/(protected)/profile/_components/`, `scripts/check-component-conventions.mjs` |
| Profile persistence ports | TypeScript function-based dependency injection | Existing TypeScript | `saveProfile` accepts a small typed dependency interface; default Firebase adapters remain in one place and test doubles can exercise the orchestration. | `src/lib/profile.ts`, `src/lib/profile.test.ts` |
| Component contracts | TypeScript compiler API | Uses the existing TypeScript dependency | Checks repository-specific named families and adapter forwarding through `pnpm check:components`; does not duplicate native framework diagnostics. | `scripts/check-component-conventions.mjs`, `scripts/check-component-composition.mjs`, their regression tests, `package.json` |
| Responsiveness contracts | TypeScript compiler API | Uses the existing TypeScript dependency | Enforces viewport exports, no zoom restrictions, fluid widths <= 320px, and WCAG 2.2 touch targets through `pnpm check:responsiveness`. | `scripts/check-responsiveness.mjs`, `scripts/check-responsiveness.test.mjs`, `package.json` |
| Duplication | jscpd | 5.4.1 | Reports meaningful duplicated code. | `.jscpd.json` |
| Complexity and health | Fallow | 3.34.0 | Reports complexity, CRAP score (from real coverage), and hotspots. Route-private hooks under `src/app/**/_hooks/` are included. `.ladle/` is excluded on purpose: it is tooling glue that Ladle loads by convention. Vendored `src/components/ui/*.tsx` and `ai-elements` are excluded; custom code under `ui/extensions/` is analyzed. Dead-code, duplication, and architecture analysis stay with Knip, jscpd, and dependency-cruiser. | `.fallowrc.json` |
| React diagnostics | React Doctor | 0.9.18 | Scans application React code for correctness, performance, and security issues. | `doctor.config.json` |
| Bundle budgets | Size Limit + `@size-limit/file` | 14.2.0 | Fails when generated client JavaScript or CSS exceeds its gzip budget. | `.size-limit.json` |
| Performance audit | Lighthouse | 13.5.0 | On-demand performance and accessibility report. | `package.json` |
| Spelling | CSpell | 10.4.0 | Checks spelling in code, JSON, and Markdown. | `cspell.json` |
| Markdown | markdownlint-cli2 | 0.23.3 | Lints repository Markdown. | `.markdownlint-cli2.jsonc` |
| Static security | Semgrep Community Edition | Host tool (CI pins 1.181.0) | Runs the project's security rules on `src` with `--error` so findings fail the run; `check:security:rules` tests them against an annotated fixture. | `tests/semgrep/rules.yml`, `tests/semgrep/rules.tsx`, `package.json` |
| Secret scanning | Gitleaks | Host tool (CI pins 8.30.1) | Scans the Git history for secrets with `gitleaks git --redact`. `detect` is deprecated upstream. | `package.json` (`check:secrets`) |
| Dependency audit | `pnpm audit` | Included with pnpm | Reports known vulnerable dependencies. | `pnpm-workspace.yaml` (`auditConfig`) |
| Continuous integration | GitHub Actions | Pinned by commit SHA | Runs `static`, `build`, `e2e`, `auth-emulator`, `security`, and `pr-title` in parallel, with a required `ci-result` aggregate. | `.github/workflows/ci.yml`, `TESTING.md` |
| Workflow linting | actionlint, zizmor | Host tools | Lint and audit the GitHub Actions workflows. | `package.json` (`check:workflows`) |
| Codebase graph | Graphify | Host tool | Builds an on-demand knowledge graph; output goes to the ignored `graphify-out/`. | None |
| Git hooks | Husky + lint-staged + Commitlint | 9.1.7 / 17.6.0 / 21.2.3 | Check staged files with Biome and validate commit messages. | `.husky/`, `package.json`, `commitlint.config.mjs` |
| Repository integrity | pre-commit | Host tool | Runs file-integrity hooks (large files, case conflicts, JSON/YAML, merge markers). | `.pre-commit-config.yaml` |
| Agent documentation | Seven installed skills | Project-local `save` plus six external skills | See [.agents/skills/README.md](.agents/skills/README.md) for names, provenance, and entrypoints. | `.agents/skills/`, `skills-lock.json` |
| Agent configuration | Agents CLI | Repository configuration; CLI is externally provided | Synchronizes reusable agent skills and MCP settings (Serena, Next.js DevTools). | `.agents/agents.json`, `.agents/skills/` |

## Host prerequisites

The repository's own dependencies install with `pnpm install`. These tools live
outside pnpm and are only needed for the commands noted next to them:

| Tool | Needed for | Check |
| --- | --- | --- |
| Node.js `^22.22.1 \|\| ^24.5.0` | Everything (`engines` in `package.json`) | `node --version` |
| Git | Biome VCS integration, hooks, Fallow hotspots | `git --version` |
| `gh` | `setup:github` and GitHub issue tracking | `gh --version` |
| Playwright browsers | `test:browser`, `test:e2e`, `test:a11y`, `test:visual` | `pnpm exec playwright install chromium` |
| pre-commit | Repository-integrity checks in the Git hook | `pre-commit --version` |
| Semgrep | `check:security` | `semgrep --version` |
| Gitleaks | `check:secrets` | `gitleaks version` |
| actionlint, zizmor | `check:workflows` | `actionlint -version`, `zizmor --version` |
| Graphify | On-demand codebase graph | `graphify --version` |

Missing `pre-commit` does not block a commit; the hook prints a warning and skips
only the integrity checks. Biome, Commitlint, and everything else run through
pnpm. In CI or on production installs, set `HUSKY=0` to skip hook installation.

On Windows, `pre-commit` can fail while building its Python virtual environment
with `WinError 206` (path too long) when Python comes from the Microsoft Store.
The Git hook therefore sets `VIRTUALENV_OVERRIDE_APP_DATA` to a short cache
(`~/.virtualenv-cache`) unless you already configured one. Running `pre-commit`
by hand outside the hook may need the same variable.

## Package management

Use [pnpm](https://pnpm.io/) `12.14.0`, as pinned by the `packageManager`
field in `package.json`. The `pnpm-lock.yaml` file is the lockfile of record.
pnpm 12 serializes two YAML documents in this file: package-manager dependency
metadata first, followed by the application importers, packages, and snapshots.
Read the complete stream when inspecting lock coverage; the first document
alone is not evidence of a missing application dependency graph. Validate
frozen installs with the pinned pnpm version. Documentation-only work should
not silently resolve or upgrade dependencies.

Do not approve third-party build scripts unless a reviewed dependency needs
them for documented core functionality. ADR 0007 also prohibits approving tools
that install agent skills or add unrequested MCP servers. If a package reports
"agent skills awaiting approval" (Fallow does), leave them unapproved. Existing
project skills are tracked in `.agents/skills/` and `skills-lock.json`.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Develop, build, and serve the Next.js application. |
| `pnpm setup:github` | Configure repository settings and branch protection rulesets via GitHub CLI. |
| `pnpm lint` / `pnpm lint:ci` / `pnpm format` | Biome check, CI check, and formatting. |
| `pnpm typecheck` | Generate route types and run `tsc --noEmit -p tsconfig.build.json`. |
| `pnpm test` | Fast `unit` Vitest project in `jsdom`. |
| `pnpm test:watch` / `pnpm test:coverage` | Watch mode / coverage (writes `coverage/`). |
| `pnpm test:logging` | Run logging and diagnostic test suite. |
| `pnpm test:browser` | `browser` Vitest project in Chromium. |
| `pnpm test:e2e` | Functional Playwright specs (excludes `@a11y` and `@visual`). |
| `pnpm test:auth` | Run Playwright's `auth-emulator` project with Firebase Auth, Firestore, and Functions via `firebase emulators:exec`; install the separate Functions dependencies first. |
| `pnpm test:a11y` | Axe accessibility scans. |
| `pnpm test:visual` | Compare screenshots with baselines. Never rewrites them. Skipped locally; runs in CI (or with `PLAYWRIGHT_VISUAL=1`). |
| `pnpm test:visual:update` | Rewrite baselines. Run it through the **Update visual baselines** workflow, not on your machine. |
| `pnpm test:mutation` | Stryker on selected logic (manual dispatch only in hosted CI until verified; see limitations). |
| `pnpm emulator` | Start local Firebase Auth Emulator. |
| `pnpm emulator:seed` | Seed test user accounts into the running Firebase Auth Emulator (`node scripts/emulator/seed.mjs`). |
| `pnpm emulator:clear` | Clear all accounts from the Firebase Auth Emulator (`node scripts/emulator/clear.mjs`). |
| `pnpm ladle` / `pnpm ladle:build` | Serve or build the component workbench (`reports/ladle`). |
| `pnpm check:architecture` | dependency-cruiser. |
| `pnpm check:unused` | Knip. |
| `pnpm check:duplicates` | jscpd. |
| `pnpm check:structure` | ast-grep rule tests, then a scan of application code. |
| `pnpm check:routes` | Enforce thin `page.tsx`, `layout.tsx` and `template.tsx` entrypoints with AST tests. |
| `pnpm check:components` | Test/enforce hook filename/export parity for owned private hooks, component names, compound parts, props forwarding, profile action/parent safety, and client boundaries. Presentation-only hooks do not need wrapper hooks. Registry code excluded. |
| `pnpm check:responsiveness` | Test and enforce responsive contracts: device-width viewports, no zoom restrictions, fluid widths <= 320px, and WCAG 2.2 touch targets (`node --test scripts/check-responsiveness.test.mjs && node scripts/check-responsiveness.mjs`). |
| `pnpm check:spelling` / `pnpm check:markdown` | CSpell / markdownlint. |
| `pnpm check:security` / `pnpm check:security:rules` | Semgrep scan of `src` (fails on findings) / tests of the Semgrep rules. Run inside a Git work tree. |
| `pnpm check:secrets` / `pnpm audit` | Gitleaks / dependency audit. |
| `pnpm check:workflows` | actionlint and zizmor on `.github/workflows`. |
| `pnpm analyze:health` | Unit tests with coverage, then Fallow complexity and CRAP. |
| `pnpm analyze:react` | React Doctor. |
| `pnpm analyze:size` | Production build, then Size Limit budgets. |
| `pnpm analyze:bundle` | Next.js bundle analyzer. |
| `pnpm analyze:lighthouse` | Lighthouse report against a running server. |
| `pnpm analyze:lighthouse:ci` | Same, headless with `--no-sandbox` and an `.html` report path; used by the scheduled workflow. |

### Verification entry points

| Command | Responsibility | Time |
| --- | --- | --- |
| `pnpm verify:fast` | Biome CI, typecheck, unit tests, ast-grep structural checks, route guard, component naming/boundary guard, and responsiveness guard (`check:responsiveness`). Meant to run constantly. | seconds |
| `pnpm verify:static` | Biome CI, typecheck, unit tests with coverage thresholds, architecture, unused code, duplication, structural rules, route/component/responsiveness guards, spelling, Markdown, Fallow health, and React Doctor. The CI `static` job. | minutes |
| `pnpm verify:build` | Browser tests, production build with size budgets, and the Ladle build. The CI `build` job. | minutes |
| `pnpm verify:full` | `verify:static` then `verify:build`. | minutes |
| `pnpm verify:e2e` | Ordinary Playwright suite: functional, accessibility, and visual; emulator cases run independently. | minutes |
| `pnpm verify:security` | Semgrep rule tests and scan, Gitleaks, workflow linting, and the dependency audit. Needs the host tools; the same checks run in the CI `security` job. | seconds |

`verify:full` intentionally excludes Playwright, security scanners, mutation
testing, and Lighthouse because they are slow or need host tools. Run
`verify:e2e` and `verify:security` before opening a pull request that touches
what they cover.

See [TESTING.md](TESTING.md) for the test strategy and workflows.

## Application libraries

The application additionally uses React 19, `next-intl`, `next-themes`, Lucide
icons, and the locally owned shadcn/ui component source. These are application
libraries rather than developer tools; see `package.json` for their complete,
current list. Internationalization starts at `src/i18n/request.ts`, and the
theming decision is recorded in ADR 0003.

## Configuration sources

| File | Responsibility |
| --- | --- |
| `package.json` | Dependencies, scripts, and `lint-staged`. |
| `pnpm-workspace.yaml` | Native-build allowlist, security `overrides`, and `auditConfig`. |
| `next.config.ts` | Next.js, Turbopack, React Compiler, and `next-intl` configuration. |
| `tsconfig.json` | TypeScript compiler settings, editor project, and the `@/*` alias. |
| `tsconfig.build.json` | Application typecheck and Next.js build settings, inherited from `tsconfig.json`. |
| `biome.json` | Biome formatting, linting, and custom-rule configuration. |
| `.biome/rules/nextjs/*.grit` | GritQL source for project-specific Biome rules. |
| `components.json` | shadcn/ui configuration and import aliases. |
| `scripts/check-route-files.mjs`, `scripts/check-route-files.test.mjs` | Thin App Router entrypoint AST guard and tests. |
| `scripts/check-component-conventions.mjs`, `scripts/check-component-composition.mjs` | Owned component naming/family conventions and adapter forwarding; regression tests are colocated `*.test.mjs` files. |
| `scripts/check-responsiveness.mjs`, `scripts/check-responsiveness.test.mjs` | Enforces viewport metadata, rigid width prevention (>320px), and WCAG 2.2 touch target minimums; regression tests in colocated `*.test.mjs`. |
| `vitest.config.mts` | `unit` and `browser` projects and coverage. |
| `vitest.mutation.config.mts` | Unit-only Vitest config used by Stryker. |
| `playwright.config.ts` | Playwright projects, web server, and screenshot tolerance. |
| `.ladle/config.mjs`, `.ladle/vite.config.mjs`, `.ladle/components.tsx` | Ladle stories glob, Vite (Tailwind, `@` alias), and global providers and CSS. |
| `.size-limit.json` | Size budgets for `.next/static/chunks`. |
| `sgconfig.yml`, `.ast-grep/` | ast-grep rules and their snapshot tests. |
| `knip.jsonc`, `.dependency-cruiser.cjs`, `.jscpd.json`, `.fallowrc.json`, `doctor.config.json` | Analysis tool configuration. |
| `cspell.json`, `.markdownlint-cli2.jsonc` | Documentation quality. |
| `tests/semgrep/` | Semgrep rules and their annotated test fixture. |
| `.github/dependabot.yml` | Weekly grouped npm, GitHub Actions, and mirror-file updates. |
| `.github/dependabot-mirror/` | Dockerfile and `requirements.txt` that let Dependabot bump the Playwright image and the pip-installed CI tools. |
| `.github/workflows/scheduled-quality.yml` | Weekly Lighthouse; Stryker by manual dispatch only until hosted CI is verified. |
| `.husky/`, `commitlint.config.mjs`, `.pre-commit-config.yaml` | Git hooks and commit validation. |
| `.github/workflows/ci.yml` | Continuous integration. |
| `.github/workflows/visual-baselines.yml` | Manual workflow that regenerates the visual baselines in CI. |
| `.github/rulesets/default-branch.json` | Branch protection rules applied by `pnpm setup:github`. |
| `.gitattributes` | Enforces LF line endings so Biome and hooks behave the same on Windows. |
| `.agents/agents.json` | Agent and MCP configuration. |

Generated output (`reports/`, `coverage/`, `.next/`, `test-results/`,
`playwright-report/`, `.stryker-tmp/`, `graphify-out/`) is ignored. Ladle
configuration in `.ladle/` is versioned; only its build output is ignored.

## Custom rule registry

Native rules are preferred; every custom rule below exists because no native
rule, type constraint, or specialized tool covers it. Add a row here, with
valid and invalid tests, before registering a new custom rule.

| Rule | Owner | Severity | Scope | Why it is not native |
| --- | --- | --- | --- | --- |
| `thin-route-entrypoints` | TypeScript AST (`scripts/check-route-files.mjs`) | error | App Router entrypoints (page.tsx, layout.tsx, template.tsx) | Next.js allows arbitrary state and branch logic inside route files. This enforces thin entrypoints where client state, effects, and mutation logic are extracted into semantic `_components` or `_hooks` modules. |
| `responsiveness-contracts` | TypeScript AST (`scripts/check-responsiveness.mjs`) | error | Root layout, App Router routes, and owned components (`src/app/**`, `src/components/**`) | Next.js and TypeScript allow arbitrary viewport configs, rigid pixel widths, and tiny interactive controls. This enforces WCAG 1.4.4 viewport scalability, WCAG 1.4.10 reflow at 320px, and WCAG 2.2 SC 2.5.8 touch target minimums (24x24px). Tests live in `scripts/check-responsiveness.test.mjs`. |
| `owned-component-composition` | TypeScript AST (`scripts/check-component-composition.mjs`) | error | All owned component modules, Server and Client, through `pnpm check:components` | TypeScript permits dropping inherited props and constructing static compound APIs; this enforces our separate-named-export and adapter-forwarding contract. Checks matching direct JSX roots, remaining props and extracted children/className. Tests live in `scripts/check-component-composition.test.mjs`. [Coverage and limits](CODING_STANDARDS.md#composition-guard-coverage). |
| `owned-component-family` | TypeScript AST (`scripts/check-component-conventions.mjs`) | error | All owned component modules, Server and Client | Root-prefixed family names, filename/export matching, local function declarations, and exact filename-to-component term parity (`checkStemComponentTermParity`, e.g. `HomeSectionClient` in `src/app/_components/home-section-client.tsx`) are repository conventions that TypeScript and Next.js allow alternatives to. Preserves the existing direct client-boundary checks, with type-only imports excluded. The complete RSC graph remains a Next.js build responsibility. |
| `owned-component-behavior` | TypeScript AST (`scripts/check-component-conventions.mjs`) | error | Owned component functions | Enforces imported application orchestration hooks and declarative rendering. Native presentation hooks (`useId`, `useTranslations`, `useFormatter`, `useFormContext`, `useWatch`) may be called directly in any supported combination; this restriction is a local convention, not a React rule. See [.agents/rules/component-naming.md](.agents/rules/component-naming.md). |
| `owned-component-naming` | TypeScript AST (`scripts/check-component-conventions.mjs`) | error | Owned TypeScript modules throughout `src` | Rejects generic View/Screen naming terms while preserving external API names through local aliases. Vendor and fixture exclusions apply. |
| `profile-direct-parent-chain` | TypeScript AST (`scripts/check-component-conventions.mjs`) | error | Profile Card, Form, and action composition | Validates immediate JSX parent relationships and action safety. Extra wrappers can alter slots even when a matching ancestor exists. See [.agents/rules/form-architecture.md](.agents/rules/form-architecture.md#direct-parent-relationships). |
| `prefer-page-props` | Grit (Biome plugin) | error | `export default async function Page({ params }: {...})` | Next.js accepts compatible hand-written types, so TypeScript will not reject them. This enforces the generated `PageProps<"/route">` helper ([Next.js docs](https://nextjs.org/docs/app/api-reference/file-conventions/page)). Convention, not a framework requirement. |
| `prefer-layout-props` | Grit (Biome plugin) | error | `export default function Layout({ children }: { children: ReactNode })` | Same reasoning for `LayoutProps<"/route">`. `Readonly<{ children: ReactNode }>` is not matched. |
| `prefer-route-context` | Grit (Biome plugin) | error | Route Handlers `GET`/`POST`/`PUT`/`PATCH`/`DELETE` with a hand-written `{ params }` | Same reasoning for `RouteContext<"/route">`. |
| `no-document-write` | Grit (Biome plugin) | error | `document.write`, `document.writeln`, `window.document.write`, `window.document.writeln` | Deprecated DOM APIs degrade HTML parser performance and introduce XSS risks. TypeScript only flags them as editor suggestions (`TS6387`), which `tsc --noEmit` omits in CI. |
| `review-effect-custom-hook` | ast-grep | warning | `useEffect` and `React.useEffect` in app-owned TSX under `src/` | Prompts review of whether the Effect would be clearer inside a descriptive custom Hook, following [React's guidance](https://react.dev/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks). This is a judgment call, so it warns without blocking commits or CI. |
| `review-redundant-state-effect` | ast-grep | warning | `useEffect` calls setting state (`set[A-Z]...`) in `src/app`, `src/components`, `src/hooks` | Prompts review of setting state inside Effects based on dependencies, following React's [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) guideline. Derived values should be calculated during render, and state updates handled in event callbacks to avoid unnecessary cascading renders. |
| `review-stateful-component-hook` | ast-grep | warning | A component function combining `useState` and `useEffect` in app-owned TSX under `src/` | Prompts review of extracting related component state and Effects into a component-specific custom Hook, while allowing independent Hooks to remain. React permits custom Hooks to compose other Hooks ([Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level)); Next.js supports colocating route code in [private folders](https://nextjs.org/docs/app/getting-started/project-structure#private-folders). This project heuristic warns without blocking commits or CI. |
| `no-manual-memoization-ts` / `-tsx` | ast-grep | warning | `useMemo`, `useCallback`, `memo` in `src/app`, `src/hooks`, `src/i18n`, `src/lib` | No native Biome rule. React Compiler makes most of these redundant but [React still documents them as escape hatches](https://react.dev/learn/react-compiler/introduction), so this is a hint, not an error. Keep the call and comment the reason when it is intentional. |
| `no-dynamic-tailwind-class` | ast-grep | error | `className` values and `cn`/`clsx`/`cva` calls in app code (vendored files excluded) | Template literals such as `bg-${color}-500` are never generated because [Tailwind scans for complete class names](https://tailwindcss.com/docs/detecting-classes-in-source-files). Functional, not stylistic; no native Biome rule. |
| `no-hardcoded-ui-attribute` | ast-grep | warning | `aria-label`, `aria-description`, `title`, `placeholder`, `alt` with a literal containing letters | `noJsxLiterals` runs with `ignoreProps`, so attributes are unchecked. A warning because brand names and similar values need judgment; `alt=""` is allowed. |
| `review-route-test-sdk-mock` | ast-grep | warning | `vi.mock` calls for backend SDKs (`firebase/` or `@/lib/firebase/`) in App Router route-level tests under `src/app/` | Prompts review of broad backend SDK mocking inside route tests. Per official Next.js guidelines and `CODING_STANDARDS.md`, route tests should validate route navigation contracts (as in `src/app/(public)/routes.test.tsx`), while client features should be tested in colocated component tests and SDK integration verified in E2E tests. |
| `require-button-props` | ast-grep | error | Type or interface declarations matching `*ButtonProps$` in `src/app` and `src/components` | Custom button components should extend `ComponentProps<typeof Button>` or `ComponentProps<"button">` so they inherit standard button properties (className, disabled, onClick) and remain composable. |
| `require-component-props` | ast-grep | error | Type or interface declarations ending in `*Props$` in app-owned `src/app` and `src/components` | Component prop types in application code should inherit standard element properties directly or through intersections (via `ComponentProps<...>`, `HTMLAttributes<...>`, or `PropsWithChildren`) so components remain composable and support `className` pass-through. Helpers nested in object members, wrapper arguments, or union alternatives do not establish inheritance. |
| `require-field-data-invalid` | ast-grep | error | `<Field>` rendered inside a Controller consuming `fieldState` in `src/app` and `src/components` | Enforces binding `data-invalid` to `<Field>` when `fieldState` is used, ensuring proper error styling and accessible ARIA attribute propagation per `CODING_STANDARDS.md`. |
| `require-form-provider` | ast-grep | error | `<form>` elements in composite form orchestrators (`*-form.tsx`) in `src/app` and `src/components` | Enforces wrapping composite forms in `<FormProvider>` or `<Form>` to eliminate prop-drilling of form controls into child field components. |
| `require-component-props-parameter` | ast-grep | error | Owned `_components` TSX functions with no parameters | Enforces a declared props parameter; the TypeScript AST composition guard and tests must ensure the parameter is actually used and forwarded. |
| `review-route-special-files-logic` | ast-grep | error | App Router special files (`page.tsx`, `layout.tsx`, `template.tsx`) under `src/app/` using `useState` or `useEffect` | Rejects direct `useState`/`useEffect` calls inside the three configured route file kinds; the separate route AST guard covers broader violations. Route entry points should remain thin presentation/glue layers; state and effects must be extracted into semantic client components under `_components/` or private hooks under `_hooks/`. |
| `no-excessive-cognitive-complexity` | Biome | error | Functions in application code under `src/` | Enforces a maximum cognitive complexity of 15 per function (`lint/complexity/noExcessiveCognitiveComplexity`), preventing high cyclomatic branching and unmaintainable stateful procedures. |
| `no-server-api-in-client-components` | Semgrep | error | `"use client"` files importing `next/headers` | Complements `no-server-only-in-client-components`; fails with a clear message before the framework build error. |
| `session-cookie-must-be-http-only` | Semgrep | error | a `.set()` call whose cookie name contains session, token, auth or sid, without `httpOnly: true` and `secure: true` | [Next.js authentication guide](https://nextjs.org/docs/app/guides/authentication). Matches by cookie name only, so unrelated cookies (theme, locale) are never flagged. |
| `no-ignored-build-errors` | Semgrep | error | `ignoreBuildErrors: true` in `src` and `next.config.ts` | Dangerous build configuration; no native rule. |
| Other Semgrep rules in `tests/semgrep/rules.yml` | Semgrep | error | `src` | Env access in client components, `eval`, HTML sinks, `dangerouslySetInnerHTML`, and secrets in `NEXT_PUBLIC_` names. `API_KEY` is deliberately not treated as a secret (public Firebase web keys). Each rule has valid and invalid cases in `tests/semgrep/rules.tsx`. |

### Reference repositories surveyed

The 156 distinct rule and config files across `notes-app` (`dev`,
`firebase/file`, `old-11`) and `exams-app` (`main`,
`chore/development-quality-tooling`) were reviewed by name and grouped. Only
the rules above were adopted. The rest fall into these groups, none of which
is reintroduced:

- **Next.js 16 removed or deprecated APIs** (`next16-*`, `app-router-legacy-*`,
  `async-*-access`): `next build` and generated types already reject them.
- **Props, variants, Base UI and Accordion/ToggleGroup APIs** (`base-ui-*`,
  `shadcn-*-props`, `component-props-type`): TypeScript.
- **shadcn composition and anatomy** (`shadcn-*`, `*-composition`,
  `*-title`): optional recommendations that a same-file pattern cannot judge
  (extracted composition is valid). They stay in the shadcn skill; behavior is
  covered by axe and Playwright.
- **Hooks placement and inline components** (`exported-hook-location`,
  `extract-stateful-hooks`, `no-inline-hook-definition`): Biome
  `noNestedComponentDefinitions` and `useHookAtTopLevel`. The repository additionally requires component-named
  orchestration hooks in separate hook modules, as registered above.
- **Effects and state** (`react-effect-set-state`, controlled/uncontrolled
  rules): React Doctor and TypeScript.
- **Tailwind style preferences** (`logical-properties`, `no-inline-styles`,
  semantic-color and spacing rules): optional preferences; Biome gets native
  rules when upgraded.
- **i18n** (`next-intl-*`): JSX text is covered by `noJsxLiterals`, keys by
  typed next-intl, catalogs by `messages.test.ts`. Dynamic keys and imperative
  toast messages need explicit review; the template
  now uses the Base UI toast manager, and those messages must use locale catalogs.
- **Security** (`next-*` server rules): see "Security checks not adopted".

### Native Biome rule evaluation history

The following evaluation was recorded against Biome 2.4.2. The repository now
pins Biome 2.5.15; `biome.json` defines the enabled rules. Historical absence
from 2.4.2 is not evidence that a rule is absent from the installed version.
Recheck current documentation before adding a replacement rule.

- **Enabled:** `noJsxLiterals` (`ignoreProps`), `noReactForwardRef` (React 19
  passes `ref` as a prop; relaxed for vendored components), and the `next` and
  `react` domains, which include `noNestedComponentDefinitions`,
  `useHookAtTopLevel`, and `useExhaustiveDependencies`.
- **Native async client-component check:** Biome 2.5.15 provides
  `lint/correctness/noNextAsyncClientComponent`, enabled by the configured
  Next.js domain. Its diagnostics cover default exports, inline named exports,
  and local named functions exported separately. Keep this responsibility in
  Biome instead of duplicating it in the custom component guard.
- **Not available in 2.4.2:** `noInlineStyles`, `noTailwindRawColors`,
  `noTailwindArbitraryValue`, `useTailwindShorthandClasses`. Revisit after a
  Biome upgrade; do not reintroduce them as Grit rules.
- **Not adopted:** `noNamespaceImport` (only flags `import * as React`, which the
  shadcn convention uses, and vendored Radix/Base UI wrappers);
  `noDeprecatedImports` (needs the project scanner, about 5x slower on every
  lint-staged run, and only flagged vendored files); `noFloatingPromises` (still
  in `nursery`); `noRestrictedImports` for `next/link` (ADR 0004 prefers the
  localized `@/i18n/navigation` helpers, but `src/app/page.tsx` uses external
  links; adopt it once locale-prefixed internal links exist).
- **Security checks not adopted:** unsafe Server Action input handling, missing
  authorization near sensitive operations, and private data in shared caches.
  Browser Firebase Auth, Firestore preferences, and Storage uploads now exist;
  there are no application Server Actions or server DAL to validate these
  particular checks against. `.parse()` or `throw` does not prove safety, and
  Next.js rejects `cookies()` or `headers()` inside `"use cache"`. Firebase
  Security Rules own client SDK access control; Gitleaks owns secret detection.
  Reassess taint-mode rules when server data access is introduced.
- **Left to TypeScript:** component props, variants, Base UI and Accordion /
  ToggleGroup APIs, and async `params`. No Grit rule duplicates them.

## State and integration ownership

- Use one discriminated `status` union for mutually exclusive loading,
  hidden, error, and ready branches. The `prefer-is-error` Grit plugin was
  deleted because it required duplicate `isLoading`/`isError` flags.
  TypeScript and component tests validate status branches; Biome keeps
  native React lint rules. Do not reintroduce an equivalent custom rule.
- Native presentation hooks may be composed directly. The AST hook guard
  is scoped to application orchestration, not to every call beginning with
  `use`. A one-line wrapper around `useId` and `useFormContext` does
  not improve separation of concerns.
- Use a typed adapter interface at service boundaries when it improves
  test isolation (`ProfileDependencies` in `src/lib/profile.ts`).
  Do not expose Firebase SDK instances to UI field components.
- This profile has exactly one `FieldGroup` under
  `ProfileFormClientContent`, and `formState.isSubmitting` is the
  source of truth for submission activity.
- `Suspense` does not make an effect-based Firebase Auth subscription
  suspend. Do not wrap it in artificial Promises solely for loading UI.
  See [React standards](CODING_STANDARDS.md#suspense-actions-and-preserved-state).

## Known limitations

- **Firebase registry source has targeted tooling exclusions.** Biome (so
  `lint-staged` does not rewrite the full generated set), CSpell, jscpd, coverage,
  Fallow health, and React Doctor skip `src/components/firebase`; Knip ignores its
  unresolved imports. TypeScript includes the directory and checks all its files.
  See
  [ADR 0008](docs/adr/0008-install-firebase-ui-registry.md).
- **Vendored components are excluded from coverage, Fallow health, React Doctor,
  and relaxed in Biome.** Formatting and import organization are disabled for the
  distributed shadcn/ui and AI Elements files; the existing targeted lint
  exceptions still apply. The exclusions cover the preinstalled shadcn/ui files
  (`src/components/ui/*.tsx`) and `src/components/ai-elements/`. Project code
  that lives beside them, such as `src/components/ui/extensions/`, is fully
  checked. The upstream `src/app/typeset.css` is not auto-formatted, and
  standalone `public/*.svg` assets are excluded from Biome; accessible names
  must still be supplied at their points of use. Fallow's coverage-match count can include vendored functions in its
  denominator. Inspect the current report before interpreting that count; it is
  not a fixed project metric.
- **CI hotspot analysis needs history.** The `static` job checks out with
  `fetch-depth: 0` so Fallow can compute hotspots; other jobs use shallow clones
  except `security`, which Gitleaks needs in full.

- **Stryker uses the `command` runner.** The native `@stryker-mutator/vitest-runner`
  10.0.0 does not work with Vitest 5.0.5: mutants inside functions are never
  activated and always survive (a ~5% score), and neither a non-hidden temp
  directory nor `inPlace` changes that. The `command` runner activates mutants
  through `__STRYKER_ACTIVE_MUTANT__` and works, at the cost of running the unit
  tests once per mutant (about 10 minutes for the four targets). Switch back to
  the `vitest` runner when it supports Vitest 5.
- **Dependency audit exception.** `braces` (GHSA-vfj7-8cjw-p6xm) has no patched
  release according to the recorded template assessment: the maintainer closed
  [micromatch/braces#84](https://github.com/micromatch/braces/issues/84) as
  not-to-fix and disputes the advisory. The recorded dependency chain includes
  `fast-glob`, `globby`, `markdownlint-cli2`, and `shadcn`. Recheck
  `pnpm why braces` and current advisories after dependency changes rather than
  assuming that chain or remediation status remains unchanged. The advisory is
  ignored in `auditConfig`. It is reached only through
  developer tools (shadcn CLI, Ladle, markdownlint) that expand fixed, trusted
  glob patterns. Remove the exception if the advisory is withdrawn or the chain
  drops `braces`; a local `pnpm patch` is not worth maintaining for this
  exposure.
- **Fallow has both blocking and advisory results.** Configured complexity
  thresholds can fail `verify:static`; scores, hotspots, and unused
  dependency suggestions also require review. Do not call a failed Fallow
  threshold advisory. The direct-child `src/components/ui/*.tsx` glob
  does not cover `ui/extensions/`; the experimental `.biome/` folder is
  excluded from health analysis but tested separately.
- **React Doctor reports are advisory.** The currently observed React Compiler, repeated JSX, and public Firebase API key naming findings require code-level triage. They are not evidence that CI has enforced or fixed them.
- **Firebase Emulator setup regression resolved (2026-10-23).** Run
  [39970721905](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/39970721905)
  failed profile journeys and showed Google popup flakiness because the
  `recordUsage` callable was unavailable. Run
  [39973720187](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/39973720187)
  passed all required jobs after CI installed the Functions package and
  launched Auth, Firestore, and Functions together. Keep the three-emulator
  setup in place and investigate any future popup retries.
- **Visual tests run only in CI.** Baselines are Linux screenshots, generated and
  compared inside the pinned Playwright container (the `container` image in
  `ci.yml` and `visual-baselines.yml`), to reduce rendering differences between baseline generation and comparison.
  Locally the visual specs are skipped. Keep the image tag and digest in step with
  the `@playwright/test` version in `package.json` when you upgrade Playwright.

## Agent tooling

Reusable agent skills and MCP configuration live in `.agents/`. Run
`agents sync` after changing `.agents/agents.json` or reusable skills, and use
`agents sync --check` before opening a pull request that changes them.

The configured MCP servers are Serena and Next.js DevTools. The installed
seven skills are `ask-matt`, `context7-cli`, `firebase-basics`,
`firebase-auth-basics`, `save`, `setup-matt-pocock-skills`, and `shadcn`;
see the [agent inventory](.agents/README.md). Configuration does not guarantee
that an external executable is installed or a server is running.

Use Context7 when current library documentation is needed. The project-local
`context7-cli` skill documents its two-step library lookup and documentation
query flow.

## Firebase Web SDK and Authentication

Create a Firebase project and register a Web app in the Firebase Console. Copy
its Web SDK values into `.env.local` using `.env.example`; these public values
are included in the browser build. Never place Admin SDK credentials or private
keys in these variables. Restart the development server after changing them.

In Authentication, enable Email/Password. Enable Google and set
`NEXT_PUBLIC_FIREBASE_GOOGLE_ENABLED=true` only if Google sign-in is desired;
configure the project support email and OAuth consent screen as required by the
Console. Add each development and deployment hostname to Authentication's
authorized domains, including `localhost` if needed. Google sign-in uses
Firebase's configured `authDomain`; review Firebase's OAuth domain guidance if
using a custom domain. FirebaseUI uses its default popup provider strategy in
ordinary browsers and its supported redirect provider strategy when the browser
user agent identifies Electron (`Electron/`), avoiding Electron popup relay
incompatibility without a separate OAuth implementation.

Review the password-reset and email-verification email templates and authorized
continue URLs in the Console. Firebase sends password-reset emails through the
registry form. This template does not send verification emails automatically or
require verified email; add that policy only when the product requires it. The
Web SDK's default browser persistence retains sign-in across browser restarts
where supported. Test shared-device requirements before changing persistence.

The auth routes use the shared browser Auth instance and return authenticated
users to `/`. They do not protect server resources or establish a server session.
Add independent server-side token verification and authorization for any future
protected data or actions. The `(public)` group is organization only. Unit tests
must mock Firebase or use the Auth Emulator; CI must not need production keys.
Real provider configuration, OAuth popup behavior, email delivery, and MFA need
verification against a configured Firebase project or emulator as appropriate.
For local emulator development, define both `FIREBASE_AUTH_EMULATOR_HOST` (for Next.js rewrites and tooling) and `NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST` (for browser Firebase Auth). For browser Firestore, use `NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST`; keep server-only `FIRESTORE_EMULATOR_HOST` out of the Next.js `env` option. No server-only endpoint is injected into the browser bundle.

For local emulator development, define `FIREBASE_AUTH_EMULATOR_HOST` (for example,
`localhost:9099`) in `.env` with a local project ID. For Electron redirect OAuth,
Next proxies the Auth Emulator handler and Auth REST endpoints through the app origin
in development; the variable remains the actual emulator endpoint, not the Next.js
port. Keep the app and configured emulator on a consistent loopback hostname (for
example, `localhost`, not a mixture of `localhost` and `127.0.0.1`). Auth emulator
use is limited to development. In-code default fallback values are removed; environment
configuration in `.env` is required. For production, omit emulator variables and
configure the real Web app values at build time. Browser code that uses Realtime Database or callable Cloud
Functions must use `NEXT_PUBLIC_FIREBASE_DATABASE_EMULATOR_HOST` and
`NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_HOST`, respectively. Configure
`NEXT_PUBLIC_FIREBASE_DATABASE_URL` when using Realtime Database outside the emulator.
Task queues, Pub/Sub, Extensions, and Admin SDK operations are server-side services:
implement them in `functions/`, never in `src/lib/firebase/client.ts`. See
[TESTING.md](TESTING.md#first-time-setup) for the isolated browser suite. For
interactive local development, run `pnpm dev` with the emulator variables in `.env`.
The operational commands for the Firebase Auth Emulator are:

- `pnpm emulator`: starts the local Auth Emulator. The Emulator Suite UI is
  accessible at `http://127.0.0.1:4000/auth`.
- `pnpm emulator:seed` (`node scripts/emulator/seed.mjs`): sends seed test accounts to the running emulator for
  local development and testing.
- `pnpm emulator:clear` (`node scripts/emulator/clear.mjs`): clears all accounts in the emulator.

See [Firebase setup](https://firebase.google.com/docs/auth/web/start) and
[OAuth domain guidance](https://firebase.google.com/docs/auth/web/redirect-best-practices).

## shadcn/ui CLI workflow

The project already has `components.json`. Use the installed CLI for repeatable
project work; use `pnpm dlx shadcn@latest` only when deliberately evaluating a
newer CLI. A CLI upgrade does not update copied component source automatically.

```bash
pnpm exec shadcn --version
pnpm exec shadcn info --json
pnpm exec shadcn docs button card field select toast
pnpm exec shadcn search @shadcn -q "card"
pnpm exec shadcn view @shadcn/card
pnpm exec shadcn add card --dry-run
pnpm exec shadcn add card --diff card.tsx
pnpm exec shadcn add card --view card.tsx
pnpm exec shadcn preset resolve --json
```

`docs` returns documentation and API URLs; read the returned pages. `view`
inspects registry metadata; `add --dry-run`, `--diff`, and `--view` resolve the
actual project paths and changes. The latter two imply a dry run. The standalone
`diff` command is deprecated. Review each affected source file, dependency,
stylesheet, and import before merging an update, preserving local changes.

`apply` changes an existing preset; `apply <code> --only theme,font` limits it
to those parts. A new style, base, icon library, or RTL migration requires a
scoped implementation review. `migrate cn` exists, but this project already
uses `cn` and re-exports it from `src/lib/utils.ts`; do not run it again just
to update documentation. Keep `shadcn/tailwind.css`: `eject` copies it into the
project and removes automatic upstream CSS updates.

No shadcn MCP server or custom registry publisher is configured. The only
explicit additional registry is `@firebase`. See
[the source review](docs/agents/shadcn.md) for the full upstream inventory and
[the persistent rule](.agents/rules/shadcn-ui.md) for the project workflow.

## Next.js documentation and CLI workflow

`package.json` pins Next.js 16.4.2. The
[complete source inventory](docs/agents/nextjs-sources.json) records the official
stable and current documentation revisions, including `errors/` messages.
The installed `node_modules/next/dist/docs/` bundle contains version-matched
Markdown generated from upstream MDX; its filenames and bytes can differ from
the repository sources. Do not compare generated `.md` bodies with source
`.mdx` hashes as if they were identical files.

Use the project's pnpm runner and inspect supported options before changing a
workflow:

```bash
pnpm exec next --version
pnpm exec next --help
pnpm exec next typegen --help
pnpm exec next info
pnpm typecheck
pnpm build
```

`pnpm typecheck` runs `next typegen` before TypeScript. Type generation loads
Next.js configuration in the production build phase and can require its
plugins, environment, and native dependencies even without a full build.
`next dev` and `next build` also generate route types. Do not hand-edit generated
`.next/types` or replace the configured `tsconfig.build.json` with an example.
`next lint` is removed in Next.js 16; Biome owns this project's lint commands.
Turbopack is the configured bundler; webpack-only configuration is not applied
by copying an example into it.

The existing Next.js DevTools MCP is configured in `.agents/agents.json`.
Runtime diagnostics require a running development server and a connected MCP
client; configuration alone does not prove a successful runtime inspection.
Context7 provides targeted current lookups; the immutable source inventory
establishes full reference scope and the installed version establishes API
compatibility. Neither lookup installs another MCP server or agent skill.

Next.js can maintain documentation guidance in `AGENTS.md`. Preserve its
managed block and keep project policies outside the markers. Upstream upgrade
reminders, `next upgrade`, and suggested codemods do not authorize a dependency
upgrade in a documentation-only task. Review package and lockfile changes on
a focused branch when an upgrade is requested.

### Next.js diagnostics and native guard ownership

| Concern | Owner | Boundary |
| --- | --- | --- |
| Framework exports, generated route types, invalid segment configuration, RSC and prerender constraints | Next.js build and TypeScript plugin | Depends on installed version and actual import/render graph |
| Async Client Components | Biome `noNextAsyncClientComponent` | Native Next.js domain rule; no duplicate custom implementation |
| Pages Router imports in owned App Router code | Biome `noRestrictedImports` in `biome.json` | `next/router`, `next/head`, `next/document`, `next/app`; regression-tested in `.biome/rules/nextjs/app-router-imports.test.ts` |
| Thin route entrypoints | Existing route AST guard and ast-grep | Stricter repository policy; does not claim Next.js forbids branching or all hooks universally |
| Component family and adapter contracts | Existing component AST guards | Repository conventions for owned components; full graph validation stays with Next.js |
| Actual freshness, navigation state, authorization, and cache isolation | Behavior tests, production E2E, and review | Syntax checks do not prove these properties |

The Pages Router import restriction includes owned `src/app`, `src/components`,
`src/hooks`, and `ui/extensions` code. Registry and generated sources retain
their existing exclusions. It uses a native rule with project configuration;
no new custom parser or framework diagnostic is introduced.

CSpell excludes the generated `docs/agents/nextjs-sources.json` evidence file,
whose upstream paths include historical API spellings and error identifiers.
The explanatory Next.js reference and canonical Markdown guides remain checked.

## React documentation and diagnostic workflow

`package.json` pins React and React DOM 19.3.1 and React Compiler 1.0.0.
The [official-source review](docs/agents/react.md) and
[complete source inventory](docs/agents/react-sources.json) record the exact
React documentation revision, current release, and runtime error catalog.
Documentation is maintained within a major version, so a live page is not
proof that its newest API exists in every React 19 installation.

Inspect installed versions and exports without upgrading packages:

```bash
pnpm list react react-dom babel-plugin-react-compiler --depth 0
pnpm exec biome explain noNestedComponentDefinitions
pnpm exec biome explain noReactPropAssignments
pnpm test
pnpm analyze:react
```

The Next.js `reactCompiler` option owns application compilation. The package's
presence does not enable Compiler in every Vite pipeline or prove every
component was optimized. React DevTools can inspect optimized components and
React performance tracks; actual profiling requires a running application.
Do not report a profiling session based only on configuration or a successful
source lookup.

### Native React guards and limits

| Concern | Enforcement | Limits |
| --- | --- | --- |
| Ordinary hook call order | Biome `useHookAtTopLevel`, existing React domain | Native diagnostics; React `use` retains its conditional/loop exception |
| Reactive Effect dependencies | Biome `useExhaustiveDependencies`, existing React domain | Does not establish cleanup, async ordering, or external-system correctness |
| Stable component type identity | Biome `noNestedComponentDefinitions`, explicit error for owned code | Rejects nested component definitions; does not prohibit every ordinary callback |
| Direct prop assignment | Biome `noReactPropAssignments`, explicit error for owned code | Does not prove deep immutability of all props, context, state, or hook results |
| React 19 ref convention | Existing Biome `noReactForwardRef` configuration | Project preference; upstream `forwardRef` is still available |
| Repository behavior ownership | Existing component and route AST guards | Stricter than the Rules of React; retains documented presentation-hook exceptions |
| Compiler eligibility and semantic React issues | Compiler, React Doctor, tests, and review | Biome does not implement every diagnostic documented for `eslint-plugin-react-hooks` |

The two newly explicit policies cover owned `src/app`, `src/components`, and
`src/hooks`, including `ui/extensions`, with existing registry exclusions.
`.biome/rules/react/native-rules.test.ts` exercises the actual configuration
without forcing rules on via CLI flags: invalid patterns, valid counterparts,
React `use`, ref props, each owned code area, and vendor exclusions. It runs in
the existing unit project and CI; no new parser, runner, or lint dependency is
introduced.

The prior tooling notes about the React domain did not establish that nested
component definitions were blocking by default. Explicit configuration and
regression probes now establish that behavior. Native diagnostic severity and
scope must be verified rather than inferred from a domain label.

Upstream `eslint-plugin-react-hooks` documentation is an API/reference source,
not a statement that ESLint is installed here. Keep Biome, React Doctor,
Compiler, and behavior-test responsibilities explicit before proposing another
lint stack. CSpell excludes only the generated React source inventory's
upstream identifiers; the explanatory review and canonical Markdown stay checked.

Next.js resolves the `server-only` boundary marker internally, so installing its
npm package is optional. `knip.jsonc` has a targeted dependency exception for
this framework marker; it does not suppress unresolved application imports.
Ladle imports the owned theme integration from `theme-provider-client.tsx`.
