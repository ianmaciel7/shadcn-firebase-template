# Individual report — `next-code-file-src-components-ai-elements-attachments-tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-attachments-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/ai-elements/attachments.tsx`
- Associated documentation: installed Next.js, `01-app/01-getting-started/05-server-and-client-components.md`, `01-app/03-api-reference/01-directives/use-client.md`, and `03-architecture/accessibility.md`; local component contracts and installed Base UI types.
- Next.js version: `16.4.2`, confirmed in `node_modules/next/package.json`.
- Status: Completed.

## Scope

- Responsibility: full, individual review of the 449 lines of the attachments module, including media classification, contexts, composition, previews, and removal.
- Files consulted: primary file, `src/components/ui/button.tsx`, `src/components/ui/hover-card.tsx`, `package.json`, `AGENTS.md`, `CODING_STANDARDS.md`, `TESTING.md`, the manifest and the existing report for `agent.tsx`; local rules `components-contracts.md`, `react-hooks-core.md`, `shadcn-ui-maintenance.md` and the installed shadcn skill; the Next.js documentation listed above; types and implementation of `@base-ui/react/preview-card/trigger/PreviewCardTrigger` and constants from the same dependency.
- Dependencies analyzed: React Context and hooks, AI SDK `FileUIPart`/`SourceDocumentUIPart` types, Lucide, Base UI Button and Base UI Preview Card through the local wrappers.
- Usage search: `rg` in `src/` found no consumers of the attachments exports outside the module itself. The findings describe failures of the exported API when used, without claiming observed impact on current routes.

## Code Review

Correct implementations:

- The directive on line 1 correctly establishes the Client Component boundary for Context, hooks, events, and interactive primitives. There is no import of server-only APIs; removal callbacks must be provided inside the client graph, respecting serialization at the Server/Client boundary.
- The discriminated union of data distinguishes a file from a source document before accessing the URL; image renders provide dimensions and alternative text.
- Contexts separate the collection variant from each item's data. The item hook raises an explicit error when the composition does not contain the Provider. Dependencies of the memoized values and the removal callback are declared.
- The default removal uses a native button with `type="button"`, an accessible name, and propagation stopping. There is no authentication management, persistence, fetch, effects, or resources that require cleanup.
- The file gathers related parts of a compound component. The local naming exclusions for AI Elements prevent classifying its multiple exports or the absence of an integration suffix as a Next.js violation.

Risks and recommendations:

- The default texts are in English and can be replaced through props/composition; localized consumers must provide translated labels. There is no current consumer to demonstrate a translation regression.
- Images use HTML `img`, including for possible local attachment URLs. This does not in itself constitute a boundary failure or a universal obligation to use `next/image`.
- No browser, rendering, or timer tests were run; the evidence below results from a full code inspection and comparison with the installed types and implementation. Full accessibility compliance is not claimed.

## Findings

### ATTACHMENTS-001 — Remove control stays invisible when it receives keyboard focus

- Identifier: `ATTACHMENTS-001`
- Severity: Low
- Category: accessibility / visible focus
- Path and line: `src/components/ai-elements/attachments.tsx:340-350`.
- Concrete evidence: the `grid` and `inline` variants apply `opacity-0` to the Button itself and only restore opacity with `group-hover:opacity-100`. There is no `focus-visible` or `focus-within` alternative in the module. The local Button provides a focus ring, but the element's zero opacity also hides that ring. The button remains in the Tab order when `onRemove` exists.
- Documentation reference: `CODING_STANDARDS.md`, section shadcn/ui API and accessibility, requires preserving keyboard and focus behavior; `TESTING.md` distinguishes manual/browser focus validation from automated scans. `node_modules/next/dist/docs/03-architecture/accessibility.md` is the installed general accessibility reference, without providing a specific opacity rule or proving this interaction.
- Impact: when navigating without hover, the user can focus an invisible remove control, without being able to identify the position or the available action. There is no evidence of exposure on current routes.
- Recommended fix: reveal the control on visible focus or focus within the group, keeping a perceptible indication; consider permanent visibility on devices without hover.
- Suggested test: render a collection in the grid and inline variants with `onRemove`, keep the pointer outside, and navigate with Tab. Verify visible computed opacity, perceptible focus, and removal by keyboard.

### ATTACHMENTS-002 — Preview delay props are discarded

- Identifier: `ATTACHMENTS-002`
- Severity: Low
- Category: API compatibility / props with no effect
- Path and line: `src/components/ai-elements/attachments.tsx:370-379`.
- Concrete evidence: `AttachmentHoverCardProps` advertises `openDelay` and `closeDelay`; the component destructures both and passes only `...props` to HoverCard. No value reaches the trigger. The local HoverCard wrapper uses `PreviewCard.Root`; the installed types in `PreviewCardTrigger.d.ts:28-38` define `delay` and `closeDelay` on the Trigger. The implementation `PreviewCardTrigger.js:50-65` uses those values or the defaults of 600/300 ms from `utils/constants.js`. Therefore changing only the delays exposed by AttachmentHoverCard does not change the preview.
- Documentation reference: the installed Base UI types and implementation above establish the real contract; `CODING_STANDARDS.md` requires using the props of the correct primitive and preserving the API when adapting it. The Next.js guide `use-client.md` confirms the interactive boundary but does not define UI library delays.
- Impact: consumers receive a configurable API that ignores the values provided, including the zero defaults declared by the wrapper. The configuration can still be done directly on the correct trigger props; there is no current consumer demonstrating impact on a route.
- Recommended fix: pass the configuration to the trigger through composition/context and map `openDelay` to `delay`, or remove the props with no effect and document the configuration on the Base UI trigger.
- Suggested test: render HoverCard with a trigger/content and non-default delays; use pointer events and controlled timers to verify opening and closing at the requested intervals.

## Conclusion

- Classification: Partially compliant.
- Explanation: composition, client boundary, data discrimination, and responsibilities are appropriate. Two verifiable local failures affect keyboard removal and preview delay configuration. These are component findings with no identified consumer yet; no code fix was made and the global audit remains pending.
