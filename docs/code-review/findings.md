# Findings

<!-- cspell:ignore AUDIOPLAYER NXLAYOUT NEXTERR DOCSTART DOCUPGRADE INTLPROVIDER AIELEMENTS pending TOTP WEBPREVIEW -->

This is the historical finding consolidation at audit checkpoint `d8e5df2`. The user subsequently authorized implementation. See [remediation status and validation limits](resolutions.md) for current dispositions; the evidence below is preserved as the original review record.

## Medium

### NXLAYOUT-001 — Root document language does not follow the selected locale

- Location: `src/app/layout.tsx:43`.
- Evidence: the root element uses `lang="en"`, while `IntlProviderServer` and `src/i18n/request.ts` resolve locale from request configuration/cookie. Portuguese and Spanish pages therefore still declare English to assistive technology and language-aware tools.
- Reference: installed layout convention in `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md` (Root Layout); architecture decision and streaming constraint in `ARCHITECTURE.md:115-123`.
- Impact: screen readers may apply English pronunciation rules to localized content; document language metadata is inaccurate.
- Recommendation: when the locale rendering strategy is designed, set the document language to the effective locale without moving a request-time cookie read above the current streaming boundary. Add browser checks for `en`, `pt-BR`, and `es`.
- Status: known architectural debt; the individual review marks the file partially conformant. Do not interpret this finding as authorization for an pending rendering redesign.

### CODEBLOCK-001 — Partial cache identity returns another code snippet

- Location: `src/components/ai-elements/code-block.tsx:144-147`, lookup at `:190-195`, storage at `:228`.
- Evidence: cache keys contain language, length, first 100 characters and last 100 characters. Equal-length middle edits collide. An isolated reproduction using unchanged extracted functions and installed Shiki confirmed the second request returned the first input's tokens instead of the requested text.
- Impact: valid code updates can display stale or unrelated code. Existing callers include `agent.tsx` and `tool.tsx`; active application-route exposure was not established. No cross-user leakage or security exploit is claimed.
- Recommendation: key tokens and subscriptions by language and complete content, or verify full content when using hashes.
- Test: sequential and concurrent requests with equal lengths/endpoints and different middle text must reconstruct each requested input exactly.
- Reference and full evidence: [code-block report](reports/next-code-file-src-components-ai-elements-code-block-tsx.md), including reproduction output and the repository cache-identity guidance. This is separate from caller schema serialization in `AGENT-001`.

No high or critical findings have been reported among the completed items. This does not imply that pending areas are clean.

## Low

### NEXTERR-001 — “Try again” uses `reset()` instead of the documented retry operation

- Location: `src/app/error.tsx:9-12,26-27`.
- Evidence: the localized control says “try again” but calls `reset()`. The installed Next.js 16.4.2 docs distinguish `reset()` (rerender the boundary children) from `retry()` (retry the failed content/read) and recommend `retry()` for most cases.
- Reference: `node_modules/next/dist/docs/01-app/01-getting-started/10-error-handling.md` (Nested error boundaries) and `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md` (retry/reset/version history).
- Impact: a transient failed read may not be repeated when the user asks to try again.
- Recommendation: use `retry` for the control, or change its text and document the reason for a rerender-only reset.
- Test: browser/integration case where a read fails once, then succeeds after invoking the recovery control.

### DOCSTART-001 — Getting Started index has an empty “Next Steps” section

- Location: `node_modules/next/dist/docs/01-app/01-getting-started/index.md:21`.
- Evidence: line 21 is the `## Next Steps` heading, with no following content. The folder contains 18 guides, but the index provides no follow-on links or action under that heading.
- Impact: readers reach an incomplete transition at the end of the index.
- Recommendation: add relevant links to subsequent guidance or remove the empty heading in the upstream source; do not patch vendored `node_modules` as a project fix.
- Test: documentation lint or a simple structural check that headings expected to contain content are followed by text or links.

### DOCUPGRADE-001 — Upgrade guide index ends with an incomplete introduction

