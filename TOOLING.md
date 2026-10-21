# Tooling

## Tool inventory

This is the operational inventory of tools installed or configured by this
repository. It is not a catalog of every runtime library; `package.json` and
`pnpm-lock.yaml` remain the source of truth for those dependencies.

| Category | Tool | Version or status | Purpose | Source of truth |
| --- | --- | --- | --- | --- |
| Package management | pnpm | 12.11.2 | Installs dependencies and runs project commands. Do not use npm or Yarn to modify dependencies. | `package.json`, `pnpm-lock.yaml` |
| Application build | Next.js | 16.4.2 | App Router framework, development server, production build, and server runtime. | `package.json`, `next.config.ts` |
| Bundler | Turbopack | Included with Next.js | Bundles development and production builds; loads Tailwind CSS through `@tailwindcss/turbopack`. | `next.config.ts` |
| Language | TypeScript | `^5` (5.9.3 locked) | Provides type checking and the `@/*` import alias. | `package.json`, `tsconfig.json`, `pnpm-lock.yaml` |
| Compiler | React Compiler | 1.0.0 | Optimizes React components through Next.js configuration. | `package.json`, `next.config.ts` |
| Styling | Tailwind CSS | `^4` | Generates utility CSS and is loaded by Turbopack (and by Vite for Ladle). | `package.json`, `next.config.ts`, `.ladle/vite.config.mjs`, `src/app/globals.css` |
| Code quality | Biome | 2.5.15 | Formats code, runs lint checks, and organizes imports. | `package.json`, `biome.json` |
| Custom code quality rules | GritQL | Executed by Biome; no standalone CLI | Supplies project-specific rules for Next.js props/context and banning deprecated DOM APIs (`document.write`). Regression-tested in `.biome/rules/nextjs/rules.test.ts` and `.biome/rules/dom/rules.test.ts`. | `.biome/rules/nextjs/*.grit`, `.biome/rules/dom/*.grit`, `biome.json` |
| UI scaffolding | shadcn/ui CLI | 4.22.0 | Adds and maintains locally owned UI components using the configured aliases and style. | `package.json`, `components.json` |
| Component workbench | Ladle | 5.1.1 | Develops and reviews components in isolation through colocated `*.stories.tsx` files. | `.ladle/`, `package.json` |
| Unit and component testing | Vitest + React Testing Library | Vitest 5.0.5 | Runs colocated unit, hook, and component tests in `jsdom` (`unit` project). | `vitest.config.mts`, `package.json` |
| Property-based testing | fast-check | 4.10.2 | Generates inputs for pure logic such as `isLocale`. | `package.json`, `src/i18n/routing.test.ts` |
| Browser component testing | Vitest Browser Mode + `vitest-browser-react` | Chromium through Playwright | Runs `*.browser.test.tsx` files in a real browser (`browser` project). | `vitest.config.mts`, `package.json` |
| End-to-end testing | Playwright | `^1.64.1` | Runs `tests/*.spec.ts` against a production build. | `playwright.config.ts`, `tests/` |
| Accessibility testing | `@axe-core/playwright` | 4.14.0 | Scans pages for WCAG 2.x A/AA violations in Playwright (`@a11y`). | `tests/a11y.spec.ts` |
| Visual regression | Playwright screenshots | Linux baselines generated and compared in CI | Compares full-page screenshots against baselines (`@visual`). | `tests/visual.spec.ts`, `tests/visual.spec.ts-snapshots/` |
| Mutation testing | Stryker with the `command` runner | 10.0.0 (see [Known limitations](#known-limitations)) | On-demand mutation analysis of selected logic; runs the unit tests once per mutant. | `stryker.config.json`, `vitest.mutation.config.mts` |
| Unused code | Knip | 6.41.0 | Finds unused files, exports, and dependencies. | `knip.jsonc` |
| Architecture boundaries | dependency-cruiser | 18.6.0 | Enforces layering rules and forbids dependency cycles. | `.dependency-cruiser.cjs` |
| Structural rules | ast-grep | 0.51.0 | Enforces project conventions that need syntax awareness (currently a warning-level hint about manual memoization, per `CODING_STANDARDS.md`). Rules have snapshot tests. | `sgconfig.yml`, `.ast-grep/` |
| Duplication | jscpd | 5.4.1 | Reports meaningful duplicated code. | `.jscpd.json` |
| Complexity and health | Fallow | 3.33.1 | Reports complexity, CRAP score (from real coverage), and hotspots. Route-private hooks under `src/app/**/_hooks/` are included. `.ladle/` is excluded on purpose: it is tooling glue that Ladle loads by convention. Vendored `src/components/ui/*.tsx` and `ai-elements` are excluded; custom code under `ui/extensions/` is analyzed. Dead-code, duplication, and architecture analysis stay with Knip, jscpd, and dependency-cruiser. | `.fallowrc.json` |
| React diagnostics | React Doctor | 0.9.18 | Scans application React code for correctness, performance, and security issues. | `doctor.config.json` |
| Bundle budgets | Size Limit + `@size-limit/file` | 14.2.0 | Fails when generated client JavaScript or CSS exceeds its gzip budget. | `.size-limit.json` |
| Performance audit | Lighthouse | 13.5.0 | On-demand performance and accessibility report. | `package.json` |
| Spelling | CSpell | 10.4.0 | Checks spelling in code, JSON, and Markdown. | `cspell.json` |
| Markdown | markdownlint-cli2 | 0.23.3 | Lints repository Markdown. | `.markdownlint-cli2.jsonc` |
| Static security | Semgrep Community Edition | Host tool (CI pins 1.180.0) | Runs the project's security rules on `src` with `--error` so findings fail the run; `check:security:rules` tests them against an annotated fixture. | `tests/semgrep/rules.yml`, `tests/semgrep/rules.tsx`, `package.json` |
| Secret scanning | Gitleaks | Host tool (CI pins 8.30.1) | Scans the Git history for secrets with `gitleaks git --redact`. `detect` is deprecated upstream. | `package.json` (`check:secrets`) |
| Dependency audit | `pnpm audit` | Included with pnpm | Reports known vulnerable dependencies. | `pnpm-workspace.yaml` (`auditConfig`) |
| Continuous integration | GitHub Actions | Pinned by commit SHA | Runs `static`, `build`, `e2e`, `security`, and `pr-title` jobs in parallel on pull requests, pushes to `main`, and manual dispatch, plus a `ci-result` aggregate (see TESTING.md). | `.github/workflows/ci.yml` |
| Workflow linting | actionlint, zizmor | Host tools | Lint and audit the GitHub Actions workflows. | `package.json` (`check:workflows`) |
| Codebase graph | Graphify | Host tool | Builds an on-demand knowledge graph; output goes to the ignored `graphify-out/`. | None |
| Git hooks | Husky + lint-staged + Commitlint | 9.1.7 / 17.6.0 / 21.2.3 | Check staged files with Biome and validate commit messages. | `.husky/`, `package.json`, `commitlint.config.mjs` |
| Repository integrity | pre-commit | Host tool | Runs file-integrity hooks (large files, case conflicts, JSON/YAML, merge markers). | `.pre-commit-config.yaml` |
| Agent configuration | Agents CLI | Repository configuration; CLI is externally provided | Synchronizes reusable agent skills and MCP settings (Serena, Next.js DevTools). | `.agents/agents.json`, `.agents/skills/` |

## Host prerequisites

The repository's own dependencies install with `pnpm install`. These tools live
outside pnpm and are only needed for the commands noted next to them:

| Tool | Needed for | Check |
| --- | --- | --- |
| Node.js `^22.22.1 \|\| ^24.5.0` | Everything (`engines` in `package.json`) | `node --version` |
| Git | Biome VCS integration, hooks, Fallow hotspots | `git --version` |
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

Use [pnpm](https://pnpm.io/) `12.11.2`, as pinned by the `packageManager`
field in `package.json`. The `pnpm-lock.yaml` file is the lockfile of record.

Do not approve third-party build scripts unless a reviewed dependency needs
them for documented core functionality. ADR 0007 also prohibits approving tools
that install agent skills or add unrequested MCP servers. If a package reports
"agent skills awaiting approval" (Fallow does), leave them unapproved. Existing
project skills are tracked in `.agents/skills/` and `skills-lock.json`.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Develop, build, and serve the Next.js application. |
| `pnpm lint` / `pnpm lint:ci` / `pnpm format` | Biome check, CI check, and formatting. |
| `pnpm typecheck` | Generate route types and run `tsc --noEmit -p tsconfig.build.json`. |
| `pnpm test` | Fast `unit` Vitest project in `jsdom`. |
| `pnpm test:watch` / `pnpm test:coverage` | Watch mode / coverage (writes `coverage/`). |
| `pnpm test:browser` | `browser` Vitest project in Chromium. |
| `pnpm test:e2e` | Functional Playwright specs (excludes `@a11y` and `@visual`). |
| `pnpm test:a11y` | Axe accessibility scans. |
| `pnpm test:visual` | Compare screenshots with baselines. Never rewrites them. Skipped locally; runs in CI (or with `PLAYWRIGHT_VISUAL=1`). |
| `pnpm test:visual:update` | Rewrite baselines. Run it through the **Update visual baselines** workflow, not on your machine. |
| `pnpm test:mutation` | Stryker on selected logic (manual dispatch only in hosted CI until verified; see limitations). |
| `pnpm ladle` / `pnpm ladle:build` | Serve or build the component workbench (`reports/ladle`). |
| `pnpm check:architecture` | dependency-cruiser. |
| `pnpm check:unused` | Knip. |
| `pnpm check:duplicates` | jscpd. |
| `pnpm check:structure` | ast-grep rule tests, then a scan of application code. |
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
| `pnpm verify:fast` | Biome CI, typecheck, and the unit tests only. Meant to run constantly. | seconds |
| `pnpm verify:static` | Biome CI, typecheck, unit tests with coverage thresholds, architecture, unused code, duplication, structural rules, spelling, Markdown, Fallow health, and React Doctor. The CI `static` job. | minutes |
| `pnpm verify:build` | Browser tests, production build with size budgets, and the Ladle build. The CI `build` job. | minutes |
| `pnpm verify:full` | `verify:static` then `verify:build`. | minutes |
| `pnpm verify:e2e` | The whole Playwright suite: functional, accessibility, and visual. | minutes |
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
| `require-component-props` | ast-grep | error | Type or interface declarations ending in `*Props$` in app-owned `src/app` and `src/components` | Component prop types in application code should inherit standard element properties (via `ComponentProps<...>`, `HTMLAttributes<...>`, or `PropsWithChildren`) so components remain composable, support `className` pass-through, and conform to the shadcn design pattern. |
| `require-field-data-invalid` | ast-grep | error | `<Field>` rendered inside a Controller consuming `fieldState` in `src/app` and `src/components` | Enforces binding `data-invalid` to `<Field>` when `fieldState` is used, ensuring proper error styling and accessible ARIA attribute propagation per `CODING_STANDARDS.md`. |
| `require-form-provider` | ast-grep | error | `<form>` elements in composite form orchestrators (`*-form.tsx`) in `src/app` and `src/components` | Enforces wrapping composite forms in `<FormProvider>` or `<Form>` to eliminate prop-drilling of form controls into child field components. |
| `review-route-special-files-logic` | ast-grep | warning | App Router special files (`page.tsx`, `layout.tsx`, `template.tsx`, `loading.tsx`) under `src/app/` using `useState` or `useEffect` | Prompts review of stateful or side-effect logic colocated directly inside route special files. Route entry points should remain thin presentation/glue layers; state and effects must be extracted into semantic client components under `_components/` or private hooks under `_hooks/`. |
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
  `noNestedComponentDefinitions` and `useHookAtTopLevel`; hooks may be colocated.
- **Effects and state** (`react-effect-set-state`, controlled/uncontrolled
  rules): React Doctor and TypeScript.
- **Tailwind style preferences** (`logical-properties`, `no-inline-styles`,
  semantic-color and spacing rules): optional preferences; Biome gets native
  rules when upgraded.
- **i18n** (`next-intl-*`): JSX text is covered by `noJsxLiterals`, keys by
  typed next-intl, catalogs by `messages.test.ts`. Dynamic keys and toast
  literals are deferred until the template has toasts.
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
  The template has no auth, database, or Server Actions to validate rules
  against, `.parse()` or `throw` does not prove safety, and Next.js already
  rejects `cookies()` or `headers()` inside `"use cache"`. Gitleaks owns
  real secrets. Add taint-mode rules once a data access layer exists.
- **Left to TypeScript:** component props, variants, Base UI and Accordion /
  ToggleGroup APIs, and async `params`. No Grit rule duplicates them.

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
skills are `ask-matt`, `context7-cli`, `save`, `setup-matt-pocock-skills`, and `shadcn`;
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
authorized domains, including `localhost` if needed. Google popup sign-in uses
Firebase's configured `authDomain`; review Firebase's OAuth domain guidance if
using a custom domain. Redirect sign-in is not enabled.

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
For local emulator development, define `FIREBASE_AUTH_EMULATOR_HOST` (for example,
`127.0.0.1:9099`) in `.env` with a local project ID. Auth emulator use is limited to
development. In-code default fallback values are removed; environment configuration in
`.env` is required. For production, omit emulator variables and configure the real Web
app values at build time. Browser code that uses Realtime Database or callable Cloud
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
