# Individual report — `next-code-file-src-components-ai-elements-audio-player-tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-audio-player-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/ai-elements/audio-player.tsx`
- Associated documentation: installed Next.js, `01-app/01-getting-started/05-server-and-client-components.md` and `01-app/03-api-reference/01-directives/use-client.md`; local shadcn rule `rules/base-vs-radix.md`; installed Base UI and Media Chrome implementations.
- Next.js version: `16.4.2`; React/React DOM `19.3.1`; Base UI `1.9.0`; Media Chrome `4.19.3`.
- Status: Completed (individual static review; browser behavior not run).

## Scope

- Responsibility: full review of the 269 lines of the AudioPlayer module, including the root, the audio element, the bar, and the exported controls; Client boundary, composition, props, accessibility, and lifecycle.
- Files consulted: `AGENTS.md`, `docs/code-review/README.md`, `docs/code-review/agents-manifest.md`, the existing individual report for `agent.tsx`, `package.json`, `CODING_STANDARDS.md`, `.agents/rules/components-contracts.md`, `.agents/rules/react-hooks-core.md`, `.agents/rules/shadcn-ui-maintenance.md`, the shadcn skill and `rules/base-vs-radix.md`, `src/components/ui/button.tsx`, `src/components/ui/button-group.tsx`, associated Next.js guides, `node_modules/@base-ui/react/button/Button.js`, `node_modules/@base-ui/react/internals/use-button/useButton.js`, `node_modules/media-chrome/package.json`, `node_modules/media-chrome/dist/react/index.js`, `node_modules/media-chrome/dist/media-chrome-button.js`, `node_modules/media-chrome/dist/media-play-button.js`, and `node_modules/media-chrome/dist/utils/server-safe-globals.js`.
- Dependencies analyzed: Media Chrome React components, `render` composition of the Base UI Button, ButtonGroup/ButtonGroupText, AI SDK audio types, and the `cn` utility.
- Consumer search: `rg` in `src/` found only the definitions in this module; no current use in an application route was identified. This limits current exposure without eliminating the defect of the reusable component.

## Code Review

Correct implementations:

- The `"use client"` directive on line 1 establishes an appropriate boundary for interactive controls and custom elements. There is no import of server-only modules; the `SpeechResult` import is type-only.
- The root configures MediaController for audio and preserves children, props, and style overrides (lines 21-56). Styles use semantic tokens; there are no credentials, data fetching, or application state in this module.
- `AudioPlayerElement` accepts a URL or generated audio and builds a data URL with media type and base64 (lines 58-80). The `media` slot is part of the MediaController integration. It does not create object URLs, so there is no object URL resource to revoke in this file.
- The controls are named parts of the same family, and the consumer chooses which to compose. The absence of `-client` in the name is not a Next.js failure; the local contract excludes AI Elements from the application component naming rules.
- Media Chrome provides dynamic labels, role, and keyboard listeners in its own classes; it is not correct to classify controls without JSX text as necessarily lacking an accessible name. The installed `MediaPlayButton` implementation updates `aria-label` and the base class defines `role="button"`.

Risks and recommendations:

- The wrappers delegate media listeners and lifecycle to the library; this file registers no Effects or listeners of its own. The installed base class implementation has cleanup in `disconnectedCallback`. This inspection does not prove the full connect/disconnect cycle in a browser.
- The audio forwards `children`, allowing `track`; the transcript/text alternative remains the responsibility of whoever supplies the content. The lint suppression on line 69 does not demonstrate WCAG compliance. Since there is no content or identified consumer, the absence of a concrete alternative was not invented as a finding.
- Playback, keyboard, focus, control locale, screen reader, hydration, build, and browser tests were not run. These checks are necessary before an integration fix and were not presented as passed.

## Findings

### AUDIOPLAYER-001 — Button keeps native mode when rendering custom elements

- Identifier: `AUDIOPLAYER-001`.
- Severity: Low.
- Category: Base UI integration / button semantics contract.
- Path and line: `src/components/ai-elements/audio-player.tsx:99-109`, `:120-130`, and `:141-151`.
- Concrete evidence: the three wrappers pass `MediaPlayButton`, `MediaSeekBackwardButton`, and `MediaSeekForwardButton` to `Button.render` without configuring `nativeButton`. The local Button forwards this prop to Base UI; `node_modules/@base-ui/react/button/Button.js` defines `nativeButton = true`. In `node_modules/media-chrome/dist/react/index.js:224-225,274-275,284-285`, these wrappers are defined with the tags `media-play-button`, `media-seek-backward-button`, and `media-seek-forward-button`, respectively, and not with `<button>`. The installed `useButton`, lines 39-50, explicitly emits a development diagnostic when native mode meets a tag other than BUTTON.
- Documentation reference: `.agents/skills/shadcn/rules/base-vs-radix.md`, section "Button / trigger as non-button element (base only)", requires `nativeButton={false}` when replacing the native element; the diagnostic and the default are confirmed by the installed code. The Next.js guide `05-server-and-client-components.md` justifies the Client boundary but does not prescribe this composition API; the finding belongs to the Base UI integration.
- Impact: when mounting these controls in development, the composition triggers the incompatible-semantics diagnostic and keeps Base UI configured for a native element that does not exist. Media Chrome has its own keyboard behavior, so the static review does not prove a playback failure or missing accessibility in production. With no identified consumer in `src/`, the current impact is restricted to the component when used.
- Recommended fix: align the composition with the non-native element contract, evaluating `nativeButton={false}` or a styling path that fully preserves the custom element's behavior. Before adopting the change, verify the interaction between the Base UI and Media Chrome keyboard handlers to prevent double activation. Do not suppress the diagnostic globally.
- Suggested test: mount the three wrappers with MediaController and a local audio in a browser, verify the absence of the Base UI diagnostic, and confirm that click, Enter, and Space trigger exactly one operation; verify focus, the disabled state, and label updates. Repeat after remount/hydration.

## Conclusion

- Classification: Partially compliant.
- Explanation: the Client boundary and the division into parts are appropriate. There is an incompatible composition contract proven by the installed code in three controls; the functional effect in a browser remains unverified. No source file was changed, no application test was declared passed, and no other task was completed by this report.
