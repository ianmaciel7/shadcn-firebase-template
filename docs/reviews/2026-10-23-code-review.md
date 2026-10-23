# Project code review — 2026-10-23

The initial findings and verification below describe the reviewed snapshot.
The [implementation follow-up](#implementation-follow-up-2026-10-23) records
the subsequent fixes and regression coverage without rewriting that evidence.

## Result and scope

Five actionable findings were identified against commit `1165e56`, with a clean
working tree at the start. No application fixes, dependency upgrades, deployment,
or remote writes were performed. The accompanying changes save the supplied
React reference in the existing rule/documentation system and correct its local
React DOM support guidance.

The review covers application routes, authentication and profile hooks, shared
utilities, Firebase initialization and persistence, Cloud Functions, resource
rules, quality guards, package configuration, and CI. Manual registry review
focused on browser resources, asynchronous input, previews, and rendering
boundaries. Automated checks cover broader source scopes, with their configured
vendor exclusions. This is a broad static and test review, not a claim that every
copied component was manually examined or every runtime path exercised.

P2 means a normal-priority defect to address in a focused change; P3 is a lower
priority tooling issue. No confirmed P0/P1 defect was established. Each finding
below has high confidence in the described behavior. Dependency exploitability
is explicitly separate from an audit report.

## Findings

### 1. [P2] Access logging errors survive a successful replacement session

Location: `src/app/(protected)/_hooks/use-protected-gate.ts:22`.

The subscription clears `readyPath` for each auth notification, but clears
`error` only when the Effect first starts. After a logging failure sets
`usageLogError`, a later authenticated session can successfully acknowledge
logging and set `readyPath` without clearing the error. `ProtectedGate` checks
`isError` first, so the user still sees an error and cannot access the content
until a remount or route change restarts the Effect.

Reproduction: render the gate, reject the first `recordUsage` call, notify the
same subscription of another authenticated user, and resolve the second call.
A focused RTL probe confirmed two calls, a persistent `usageLogError`, and no
protected content. Existing tests cover an obsolete failure arriving after a
new success, which does not cover an error already committed to state.

Suggested correction: reset error state for each new subscription notification
or model readiness/error by session revision. Keep the existing revision check
so an obsolete response cannot affect the current session. Preserve the
documented requirement that logging acknowledgment gates access.

### 2. [P2] Completing a prompt submission deletes a newer unsent draft

Location: `src/components/ai-elements/prompt-input.tsx:891`.

With `PromptInputProvider`, the submit handler waits for `onSubmit` and then
unconditionally calls `controller.textInput.clear()`. If the caller keeps the
editor available and the user types the next message while the previous request
is pending, completion deletes that newer text. Attachment cleanup similarly
clears current state rather than only the submitted attachment IDs.

Reproduction: submit `first message`, keep the submission Promise pending, type
`next unsent message`, then resolve the Promise. An RTL probe confirmed the
newer input becomes empty. The default component has no submission lock.

Suggested correction: keep a submission snapshot/revision and clear only the
submitted draft and attachment identities, or explicitly prevent edits while
pending. Preserve the draft on errors. This registry component is not imported
by the current routes; the defect affects consumers when it is composed into a
page. The text-loss case was reproduced; the attachment case follows the
shared unconditional clear path and was not independently tested.

### 3. [P2] A late microphone permission result starts recording after removal

Location: `src/components/ai-elements/speech-input.tsx:202`.

The cleanup Effect stops streams already stored in refs. However,
`startMediaRecorder` awaits `getUserMedia` without a lifetime or request check.
If the component is removed while the permission prompt is pending, cleanup
sees no stream. Once permission resolves, the continuation stores the stream
and starts a recorder after cleanup has already run, leaving microphone tracks
active without a mounted control to stop them.

Reproduction: defer `getUserMedia`, click the record button, remove the
component, then resolve with a fake stream. An RTL probe confirmed the recorder
starts once and the track's `stop` is never called. This reproduces lifecycle
ordering with mocks, not real browser permission behavior.

Suggested correction: invalidate pending recording requests during cleanup;
when a stale request resolves, immediately stop all returned tracks before
creating a recorder. Also release tracks if recorder construction/start fails.
This registry component is not imported by the current routes; the defect
affects consumers of the MediaRecorder fallback.

### 4. [P2] The security audit omits the Cloud Functions lockfile

Location: `.github/workflows/ci.yml:184`; affected lock entry:
`functions/package-lock.json:2893`.

CI runs `pnpm audit` only at the root. The backend has a separate npm lockfile
and is not a member of a declared pnpm workspace package list. The root audit
therefore does not cover its independently deployed dependency graph.

Evidence: the root audit reported zero findings under the existing configured
exception. Running `npm audit --package-lock-only --ignore-scripts --json`
inside `functions/` exited with failure and reported 12 moderate affected
package entries. They trace to **one underlying advisory**,
[GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq), for
`uuid <11.1.1`; the backend locks `uuid` to `9.0.1`. Twelve affected entries
must not be presented as twelve independent vulnerabilities.

The advisory concerns optional buffer use in UUID v3/v5/v6. Reachability of
those operations from the current callable was not demonstrated. The confirmed
defect is the audit coverage gap; this is not proof of an exploitable backend.

Suggested correction: audit the backend lockfile separately in CI, inspect
the affected dependency paths and runtime calls, and apply a compatible
remediation or a narrowly justified exception. The audit reports no automatic
fix; do not force a major transitive override without compatibility checks.

### 5. [P3] Emulator seeding exits successfully after HTTP failures

Location: `scripts/emulator/seed.mjs:66`.

`reportCreateUserResult` prints an error for a non-success HTTP response other
than `EMAIL_EXISTS`, but neither throws nor sets a failing exit status. Fetch
resolves normally for HTTP 4xx/5xx, so the catch in `seedUsers` does not run.
Automation can proceed with missing fixture users after a misleading success.

Reproduction: run the real seed module with dummy emulator configuration,
stub environment-file loading, and stub fetch to return HTTP 500 for both
users. The script prints both errors followed by `Seeding completed.` and
exits **0**. No emulator or production endpoint was contacted by this probe.

Suggested correction: propagate unexpected HTTP failures to the caller or set
`process.exitCode = 1`; retain idempotent success for `EMAIL_EXISTS`. Only print
the success completion message when the requested setup succeeded.

## Verification results

| Check | Result |
| --- | --- |
| Biome CI | Passed; 291 files checked before documentation edits. |
| Existing unit tests and coverage | 33 files, 212 tests passed. Statements 87.93%, branches 81.37%, functions 86.52%, lines 88.77%; all configured thresholds passed. |
| Logging test runner | Passed, one test file. |
| Architecture | Passed; 245 modules, 417 dependencies, no violations. |
| Unused code, duplication, structural rules | Passed within configured scopes; duplication excludes copied registries. |
| Route, component, responsiveness guards | Passed, including their existing regression suites. |
| Spelling and Markdown | Passed, including final documentation validation. |
| Fallow | Passed; zero above threshold, maintainability 93.3. |
| React Doctor | Completed with eight warnings; not a clean diagnostic result. |
| Focused review probes | Three RTL cases reproduced findings 1–3. A separate Node probe reproduced finding 5 with exit 0. These assert the existing defects, not their fixes. |
| Root dependency audit | Passed under the existing `braces` advisory exception in `pnpm-workspace.yaml`. |
| Functions dependency audit | Failed: 12 moderate affected package entries linked to the single UUID advisory above. |
| Framework typecheck and production build | Blocked loading the installed SWC native binding (`ERR_SWC_NATIVE_CACHE`), including attempts with a workspace cache and temporary materialization. |
| Standalone TypeScript | Failed only on missing generated `LayoutProps` in three layouts; Next.js type generation could not complete. No substitute declarations were added. |
| Ladle build | Blocked by the same SWC native binding problem. |
| Browser component tests | Could not run: Chromium v1248 is absent. Installation into a task-local directory was denied by network policy (`403 Domain forbidden` for `cdn.playwright.dev`). |
| Production E2E, visual, accessibility, size budgets | Not completed because production build/browser prerequisites failed. |
| Firebase emulator integration and resource-rule execution | Not run; Firebase CLI is absent. Rules were inspected statically. |
| Semgrep, Gitleaks, actionlint, zizmor | Not run; host executables are absent. Manual review and dependency audits do not replace these scans. |
| Serena, Context7 CLI, Agents sync | Host executables unavailable. Source navigation used local files and AST tooling. No Serena memory or agent synchronization is claimed. |

The installed pnpm executable reports 11.25.0 while `package.json` requests
12.14.0. Its automatic dependency verification initially attempted installation
and failed creating a host directory. Subsequent commands used the existing
dependencies with `pnpm_config_verify_deps_before_run=false`; no lock files were
changed. Repeat the full verification in the intended package-manager/runtime
environment before release.

React Doctor's six `set-state-in-effect` warnings are optimization concerns,
not proof that these Firebase subscriptions or avatar resource Effects should
be removed. Its public Firebase API-key warning does not establish a leaked
secret: Web SDK configuration is public and authorization belongs to Firebase
rules. Its duplicated JSX warning is not a demonstrated correctness defect.
No warnings were suppressed or converted into broad refactors.

## Existing limitations and reference persistence

`ARCHITECTURE.md` already records the static `html lang="en"` attribute despite
cookie-selected Portuguese/Spanish content. This remains an accessibility issue
requiring a locale/rendering design compatible with Cache Components, not a
newly discovered defect or an implemented fix. Do not move request-cookie reads
above all Suspense boundaries as an untested quick fix.

The user-supplied React reference is saved through `.agents/rules/react.md`
and `docs/agents/react.md`, with behavior owned by `CODING_STANDARDS.md` and
the existing canonical guides. Local exports and types establish that
`browser` belongs to `react-dom`, correcting two previous documentation claims.
The supplied list also omits `requestFormReset`; API totals are descriptive,
not completeness guarantees. The earlier upstream source inventory retains its
original retrieval date; this review did not refresh all official sources.

Recommended order: restore gate recovery, close the backend audit gap, repair
microphone cleanup and prompt draft ownership before using those components,
then correct seed failure signaling. Re-run behavior tests and the unavailable
release checks for the corresponding implementation changes.

## Implementation follow-up (2026-10-23)

The implementation incorporates `main` through `703096e`, including its exact
component/hook naming and quality-rule changes. The initial gate path above
is historical: its current hook is
`src/app/(protected)/_hooks/use-protected-gate-client.ts`, consumed by
`ProtectedGateClient` in `_components/protected-gate-client.tsx`.

| Finding | Implemented correction | Regression coverage |
| --- | --- | --- |
| 1. Persistent gate error | Clear the committed error for each new auth notification while preserving revision checks and the new session's logging acknowledgment requirement. | `protected-gate-client.test.tsx` verifies error recovery, loading before the new acknowledgment, and stale-response protection. |
| 2. New draft erased by an older send | Capture provider draft revision and attachment/source identities. Clear only submitted work after success; preserve newer edits and failed submissions. Local inputs also track edits made while pending. | `prompt-input.test.tsx` exercises unchanged success, re-entered identical text as a newer revision, newer attachments, local edits, and failed sends. |
| 3. Late permission result leaks microphone | Invalidate pending recording requests on cleanup, stop stale or failed-setup streams, prevent duplicate pending starts, and ignore obsolete transcription results. Recording chunks belong to each recording. | `speech-input.test.tsx` covers late permission, constructor/start failure, pending-request duplication, track cleanup, and late transcript delivery. |
| 4. Backend audit omitted | Add `audit:functions` to security verification and CI. Pin the backend's transitive UUID resolution to CommonJS-compatible `11.1.1`, addressing the reported advisory without a broad ignore. | Separate lockfile audit reports zero vulnerabilities. UUID v4 resolution/generation for the three affected consumers and Firebase SDK/callable initialization were checked without requests. |
| 5. Failed seed reports success | Return failure for unexpected HTTP responses and stop with exit status 1 before printing the success message; retain `EMAIL_EXISTS` as idempotent success. | `scripts/emulator/seed.test.mjs` asserts actual process status for HTTP 400/500, network errors, creation success, and existing users. |

The shared profile service also revalidates the active session after async
boundaries before starting another write. Its injected-adapter regression in
`src/lib/profile.test.ts` verifies that a session change during upload prevents
later profile/preference writes. Firebase resource rules remain the authoritative
authorization boundary; client checks do not replace them.

These fixes cover behavior across route-private `_hooks` and `_components`
and shared service modules. There are currently no route-private `_lib`
modules to migrate or repair. Preserve shared logic in `src/lib` and apply the
same operation-boundary and behavior-test requirements when route-local `_lib`
modules are introduced; do not create placeholder directories for this review.

`TOOLING.md` now records the observed failures, owning regression suites,
private/shared folder boundaries, and the limits of syntax analysis. The
component regressions run through the existing unit project even where copied
registry code is excluded from coverage. Seed regressions run in both
`verify:fast` and `verify:static`; root and backend audits run separately through
`verify:security` and CI. `TESTING.md` and `SECURITY.md` record the matching
verification and dependency maintenance requirements.

### Final implementation verification

Five independent review agents checked authentication/services, prompt drafts,
microphone resources, backend/CI security, and tooling documentation. The final
stable full unit run passed after the asynchronous failure assertions were
corrected to wait for blob conversion before observing submission. No test or
coverage threshold was weakened, and no advisory exception was added.

| Check | Observed implementation result |
| --- | --- |
| Unit coverage | 35 files, 237 tests passed. Statements 90.06%, branches 82.55%, functions 87.63%, lines 90.73%; all thresholds passed. |
| CLI and logging | Four seed process tests and four logging tests passed. |
| Biome CI | Passed, 295 files checked. |
| Architecture, unused code, duplication, structure, routes, components, responsiveness | All passed. Private hook/component conventions from current `main` were retained. |
| Fallow | Passed, zero above threshold, maintainability 93.4. |
| React Doctor | Completed with seven advisory warnings; no suppression added. |
| Security rules | All nine Semgrep rule tests passed; source scan reported zero findings. |
| Secret and workflow scans | Gitleaks history scan found no leaks; actionlint and online zizmor audit passed with no findings. |
| Dependency audits | Root audit passed under its existing documented exception; separate Functions audit reported zero vulnerabilities across 253 locked dependencies. |
| Framework build/type generation | Remain blocked by installed SWC native cache validation (`ERR_SWC_NATIVE_CACHE`). Standalone TypeScript reports only missing generated `LayoutProps` in three layouts. |
| Browser tests | Remain blocked by missing Chromium v1248; the earlier browser download was rejected by network policy. Production E2E, visual, accessibility, size, and emulator integration were not established. |

The pinned pnpm 12.14.0 and CI-pinned security tools were installed into a
temporary task directory for final validation. Writable local tool caches
allowed security scans without modifying the user's home directory or disabling
audits. Local Node is 24.19.0; the Functions CI/emulator job uses Node 22.
These results do not establish deployed Functions behavior, real microphone
permission interaction, or production rendering. The build/browser limitations
remain explicit for the next CI/release verification.
