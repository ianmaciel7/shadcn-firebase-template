# Testing

## Validation commands

Run the checks relevant to a change before opening a pull request. See
[TOOLING.md](TOOLING.md) for every command and the tools behind them.

| Command | Use it for |
| --- | --- |
| `pnpm verify:fast` | Code changes: Biome CI, typecheck, unit tests, route-entrypoint guard, owned-component naming/boundary guard, and responsiveness guard (`check:responsiveness`). Browser suites run separately. |
| `pnpm verify:full` | Before a pull request: `verify:static` (adds coverage thresholds, architecture, unused code, duplication, ast-grep structural checks, route/component/responsiveness guards, spelling, Markdown, complexity, React diagnostics) plus `verify:build` (browser tests, production build with size budgets, Ladle build). |
| `pnpm verify:e2e` | Changes that affect pages or visual output: functional, accessibility, and visual Playwright specs. |
| `pnpm verify:security` | Dependency or configuration changes: Semgrep rule tests and scan, Gitleaks, workflow lint, and `pnpm audit`. Needs the host tools in [TOOLING.md](TOOLING.md#host-prerequisites). |

For documentation-only changes, run `pnpm check:markdown` and
`pnpm check:spelling`, then verify relative links, referenced paths, and
commands against the repository. These checks do not replace CI; the pull
request still runs the configured jobs. Markdown lint intentionally excludes
agent files and ADRs 0001–0005, so review those manually when applicable.

`pnpm verify:fast` must stay fast. It runs only the `unit` Vitest project; browser,
end-to-end, visual, and mutation tests are deliberately outside it.

For a manual smoke test, run `pnpm dev` and verify the affected route in a
browser, including its loading, error, and localized states where applicable.

## Test layers

| Layer | Location and name | Runner | Command | Use for |
| --- | --- | --- | --- | --- |
| Unit and hook | `src/**/*.test.ts(x)` next to the source | Vitest `unit` project, `jsdom` | `pnpm test` | Functions, utilities, hooks, and business logic. |
| Property-based | Inside unit tests, with `fast-check` | Vitest `unit` | `pnpm test` | Pure logic with a large input space, such as `isLocale`. |
| Browser component | `src/**/*.browser.test.tsx` | Vitest `browser` project, Chromium | `pnpm test:browser` | Behavior that needs a real browser: responsive breakpoints, container queries (`@container`), focus, real events. |
| End-to-end / Responsiveness | `tests/*.spec.ts`, `tests/responsive.spec.ts` | Playwright | `pnpm test:e2e` | User journeys and responsive layout against a production build. `tests/responsive.spec.ts` covers multi-viewport matrix (320px, 390px, 768px, 1280px), horizontal overflow prevention (`scrollWidth <= clientWidth`), and WCAG 2.2 SC 2.5.8 touch target compliance. |
| Accessibility | `tests/a11y.spec.ts`, titled `@a11y` | Playwright and axe-core | `pnpm test:a11y` | Automated WCAG 2.0, 2.1, and 2.2 A/AA scans (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`) across desktop (`1280x800`) and mobile (`390x844`) viewports in light and dark mode. |
| Visual regression | `tests/visual.spec.ts`, titled `@visual` | Playwright screenshots (CI only) | `pnpm test:visual` | Layout and theme changes in rendered pages. |
| Mutation | `stryker.config.json` | Stryker | `pnpm test:mutation` | Command-runner mutation testing. Manual CI run until a hosted-run success is confirmed; see [TOOLING.md](TOOLING.md#known-limitations). |

Choose the lightest layer that can fail for the right reason. Keep a behavior
in `jsdom` when a stub is enough, and move it to Browser Mode only when the real
browser matters (for example, `use-mobile.browser.test.tsx` uses a real viewport
instead of a stubbed `matchMedia`).

## Test placement and scope

- Place Vitest unit tests for functions, utilities, hooks, and business logic
  next to their source module with `*.test.ts`.
- Place React component and JSX integration tests next to their source module
  with `*.test.tsx`. Use `*.browser.test.tsx` for Browser Mode tests.
- Place Playwright specifications in root `tests/` with `*.spec.ts`. Keep E2E
  fixtures and helpers there only when they are E2E-specific and shared.
- Do not create empty test directories or placeholder tests. Do not create a
  global `unit/`, `components/`, or `integration/` directory, nor a
  `__tests__/` folder for every component.
- Preserve App Router organization: colocating a test does not make a route
  public, and `_components` and `_lib` remain suitable private locations.
- Do not write a test only to make a tool report success. When a tool has no
  suitable subject yet, leave it unused and say so.

Six Vitest suites verify configuration rather than application behavior:
`src/messages/messages.test.ts` checks that every locale catalog has the same
keys and ICU arguments as the default locale and no empty messages, and
`.biome/rules/nextjs/rules.test.ts` and `.biome/rules/dom/rules.test.ts` lint
fixtures to prove each Grit rule reports invalid code and accepts valid code.
`.biome/rules/react/rules.test.ts` verifies the hook error-flag convention
and its file scope.
`.biome/rules/nextjs/app-router-imports.test.ts` verifies the native App Router
import policy and its exclusions.
`.biome/rules/react/native-rules.test.ts` verifies native React diagnostic
configuration, valid counterparts, and owned/vendor scope.
Semgrep rules are tested with `semgrep --test` (`pnpm check:security:rules`) and
ast-grep rules with `ast-grep test`.

Use Vitest with React Testing Library for synchronous units, components, and
integrations. Favor `getByRole` and other accessible queries. Test observable
behavior, not external-library internals; keep feature-specific mocks and
fixtures local until there is actual reuse. Use small snapshots only when their
output is the contract.

Use Playwright for browser journeys and asynchronous Server Components. Vitest
does not currently support async Server Components completely, so do not build
testing workarounds for them. Add MSW only when a shared network-mocking need
exists (ADR 0006).

At minimum, new tests should be deterministic, independent of external
services, and safe to run in CI. Mock network and clock dependencies where
needed. Do not store production credentials or personal data in test fixtures.

## Responsiveness testing and 2026 best practices

The repository enforces modern responsive web design standards and WCAG
accessibility requirements across three layers: static AST enforcement,
Vitest Browser Mode component tests, and Playwright end-to-end specifications.

### 1. Static responsiveness guard (`pnpm check:responsiveness`)

`scripts/check-responsiveness.mjs` runs in `pnpm verify:fast` and `pnpm verify:static`
to catch responsive anti-patterns and accessibility regressions before runtime:

- **Viewport scalability (WCAG 1.4.4 Resize Text)**: The root layout (`src/app/layout.tsx`)
  must export a `viewport` configuration (or `generateViewport`) declaring
  `width: 'device-width'` and `initialScale: 1`. Disabling zoom via `userScalable: false`,
  `maximumScale: 1`, or string `user-scalable=no` is strictly prohibited.
- **Rigid pixel width prevention (WCAG 1.4.10 Reflow)**: Flags fixed pixel widths
  greater than 320px (`w-[...px]`, `min-w-[...px]`, or inline `style={{ width: ... }}`)
  when used without responsive breakpoint prefixes (`sm:`, `md:`, `lg:`, `@*`) or fluid
  wrappers (`max-w-full`, `max-w-screen`, `max-w-[100%]`).
- **Touch target minimums (WCAG 2.2 SC 2.5.8 Target Size)**: Flags interactive
  elements (`<button>`, `<a>`, `<Link>`, or elements with `role="button"` / `onClick`)
  with dimensions below 24x24px that lack hit-area padding (`p-2`, `p-[6px]`), explicit
  minimum constraints (`min-h-6 min-w-6`), or pseudo-element expanders (`after:-inset-2`).

### 2. Browser component testing (colocated `*.browser.test.tsx`)

Vitest Browser Mode executes tests in real headless Chromium via Playwright,
colocated alongside their respective UI components:

- **Tailwind CSS v4 Container Queries (`@container`)**: Tests components utilizing
  `@container`, `@xs:`, `@sm:`, and `@md:` variants (such as `card.browser.test.tsx`
  for `@container/card-header` and responsive metric grids) in a real layout engine that
  computes CSS container contexts accurately, which `jsdom` cannot replicate.
- **Breakpoint reflow**: Validates that components adapt smoothly when viewport
  dimensions shift between mobile (390px), tablet (768px), and desktop (1280px)
  (such as `button.browser.test.tsx` and `use-mobile.browser.test.tsx`).
- **Interactive touch targets**: Validates bounding box dimensions (`getBoundingClientRect()`)
  for interactive buttons and actions in rendered DOM trees (e.g. `button.browser.test.tsx`).

### 3. End-to-end responsiveness and reflow suite (`tests/responsive.spec.ts`)

Playwright verifies production builds across a representative viewport matrix:

| Viewport name | Dimensions | Focus |
| --- | --- | --- |
| `reflow-320` | 320x568 | WCAG 1.4.10 Reflow standard at 320 CSS pixels. Verifies horizontal overflow prevention (`scrollWidth <= clientWidth + 1`) and zero two-dimensional scrollbars. |
| `mobile-390` | 390x844 | Modern mobile device layout, vertical button stacking, touch target sizing, and fluid hero sections. |
| `tablet-768` | 768x1024 | Intermediate tablet viewport reflow and layout transitions. |
| `desktop-1280` | 1280x800 | Full desktop multi-column layouts, side-by-side action alignment, and wide content containers. |

- **Zero horizontal scrollbar**: Each route (`/`, `/sign-in`, `/register`) is verified
  to ensure content fits within the client viewport without horizontal overflow.
- **Touch target compliance**: Iterates over all interactive controls (`button`, `a`,
  `[role='button']`, `[role='link']`) to verify computed bounding boxes meet or exceed
  24x24px (with subpixel tolerance `>= 23.5px`).
- **Component reflow behavior**: Proves that interactive layouts (such as hero action
  links) stack vertically on small viewports and align horizontally on desktop viewports.

### 4. Accessibility across viewports (`tests/a11y.spec.ts`)

Axe scans run across both desktop (`1280x800`) and mobile (`390x844`) viewports in
light and dark color schemes, ensuring responsive layout adaptations and DOM
reordering do not introduce contrast, landmark, or accessibility violations.

## Visual regression workflow

Baselines are Linux screenshots, generated and compared in CI inside the pinned
Playwright container, so they never depend on your machine. Locally, the
`@visual` specs are skipped (set `PLAYWRIGHT_VISUAL=1` to run them anyway).

1. Open a pull request or push. The **End-to-end, accessibility and visual** job
   compares screenshots and uploads the `playwright-report` artifact; open it to
   see the expected, actual, and diff images.
2. If the change is not intentional, fix the code.
3. If it is intentional, run the **Update visual baselines** workflow (Actions
   tab, or `gh workflow run visual-baselines.yml --ref <branch>`), then download
   and review the images and commit them:

   ```bash
   gh run download <run-id> --name visual-baselines --dir tests/visual.spec.ts-snapshots
   ```

Differences up to 1% of pixels are tolerated (`maxDiffPixelRatio` in
`playwright.config.ts`). Never update baselines just to silence a failure.

## Component workbench

Write a colocated `*.stories.tsx` next to a component to review it in isolation:

```bash
pnpm ladle         # serve the workbench
pnpm ladle:build   # production build in reports/ladle
```

`.ladle/components.tsx` uses `NextIntlClientProvider` with English messages,
plus the application's theme and tooltip providers. It imports `.ladle/ladle.css`,
which loads `src/app/globals.css`; the async application `IntlProvider` is not
used in the browser workbench.
Cover the variants and states a reviewer needs to see, not every prop.

## Coverage, complexity, and size

- `pnpm test:coverage` writes `coverage/`. It measures application code and
  leaves out the vendored `src/components/ui/*.tsx` and
  `src/components/ai-elements`; `src/components/ui/extensions` is measured.
- `vitest.config.mts` sets a coverage floor of 70% (statements, branches,
  functions, lines). Actual coverage comes from the latest run. Raise it as
  application code grows; never lower it to pass a run. `json-summary` feeds
  the CI step summary.
- `pnpm analyze:health` runs coverage and feeds it to Fallow so CRAP scores
  reflect real tests; `pnpm analyze:fallow` reuses an existing `coverage/`. Add a test before accepting a complex, untested function.
- `pnpm analyze:size` builds the app and fails when generated client JavaScript or
  CSS exceeds the gzip budgets in `.size-limit.json`. Raise a budget only with a
  reason in the pull request.

## Continuous integration

`.github/workflows/ci.yml` runs on pull requests, pushes to `main`, and manual
`workflow_dispatch`. Jobs run in parallel:

| Job | Runs | Local equivalent |
| --- | --- | --- |
| `static` | Biome, typecheck, unit tests with coverage thresholds, architecture, Knip, jscpd, ast-grep, route/component/responsiveness guards, CSpell, markdownlint, Fallow, React Doctor | `pnpm verify:static` |
| `build` | Vitest Browser Mode, production build with size budgets, Ladle production build | `pnpm verify:build` |
| `e2e` | Playwright functional, accessibility, and visual specs in the pinned Playwright container | `pnpm verify:e2e` |
| `security` | Semgrep rule tests and scan (`--error`), Gitleaks, actionlint, zizmor, `pnpm audit`, pre-commit | `pnpm verify:security` |
| `pr-title` | Conventional Commit PR title (pull requests only) | `echo "feat: title" \| pnpm exec commitlint` |
| `ci-result` | Aggregates the jobs above; use it as the single required status check | n/a |

Pull-request runs cancel superseded runs (including when the title is edited,
which re-runs the title check); pushes to `main` each get their own
concurrency group and are never cancelled. The
coverage report and the Playwright report and `test-results` are uploaded as
artifacts for seven days, and coverage plus the job results are summarized on
the run page. Run `pnpm check:workflows` after editing a workflow, and keep
actions and the Playwright container pinned by commit SHA or digest.

Dependabot opens weekly grouped updates for npm and GitHub Actions
(`.github/dependabot.yml`); review each one, there is no auto-merge. It does not
update the workflow container directly: the Docker mirror receives proposed
image updates, which must be copied into both workflows. Keep the image tag and
digest aligned with `@playwright/test` and regenerate baselines with the
`Update visual baselines` workflow.

### Adapting the tests in a generated project

Reusable checks: the Vitest and Playwright configs, axe scan, and
`tests/home.spec.ts` smoke tests for a successful `/` response, page landmarks,
configured locale cookies and safe new-tab links. These tests no longer depend
on the starter headline, document title or starter link labels. They are smoke
tests, not proof that each locale's translated UI text is correct; add
behavior-specific localization tests for the derived application, including
translated text and the document language. The current root layout fixes
`html lang` to `en`; the cookie smoke tests do not validate that attribute.

Template-specific fixtures: `home-*` visual baselines capture the starter
home page. Replace them after changing the UI, and regenerate reviewed
screenshots through the manual `Update visual baselines` workflow. If your
application removes the home page or its primary heading, adapt the smoke test
to your app rather than disabling E2E or automatically accepting new baselines.

### Automated accessibility limits

axe-core detects only a subset of WCAG failures. It does not verify keyboard
operation, focus order, screen-reader output, or content quality, so passing
scans do not mean WCAG compliance. Test those manually.

### Scheduled and manual checks

`.github/workflows/scheduled-quality.yml` runs Lighthouse weekly (Mondays
06:00 UTC); manual dispatch also starts the Stryker mutation job:

- `mutation`: **manual dispatch only** until its behavior is verified on a
  hosted runner; it fails below the `break` score in `stryker.config.json`
  and uploads the HTML report.
- `lighthouse`: builds and serves the app, then runs
  `pnpm analyze:lighthouse:ci` and uploads the report. It is report-only: it
  fails only when the audit cannot run, because no score threshold is set.

Fallow and React Doctor already run in the `static` job. The Lighthouse job's
runner setup (Playwright Chromium with `--no-sandbox`) was verified locally but
not yet on a hosted runner; check the first scheduled run.

### Known limitations

- The `braces` advisory exception in `pnpm-workspace.yaml` is documented there;
  **every generated project must reassess it** against its own dependency tree.
  Remove the suppression when the affected dependency chain is no longer present.
- `pnpm check:security` must run inside a Git work tree; Semgrep stalls on
  Windows when the directory is not a repository.
- Dependabot cannot read workflow `container:` images or tool pins, so
  `.github/dependabot-mirror/` holds a Dockerfile and a `requirements.txt` that
  receive those bumps. Copy a Playwright image bump into `ci.yml` and
  `visual-baselines.yml` by hand. Gitleaks and actionlint versions stay manual.
- Deployment is intentionally absent; add provider-specific CD in the derived
  project.
- On Windows, set `PYTHONUTF8=1` when running Semgrep locally, or it can exit
  with code 2 on an output encoding error.

## First-time setup

For browser authentication journeys, install the Firebase CLI and Chromium,
install the Functions dependencies with `npm --prefix functions ci`, then run
`pnpm test:auth`. This starts the Auth, Firestore, and Functions emulators with the local project
and settings configured in `.env` (such as `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`
and `NEXT_PUBLIC_FIREBASE_PROJECT_ID=local-test`) and a development server on port 3100.
Ports 9099, 8080, 5001, and 3100 must be free. The auth test server receives
`NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_HOST` (default `127.0.0.1:5001`) so
protected-screen and profile-save usage guards call the local Functions emulator.
Set that variable when using a custom Functions emulator endpoint.
The test configuration supplies non-production Web
SDK values; no Firebase account or production credentials are needed. This
suite is separate from the production-build Playwright suite and requires the
Firebase CLI on PATH. It tests the emulator, not actual Google consent or email
delivery. The production build's existing registry type errors remain a separate
validation failure.

Install the browser binaries once per environment:

```bash
pnpm exec playwright install chromium
```

Playwright starts the application itself (`pnpm build && pnpm start`), reusing a
server on port 3000 when one is already running outside CI.

## Pull request evidence

In the pull request description, state the commands run and the relevant
manual checks. Call out deliberately untested behavior, the reason it could
not be exercised, and any known baseline validation failure.

## shadcn/ui update verification

For a documentation refresh, use the documentation checks above and validate
the source inventory against the recorded upstream revision. Compare stated
configuration and commands with the local files and CLI help. A fetched source
inventory establishes documentation coverage, not a passing application build.

When component source changes, run `pnpm verify:fast`, `pnpm check:structure`,
and the relevant browser suites. Check label/control associations, invalid and
disabled states, focus entry and return, keyboard operation, and loading/error
feedback through accessible roles. Verify styled navigation remains a link,
submit and sign-out remain separate actions, and Base UI Select values reach
the form correctly. Inspect light/dark, responsive, long-text, and localized
states in Ladle or the application; visual baselines change only through the
existing reviewed workflow.

Do not infer accessibility from the component name, generated source, or an axe
pass alone. Use browser interaction checks for focus, portals, and keyboard
behavior. Add regression tests for changed application behavior, rather than
mirroring third-party implementation details.

## Compound component guard regression tests

`pnpm check:components` runs the naming/profile safety tests and the general
composition regression suite, then scans all owned components. New cases cover
valid named families in both directive-free and client-boundary modules, simple
components without invented parts, unrelated exports, static compound mutation,
renamed primitive imports and bindings, forwarded/rest props, extracted
children/className, type-only imports, and async Server Components. Async
client-component diagnostics belong to Biome's native
`noNextAsyncClientComponent`; the custom suite verifies that responsibility is
not duplicated. Keep valid counterexamples alongside rejected cases.

The [coverage contract](CODING_STANDARDS.md#composition-guard-coverage) records
what the guard can prove. It does not resolve arbitrary component anatomy or
transitive RSC imports; builds and behavior tests still validate those paths.

## Responsiveness guard regression tests

`pnpm check:responsiveness` executes `scripts/check-responsiveness.test.mjs` before scanning
application files. The suite tests both valid implementations and rejected anti-patterns:

- **Path classifiers**: Confirms discrimination between owned application components, App
  Router entry points, and third-party vendor trees (`src/components/firebase`,
  `src/components/ai-elements`, and preinstalled `src/components/ui/*.tsx`).
- **Root layout viewport metadata (WCAG 1.4.4)**: Confirms valid static `viewport` exports
  and dynamic `generateViewport` functions with `width: 'device-width'` and `initialScale: 1`.
  Rejects missing viewport exports on root layout, invalid dimensions, and zoom restrictions
  (`userScalable: false`, `maximumScale: 1`, or meta string `user-scalable=no`).
- **Rigid pixel widths (WCAG 1.4.10)**: Verifies rejection of fixed pixel widths greater than
  320px in JSX classes, standalone string constants, and inline styles (`style={{ width: ... }}`)
  when lacking responsive breakpoint prefixes (`sm:`, `md:`, `lg:`, `@*`) or fluid wrappers
  (`max-w-full`). Allows widths `<= 320px` and fluid constraints.
- **Touch target minimums (WCAG 2.2 SC 2.5.8)**: Verifies rejection of interactive elements
  (`<button>`, `<a>`, `<Link>`, or `role="button"`) with dimensions below 24x24px lacking
  hit-area padding, minimum sizing, or pseudo-element touch expanders, while allowing child icons
  and non-interactive elements.

The [responsiveness standards](CODING_STANDARDS.md#responsive-design-and-layout-contracts) record
the enforced contracts and modern responsive practices.

## Next.js documentation and framework verification

For a complete documentation refresh, require non-truncated inventories for
both upstream `docs/` and `errors/`, pin source revisions, retrieve every body,
and verify Git blob hashes. Compare the installed stable version with the
current documentation before adopting changed APIs. Record failures explicitly;
a URL index or a successful Context7 query alone is not complete coverage.
See [the review record](docs/agents/nextjs.md).

The App Router import policy uses native Biome diagnostics. Its colocated
configuration regression suite tests invalid imports, valid App Router APIs,
re-exports, each owned code area, UI extensions, and the vendor exclusion.
It runs in the existing `unit` project; `verify:fast` and CI already include it.
Next.js build remains responsible for its own RSC and rendering diagnostics.

For changes to request APIs, caching, metadata, or navigation, use a production
build and Playwright in addition to relevant unit tests. Verify request-specific
content, Suspense fallbacks, direct navigation, client navigation, back/forward
state, and mutation consistency. Test different users/locales when cache keys
could cross those boundaries. A development-only success or a mocked router
does not prove production prerendering or cache isolation.

Async Server Components remain E2E subjects; do not add jsdom rendering
workarounds for unsupported Vitest behavior. Server mutation/API introductions
need authorization and invalid-input tests at the new boundary. Cookie-based
translations and static `html lang` are separate contracts; a language-attribute
change must cover accessibility and Cache Components rendering behavior.

Local missing native bindings, blocked external lookups, and unavailable MCP
runtime sessions are environment limitations, not successful checks. Keep CI
requirements and coverage thresholds intact while reporting those limitations.

## React rules and lifecycle verification

The native React configuration suite lives in
`.biome/rules/react/native-rules.test.ts`. It verifies blocking diagnostics for
hook order/dependencies, nested component identity, direct prop assignment,
and the existing ref convention using actual project configuration. Valid
counterparts include conditional React `use` and React 19 ref props. Owned
route/component/hook areas, UI extensions, and the new policies' registry
exclusions are exercised. Run it with the existing `unit` Vitest project.

For lifecycle changes, test user-visible state and owned resources across
setup, cleanup, replacement, and reveal. Use a Strict Mode wrapper when it can
expose missing cleanup; do not assert that an Effect or ref callback always
runs exactly once. Verify unsubscribe/release behavior and that obsolete async
results cannot overwrite the current user or resource. Activity and Suspense
can tear down Effects while preserving other state, so permanent unmount is
not the only cleanup case.

Keep real viewport/media/focus behavior in Browser Mode, and hydration,
framework navigation, async Server Components, and production cache behavior
in Playwright. RTL/hook tests and isolated Ladle renders do not reproduce the
entire Next.js renderer or prove Compiler optimization. Profile only with an
actual running app; do not infer performance gains from a memoization diff.

Prefer React Testing Library and supported `act` integration. If a manual
flush is needed, use `await act(async () => ...)` from `react`; do not introduce
`react-dom/test-utils` or deprecated `react-test-renderer` as a new test stack.
Avoid hiding act warnings with blanket suppression. Keep async user actions
awaited and make assertions after observable completion.

For a complete React reference refresh, inventory all Markdown/MDX beneath
`react.dev`'s content tree, retrieve every body at its pinned revision, and
verify blob hashes. The versioned runtime error catalog is a separate source
from the narrative error guides. Record source scope, installed API support,
and actual behavior-test results separately, following
[the review workflow](docs/agents/react.md).

## Integration naming regressions

`pnpm check:components` verifies browser/server integration suffixes, required
boundaries and presentation filenames without suffixes. Regression cases cover interactive UI
and form-context hooks without integration suffixes, browser storage, Firebase,
server requests, transitive helper imports, type-only imports, and composition
of integration children. Full source scans exercise the same classifier.
The naming rule documents syntax limits; Next.js still validates module graphs.

## Application logging validation

Logging changes need both the colocated Vitest guard/instrumentation tests and
`pnpm test:logging` for callable authentication, event
validation, and identity handling. Both `verify:fast` and `verify:static` include
this command, so the existing CI static job runs the callable tests. A production
Next.js build and a deployed Cloud Logging smoke test remain separate checks; mocked logger tests do not
prove provider ingestion or IAM configuration. Native SWC loading failures can
prevent Next.js type generation and leave `LayoutProps` unresolved in TypeScript;
report the environment failure rather than treating those checks as passed.