- Location: `node_modules/next/dist/docs/01-app/02-guides/upgrading/index.md:7`.
- Evidence: the sentence ends with a colon but provides no links or content, although the folder contains version-specific guides, codemods, and agent-upgrade guidance.
- Impact: the index does not direct readers to the available upgrade references.
- Recommendation: link the available child guides in the upstream documentation or complete/remove the unfinished sentence. Do not modify the installed dependency as a project fix.
- Test: documentation structure check confirming that the index links to its available guide files.

### THEME-001 — Theme provider replaces `console.error` globally

- Location: `src/components/ui/extensions/theme-provider-client.tsx:8-16`.
- Evidence: module initialization replaces the global `console.error` function in development and suppresses any message containing the substring `Encountered a script tag`; it neither checks the source nor restores the original function.
- Impact: unrelated development errors with the same text can be hidden for the lifetime of the page, affecting other components and tooling.
- Recommendation: remove the global monkey patch or scope narrowly to the specific warning source and lifecycle; avoid mutating shared console state at module load.
- Test: verify unrelated console errors remain visible and that any narrowly scoped suppression is restored after use.
- Deduplication: the two folder reports for `src/components/ui/` and `src/components/ui/extensions/` point to the same file and issue; this is one finding, independently confirmed by the file report.

### INTLPROVIDER-001 — Caller props can override request-resolved locale/messages

- Location: `src/components/ui/extensions/intl-provider-server.tsx:9,14`.
- Evidence: the wrapper resolves locale and messages from the request, then spreads caller props afterward, allowing those values to be replaced. The current root-layout call only supplies `children`.
- Impact: a future caller can accidentally render a locale/messages pair inconsistent with the request, producing incorrect translations or cache/render mismatches.
- Recommendation: omit locale/messages from the accepted props or spread caller props before explicitly setting request-derived values.
- Test: a type-level or component test should show callers cannot override request-owned locale/messages and the provider renders the resolved request values.

### AGENT-001 — Lazy tool schema can pass `undefined` into CodeBlock

- Location: `src/components/ai-elements/agent.tsx:92-110`.
- Evidence: a supported lazy `inputSchema` is a function; `JSON.stringify()` returns `undefined` for a function, then the value is passed into `CodeBlock`. Its content renderer calls string methods such as `.slice()` and `.split()`, which can throw when the tool accordion expands.
- Impact: expanding a tool with a lazy schema can crash that UI subtree.
- Recommendation: use the AI SDK's supported schema conversion and supply a text fallback whenever a serializable schema cannot be produced.
- Test: render and expand `AgentTool` with a lazy schema, verifying it displays converted output or a fallback without throwing.

### COMPONENTS-OWNERSHIP-001 — Component ownership terminology conflicts across project docs

- Location: `.agents/rules/components-contracts.md:14-18`; compare `docs/adr/0008-install-firebase-ui-registry.md:477-485` and `ARCHITECTURE.md:133-138`.
- Evidence: the component contract groups `ui/`, `firebase/`, and `ai-elements/` as “vendor-owned,” while current architecture and ADR guidance describes copied source as locally maintained and adaptable. Folder reviews found the conflict relevant for both Firebase and AI Elements.
- Impact: contributors may apply different expectations to modification, naming, and maintenance of these components.
- Recommendation: reconcile the current rule wording with the accepted ADR amendment and architecture guide; preserve the ADR's historical sections and change only current guidance.
- Test: documentation consistency check or a targeted review confirming the three current sources use the same ownership term.
- Deduplication: consolidates `COMPONENTS-OWNERSHIP-001`, `FIREBASE-FOLDER-001`, and `AIELEMENTS-FOLDER-001` from the parent and child folder reports into one policy finding.

### ARTIFACT-001 — Tooltip action nests native buttons

- Location: `src/components/ai-elements/artifact.tsx:123`.
- Evidence: `TooltipTrigger` wraps a local `Button` as its child. Both installed Base UI primitives default to a native button; the trigger does not receive `render`.
- Impact: invalid interactive nesting can produce ambiguous focus and activation and parser differences during hydration. No application consumer or runtime hydration failure was demonstrated.
- Recommendation: compose one element with the Base UI `render` API, preserving handlers, labels and disabled state.
- Test: one tab stop and one activation for click, Enter and Space, with and without tooltip; inspect hydration warnings.
- Reference and independent evidence: [artifact report](reports/next-code-file-src-components-ai-elements-artifact-tsx.md), including installed primitive source and Next.js Client Component prerendering guidance.

