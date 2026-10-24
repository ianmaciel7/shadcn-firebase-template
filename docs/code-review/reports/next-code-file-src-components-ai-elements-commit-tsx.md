# Individual report — `next-code-file-src-components-ai-elements-commit-tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-commit-tsx`.
- Type: `CODE_FILE`.
- Primary path: `src/components/ai-elements/commit.tsx`.
- Associated documentation: installed Next.js, `01-app/01-getting-started/05-server-and-client-components.md` and `01-app/03-api-reference/01-directives/use-client.md`; local composition rules and installed Base UI contracts.
- Next.js version: `16.4.2`, confirmed in `node_modules/next/package.json`.
- Status: Completed.

## Scope

- Responsibility: full individual review of the 481 lines of the Commit module, its exported components and types, composition, state, clipboard, timer, accessibility, and Server/Client boundary.
- Files consulted: primary file; `AGENTS.md`; audit manifest and README; individual report for `checkpoint.tsx`; `components.json`; `CODING_STANDARDS.md`; local rules `components-contracts.md`, `shadcn-ui-maintenance.md`, `react-hooks-core.md`, `react-quality.md`, `nextjs-maintenance.md`; shadcn skill and its `base-vs-radix.md` rule; local wrappers `collapsible.tsx` and `button.tsx`; installed implementations `CollapsibleTrigger.js`, `CollapsibleTrigger.d.ts`, `internals/use-button/useButton.js`, Lucide; Next.js documents above.
- Dependencies analyzed: React and React DOM, Lucide, Base UI `1.9.0`, local Button, Avatar, Collapsible, and `cn`.
- Consumer search: `rg` in `src/`, excluding the primary file, found no use of `Commit` or import of `ai-elements/commit`.

## Code Review

Correct implementations:

- The `"use client"` directive on line 1 is appropriate for state, Effects, and clipboard use within a handler. There is no import of server-only APIs, credentials, or persistence of application data.
- The family keeps presentation, header, metadata, actions, and file list separate. The wrappers preserve HTML props and `className`; types of interactive components derive from the installed local primitives.
- Root and Content use the same Collapsible composition when assembled by the consumer. The pattern of two independent roots observed in the `chain-of-thought.tsx` report does not exist here.
- Avatar contains an AvatarFallback with required initials. File changes use letters A/D/M/R and signs beyond color, without relying solely on color for the default content.
- `CommitTimestamp` initializes the text as empty both on the server and on the first client render and computes the relative time in an Effect. This avoids attributing a hydration mismatch to the use of `Date.now()` in the helper, which is not called during render. `dateTime` provides the ISO date.
- Copying checks clipboard availability, handles rejections, and offers success/error callbacks. The timer stored in a ref is cleared in cleanup. This does not prove the case of a clipboard Promise that resolves after cleanup.
- The actions stop click and keydown propagation, allowing inner actions to be separated from the header expansion. Explicit consumer props can replace handlers through the spread; this should be considered when integrating.
- The exclusions for generated AI Elements components prevent treating arrow functions or the absence of a suffix as failures of the owned-component guard. Requirements for routes, caching, and Server Actions do not apply to this file.

Risks and recommendations:

- The default copy button contains only a decorative icon; consumers must provide `aria-label`, `aria-labelledby`, or localized text children. The contract accepts these props. With no demonstrated consumer, no accessible-name failure was attributed to an existing screen.
- The relative time uses fixed English and is only recalculated when the `date` reference changes, so it can become stale in a long session. The consumer can replace the text with `children`; define locale and refresh requirements before integrating.
- `space-y-1` and explicit colors with dark variants diverge from the local visual recommendations, but they demonstrate no runtime failure and do not justify automatic migration of the copied code in this audit.
- Verify concurrent copy, hash change, callbacks, and asynchronous resolution after unmount before introducing lifecycle changes. The inspection did not turn these unexecuted scenarios into confirmed findings.

## Findings

### COMMIT-001 — Header replaces button with div without changing native mode

- Identifier: `COMMIT-001`.
- Severity: Low.
- Category: Base UI composition / accessibility / keyboard.
- Path and line: `src/components/ai-elements/commit.tsx:35-48`, especially `render` on lines 38–44.
- Concrete evidence: `CommitHeader` renders `<div>` through `CollapsibleTrigger` without setting `nativeButton={false}`. The local wrapper only forwards props; the installed implementation `node_modules/@base-ui/react/collapsible/trigger/CollapsibleTrigger.js` defines `nativeButton = true` and passes it to `useButton`. In `internals/use-button/useButton.js:105-109,128-136`, native mode requires a BUTTON tag for activation; the keyup branch for Space also requires non-native mode. On lines 179–185, `role="button"` is only provided in non-native mode. The div has no native button behavior to compensate for these branches.
- Verification: a `ReactDOMServer.renderToStaticMarkup` experiment with the real Root, Trigger `render={<div />}`, and Panel from the installed dependency produced `<div data-closed=""><div type="button" tabindex="0" aria-expanded="false">Commit</div></div>`. This confirms the absence of a button role in the markup of the same topology; it is not equivalent to running the full TSX component in a browser.
- Documentation reference: `.agents/skills/shadcn/rules/base-vs-radix.md`, section "Button / trigger as non-button element", requires `nativeButton={false}` when `render` swaps the element for a non-button; `CODING_STANDARDS.md`, section "shadcn/ui API and accessibility", requires preserving semantics and keyboard. Installed Next.js, `05-server-and-client-components.md` and `use-client.md`, supports the interactive boundary but does not prescribe this Base UI API.
- Impact: in the default composition, the header is focusable and responds to click, but loses the button role and the Enter/Space activation synthesis the div needs. The dependency also emits a development diagnostic about the incompatible element. With no consumer found in `src/`, no impact on a current application flow was demonstrated.
- Recommended fix: align the element with the contract: if the header must remain a div to compose actions, set non-native mode on the primitive and validate semantics/keyboard; if a native button is adopted, reorganize interactive actions to avoid nested buttons. Preserve controlled state, accessible names, and the association with the panel.
- Suggested test: mount the public Commit/Header/Content composition; locate the header by button role, focus it, and expand/collapse with Enter and Space; verify `aria-expanded`, `aria-controls`, and the absence of the Base UI diagnostic. With CommitActions and copy, confirm that the action neither expands the panel nor fires twice.
- Consolidation: belongs to the same family of incompatible `nativeButton` configuration recorded in `AUDIOPLAYER-001`. This report preserves the file's independent evidence; the general deduplication should keep the references to both and distinguish that Media Chrome has its own behavior, while this div does not.

## Conclusion

- Classification: Partially compliant.
- Explanation: the family respects the client boundary and the separation of responsibilities, but the default header uses native mode for a div, losing the primitive's semantics and keyboard support.
- CLI query: `pnpm exec shadcn docs collapsible button` failed before running shadcn, because pnpm tried to create `/home/agent/.local/share/pnpm` and received `ENOENT`. The installed local contracts and sources were used; no successful remote query is claimed.
- Markdown validation: the real executable `markdownlint-cli2-bin.mjs` ran the configured global globs and flagged no problem in this report. The command found pre-existing errors in other audit documents; the general run is not approved.
- Limits: full static reading, dependency tracing, and an isolated SSR experiment. No build, browser, real clipboard, screen reader, or application tests were run. No source or aggregate file was changed by this agent.
