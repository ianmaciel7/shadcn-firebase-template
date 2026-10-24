# Individual report — `next-code-file-src-components-ai-elements-controls-tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-controls-tsx`.
- Type: `CODE_FILE`.
- Primary path: `src/components/ai-elements/controls.tsx`.
- Associated documentation: installed Next.js, `01-app/01-getting-started/05-server-and-client-components.md` and `01-app/03-api-reference/01-directives/use-client.md`; installed React Flow types and implementation.
- Next.js version: `16.4.2`, confirmed in `node_modules/next/package.json`.
- Status: Completed.

## Scope

- Responsibility: full individual review of the 20 lines of the Controls adapter, including composition, props contract, classes, accessibility, and the Server/Client boundary.
- Files consulted: primary file; `AGENTS.md`; `docs/code-review/README.md`; `docs/code-review/agents-manifest.md`; `canvas.tsx` report as a format reference; `CODING_STANDARDS.md`; `.agents/rules/components-contracts.md`; `.agents/rules/shadcn-ui-maintenance.md`; `.agents/skills/shadcn/SKILL.md`; `src/lib/utils.ts`; the two installed Next.js guides above; `node_modules/@xyflow/react/package.json`, `dist/esm/index.js`, `dist/esm/index.mjs`, `dist/esm/additional-components/Controls/types.d.ts`, and `dist/style.css`.
- Dependencies analyzed: `@xyflow/react@12.12.0`, React, and `cn`. No shadcn/Base UI primitive is used in this file, so no change or API recommendation from that family was needed.
- Consumer search: a search in `src/` for `Controls` and `ai-elements/controls`, excluding the primary file, found no current consumer.

## Code Review

Correct implementations:

- The `"use client"` directive is before the imports (line 1). The delegated component uses React Flow's store, hooks, and events; the boundary is compatible with the installed Next.js guide. React Flow's two installed ESM entry points also declare `"use client"`.
- The module keeps a small responsibility: adapting the appearance of `ControlsPrimitive`, without reimplementing zoom, framing, locking, state, or event handling.
- `ComponentProps<typeof ControlsPrimitive>` (line 7) inherits the dependency's real contract. The spread on line 16 preserves options for position, orientation, callbacks, visibility, style, the panel's accessible name, and `children`, while `className` is composed with `cn` (lines 9–15).
- The installed implementation in `dist/esm/index.mjs:4587-4630` generates native buttons with `type="button"`, accessible names, and titles from `ariaLabelConfig`; the zoom buttons receive `disabled` at the limits. The wrapper neither replaces those elements nor removes their accessibility props.
- The classes on lines 12–13 use semantic tokens and apply no `outline-none`, `tabIndex`, hiding, or dimensions smaller than the dependency's. The installed CSS provides 26 by 26 pixel buttons; the inspection does not prove the computed dimensions on a concrete page.
- There is no own asynchronous resource, Effect, subscription, secret, injected HTML, persistence, or server-only API to analyze in this module. The imported utility only re-exports `cn`.
- The arrow-function declaration and the absence of a `-client` suffix were not treated as defects: the AI Elements tree has an explicit exclusion in the local naming contract. The directive and the imported graph define the boundary, regardless of the file name.

Risks and recommendations:

- The dependency queries the React Flow store. The adapter must be composed within the appropriate context, normally as a child of `ReactFlow`, per the example in the installed implementation itself. Do not create another isolated provider just to satisfy the hook, as this would disconnect the controls from the editor. With no current consumer, there is no evidence of use outside the context.
- Non-serializable callbacks must be prepared in a client composition when crossing a Server/Client boundary. The inherited type allowing callbacks is normal and demonstrates no violation without a Server Component consumer.
- The consumer editor must load the dependency's CSS and validate focus, contrast, real size, touch, and horizontal/vertical orientation. That CSS import exists in the `canvas.tsx` adapter, reviewed separately; this report does not assume that all future compositions will use that adapter.
- Button localization depends on the editor's `ariaLabelConfig`, in addition to the `aria-label` forwarded to the panel. The lack of translation in this generic adapter does not prove a failure on a localized page without a demonstrated consumer.
- Data, cache, metadata, routes, and server mutations are not applicable to this presentation module. No build, browser, keyboard, screen reader, or integration tests were run; no remote/CLI query was needed for the React Flow API inspected locally.

## Findings

No actionable finding demonstrated. Context, CSS, and integrated accessibility validation are requirements of using the dependency; they were not converted into hypothetical bugs of the wrapper.

## Conclusion

- Classification: Compliant.
- Explanation: the adapter preserves the contract and composition of the installed dependency, keeps the client boundary, and introduces no concrete defect in the full static review. The conclusion certifies neither the accessibility nor the operation of an integrated editor, since no current consumer was identified and nothing was run in a browser. Only this individual report was created.