### ATTACHMENTS-001 — Remove action stays visually hidden on keyboard focus

- Location: `src/components/ai-elements/attachments.tsx:338-350`.
- Evidence: grid and inline removal buttons use `opacity-0` and reveal on `group-hover` only. Keyboard focus alone does not reveal the control or its focus ring.
- Impact: keyboard users can reach an invisible removal action. No current application consumer was found.
- Recommendation: reveal on focus/focus-within as well as hover and assess touch interaction.
- Test: Tab to each variant without pointer hover and verify visible control, focus indicator and single removal activation.
- Reference and full evidence: [attachments report](reports/next-code-file-src-components-ai-elements-attachments-tsx.md).

### ATTACHMENTS-002 — Hover preview delay props are discarded

- Location: `src/components/ai-elements/attachments.tsx:375-379`.
- Evidence: `openDelay` and `closeDelay` are destructured but never forwarded. The installed Base UI primitive owns `delay` and `closeDelay` on its Trigger, with defaults of 600 and 300 milliseconds.
- Impact: the advertised wrapper delay settings have no effect when the component is used.
- Recommendation: map delay settings to the supported Trigger contract or expose that contract directly.
- Test: use non-default delays and verify preview open/close timing.
- Reference and full evidence: [attachments report](reports/next-code-file-src-components-ai-elements-attachments-tsx.md).

### AUDIOPLAYER-001 / COMMIT-001 — Native Button mode renders non-native elements

- Location: `src/components/ai-elements/audio-player.tsx:99-109`, `:120-130`, `:141-151`.
- Evidence: play and seek controls pass Media Chrome custom elements to `Button.render` while Base UI keeps `nativeButton=true`. Installed Base UI explicitly diagnoses this combination.
- Impact: development diagnostics and an incorrect native-element contract. Media Chrome provides its own keyboard behavior; playback failure was not established and no application consumer was found.
- Recommendation: align the non-native element contract and verify Base UI and Media Chrome do not both activate the same keyboard event.
- Test: mount with real media controls, check diagnostics, focus, labels and exactly one operation per click, Enter or Space.
- Reference and full evidence: [audio-player report](reports/next-code-file-src-components-ai-elements-audio-player-tsx.md).
- Independent location: `src/components/ai-elements/commit.tsx:35-48`. The Collapsible trigger renders a div while retaining native-button mode. An isolated SSR experiment confirms no button role; installed event handlers rely on native behavior the div cannot provide.
- Additional impact and test: unlike Media Chrome, the commit header div has no independent keyboard activation. Verify its button role, Enter/Space expansion, panel association and separation from nested copy actions.
- Deduplication: `COMMIT-001` shares the native-element configuration cause with `AUDIOPLAYER-001`; count these as one low finding, preserving the [commit report](reports/next-code-file-src-components-ai-elements-commit-tsx.md) and its independent evidence. This is distinct from nested native buttons in `ARTIFACT-001`.

### CHAIN-001 — Expansion trigger references a different Collapsible root

- Location: `src/components/ai-elements/chain-of-thought.tsx:78-97`, `:181-192`.
- Evidence: Header and Content each create a separate Collapsible root. Their shared application state does not share primitive IDs. An isolated SSR experiment with the installed primitives confirmed `aria-controls` has no matching panel ID.
- Impact: broken accessible trigger/panel association despite synchronized visual expansion. No current application consumer was found.
- Recommendation: share one primitive root or explicitly maintain a stable trigger/panel association, checking focus behavior.
- Test: open the public composition by keyboard and resolve `aria-controls` to its visible panel, including multiple instances and controlled/uncontrolled state.
- Reference and full evidence: [chain-of-thought report](reports/next-code-file-src-components-ai-elements-chain-of-thought-tsx.md). The SSR experiment is not a browser test of the complete component.

### CODEBLOCK-002 — Default copy control has no accessible name

- Location: `src/components/ai-elements/code-block.tsx:501-510`.
- Evidence: default children are only decorative Lucide icons. The wrapper supplies no label or hidden text, and Base UI adds none.
- Impact: the optional default control has no programmatic name; no current consumer of this copy control was found.
- Recommendation: supply a replaceable, localizable default name or require explicit naming in the props contract.
- Test: query the default control by button role and copy name before and after success, preserving consumer overrides.
- Reference and full evidence: [code-block report](reports/next-code-file-src-components-ai-elements-code-block-tsx.md).

