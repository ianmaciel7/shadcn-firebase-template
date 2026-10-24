# Individual report — `next-code-file-src-components-ai-elements-artifact-tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-artifact-tsx`.
- Type: `CODE_FILE`.
- Primary path: `src/components/ai-elements/artifact.tsx`.
- Associated documentation: installed Next.js, `01-app/01-getting-started/05-server-and-client-components.md` and `01-app/03-api-reference/01-directives/use-client.md`; installed Base UI contract and the local trigger composition rule.
- Next.js version: `16.4.2`, confirmed by the installed `next/package.json`.
- Status: Completed.

## Scope

- Responsibility: full review of the 158 lines of the primary file, including the eight components and their exported types.
- Files consulted: `AGENTS.md`, `docs/code-review/README.md`, `docs/code-review/agents-manifest.md`, `docs/code-review/reports/next-code-file-src-components-ai-elements-agent-tsx.md`, `components.json`, `package.json`, `CODING_STANDARDS.md`, `.agents/rules/components-contracts.md`, `.agents/rules/shadcn-ui-maintenance.md`, `.agents/rules/react-hooks-core.md`, `.agents/skills/shadcn/rules/base-vs-radix.md`, `src/components/ui/button.tsx`, `src/components/ui/tooltip.tsx`, `src/lib/utils.ts`, the two Next.js guides above, and the installed modules `@base-ui/react/tooltip/trigger/TooltipTrigger.{js,d.ts}` and `@base-ui/react/button/Button.js`.
- Dependencies analyzed: React, HTML types, Lucide, local Button and Tooltip, Base UI primitives, and the `cn` utility.
- Method: full static reading and tracing of the imported primitives. A search for `artifact` and `Artifact` in `src/`, excluding the primary file, found no current consumer. No build, component tests, browser, keyboard, screen reader, or remote shadcn CLI query were run. No behavioral coverage from those checks is claimed.

## Code Review

Correct implementations:

- The `"use client"` directive precedes the imports (line 1) and accommodates the interactive primitives, without importing server-only APIs or reading secrets. The installed guide explains that the boundary applies to the imported graph; the absence of own hooks does not make the directive incorrect.
- The structure components forward HTML props, `children` through the spread, and `className` with `cn`. The family keeps presentation responsibilities and offers explicit parts for header, description, actions, and content; it does not mix persistence, authentication, or application data.
- The actions provide `type="button"` by default (lines 54 and 110), avoiding accidental submission in default usage. Explicit consumer props can override this default through the later spread, in line with the inherited native contract.
- `ArtifactClose` provides an accessible name through visually hidden text (line 59). `ArtifactAction` provides hidden text from `label` or `tooltip` (line 115), and also preserves the native `aria-label` through props.
- There are no Effects, subscriptions, persistent resources, duplicated derived state, or direct DOM access that would require cleanup analysis.
- The AI Elements folder is explicitly outside the application component name guard. Arrow functions and the absence of a `-client` suffix are not Next.js or guard findings.

Risks and recommendations:

- When `icon` is used without `label`, `tooltip`, text content, or `aria-label`, the consumer can create an action without an accessible name. This is a usage-contract responsibility; no current consumer was found that demonstrates such a failure. Document the accessible-name requirement and consider a more restrictive type.
- The `Close` text is fixed in English (line 59), but `aria-label` can be provided by the consumer. Verify localization in the adapter that adopts the component, without requiring application translations inside the generic library.
- Title and description are paragraphs, with no automatic association to a region. This is not an error in itself: the semantic structure depends on the consumer's composition.
- The presentation repeats button styles in the two actions. This is minor and does not justify an abstraction or an isolated refactor during this audit.
- `icon` accepts a component function. This prop is valid between Client Components; a Server Component must compose serializable content or establish a client adapter. No usage that violates boundary serialization was found.

## Findings

### ARTIFACT-001 — Action tooltip creates nested buttons

- Identifier: `ARTIFACT-001`.
- Severity: Low.
- Category: Base UI composition / accessibility / invalid HTML.
- Path and line: `src/components/ai-elements/artifact.tsx:119-127`, especially line 123; inner button built on lines 103-116.
- Concrete evidence: with `tooltip` filled in, the code renders `<TooltipTrigger>{button}</TooltipTrigger>`, without `render`. The local wrapper in `src/components/ui/tooltip.tsx:23-24` forwards the props directly to `TooltipPrimitive.Trigger`. The installed implementation `node_modules/@base-ui/react/tooltip/trigger/TooltipTrigger.js:187` calls `useRenderElement('button', ...)`. The `button` child is the local `Button`, which renders `ButtonPrimitive`; `node_modules/@base-ui/react/button/Button.js:39` also calls `useRenderElement('button', ...)`. Therefore the default case with a tooltip produces a button inside another button.
- Documentation reference: `.agents/skills/shadcn/rules/base-vs-radix.md`, section "Composition: asChild vs render", requires replacing the trigger element using `render` in the Base UI family, and explicitly cites `TooltipTrigger`. The installed `TooltipTrigger.d.ts` declarations confirm that the default element is `button`. The installed Next.js guide `01-app/01-getting-started/05-server-and-client-components.md`, section "On the server", explains the pre-rendering of Client Component HTML; the client directive does not remove the need for valid HTML. The failure is one of primitive composition, not a Next.js naming requirement.
- Impact: nested interactive controls produce invalid semantics, can introduce ambiguous focus/activation, and, when pre-rendered, allow HTML parser corrections that are incompatible with the tree expected during hydration. No hydration error was observed at runtime. The severity takes into account that no current consumer was found in `src/`.
- Recommended fix: compose a single button through `TooltipTrigger render={button}` (or the equivalent `render={<Button ... />}`), preserving content, handlers, accessibility props, and disabled state on the composed element. Do not add `asChild`, which belongs to a different primitive family.
- Suggested test: render `ArtifactAction` with an icon, tooltip, and handler; verify that exactly one button exists, with an accessible name, that Tab reaches it only once, that focus/hover open the tooltip, and that Enter/Space trigger the handler exactly once. Cover the variant without a tooltip and the disabled state. For adoption in Next.js, also verify pre-render/hydration without nesting warnings.

## Conclusion

- Classification: Partially compliant.
- Explanation: the Client Component boundary, props forwarding, and division into parts are appropriate. The optional tooltip path uses a composition that is incompatible with the installed Base UI primitive and creates nested controls. No application code was changed and no executed tests are claimed.