### CONTEXT-001 — Cached input is priced as regular input

- Location: `src/components/ai-elements/context.tsx:197-204`, `:255-270`, `:375-390`.
- Evidence: total/input estimates pass all input tokens at the regular rate and omit the SDK's cache read/write distribution. With the installed pricing catalog, one million fully cached `gpt-4o` input tokens produce a displayed total of $2.50 while the supported cache-only estimate is $1.25.
- Impact: inconsistent cost estimates and breakdown; no application consumer or effect on real billing was demonstrated.
- Recommendation: adapt the complete token distribution once and derive totals and rows from that result, avoiding double counting.
- Test: uncached, cached, mixed and cache-write inputs with a fixed catalog must yield consistent totals and details.
- Reference and reproduction: [context report](reports/next-code-file-src-components-ai-elements-context-tsx.md), using the installed SDK contracts and pricing helper.

### CONTEXT-002 — Default context progress has no accessible name

- Location: `src/components/ai-elements/context.tsx:162-169`.
- Evidence: the default Progress supplies neither an accessible label nor an associated Label part. An isolated SSR experiment with installed Base UI confirmed a percentage value without a name.
- Impact: assistive technology receives a progress percentage without its purpose. No current application consumer was found.
- Recommendation: provide a localizable default label or explicit association and preserve naming in custom compositions.
- Test: query the default progress bar by role and context-usage name, including multiple instances and ID associations.
- Reference and full evidence: [context report](reports/next-code-file-src-components-ai-elements-context-tsx.md).

## Validated UI findings after the original checkpoint

These issues were discovered in three individual reviews, corrected in commit `95853e2`, and verified by [review validation run 40130032176](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40130032176). The preceding findings remain the historical checkpoint record.

- **Medium — UI-CAROUSEL-EVENT-001:** The `reInit` listener was not removed during effect cleanup. Both event listeners are now removed.
- **Low — UI-CAROUSEL-AXIS-001:** Vertical carousels handled horizontal arrows. Key navigation now follows orientation.
- **Medium — UI-SIDEBAR-HYDRATION-001:** Random skeleton width could diverge between server and client initial renders. Width is now deterministic.
- **Low — UI-CODEBLOCK-SUBMIT-001:** The copy control lacked `type="button"` and could submit an ancestor form. It now has an explicit non-submitting type.

See the three corresponding [individual UI reports](reports/next-code-file-src-components-ui-carousel-tsx.md), [sidebar report](reports/next-code-file-src-components-ui-sidebar-tsx.md), and [copy-button report](reports/next-code-file-src-components-ui-code-block-tsx.md).

## Validated Firebase UI findings

- **Low — FIREBASE-POLICIES-001:** Terms and privacy callback buttons previously used the browser's implicit submit type inside auth forms. The button now explicitly uses `type="button"`, verified by a form regression test.
- **Low — FIREBASE-TOTP-NAME-001:** Enrollment previously wrote the verification code as the TOTP factor name. Enrollment now receives the separately entered `displayName`, verified through the mocked enrollment adapter.

These corrections passed [run 40131416018](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40131416018); emulator coverage remains a separate boundary.

## Verified preview component fixes

- **Medium — AI-WEBPREVIEW-SANDBOX-001:** The preview iframe previously allowed callers to override the `sandbox` prop because the prop spread came last. The invariant sandbox now takes precedence and `srcDoc` injection is suppressed in the component.
- **Low — AI-WEBPREVIEW-INPUT-001:** A custom `onChange` previously disabled the URL field's internal text state update. The field now synchronizes its internal value and forwards the consumer callback.

Focused tests for both cases and blocked URL schemes passed in [run 40131931671](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40131931671).

## Verified multi-factor selection finding

- **Low — Repeated factor identity:** The enrollment chooser previously reused `hint.factorId` as the React key, even when two hints represented different enrolled devices of the same method. It now uses `hint.uid`. A regression test confirmed unique identity and correct selection of the second enrolled factor in [run 40132646413](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40132646413).
